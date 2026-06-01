const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SITE = process.env.TECH_WP_SITE || 'https://technijian.com';
const WP_USER = process.env.TECH_WP_USER || process.env.WP_USER;
const WP_PASSWORD = process.env.TECH_WP_PASSWORD || process.env.WP_PASSWORD;
const DRY_RUN = process.argv.includes('--dry-run');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, ''));
}

const posts = readJson(path.join(ROOT, 'june-2026-posts.json'));
const publishPath = path.join(ROOT, 'june-2026-publish-result.json');
const publishResult = readJson(publishPath);
const imageManifestPath = path.join(ROOT, 'june-2026-chatgpt-image-replacement.json');
const imageManifest = readJson(imageManifestPath);

if (!DRY_RUN && (!WP_USER || !WP_PASSWORD)) {
  console.error('Missing TECH_WP_USER/TECH_WP_PASSWORD or WP_USER/WP_PASSWORD.');
  process.exit(1);
}

function authHeader() {
  return `Basic ${Buffer.from(`${WP_USER}:${WP_PASSWORD}`).toString('base64')}`;
}

async function wpFetch(pathname, options = {}) {
  const response = await fetch(`${SITE}${pathname}`, {
    ...options,
    headers: { Authorization: authHeader(), ...(options.headers || {}) }
  });
  const text = await response.text();
  let body = text;
  try { body = text ? JSON.parse(text) : null; } catch {}
  if (!response.ok) {
    throw new Error(`WP ${options.method || 'GET'} ${pathname} failed (${response.status}): ${typeof body === 'string' ? body : JSON.stringify(body)}`);
  }
  return body;
}

async function uploadMedia(post, imageInfo) {
  const mediaPath = imageInfo.uploadImage || post.imageFile;
  const bytes = fs.readFileSync(mediaPath);
  const filename = path.basename(mediaPath);
  const contentType = path.extname(mediaPath).toLowerCase() === '.jpg' || path.extname(mediaPath).toLowerCase() === '.jpeg'
    ? 'image/jpeg'
    : 'image/png';
  const media = await wpFetch('/wp-json/wp/v2/media', {
    method: 'POST',
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`
    },
    body: bytes
  });

  await wpFetch(`/wp-json/wp/v2/media/${media.id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      alt_text: `${imageInfo.titleText} featured image`,
      title: imageInfo.titleText,
      caption: '',
      description: `ChatGPT-generated square featured image for ${post.title}`
    })
  });

  return media.id;
}

async function findLivePost(slug) {
  const found = await wpFetch(`/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&status=publish,future,draft,pending,private&context=edit`);
  if (!Array.isArray(found) || !found.length) throw new Error(`Missing post ${slug}`);
  return found[0];
}

async function main() {
  const imageBySlug = new Map((imageManifest.images || []).map((item) => [item.slug, item]));
  const publishBySlug = new Map(publishResult.map((item) => [item.slug, item]));
  const replacements = [];

  for (const post of posts) {
    const imageInfo = imageBySlug.get(post.slug);
    if (!imageInfo) throw new Error(`Missing image manifest entry for ${post.slug}`);
    const mediaPath = imageInfo.uploadImage || post.imageFile;
    if (!fs.existsSync(mediaPath)) throw new Error(`Missing image file: ${mediaPath}`);

    const live = DRY_RUN ? publishBySlug.get(post.slug) : await findLivePost(post.slug);
    if (!live) throw new Error(`Missing publish result for ${post.slug}`);

    const oldMediaId = live.featured_media || live.mediaId || 0;
    const newMediaId = DRY_RUN ? oldMediaId : await uploadMedia(post, imageInfo);

    if (!DRY_RUN) {
      await wpFetch(`/wp-json/wp/v2/posts/${live.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured_media: newMediaId })
      });
    }

    const publishItem = publishBySlug.get(post.slug);
    if (publishItem) publishItem.mediaId = newMediaId;

    replacements.push({
      slug: post.slug,
      postId: live.id,
      title: post.title,
      status: live.status,
      scheduledDate: post.date,
      oldMediaId,
      newMediaId,
      titleText: imageInfo.titleText,
      imageFile: mediaPath
    });

    console.log(`${DRY_RUN ? 'Would replace' : 'Replaced'} image: ${post.slug} old=${oldMediaId} new=${newMediaId}`);
  }

  if (!DRY_RUN) {
    const replacementPath = path.join(ROOT, 'june-2026-image-upload-replacement-result.json');
    fs.writeFileSync(replacementPath, `${JSON.stringify(replacements, null, 2)}\n`, 'utf8');
    fs.writeFileSync(publishPath, `${JSON.stringify(publishResult, null, 2)}\n`, 'utf8');

    const archiveRoot = path.join(ROOT, '..', '..', 'Website Blogs', 'June_2026_Blogs');
    fs.copyFileSync(replacementPath, path.join(archiveRoot, 'june-2026-image-upload-replacement-result.json'));
    fs.copyFileSync(publishPath, path.join(archiveRoot, 'june-2026-publish-result.json'));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
