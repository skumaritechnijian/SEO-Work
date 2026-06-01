const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SITE = process.env.TECH_WP_SITE || 'https://technijian.com';
const WP_USER = process.env.TECH_WP_USER || process.env.WP_USER;
const WP_PASSWORD = process.env.TECH_WP_PASSWORD || process.env.WP_PASSWORD;
const posts = JSON.parse(fs.readFileSync(path.join(ROOT, 'june-2026-posts.json'), 'utf8'));

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
  if (!response.ok) throw new Error(`WP ${options.method || 'GET'} ${pathname} failed (${response.status}): ${typeof body === 'string' ? body : JSON.stringify(body)}`);
  return body;
}

function wordCount(html) {
  return String(html || '')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

async function main() {
  const result = [];
  for (const post of posts) {
    const found = await wpFetch(`/wp-json/wp/v2/posts?slug=${encodeURIComponent(post.slug)}&status=publish,future,draft,pending,private&context=edit`);
    if (!Array.isArray(found) || !found.length) throw new Error(`Missing post ${post.slug}`);
    const live = found[0];
    const content = live.content && live.content.raw ? live.content.raw : live.content.rendered;
    result.push({
      slug: post.slug,
      id: live.id,
      status: live.status,
      date: live.date,
      categories: live.categories || [],
      tagCount: (live.tags || []).length,
      featuredMedia: live.featured_media,
      words: wordCount(content),
      hasFaq: /Frequently Asked Questions/i.test(content),
      hasFaqSchema: /FAQPage/i.test(content)
    });
  }
  fs.writeFileSync(path.join(ROOT, 'june-2026-verification.json'), `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
