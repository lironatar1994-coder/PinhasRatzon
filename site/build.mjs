// Static site build. No dependencies — run with `node build.mjs`.
// Output goes to dist/ and is deployable as-is to any static host.

import { mkdir, writeFile, rm, cp, stat, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { SITE_URL, BASE_PATH } from './src/site.mjs';
import { PRACTICE } from './src/content/practice.mjs';
import { setAssetVersion } from './src/layout.mjs';
import {
  home, practiceIndex, practicePage, about, faqPage, contact,
  accessibility, thankYou, notFound,
} from './src/pages.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, 'dist');
const PUBLIC = join(ROOT, 'public');

const base = SITE_URL.replace(/\/$/, '');
const today = new Date().toISOString().slice(0, 10);

/** path → { html, priority, changefreq } */
const routes = new Map();
const unlisted = new Map();

const add = (path, html, priority = 0.7, changefreq = 'monthly') =>
  routes.set(path, { html, priority, changefreq });

// Pages are rendered only after the asset version is known, so the stamped
// /assets URLs land in every page.
function buildRoutes() {
  add('/', home(), 1.0, 'weekly');
  add('/practice-areas/', practiceIndex(), 0.9);
  for (const p of PRACTICE) add(`/practice-areas/${p.slug}/`, practicePage(p), 0.9);
  add('/about/', about(), 0.8);
  add('/faq/', faqPage(), 0.8);
  add('/contact/', contact(), 0.8);
  add('/accessibility/', accessibility(), 0.3, 'yearly');

  // Not in the sitemap and marked noindex.
  unlisted.set('/thank-you/', thankYou());
  unlisted.set('/404.html', notFound());
}

/* ------------------------------------------------------------------ write */

const outPathFor = (route) =>
  route.endsWith('.html') ? join(DIST, route.slice(1)) : join(DIST, route.slice(1), 'index.html');

// The pages are authored as if they sat at a domain root. When SITE_URL
// carries a path prefix, every root-relative reference in the rendered markup
// has to gain it — links, assets, preloads, form actions. Absolute URLs (the
// canonical, OG and JSON-LD ones) already come from SITE_URL and are untouched.
function withBase(html) {
  if (!BASE_PATH) return html;
  return html
    .replace(/\b(href|src|action)="\/(?!\/)/g, `$1="${BASE_PATH}/`)
    .replace(/\bsrcset="([^"]*)"/g, (_, list) => {
      const out = list
        .split(',')
        .map((c) => c.trim().replace(/^\/(?!\/)/, `${BASE_PATH}/`))
        .join(', ');
      return `srcset="${out}"`;
    });
}

async function writePage(route, html) {
  const file = outPathFor(route);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, withBase(html), 'utf8');
  return file;
}

function sitemapXml() {
  const urls = [...routes.entries()]
    .map(
      ([path, r]) => `  <url>
    <loc>${base}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority.toFixed(1)}</priority>
  </url>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function robotsTxt() {
  return `User-agent: *
Allow: ${BASE_PATH}/
Disallow: ${BASE_PATH}/thank-you/

Sitemap: ${base}/sitemap.xml
`;
}

async function exists(p) {
  try { await stat(p); return true; } catch { return false; }
}

async function main() {
  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });

  if (await exists(PUBLIC)) {
    await cp(PUBLIC, DIST, { recursive: true });
  }

  const css = await readFile(join(PUBLIC, 'assets/css/style.css'), 'utf8');
  const js = await readFile(join(PUBLIC, 'assets/js/main.js'), 'utf8');
  const v = createHash('sha1').update(css + js).digest('hex').slice(0, 8);
  setAssetVersion(v);
  buildRoutes();

  let n = 0;
  for (const [route, r] of routes) { await writePage(route, r.html); n++; }
  for (const [route, html] of unlisted) { await writePage(route, html); n++; }

  await writeFile(join(DIST, 'sitemap.xml'), sitemapXml(), 'utf8');
  await writeFile(join(DIST, 'robots.txt'), robotsTxt(), 'utf8');

  console.log(`built ${n} pages → dist/  (assets v=${v})`);
  console.log(`sitemap: ${routes.size} indexable URLs`);
  if (BASE_PATH) console.log(`path prefix: ${BASE_PATH} (applied to every internal link)`);
  if (base.includes('ratzon-law.co.il')) {
    console.warn('\n⚠️  SITE_URL is still the placeholder domain. Set it in src/site.mjs before deploying —');
    console.warn('   canonicals, Open Graph, the sitemap and the JSON-LD all derive from it.');
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
