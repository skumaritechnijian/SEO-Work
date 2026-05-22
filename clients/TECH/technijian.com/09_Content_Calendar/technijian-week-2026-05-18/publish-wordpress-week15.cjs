const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SITE = process.env.TECH_WP_SITE || 'https://technijian.com';
const WP_USER = process.env.TECH_WP_USER || process.env.WP_USER;
const WP_PASSWORD = process.env.TECH_WP_PASSWORD || process.env.WP_PASSWORD;
const DEFAULT_STATUS = process.env.WP_POST_STATUS || 'future';
const DRY_RUN = process.argv.includes('--dry-run');
const onlyArg = process.argv.find((arg) => arg.startsWith('--only='));
const onlyKeys = onlyArg ? new Set(onlyArg.replace('--only=', '').split(',').map((key) => key.trim()).filter(Boolean)) : null;
const posts = JSON.parse(fs.readFileSync(path.join(ROOT, 'week15-posts.json'), 'utf8'))
  .filter((post) => !onlyKeys || onlyKeys.has(post.key) || onlyKeys.has(post.slug));

function authHeader() {
  if (!WP_USER || !WP_PASSWORD) return null;
  return `Basic ${Buffer.from(`${WP_USER}:${WP_PASSWORD}`).toString('base64')}`;
}

async function wpFetch(pathname, options = {}) {
  const authorization = authHeader();
  if (!authorization) throw new Error('Missing TECH_WP_USER/TECH_WP_PASSWORD or WP_USER/WP_PASSWORD.');
  const response = await fetch(`${SITE}${pathname}`, {
    ...options,
    headers: {
      Authorization: authorization,
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  let body = text;
  try { body = text ? JSON.parse(text) : null; } catch {}
  if (!response.ok) {
    throw new Error(`WP ${options.method || 'GET'} ${pathname} failed (${response.status}): ${typeof body === 'string' ? body : JSON.stringify(body)}`);
  }
  return body;
}

function slugify(input) {
  return input.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

async function getExistingTerm(kind, name) {
  const slug = slugify(name);
  const found = await wpFetch(`/wp-json/wp/v2/${kind}?slug=${encodeURIComponent(slug)}&per_page=100`);
  if (Array.isArray(found) && found.length) return found[0].id;
  const searched = await wpFetch(`/wp-json/wp/v2/${kind}?search=${encodeURIComponent(name)}&per_page=100`);
  const exact = Array.isArray(searched) ? searched.find((term) => term.name === name) : null;
  return exact ? exact.id : null;
}

async function uploadMedia(post) {
  const bytes = fs.readFileSync(post.imageFile);
  const filename = path.basename(post.imageFile);
  const media = await wpFetch('/wp-json/wp/v2/media', {
    method: 'POST',
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="${filename}"`
    },
    body: bytes
  });
  await wpFetch(`/wp-json/wp/v2/media/${media.id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      alt_text: post.imageAlt,
      title: post.title,
      caption: '',
      description: `Generated Technijian featured image for ${post.title}`
    })
  });
  return media.id;
}

async function findExisting(slug) {
  const found = await wpFetch(`/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&status=publish,future,draft,pending,private&context=edit`);
  return Array.isArray(found) && found.length ? found[0] : null;
}

function yoastMeta(post) {
  return {
    _yoast_wpseo_focuskw: post.yoast.focusKeyphrase,
    _yoast_wpseo_title: post.yoast.metaTitle,
    _yoast_wpseo_metadesc: post.yoast.metaDescription,
    _yoast_wpseo_focuskeywords: JSON.stringify(post.yoast.relatedKeyphrases),
    _yoast_wpseo_metakeywords: post.yoast.metaKeywords,
    _kadence_hide_featured_image: '1',
    _astra_hide_featured_image: '1',
    _generate_disable_post_image: '1',
    _disable_featured_image: '1',
    hide_featured_image: '1'
  };
}

function payloadFor(post, categoryId, tagIds, mediaId) {
  return {
    title: post.title,
    slug: post.slug,
    status: DEFAULT_STATUS,
    date: post.date,
    content: fs.readFileSync(post.contentFile, 'utf8'),
    excerpt: post.excerpt,
    categories: categoryId ? [categoryId] : [],
    tags: tagIds,
    featured_media: mediaId,
    comment_status: 'closed',
    ping_status: 'closed',
    meta: yoastMeta(post)
  };
}

async function main() {
  const manifest = [];

  for (const post of posts) {
    const dryPayload = {
      title: post.title,
      slug: post.slug,
      date: post.date,
      status: DEFAULT_STATUS,
      category: post.category,
      tags: post.tags,
      yoast: post.yoast,
      hideFeaturedImage: post.hideFeaturedImage,
      contentFile: post.contentFile,
      imageFile: post.imageFile
    };

    if (DRY_RUN) {
      console.log(JSON.stringify({ dryRun: true, post: dryPayload }, null, 2));
      manifest.push({ ...dryPayload, dryRun: true });
      continue;
    }

    const categoryId = await getExistingTerm('categories', post.category);
    const tagIds = [];
    for (const tag of post.tags) {
      const tagId = await getExistingTerm('tags', tag);
      if (tagId) tagIds.push(tagId);
      else console.warn(`Skipping missing tag without create permission: ${tag}`);
    }
    const mediaId = await uploadMedia(post);
    const payload = payloadFor(post, categoryId, tagIds, mediaId);
    const existing = await findExisting(post.slug);
    const saved = existing
      ? await wpFetch(`/wp-json/wp/v2/posts/${existing.id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      : await wpFetch('/wp-json/wp/v2/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

    manifest.push({ key: post.key, id: saved.id, link: saved.link, status: saved.status, slug: saved.slug, mediaId });
    console.log(`Scheduled: ${post.title} -> ${saved.link}`);
  }

  fs.writeFileSync(path.join(ROOT, DRY_RUN ? 'week15-dry-run-result.json' : 'week15-publish-result.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
