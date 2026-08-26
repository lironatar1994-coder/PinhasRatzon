// Shared restraint rules. verify-restraint.mjs runs these against dist/;
// verify-restraint-control.mjs runs the SAME rules against a fixture that is
// known to violate them, so a checker that can never fail is caught.

/** Markup or copy that signals pressure-selling. Each must be absent. */
export const BANNED = [
  { id: 'floating-action-buttons', re: /class="[^"]*\b(float-actions|fab)\b/i, why: 'floating call/WhatsApp buttons' },
  { id: 'mobile-action-bar', re: /class="[^"]*\bmobile-bar\b/i, why: 'sticky bottom action bar' },
  { id: 'hero-form', re: /class="[^"]*\bhero-form\b/i, why: 'lead form inside the hero' },
  { id: 'trust-bar', re: /class="[^"]*\btrustbar\b/i, why: 'icon trust strip' },
  { id: 'vanity-numbers', re: /class="[^"]*\bnumbers\b/i, why: 'large vanity statistics strip' },
  { id: 'ten-reasons', re: /עשר סיבות/, why: 'ten-reasons sales list' },
  { id: 'calculators', re: /מחשבון/, why: 'calculator lead magnets' },
  { id: 'testimonial-placeholder', re: /ציטוט לקוח/, why: 'placeholder testimonials' },
  { id: 'shouty-cta', re: /לשיחת ייעוץ חייגו/, why: 'imperative "call now" copy' },
  { id: 'unfilled-number', re: /\[ מספר \]/, why: 'unfilled statistic placeholder' },
  { id: 'card-chrome', re: /class="[^"]*\bcard\b/i, why: 'card chrome — this design uses hairlines' },
];

/** At most this many CTA buttons per page. */
export const MAX_BUTTONS = 2;

const countButtons = (html) => (html.match(/class="[^"]*\bbtn\b/g) || []).length;

/**
 * @param {Array<{name: string, html: string}>} pages
 * @returns {Array<{page: string, rule: string, why: string}>} violations
 */
export function scanRestraint(pages) {
  const violations = [];
  for (const { name, html } of pages) {
    for (const rule of BANNED) {
      if (rule.re.test(html)) violations.push({ page: name, rule: rule.id, why: rule.why });
    }
    const n = countButtons(html);
    if (n > MAX_BUTTONS) {
      violations.push({ page: name, rule: 'too-many-ctas', why: `${n} CTA buttons (max ${MAX_BUTTONS})` });
    }
  }
  return violations;
}
