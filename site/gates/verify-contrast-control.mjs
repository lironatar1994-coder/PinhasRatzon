// G6 — negative control for the contrast checker, plus anchors against
// published WCAG values so the maths itself cannot drift unnoticed.
import { checkPairs, ratio, luminance } from './lib/contrast.mjs';

let bad = 0;

// A pair that must fail: mid grey on white is roughly 2.8:1.
if (checkPairs({ '--fg': '#9a9a9a', '--bg': '#ffffff' }, [['--fg', '--bg', 4.5, 'known failing pair']]).length !== 1) {
  console.error('FAIL: a known-failing pair was not reported');
  bad++;
}

// A pair that must pass.
if (checkPairs({ '--fg': '#000000', '--bg': '#ffffff' }, [['--fg', '--bg', 4.5, 'black on white']]).length !== 0) {
  console.error('FAIL: black on white was reported as failing');
  bad++;
}

// A missing token must be reported, not silently skipped.
if (checkPairs({ '--bg': '#ffffff' }, [['--nope', '--bg', 4.5, 'missing token']]).length !== 1) {
  console.error('FAIL: a missing token was not reported');
  bad++;
}

// Anchors: relative luminance of white is 1, of black is 0, and their ratio is 21:1.
const white = luminance('#ffffff'), black = luminance('#000000');
if (Math.abs(white - 1) > 1e-9 || Math.abs(black) > 1e-9) {
  console.error(`FAIL: luminance anchors wrong (white=${white}, black=${black})`);
  bad++;
}
if (Math.abs(ratio('#000000', '#ffffff') - 21) > 0.01) {
  console.error('FAIL: black/white ratio is not 21:1');
  bad++;
}
// Order must not change the result.
if (Math.abs(ratio('#8c6e45', '#faf8f5') - ratio('#faf8f5', '#8c6e45')) > 1e-9) {
  console.error('FAIL: ratio is not symmetric');
  bad++;
}

if (bad) process.exit(1);
console.log('anchors: white=1 black=0 bw=21:1 symmetric=true failingPairCaught=true missingTokenCaught=true');
console.log('CONTRAST CONTROL VERIFIED');
