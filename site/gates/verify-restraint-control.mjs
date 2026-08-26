// G3 — negative control. The same rules must FAIL on known-bad fixtures.
// Without this, "no violations found" could equally mean the checker is broken.
import { scanRestraint, BANNED, MAX_BUTTONS } from './lib/restraint.mjs';

const clean = { name: 'clean-fixture', html: '<main><h1>שלום</h1><a class="textlink">קרא עוד</a></main>' };

// One fixture per banned rule, plus one that blows the CTA budget.
const fixtures = [
  { name: 'fab', html: '<div class="float-actions"><a class="fab"></a></div>' },
  { name: 'bar', html: '<nav class="mobile-bar"></nav>' },
  { name: 'heroform', html: '<div class="hero-form"></div>' },
  { name: 'trust', html: '<section class="trustbar"></section>' },
  { name: 'numbers', html: '<section class="numbers"></section>' },
  { name: 'reasons', html: '<h2>עשר סיבות לעבוד איתי</h2>' },
  { name: 'calc', html: '<h3>מחשבון מס שבח</h3>' },
  { name: 'quote', html: '<p>[ ציטוט לקוח — להשלמה ]</p>' },
  { name: 'shouty', html: '<a>לשיחת ייעוץ חייגו 054-2221155</a>' },
  { name: 'unfilled', html: '<span>[ מספר ]</span>' },
  { name: 'card', html: '<article class="card"></article>' },
  { name: 'ctas', html: '<a class="btn">א</a><a class="btn">ב</a><a class="btn">ג</a>' },
];

let bad = 0;

// 1. every fixture must be caught
for (const f of fixtures) {
  if (scanRestraint([f]).length === 0) {
    console.error(`FAIL: fixture "${f.name}" was not detected — that rule cannot fail`);
    bad++;
  }
}

// 2. every banned rule must be exercised by at least one fixture
const caught = new Set(fixtures.flatMap((f) => scanRestraint([f]).map((v) => v.rule)));
for (const rule of BANNED) {
  if (!caught.has(rule.id)) {
    console.error(`FAIL: rule "${rule.id}" has no fixture exercising it`);
    bad++;
  }
}

// 3. the clean fixture must pass, or the checker simply flags everything
if (scanRestraint([clean]).length !== 0) {
  console.error('FAIL: the clean fixture was flagged — the checker is over-sensitive');
  bad++;
}

// 4. exactly MAX_BUTTONS must still be allowed
if (scanRestraint([{ name: 'at-limit', html: '<a class="btn">א</a><a class="btn">ב</a>' }]).length !== 0) {
  console.error(`FAIL: ${MAX_BUTTONS} buttons should be allowed but were flagged`);
  bad++;
}

if (bad) process.exit(1);
console.log(`fixtures=${fixtures.length} rules=${BANNED.length} allCaught=true cleanPasses=true`);
console.log('NEGATIVE CONTROL VERIFIED');
