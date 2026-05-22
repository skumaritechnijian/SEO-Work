const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SOURCE = path.resolve(ROOT, '..', '..', 'Website Blogs', 'Week_15_May_18-22_2026_Content_Package.md');
const POSTS_DIR = path.join(ROOT, 'posts');
const IMAGES_DIR = path.join(ROOT, 'featured-images');

const specs = [
  {
    key: 'monday-persona-a',
    day: 'Monday',
    date: '2026-05-18T09:00:00-07:00',
    persona: 'Persona A - Compliance-Anxious Executive',
    author: 'Puneet Kumar',
    category: 'Managed IT Services',
    focus: 'IT disaster recovery Newport Beach businesses 2026',
    metaTitle: 'IT Disaster Recovery Newport Beach 2026 | Technijian',
    metaDescription: 'Build a 2026 IT disaster recovery plan for Newport Beach businesses with RTO, RPO, ransomware recovery, compliance planning, and tested procedures.',
    tags: ['IT disaster recovery', 'Newport Beach IT', 'business continuity', 'ransomware recovery', 'managed IT services', 'HIPAA compliance'],
    keyphrases: ['IT disaster recovery Newport Beach businesses 2026', 'business continuity Newport Beach', 'ransomware recovery plan', 'managed IT disaster recovery'],
    internalLinks: [
      ['Managed IT services', 'https://technijian.com/managed-it-services/'],
      ['Cybersecurity services', 'https://technijian.com/cybersecurity-services/'],
      ['HIPAA compliant IT support', 'https://technijian.com/hipaa-compliant-it-support/']
    ],
    externalLinks: [
      ['Ready.gov business continuity planning', 'https://www.ready.gov/business-continuity-plan'],
      ['NIST Cybersecurity Framework', 'https://www.nist.gov/cyberframework']
    ],
    imageTheme: 'Coastal Newport Beach business skyline, resilient cloud infrastructure, secure backup nodes, blue and teal cyber grid'
  },
  {
    key: 'tuesday-persona-b',
    day: 'Tuesday',
    date: '2026-05-19T09:00:00-07:00',
    persona: 'Persona B - Visionary Founder',
    author: 'Mohit Pandey',
    category: 'Software Development',
    focus: 'software development RFP 2026 Orange County vendor selection',
    metaTitle: 'Software Development RFP 2026 Orange County Guide',
    metaDescription: 'Use this 2026 Orange County software development RFP guide to compare vendors, protect IP, evaluate architecture, and avoid delivery risk.',
    tags: ['software development RFP', 'Orange County software development', 'vendor selection', 'custom software', 'SaaS development', 'AI-native SDLC'],
    keyphrases: ['software development RFP 2026 Orange County vendor selection', 'software vendor selection Orange County', 'custom software RFP checklist', 'SaaS development RFP'],
    internalLinks: [
      ['Custom software development', 'https://technijian.com/custom-software-development/'],
      ['AI-native software development', 'https://technijian.com/ai-native-software-development/'],
      ['Technology consulting', 'https://technijian.com/technology-consulting/']
    ],
    externalLinks: [
      ['CISA secure by design guidance', 'https://www.cisa.gov/securebydesign'],
      ['OWASP Software Assurance Maturity Model', 'https://owaspsamm.org/']
    ],
    imageTheme: 'Orange County founder reviewing software architecture boards, contract-first API diagrams, clean product roadmap interface'
  },
  {
    key: 'wednesday-persona-c',
    day: 'Wednesday',
    date: '2026-05-20T09:00:00-07:00',
    persona: 'Persona C - Growth-Blocked Owner or CMO',
    author: 'Saroj',
    category: 'SEO Services',
    focus: 'technical SEO audit checklist Orange County 2026',
    metaTitle: 'Technical SEO Audit Checklist Orange County 2026',
    metaDescription: 'Run a 2026 technical SEO audit for an Orange County business with checks for crawlability, Core Web Vitals, schema, indexing, and redirects.',
    tags: ['technical SEO audit', 'Orange County SEO', 'Core Web Vitals', 'schema markup', 'crawlability', 'Yoast SEO'],
    keyphrases: ['technical SEO audit checklist Orange County 2026', 'Orange County technical SEO', 'Core Web Vitals audit', 'schema markup audit'],
    internalLinks: [
      ['SEO services', 'https://technijian.com/seo-services/'],
      ['Technical SEO services', 'https://technijian.com/technical-seo/'],
      ['Website maintenance', 'https://technijian.com/website-maintenance/']
    ],
    externalLinks: [
      ['Google Search Central SEO starter guide', 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide'],
      ['PageSpeed Insights', 'https://pagespeed.web.dev/']
    ],
    imageTheme: 'Technical SEO dashboard with crawl maps, schema blocks, speed metrics, Orange County business website audit'
  },
  {
    key: 'thursday-persona-d',
    day: 'Thursday',
    date: '2026-05-21T09:00:00-07:00',
    persona: 'Persona D - Enterprise Digital Transformation Director',
    author: 'Vaishali',
    category: 'AI Consulting',
    focus: 'AI chatbot vs AI agent difference 2026 Orange County business',
    metaTitle: 'AI Chatbot vs AI Agent Difference 2026 | OC Business',
    metaDescription: 'Compare AI chatbots and AI agents for Orange County businesses in 2026, including autonomy, workflows, security, CRM actions, and adoption risk.',
    tags: ['AI chatbot', 'AI agent', 'Orange County AI consulting', 'business automation', 'secure AI', 'enterprise AI'],
    keyphrases: ['AI chatbot vs AI agent difference 2026 Orange County business', 'AI agent for business automation', 'enterprise AI consulting Orange County', 'secure AI implementation'],
    internalLinks: [
      ['AI consulting services', 'https://technijian.com/ai-consulting/'],
      ['Microsoft Copilot consulting', 'https://technijian.com/microsoft-copilot-consulting/'],
      ['Cybersecurity services', 'https://technijian.com/cybersecurity-services/']
    ],
    externalLinks: [
      ['NIST AI Risk Management Framework', 'https://www.nist.gov/itl/ai-risk-management-framework'],
      ['Microsoft responsible AI principles', 'https://www.microsoft.com/ai/responsible-ai']
    ],
    imageTheme: 'Split comparison of chatbot conversation bubble and autonomous AI agent workflow, secure enterprise controls, Orange County office'
  },
  {
    key: 'friday-news-persona-b',
    day: 'Friday',
    date: '2026-05-22T09:00:00-07:00',
    persona: 'Persona B - Visionary Founder',
    author: 'Mohit Pandey',
    category: 'Technology News',
    focus: 'Y Combinator SoCal startups 2026 Orange County Los Angeles AI investment',
    metaTitle: 'Y Combinator SoCal Startups 2026 | OC and LA AI',
    metaDescription: 'What Y Combinator and the 2026 SoCal AI startup surge mean for Orange County and Los Angeles founders, software teams, and investors.',
    tags: ['Y Combinator', 'SoCal startups', 'Los Angeles startups', 'Orange County startups', 'AI investment', 'SaaS development'],
    keyphrases: ['Y Combinator SoCal startups 2026 Orange County Los Angeles AI investment', 'SoCal AI startups 2026', 'Orange County startup software development', 'Los Angeles AI startup funding'],
    internalLinks: [
      ['Custom software development', 'https://technijian.com/custom-software-development/'],
      ['AI-native software development', 'https://technijian.com/ai-native-software-development/'],
      ['AI consulting services', 'https://technijian.com/ai-consulting/']
    ],
    externalLinks: [
      ['Y Combinator companies in Los Angeles', 'https://www.ycombinator.com/companies/location/los-angeles'],
      ['Y Combinator applications', 'https://www.ycombinator.com/apply/']
    ],
    imageTheme: 'Southern California AI startup ecosystem map, OC and LA nodes, venture funding lines, founders building SaaS products'
  }
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function slugify(input) {
  return input.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function escapeHtml(input) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function splitSections(markdown) {
  const matches = [...markdown.matchAll(/^##\s+.*?(MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY).*$/gim)];
  return matches.map((match, index) => {
    const start = match.index;
    const end = matches[index + 1]?.index ?? markdown.length;
    return markdown.slice(start, end).trim();
  });
}

function extract(section, regex) {
  return section.match(regex)?.[1]?.replace(/\*\*/g, '').trim() || '';
}

function plainText(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/[#>*_`[\]()]/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function excerpt(markdown, wordCount = 150) {
  const words = plainText(cleanArticleMarkdown(markdown)).split(/\s+/).filter(Boolean);
  return words.slice(0, wordCount).join(' ') + (words.length > wordCount ? '.' : '');
}

function cleanArticleMarkdown(markdown) {
  return markdown
    .split(/\r?\n/)
    .filter((line) => {
      const trimmed = line.trim();
      if (!trimmed) return true;
      if (/^##\s+/.test(trimmed)) return false;
      if (/^###\s+/.test(trimmed)) return false;
      if (/NEWS ARTICLE/i.test(trimmed)) return false;
      if (/^(?:🔑|🔗|📰|Target Keyword|URL Slug|Persona Tracker|Published|Persona):/i.test(trimmed)) return false;
      if (/^\*\*(?:Persona|Trending Sources|Target Keyword|URL Slug|Persona Tracker|Published):/i.test(trimmed)) return false;
      return true;
    })
    .join('\n');
}

function inlineMarkdown(line) {
  return escapeHtml(line)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[(.+?)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2">$1</a>');
}

function markdownToBlocks(markdown, post) {
  if (post.key === 'friday-news-persona-b') {
    markdown = markdown
      .replace(/123 LA-Area Startups/g, '148 LA-Area Startups')
      .replace(/123 LA-area startups/g, '148 LA-area startups')
      .replace(/123 Los Angeles-area startups/g, '148 Los Angeles-area startups')
      .replace(/123 YC-Backed LA Startups/g, '148 YC-Backed LA Startups')
      .replace(/123 active startups/g, '148 active startups')
      .replace(
        /One of the clear narratives from the W26 batch analysis is that AI-native startups are targeting the replacement of[\s\S]*?Please paste the remainder of the Friday News Article and I will append it to this file\./,
        [
          'One of the clear narratives from the W26 batch analysis is that AI-native startups are targeting the replacement of legacy SaaS workflows with smaller, faster, AI-native systems. That matters for OC founders and operators because the next competitive advantage may not come from buying another large platform. It may come from rebuilding one narrow workflow with better data access, stronger automation, and a cleaner user experience.',
          '',
          '#### How OC Founders Should Respond',
          '',
          'For Orange County and Los Angeles founders, the lesson is practical: speed still matters, but architecture matters more. A rushed AI product with weak security, unclear data boundaries, and brittle integrations will struggle once enterprise buyers start asking procurement questions. Founders should define their core workflow, document the data model, protect customer information from day one, and build with enough discipline that investor momentum does not turn into technical debt.',
          '',
          '#### Where Technijian Fits',
          '',
          'Technijian supports this exact stage of the market: founders and growth teams that need software built quickly without sacrificing architecture, security, or long-term maintainability. Whether an OC company is preparing an MVP, replacing an internal workflow, evaluating AI vendors, or hardening a SaaS product for enterprise customers, the right technical partner can turn market urgency into a system that survives real customer use.',
          '',
          '#### Final Takeaway',
          '',
          'The YC W26 effect is not only a Silicon Valley story. It is a Southern California execution signal. AI-native software companies are moving faster, raising expectations, and changing what buyers expect from digital products. OC businesses that understand the shift now can make better build, buy, and partnership decisions before the next wave of AI vendors reaches their inbox.'
        ].join('\n')
      );
  }
  const lines = markdown.split(/\r?\n/);
  const blocks = [];
  let para = [];
  let inList = false;

  function flushPara() {
    if (para.length) {
      blocks.push(`<!-- wp:paragraph -->\n<p>${inlineMarkdown(para.join(' '))}</p>\n<!-- /wp:paragraph -->`);
      para = [];
    }
  }

  function closeList() {
    if (inList) {
      blocks.push('</ul>\n<!-- /wp:list -->');
      inList = false;
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushPara();
      closeList();
      continue;
    }
    if (/^##\s+/.test(trimmed)) continue;
    if (/NEWS ARTICLE/i.test(trimmed)) continue;
    if (/^###\s+/.test(trimmed)) {
      flushPara();
      closeList();
      blocks.push(`<!-- wp:heading {"level":1} -->\n<h1 class="wp-block-heading">${inlineMarkdown(trimmed.replace(/^###\s+/, ''))}</h1>\n<!-- /wp:heading -->`);
      continue;
    }
    if (/^####\s+/.test(trimmed)) {
      flushPara();
      closeList();
      blocks.push(`<!-- wp:heading -->\n<h2 class="wp-block-heading">${inlineMarkdown(trimmed.replace(/^####\s+/, ''))}</h2>\n<!-- /wp:heading -->`);
      continue;
    }
    if (/^[-*]\s+/.test(trimmed)) {
      flushPara();
      if (!inList) {
        blocks.push('<!-- wp:list -->\n<ul>');
        inList = true;
      }
      blocks.push(`<li>${inlineMarkdown(trimmed.replace(/^[-*]\s+/, ''))}</li>`);
      continue;
    }
    if (/^(?:🔑|🔗|📰|Target Keyword|URL Slug|Persona Tracker|Published|Persona):/i.test(trimmed)) continue;
    if (/^\*\*(?:Persona|Trending Sources|Target Keyword|URL Slug|Persona Tracker|Published):/i.test(trimmed)) continue;
    para.push(trimmed);
  }

  flushPara();
  closeList();

  const linkBlock = [
    '<!-- wp:heading -->',
    '<h2 class="wp-block-heading">Recommended Reading and Sources</h2>',
    '<!-- /wp:heading -->',
    '<!-- wp:list -->',
    '<ul>',
    ...post.internalLinks.map(([text, url]) => `<li>Technijian: <a href="${url}">${escapeHtml(text)}</a></li>`),
    ...post.externalLinks.map(([text, url]) => `<li>External source: <a href="${url}" rel="noopener" target="_blank">${escapeHtml(text)}</a></li>`),
    '</ul>',
    '<!-- /wp:list -->'
  ].join('\n');

  return [
    '<!-- SEO Brief',
    `Focus keyphrase: ${post.focus}`,
    `Related keyphrases: ${post.keyphrases.join(', ')}`,
    `Meta title: ${post.metaTitle}`,
    `Meta description: ${post.metaDescription}`,
    'Featured image is assigned for social/Open Graph use and hidden on the single post template.',
    '-->',
    ...blocks,
    linkBlock
  ].join('\n\n');
}

function build() {
  ensureDir(POSTS_DIR);
  ensureDir(IMAGES_DIR);

  const markdown = fs.readFileSync(SOURCE, 'utf8');
  const sections = splitSections(markdown);
  if (sections.length !== 5) {
    throw new Error(`Expected 5 Week 15 sections, found ${sections.length}`);
  }

  const posts = sections.map((section, index) => {
    const spec = specs[index];
    let title = extract(section, /^###\s+(.+)$/m);
    if (spec.key === 'friday-news-persona-b') {
      title = title.replace('123 LA-Area Startups', '148 LA-Area Startups');
      section = section
        .replace(/123 LA-Area Startups/g, '148 LA-Area Startups')
        .replace(/123 LA-area startups/g, '148 LA-area startups')
        .replace(/123 Los Angeles-area startups/g, '148 Los Angeles-area startups')
        .replace(/123 YC-Backed LA Startups/g, '148 YC-Backed LA Startups')
        .replace(/123 active startups/g, '148 active startups');
    }
    const urlPath = extract(section, /(?:URL|URL Slug).*?(\S+\/)\s*$/im);
    const slug = urlPath ? urlPath.split('/').filter(Boolean).pop() : slugify(title);
    const contentFile = path.join(POSTS_DIR, `${slug}.html`);
    const imageFile = path.join(IMAGES_DIR, `${spec.key}.png`);
    const post = {
      ...spec,
      title,
      slug,
      sourceFile: SOURCE,
      contentFile,
      imageFile,
      imageAlt: `${title} featured image for Technijian`,
      imagePrompt: `Create a 1200x630 editorial technology blog featured image for Technijian. Theme: ${spec.imageTheme}. Premium B2B technology style, realistic but polished, no readable text, no logos, no people looking at camera, clean negative space for crop safety.`,
      excerpt: excerpt(section, 150),
      hideFeaturedImage: true,
      yoast: {
        focusKeyphrase: spec.focus,
        relatedKeyphrases: spec.keyphrases.slice(1).map((keyword) => ({ keyword, score: 0 })),
        metaTitle: spec.metaTitle,
        metaDescription: spec.metaDescription,
        metaKeywords: spec.keyphrases.join(', ')
      }
    };
    fs.writeFileSync(contentFile, markdownToBlocks(section, post), 'utf8');
    return post;
  });

  fs.writeFileSync(path.join(ROOT, 'week15-posts.json'), `${JSON.stringify(posts, null, 2)}\n`, 'utf8');
  fs.writeFileSync(path.join(ROOT, 'WEEK15_SCHEDULE_SUMMARY.md'), summary(posts), 'utf8');
  console.log(`Built ${posts.length} posts in ${ROOT}`);
}

function summary(posts) {
  return [
    '# Technijian Week 15 Blog Schedule',
    '',
    'Source plan confirms Week 15 is Phase 15: Content Refresh (Update Old Posts).',
    '',
    '| Day | Date | Persona | Title | Focus keyphrase | Slug |',
    '|---|---:|---|---|---|---|',
    ...posts.map((post) => `| ${post.day} | ${post.date} | ${post.persona} | ${post.title} | ${post.focus} | ${post.slug} |`),
    '',
    '## WordPress Notes',
    '',
    '- Use `future` status for future dates.',
    '- Monday May 18 and Tuesday May 19, 2026 are already in the past as of May 20, 2026; WordPress will usually publish immediately if those dates are used live now.',
    '- Featured images are generated as package assets and marked `hideFeaturedImage: true` for template-level hiding.',
    '- Yoast fields are included in `week15-posts.json`: focus keyphrase, related keyphrases, SEO title, meta description, and meta keywords.',
    ''
  ].join('\n');
}

build();
