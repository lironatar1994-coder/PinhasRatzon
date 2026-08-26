// G1 — measure the built inventory from dist/, not from the build's own log line.
import { spawnSync } from 'node:child_process';
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PRACTICE } from '../src/content/practice.mjs';

const SITE = dirname(dirname(fileURLToPath(import.meta.url)));
const DIST = join(SITE, 'dist');
const fail = (m) => { console.error('FAIL: ' + m); process.exitCode = 1; };

const build = spawnSync(process.execPath, ['build.mjs'], { cwd: SITE, encoding: 'utf8' });
if (build.status !== 0) {
  console.error(build.stdout || '', build.stderr || '');
  fail('build.mjs exited ' + build.status);
  process.exit(1);
}

const exists = async (p) => { try { await stat(p); return true; } catch { return false; } };
async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

// Expectations derived from source, never copied out of the build output.
const indexable = [
  '/', '/practice-areas/', '/about/', '/faq/', '/contact/', '/accessibility/',
  ...PRACTICE.map((p) => `/practice-areas/${p.slug}/`),
];
const unlisted = ['/thank-you/', '/404.html'];

for (const route of [...indexable, ...unlisted]) {
  const f = route.endsWith('.html') ? join(DIST, route.slice(1)) : join(DIST, route.slice(1), 'index.html');
  if (!(await exists(f))) fail('missing page for route ' + route);
}

const html = await walk(DIST);
if (html.length !== indexable.length + unlisted.length) {
  fail(`dist holds ${html.length} html files, expected ${indexable.length + unlisted.length}`);
}

if (!(await exists(join(DIST, 'sitemap.xml')))) fail('sitemap.xml missing');
if (!(await exists(join(DIST, 'robots.txt')))) fail('robots.txt missing');

const sm = await readFile(join(DIST, 'sitemap.xml'), 'utf8');
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (locs.length !== indexable.length) fail(`sitemap lists ${locs.length} urls, expected ${indexable.length}`);
for (const u of locs) if (/thank-you|404/.test(u)) fail('sitemap lists a noindex url: ' + u);
for (const route of indexable) {
  if (!locs.some((u) => u.endsWith(route))) fail('sitemap is missing route ' + route);
}

const robots = await readFile(join(DIST, 'robots.txt'), 'utf8');
if (!/Sitemap:\s*http/i.test(robots)) fail('robots.txt does not point at the sitemap');

if (process.exitCode) process.exit(1);
console.log(`pages=${html.length} indexable=${locs.length}`);
console.log('BUILD INVENTORY VERIFIED');
