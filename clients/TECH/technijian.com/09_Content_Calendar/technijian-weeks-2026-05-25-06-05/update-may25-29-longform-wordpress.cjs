const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SITE = process.env.TECH_WP_SITE || 'https://technijian.com';
const WP_USER = process.env.TECH_WP_USER || process.env.WP_USER;
const WP_PASSWORD = process.env.TECH_WP_PASSWORD || process.env.WP_PASSWORD;
const posts = JSON.parse(fs.readFileSync(path.join(ROOT, 'next-two-weeks-posts.json'), 'utf8'))
  .filter((post) => /^2026-05-2[5-9]/.test(post.key));

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

async function findExisting(slug) {
  const found = await wpFetch(`/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&status=publish,future,draft,pending,private&context=edit`);
  if (!Array.isArray(found) || !found.length) throw new Error(`No post found for slug: ${slug}`);
  return found[0];
}

function escapeXml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function member(name, value) {
  return `<member><name>${escapeXml(name)}</name><value><string>${escapeXml(value)}</string></value></member>`;
}

function customField(key, value) {
  return `<value><struct>${member('key', key)}${member('value', value)}</struct></value>`;
}

async function xmlRpc(method, paramsXml) {
  const body = `<?xml version="1.0"?><methodCall><methodName>${method}</methodName><params>${paramsXml.map((param) => `<param><value>${param}</value></param>`).join('')}</params></methodCall>`;
  const response = await fetch(`${SITE}/xmlrpc.php`, { method: 'POST', headers: { 'Content-Type': 'text/xml' }, body });
  const text = await response.text();
  if (!response.ok || /<fault>/.test(text)) throw new Error(`XML-RPC ${method} failed (${response.status}): ${text.slice(0, 600)}`);
}

async function updateYoast(postId, post) {
  const fields = [
    customField('_yoast_wpseo_focuskw', post.yoast.focusKeyphrase),
    customField('_yoast_wpseo_title', post.yoast.metaTitle),
    customField('_yoast_wpseo_metadesc', post.yoast.metaDescription),
    customField('_yoast_wpseo_focuskeywords', JSON.stringify(post.yoast.relatedKeyphrases)),
    customField('_yoast_wpseo_metakeywords', post.yoast.metaKeywords),
    customField('_kadence_hide_featured_image', '1'),
    customField('_astra_hide_featured_image', '1'),
    customField('_generate_disable_post_image', '1'),
    customField('_disable_featured_image', '1'),
    customField('hide_featured_image', '1')
  ].join('');
  const struct = `<struct><member><name>custom_fields</name><value><array><data>${fields}</data></array></value></member></struct>`;
  await xmlRpc('wp.editPost', ['<int>1</int>', `<string>${escapeXml(WP_USER)}</string>`, `<string>${escapeXml(WP_PASSWORD)}</string>`, `<int>${postId}</int>`, struct]);
}

function wordCount(html) {
  return html.replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
}

async function main() {
  const result = [];
  for (const post of posts) {
    const content = fs.readFileSync(post.contentFile, 'utf8');
    const words = wordCount(content);
    if (words < 2000) throw new Error(`${post.slug} has only ${words} words`);
    const existing = await findExisting(post.slug);
    const saved = await wpFetch(`/wp-json/wp/v2/posts/${existing.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        excerpt: post.excerpt,
        status: 'future',
        date: post.date
      })
    });
    await updateYoast(saved.id, post);
    result.push({ id: saved.id, slug: saved.slug, status: saved.status, date: saved.date, words });
    console.log(`Updated long-form content: ${saved.slug} (${words} words)`);
  }
  fs.writeFileSync(path.join(ROOT, 'may25-29-longform-wordpress-update.json'), `${JSON.stringify(result, null, 2)}\n`, 'utf8');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
