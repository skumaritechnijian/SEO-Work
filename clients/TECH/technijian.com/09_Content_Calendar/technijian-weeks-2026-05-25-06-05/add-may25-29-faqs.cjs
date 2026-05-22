const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const WEBSITE_POSTS_DIR = path.resolve(ROOT, '..', '..', 'Website Blogs', 'Week_16-17_May_25-Jun_05_2026_Blogs', 'posts');
const MANIFEST = path.join(ROOT, 'next-two-weeks-posts.json');
const posts = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));

const faqs = {
  'oc-dental-practices-managed-it-2026': [
    ['Why do OC dental practices need managed IT in 2026?', 'Orange County dental practices need managed IT because clinical operations now depend on secure, reliable technology for imaging, scheduling, billing, patient communication, backups, and HIPAA-aligned access controls. Managed IT helps reduce downtime, protect patient data, coordinate vendors, and keep the practice prepared for security or recovery events.'],
    ['Is managed IT helpful for HIPAA compliance?', 'Yes. Managed IT supports HIPAA compliance by helping maintain technical safeguards such as user access controls, endpoint protection, encryption, audit support, backups, patching, and incident response procedures. Legal and compliance obligations still require leadership oversight, but IT controls are a major part of daily readiness.'],
    ['What systems should a dental IT provider support?', 'A dental IT provider should understand workstations, servers, imaging systems, practice management software, phones, internet connectivity, Wi-Fi, printers, backup platforms, cybersecurity tools, patient communication systems, and vendor escalation workflows.'],
    ['How often should dental practices test backups?', 'Dental practices should review backup status continuously and perform restore testing on a recurring schedule. The goal is to confirm that patient records, imaging data, documents, and key systems can be recovered within a timeframe that protects operations.'],
    ['What is the first step before hiring a managed IT provider?', 'Start with an IT assessment. Document devices, users, vendors, software, backups, security controls, remote access, and known pain points. This gives leadership a practical baseline before comparing providers or approving a support plan.']
  ],
  'ci-cd-pipeline-startups-2026': [
    ['What is a CI/CD pipeline for startups?', 'A CI/CD pipeline is a repeatable software delivery process that automatically builds, tests, checks, and deploys code. For startups, it helps teams release faster while reducing bugs, deployment stress, and avoidable technical debt.'],
    ['When should a startup build a CI/CD pipeline?', 'A startup should build a basic CI/CD pipeline as soon as more than one person contributes code or the product has real users. The first version can be simple, but it should include source control, pull requests, automated checks, staging, and a repeatable production deployment path.'],
    ['How does CI/CD reduce technical debt?', 'CI/CD reduces technical debt by catching broken builds, failed tests, insecure dependencies, and deployment mistakes earlier. It also creates a shared release process so teams do not rely on undocumented manual steps or one developer’s memory.'],
    ['Should security checks be part of CI/CD?', 'Yes. Startups should include secret scanning, dependency checks, static analysis, container scanning where relevant, and access controls in the pipeline. Security checks are easier to maintain when they are part of normal delivery rather than added after launch.'],
    ['What is the minimum viable CI/CD pipeline?', 'A minimum viable pipeline includes branch protection, pull request review, automated build checks, basic tests, dependency scanning, staging deployment, production deployment, and a rollback process. The pipeline can mature as the product and customer risk grow.']
  ],
  'page-speed-optimization-oc-restaurants-2026': [
    ['Why does page speed matter for OC restaurants?', 'Page speed matters because restaurant searches often happen on mobile when guests are ready to view a menu, reserve a table, call, get directions, or order. A slow site can cause potential diners to leave before they take action.'],
    ['Can page speed affect restaurant SEO?', 'Yes. Page speed can support search visibility by improving crawlability, mobile experience, engagement, and Core Web Vitals. It is not the only ranking factor, but it is an important part of a healthy local SEO and conversion strategy.'],
    ['What slows down restaurant websites most often?', 'Common problems include oversized food photos, PDF-only menus, heavy booking widgets, review widgets, embedded maps, too many plugins, render-blocking scripts, slow hosting, and unoptimized mobile layouts.'],
    ['Should restaurants use HTML menus instead of PDFs?', 'Restaurants should usually use crawlable HTML menus as the primary menu experience because they are easier to read on mobile, better for SEO, and faster when built well. PDFs can still be offered as a secondary download.'],
    ['How often should restaurants test website speed?', 'Restaurants should test speed after major menu updates, new photos, plugin changes, redesigns, booking platform changes, and paid campaign launches. A quarterly performance review is a good baseline for active restaurant websites.']
  ],
  'ai-roi-metrics-orange-county-businesses-2026': [
    ['What AI ROI metrics should businesses track first?', 'Businesses should start with workflow metrics such as time saved, cycle time, error reduction, rework, adoption, response speed, customer impact, revenue influence, and risk controls. The right metrics depend on the workflow being improved.'],
    ['Why is a baseline important before adopting AI?', 'A baseline shows how the process performs before AI is introduced. Without it, leaders cannot tell whether AI improved speed, quality, cost, customer experience, or risk. Baselines turn AI ROI from a guess into a measurable comparison.'],
    ['Is employee adoption an AI ROI metric?', 'Yes. Employee adoption is critical because a tool that people do not use has little value. Track active users, repeat usage, completed workflows, trust, overrides, and abandonment points to understand whether AI is actually helping work get done.'],
    ['How should businesses measure AI risk?', 'Businesses should track sensitive data exposure, permission scope, human approval points, audit logs, vendor risk, inaccurate outputs, and compliance exceptions. Risk controls protect ROI by preventing expensive mistakes.'],
    ['When should an AI pilot be scaled?', 'Scale an AI pilot only when it shows measurable improvement against the baseline, has acceptable risk controls, earns user adoption, and fits the broader workflow. If speed improves but errors or risk increase, refine the pilot before expanding.']
  ],
  'google-local-services-ads-orange-county-2026': [
    ['What are Google Local Services Ads?', 'Google Local Services Ads are paid local listings designed to connect searchers with service providers. Depending on category and location, businesses may need to complete screening, verification, license, insurance, or background check requirements.'],
    ['Do Local Services Ads replace local SEO?', 'No. Local Services Ads can support lead generation, but they do not replace local SEO. Businesses still need strong service pages, reviews, Google Business Profile optimization, website speed, schema, conversion tracking, and reputation management.'],
    ['Why do LSAs matter for Orange County businesses?', 'They matter because OC service markets are competitive and many searches have high commercial intent. LSAs can influence visibility near the top of search results, but lead quality still depends on trust, reviews, response speed, and operational follow-up.'],
    ['How can businesses improve LSA lead quality?', 'Improve lead quality by choosing accurate service categories, responding quickly, tracking calls, training intake staff, reviewing booked revenue, disputing invalid leads when appropriate, and aligning ad visibility with strong website and review signals.'],
    ['What should businesses check before increasing LSA budget?', 'Before increasing budget, review lead quality, close rate, response speed, review strength, service areas, website conversion paths, business profile accuracy, and staff follow-up. More spend should follow operational readiness, not replace it.']
  ]
};

