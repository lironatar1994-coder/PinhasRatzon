// G7 — the canon type system (redesign of 2026-08-26): all-Heebo, an airy
// light body (the vertical's premium tell: 20px / weight 300 / line-height 2),
// display weight 600+, and the webfont reaching every page. The previous
// serif system (Frank Ruhl Libre) must be fully gone.
import { readdir, readFile } from 'node:fs/promises';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = dirname(dirname(fileURLToPath(import.meta.url)));
const DIST = join(SITE, 'dist');
const fail = (m) => { console.error('FAIL: ' + m); process.exitCode = 1; };

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

// Comments off — a rule named in prose is not a rule declared.
const css = (await readFile(join(SITE, 'public/assets/css/style.css'), 'utf8'))
  .replace(/\/\*[\s\S]*?\*\//g, '');

// Both face tokens must lead with Heebo and end in a generic sans fallback.
for (const name of ['display', 'sans']) {
  const m = css.match(new RegExp(`--${name}:\\s*([^;]+);`));
  if (!m) { fail(`--${name} token not found`); continue; }
  const stack = m[1].trim();
  if (!/^'Heebo'/.test(stack)) fail(`--${name} does not lead with Heebo`);
  if (!/sans-serif$/.test(stack)) fail(`--${name} has no generic sans fallback`);
}
if (/Frank Ruhl/i.test(css)) fail('the retired serif still appears in the stylesheet');

// Headings carry weight (600+); the body stays light (300) and airy (lh >= 1.9).
const headingRule = css.match(/h1,\s*h2,\s*h3,\s*h4\s*\{([^}]*)\}/);
if (!headingRule || !/font-family:\s*var\(--display\)/.test(headingRule[1])) {
  fail('headings do not use var(--display)');
}
const hw = headingRule && headingRule[1].match(/font-weight:\s*(\d+)/);
if (!hw || Number(hw[1]) < 500) fail(`heading weight is ${hw ? hw[1] : 'unset'}, expected 500 or heavier`);

const bodyRule = css.match(/\nbody\s*\{([^}]*)\}/);
const bw = bodyRule && bodyRule[1].match(/font-weight:\s*(\d+)/);
if (!bw || Number(bw[1]) > 300) fail(`body weight is ${bw ? bw[1] : 'unset'}, expected 300 or lighter`);
const blh = bodyRule && bodyRule[1].match(/line-height:\s*([\d.]+)/);
if (!blh || Number(blh[1]) < 1.9) fail(`body line-height is ${blh ? blh[1] : 'unset'}, expected 1.9 or more`);

// Hebrew never gets letter-spacing.
if (/letter-spacing/.test(css)) fail('letter-spacing declared — Hebrew type never gets tracking');

const files = await walk(DIST);
if (!files.length) fail('dist/ holds no pages');

for (const f of files) {
  const html = await readFile(f, 'utf8');
  const page = '/' + relative(DIST, f).replace(/\\/g, '/');
  const link = html.match(/fonts\.googleapis\.com\/css2\?([^"]+)/);
  if (!link) { fail(page + ' does not load the webfonts'); continue; }
  if (!/Heebo/.test(link[1])) fail(page + ' does not request Heebo');
  if (!/Heebo:wght@[^&]*\b300\b/.test(link[1])) fail(page + ' does not request the light body weight');
  if (!/Heebo:wght@[^&]*\b(600|700)\b/.test(link[1])) fail(page + ' does not request a display weight');
  if (!/display=swap/.test(link[1])) fail(page + ' does not use display=swap');
  if (/Frank\+Ruhl|Assistant/.test(link[1])) fail(page + ' still requests a retired face');
}

if (process.exitCode) process.exit(1);
console.log(`pages=${files.length} face=Heebo headingWeight=${hw[1]} bodyWeight=${bw[1]} bodyLeading=${blh[1]}`);
console.log('TYPOGRAPHY VERIFIED');
