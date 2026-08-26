// Post-build sanity check: SEO tags, JSON-LD validity, heading structure,
// and internal links that point at nothing. Run with `node check.mjs`.

import { readFile, readdir, stat } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { BASE_PATH } from './src/site.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, 'dist');

const problems = [];
const notes = [];

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const exists = async (p) => { try { await stat(p); return true; } catch { return false; } };

const routeOf = (file) =>
  '/' + file.slice(DIST.length + 1).replace(/\\/g, '/').replace(/index\.html$/, '');

function textOf(html, re) {
  const m = html.match(re);
  return m ? m[1].trim() : null;
}

const files = await walk(DIST);

for (const file of files) {
  const route = routeOf(file);
  const html = await readFile(file, 'utf8');
  const tag = (n) => `${route} — ${n}`;

  // --- lang / dir
  if (!/<html lang="he" dir="rtl">/.test(html)) problems.push(tag('missing lang="he" dir="rtl"'));

  // --- title
  const title = textOf(html, /<title>([\s\S]*?)<\/title>/);
  if (!title) problems.push(tag('no <title>'));
  else if (title.length > 62) notes.push(tag(`title is ${title.length} chars (>62 may truncate): "${title}"`));
  else if (title.length < 20) notes.push(tag(`title is short (${title.length}): "${title}"`));

  // --- description
  const desc = textOf(html, /<meta name="description" content="([\s\S]*?)">/);
  if (!desc) problems.push(tag('no meta description'));
  else if (desc.length > 158) notes.push(tag(`description is ${desc.length} chars (>158 may truncate)`));
  else if (desc.length < 70) notes.push(tag(`description is short (${desc.length})`));

  // --- canonical + robots
  if (!/<link rel="canonical"/.test(html)) problems.push(tag('no canonical'));
  const noindex = /content="noindex/.test(html);

  // --- headings
  const h1s = [...html.matchAll(/<h1[^>]*>/g)].length;
  if (h1s !== 1) problems.push(tag(`${h1s} <h1> tags (expected exactly 1)`));

  const levels = [...html.matchAll(/<h([1-4])[^>]*>/g)].map((m) => Number(m[1]));
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] - levels[i - 1] > 1) {
      notes.push(tag(`heading jumps h${levels[i - 1]} → h${levels[i]}`));
      break;
    }
  }

  // --- JSON-LD
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (!blocks.length) problems.push(tag('no JSON-LD'));
  for (const b of blocks) {
    try {
      const data = JSON.parse(b[1]);
      const graph = data['@graph'] || [data];
      for (const node of graph) {
        if (!node['@type']) problems.push(tag('JSON-LD node without @type'));
      }
      if (!noindex && !graph.some((n) => n['@type'] === 'Attorney')) {
        problems.push(tag('JSON-LD missing the Attorney node'));
      }
    } catch (e) {
      problems.push(tag(`JSON-LD does not parse: ${e.message}`));
    }
  }

  // --- images must have alt
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt=/.test(m[0])) problems.push(tag('an <img> has no alt attribute'));
  }

  // --- internal links resolve
  // dist/ is written with the deployment's path prefix baked into every
  // href, but the files on disk do not carry it — so it comes back off here.
  for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    const raw = m[1];
    if (BASE_PATH && raw !== BASE_PATH && !raw.startsWith(BASE_PATH + '/')) {
      problems.push(tag(`internal link escapes the deployment path: ${raw}`));
      continue;
    }
    const href = BASE_PATH ? raw.slice(BASE_PATH.length) || '/' : raw;
    if (href.startsWith('/assets/')) {
      if (!(await exists(join(DIST, href.slice(1)))) && !href.includes('og-default') && !href.includes('apple-touch')) {
        problems.push(tag(`asset not found: ${href}`));
      }
      continue;
    }
    const target = href.endsWith('.html')
      ? join(DIST, href.slice(1))
      : join(DIST, href.slice(1), 'index.html');
    if (!(await exists(target))) problems.push(tag(`dead internal link: ${href}`));
  }
}

// --- sitemap + robots
for (const f of ['sitemap.xml', 'robots.txt']) {
  if (!(await exists(join(DIST, f)))) problems.push(`missing ${f}`);
}
const sm = await readFile(join(DIST, 'sitemap.xml'), 'utf8');
if (/thank-you|404/.test(sm)) problems.push('sitemap lists a noindex page');
const smCount = [...sm.matchAll(/<loc>/g)].length;

// --- report
console.log(`checked ${files.length} pages, ${smCount} sitemap URLs\n`);
if (problems.length) {
  console.log(`✗ ${problems.length} problem(s):`);
  problems.forEach((p) => console.log('  - ' + p));
} else {
  console.log('✓ no problems');
}
if (notes.length) {
  console.log(`\n${notes.length} note(s):`);
  notes.forEach((n) => console.log('  · ' + n));
}
process.exit(problems.length ? 1 : 0);