function paragraph(text) {
  return `<!-- wp:paragraph -->\n<p>${text}</p>\n<!-- /wp:paragraph -->`;
}

function heading(level, text) {
  const attrs = level === 3 ? ' {"level":3}' : '';
  return `<!-- wp:heading${attrs} -->\n<h${level} class="wp-block-heading">${text}</h${level}>\n<!-- /wp:heading -->`;
}

function faqBlock(items) {
  const blocks = [heading(2, 'Frequently Asked Questions')];
  for (const [question, answer] of items) {
    blocks.push(heading(3, question));
    blocks.push(paragraph(answer));
  }
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer }
    }))
  };
  blocks.push(`<!-- wp:html -->\n<script type="application/ld+json">${JSON.stringify(schema)}</script>\n<!-- /wp:html -->`);
  return blocks.join('\n\n');
}

function wordCount(html) {
  return html.replace(/<!--[\s\S]*?-->/g, ' ').replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
}

const summary = [];
for (const post of posts) {
  const items = faqs[post.slug];
  if (!items) continue;
  const file = post.contentFile;
  let html = fs.readFileSync(file, 'utf8');
  html = html
    .replace(/<!-- wp:heading -->\s*<h2 class="wp-block-heading">Frequently Asked Questions<\/h2>[\s\S]*$/i, '')
    .trim();
  html = `${html}\n\n${faqBlock(items)}\n`;
  fs.writeFileSync(file, html, 'utf8');
  fs.mkdirSync(WEBSITE_POSTS_DIR, { recursive: true });
  fs.writeFileSync(path.join(WEBSITE_POSTS_DIR, path.basename(file)), html, 'utf8');
  summary.push({ slug: post.slug, words: wordCount(html), faqCount: items.length });
}

fs.writeFileSync(path.join(ROOT, 'may25-29-faq-update.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
fs.writeFileSync(path.resolve(ROOT, '..', '..', 'Website Blogs', 'Week_16-17_May_25-Jun_05_2026_Blogs', 'may25-29-faq-update.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(summary, null, 2));
