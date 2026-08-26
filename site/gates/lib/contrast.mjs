// WCAG contrast maths plus the token table this design actually uses.
// verify-contrast.mjs checks the real stylesheet; verify-contrast-control.mjs
// runs the same checker against a deliberately failing token set.

const srgb = (v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));

export function luminance(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const [r, g, b] = [0, 2, 4].map((i) => srgb(parseInt(full.slice(i, i + 2), 16) / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Pull `--name: #hex;` declarations out of a :root block. */
export function parseTokens(css) {
  const root = css.match(/:root\s*\{([\s\S]*?)\}/);
  if (!root) throw new Error('no :root block found in stylesheet');
  const tokens = {};
  for (const m of root[1].matchAll(/--([\w-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;/g)) {
    tokens['--' + m[1]] = m[2];
  }
  return tokens;
}

/**
 * Every foreground/background pairing the design actually renders.
 * `min` is 4.5 for body text, 3 for large display type.
 */
export const PAIRS = [
  ['--ink', '--paper', 4.5, 'body text on paper'],
  ['--ink-2', '--paper', 4.5, 'secondary prose on paper'],
  ['--muted', '--paper', 4.5, 'meta text on paper'],
  ['--accent', '--paper', 4.5, 'links and labels on paper'],

  ['--ink', '--paper-2', 4.5, 'body text on the alternate ground'],
  ['--ink-2', '--paper-2', 4.5, 'prose on the alternate ground'],
  ['--muted', '--paper-2', 4.5, 'meta on the alternate ground'],
  ['--accent', '--paper-2', 4.5, 'links on the alternate ground'],

  ['--on-deep', '--deep', 4.5, 'text on the deep ground'],
  ['--on-deep-2', '--deep', 4.5, 'secondary text on the deep ground'],
  ['--accent-lt', '--deep', 4.5, 'labels on the deep ground'],
  ['--on-deep-2', '--deep-2', 4.5, 'placeholder text on the hero panel'],
  // The breadcrumb dash is a glyph, not a hairline: it needs the 3:1 UI bar,
  // not the 1.48:1 it silently shipped at while it borrowed --line-deep.
  ['--sep-deep', '--deep', 3, 'breadcrumb separator on the deep ground'],

  ['--ink', '--accent-lt', 4.5, 'button label on the gold fill'],
  ['--deep', '--accent-lt', 4.5, 'skip link and hovered phone box on gold'],
];

/**
 * @returns {Array<{pair: string, got: number, min: number, note: string}>} failures
 */
export function checkPairs(tokens, pairs = PAIRS) {
  const failures = [];
  for (const [fgName, bgName, min, note] of pairs) {
    const fg = tokens[fgName];
    const bg = tokens[bgName];
    if (!fg || !bg) {
      failures.push({ pair: `${fgName} on ${bgName}`, got: 0, min, note: 'token missing from stylesheet' });
      continue;
    }
    const got = Math.round(ratio(fg, bg) * 100) / 100;
    if (got < min) failures.push({ pair: `${fgName} on ${bgName}`, got, min, note });
  }
  return failures;
}
