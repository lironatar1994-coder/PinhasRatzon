// G5 — every declared foreground/background pair meets its WCAG threshold,
// computed from the stylesheet tokens rather than asserted by hand.
import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseTokens, checkPairs, PAIRS, ratio } from './lib/contrast.mjs';

const SITE = dirname(dirname(fileURLToPath(import.meta.url)));
const css = await readFile(join(SITE, 'public/assets/css/style.css'), 'utf8');

const tokens = parseTokens(css);
const failures = checkPairs(tokens);

for (const [fg, bg, min, note] of PAIRS) {
  if (tokens[fg] && tokens[bg]) {
    console.log(`  ${ratio(tokens[fg], tokens[bg]).toFixed(2).padStart(6)} / ${min}  ${note}`);
  }
}

if (failures.length) {
  console.error(`FAIL: ${failures.length} pair(s) below threshold`);
  for (const f of failures) console.error(`  ${f.pair} = ${f.got}, needs ${f.min} (${f.note})`);
  process.exit(1);
}

console.log(`pairs=${PAIRS.length} tokens=${Object.keys(tokens).length}`);
console.log('TOKEN CONTRAST VERIFIED');
