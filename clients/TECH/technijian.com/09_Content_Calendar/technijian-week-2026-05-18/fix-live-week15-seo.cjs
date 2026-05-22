const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SITE = process.env.TECH_WP_SITE || 'https://technijian.com';
const WP_USER = process.env.TECH_WP_USER || process.env.WP_USER;
const WP_PASSWORD = process.env.TECH_WP_PASSWORD || process.env.WP_PASSWORD;
const posts = JSON.parse(fs.readFileSync(path.join(ROOT, 'week15-posts.json'), 'utf8'));
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'week15-publish-result.json'), 'utf8'));
const targetKeys = new Set(['wednesday-persona-c', 'thursday-persona-d', 'friday-news-persona-b']);

if (!WP_USER || !WP_PASSWORD) {
  console.error('Missing TECH_WP_USER/TECH_WP_PASSWORD or WP_USER/WP_PASSWORD.');
  process.exit(1);
}

function authHeader() {
  return `Basic ${Buffer.from(`${WP_USER}:${WP_PASSWORD}`).toString('base64')}`;
}

async function wpFetch(pathname, options = {}) {
  const response = await fetch(`${SITE}${pathname}`, {
    ...options,
    headers: {
      Authorization: authHeader(),
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

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function xmlRpc(method, paramsXml) {
  const body = `<?xml version="1.0"?><methodCall><methodName>${method}</methodName><params>${paramsXml.map((param) => `<param><value>${param}</value></param>`).join('')}</params></methodCall>`;
  const response = await fetch(`${SITE}/xmlrpc.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'text/xml' },
    body
  });
  const text = await response.text();
  if (!response.ok || /<fault>/.test(text)) {
    throw new Error(`XML-RPC ${method} failed (${response.status}): ${text.slice(0, 600)}`);
  }
  return text;
}

function member(name, value) {
  return `<member><name>${escapeXml(name)}</name><value><string>${escapeXml(value)}</string></value></member>`;
}

function customField(key, value) {
  return `<value><struct>${member('key', key)}${member('value', value)}</struct></value>`;
}

async function updateYoastXmlRpc(postId, post) {
  const relatedJson = JSON.stringify(post.yoast.relatedKeyphrases || []);
  const customFields = [
    customField('_yoast_wpseo_focuskw', post.yoast.focusKeyphrase),
    customField('_yoast_wpseo_title', post.yoast.metaTitle),
    customField('_yoast_wpseo_metadesc', post.yoast.metaDescription),
    customField('_yoast_wpseo_focuskeywords', relatedJson),
    customField('_yoast_wpseo_metakeywords', post.yoast.metaKeywords),
    customField('_kadence_hide_featured_image', '1'),
    customField('_astra_hide_featured_image', '1'),
    customField('_generate_disable_post_image', '1'),
    customField('_disable_featured_image', '1'),
    customField('hide_featured_image', '1')
  ].join('');
  const contentStruct = `<struct><member><name>custom_fields</name><value><array><data>${customFields}</data></array></value></member></struct>`;
  await xmlRpc('wp.editPost', [
    '<int>1</int>',
    `<string>${escapeXml(WP_USER)}</string>`,
    `<string>${escapeXml(WP_PASSWORD)}</string>`,
    `<int>${postId}</int>`,
    contentStruct
  ]);
}

function removeRecommendedSection(content) {
  return content.replace(
    /\n*<!-- wp:heading -->\s*<h2 class="wp-block-heading">Recommended Reading and Sources<\/h2>\s*<!-- \/wp:heading -->\s*<!-- wp:list -->[\s\S]*?<!-- \/wp:list -->\s*$/i,
    ''
  ).trim();
}

function anchorParagraphs(post) {
  const internal = post.internalLinks
    .map(([text, url]) => `<a href="${url}">${text}</a>`)
    .join(', ');
  const external = post.externalLinks
    .map(([text, url]) => `<a href="${url}" rel="noopener" target="_blank">${text}</a>`)
    .join(' and ');

  if (post.key === 'friday-news-persona-b') {
    return [
      '<!-- wp:paragraph -->',
      `<p>For OC and Los Angeles founders turning this startup momentum into product execution, Technijian supports <a href="https://technijian.com/custom-software-development/">Custom software development</a>, <a href="https://technijian.com/ai-native-software-development/">AI-native software development</a>, and <a href="https://technijian.com/ai-consulting/">AI consulting services</a> that help teams move from idea to secure, maintainable software.</p>`,
      '<!-- /wp:paragraph -->',
      '',
      '<!-- wp:paragraph -->',
      `<p>For market context, review <a href="https://www.ycombinator.com/companies/location/los-angeles" rel="noopener" target="_blank">Y Combinator companies in Los Angeles</a> and <a href="https://www.ycombinator.com/apply/" rel="noopener" target="_blank">Y Combinator applications</a> to see how the regional startup pipeline is evolving.</p>`,
      '<!-- /wp:paragraph -->'
    ].join('\n');
  }

  return [
    '<!-- wp:paragraph -->',
    `<p>For support turning this guidance into execution, explore Technijian resources for ${internal}.</p>`,
    '<!-- /wp:paragraph -->',
    '',
    '<!-- wp:paragraph -->',
    `<p>For additional reference, see ${external}.</p>`,
    '<!-- /wp:paragraph -->'
  ].join('\n');
}

function updateContent(content, post) {
  const cleaned = removeRecommendedSection(content);
  return `${cleaned}\n\n${anchorParagraphs(post)}\n`;
}

async function findExistingTerms(kind, names) {
  const ids = [];
  for (const name of names) {
    const slug = name.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const bySlug = await wpFetch(`/wp-json/wp/v2/${kind}?slug=${encodeURIComponent(slug)}&per_page=100`);
    if (Array.isArray(bySlug) && bySlug.length) {
      ids.push(bySlug[0].id);
      continue;
    }
    const found = await wpFetch(`/wp-json/wp/v2/${kind}?search=${encodeURIComponent(name)}&per_page=100`);
    const exact = Array.isArray(found) ? found.find((term) => term.name.toLowerCase() === name.toLowerCase()) : null;
    if (exact) ids.push(exact.id);
    else console.warn(`Missing ${kind.slice(0, -1)} term: ${name}`);
  }
  return [...new Set(ids)];
}

async function main() {
  const results = [];

  for (const row of manifest.filter((item) => targetKeys.has(item.key))) {
    const post = posts.find((item) => item.key === row.key);
    const live = await wpFetch(`/wp-json/wp/v2/posts/${row.id}?context=edit`);
    const content = updateContent(live.content.raw || live.content.rendered || fs.readFileSync(post.contentFile, 'utf8'), post);
    const categoryIds = await findExistingTerms('categories', [post.category]);
    const tagIds = await findExistingTerms('tags', post.tags);

    const payload = {
      title: post.title,
      slug: post.slug,
      status: 'future',
      date: post.date,
      content,
      excerpt: post.excerpt,
      featured_media: row.mediaId,
      meta: {
        _yoast_wpseo_focuskw: post.yoast.focusKeyphrase,
        _yoast_wpseo_title: post.yoast.metaTitle,
        _yoast_wpseo_metadesc: post.yoast.metaDescription,
        _yoast_wpseo_focuskeywords: JSON.stringify(post.yoast.relatedKeyphrases || []),
        _yoast_wpseo_metakeywords: post.yoast.metaKeywords,
        hide_featured_image: '1'
      }
    };
    if (categoryIds.length) payload.categories = categoryIds;
    if (tagIds.length) payload.tags = tagIds;

    const updated = await wpFetch(`/wp-json/wp/v2/posts/${row.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    await updateYoastXmlRpc(row.id, post);

    results.push({
      key: row.key,
      id: row.id,
      status: updated.status,
      link: updated.link,
      categoriesApplied: categoryIds.length,
      tagsApplied: tagIds.length,
      yoastUpdatedViaXmlRpc: true
    });
    console.log(`Fixed: ${post.title} (${row.id})`);
  }

  fs.writeFileSync(path.join(ROOT, 'week15-live-fix-result.json'), `${JSON.stringify(results, null, 2)}\n`, 'utf8');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
