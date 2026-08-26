// G2 — no pressure-selling UI anywhere in the built output.
import { readdir, readFile } from 'node:fs/promises';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanRestraint, BANNED, MAX_BUTTONS } from './lib/restraint.mjs';

const SITE = dirname(dirname(fileURLToPath(import.meta.url)));
const DIST = join(SITE, 'dist');

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const files = await walk(DIST);
if (files.length === 0) {
  console.error('FAIL: dist/ holds no pages — run the build first');
  process.exit(1);
}

const pages = [];
for (const f of files) {
  pages.push({ name: '/' + relative(DIST, f).replace(/\\/g, '/'), html: await readFile(f, 'utf8') });
}

const violations = scanRestraint(pages);
if (violations.length) {
  console.error(`FAIL: ${violations.length} restraint violation(s)`);
  for (const v of violations) console.error(`  ${v.page} — ${v.rule}: ${v.why}`);
  process.exit(1);
}

console.log(`pages=${pages.length} rules=${BANNED.length} maxButtons=${MAX_BUTTONS}`);
console.log('RESTRAINT VERIFIED');
