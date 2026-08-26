// Site-wide configuration. Everything that appears on more than one page lives here.

// Live location. Canonicals, Open Graph, the sitemap and the JSON-LD all
// derive from it. It may carry a path prefix — the site is currently served
// under one — and BASE_PATH below is read back out of it so the two can never
// drift apart.
export const SITE_URL = 'https://lawebs.co.il/PinhasRatzon';

// '' when the site sits at a domain root, '/PinhasRatzon' while it does not.
// Pages are authored with root-relative links; build.mjs prefixes this onto
// every one of them on the way out.
export const BASE_PATH = new URL(SITE_URL).pathname.replace(/\/+$/, '');

// The street address is published at the client's instruction (2026-08-25),
// reversing the earlier service-area-only decision. Opening hours, a map and
// `geo` are still deliberately absent: no hours were ever supplied, and no
// coordinates have been verified. Do not invent either.
export const BIZ = {
  name: 'פנחס רצון, עורך דין',
  shortName: 'עו״ד פנחס רצון',
  legalName: 'פנחס רצון, עורך דין',
  founded: '2011',
  // Derived from `founded` so it can never drift out of date.
  get yearsExperience() { return new Date().getFullYear() - Number(this.founded); },
  phone: '054-2221155',
  phoneE164: '+972542221155',
  email: 'Ratzon@gmail.com',
  street: 'האר״י הקדוש 20',
  city: 'פתח תקווה',
  region: 'מחוז המרכז',
  country: 'IL',
  areaServed: ['פתח תקווה', 'ראש העין', 'הוד השרון', 'כפר סבא', 'רמת גן', 'גבעת שמואל', 'אלעד', 'גוש דן', 'מחוז המרכז'],
  areaHuman: 'פתח תקווה, גוש דן והמרכז',
  get addressHuman() { return `${this.street}, ${this.city}`; },
  languages: ['he', 'en'],
  // ⚠️ להשלמה — פרופילים שקיימים בפועל בלבד.
  sameAs: [],
};

export const NAV = [
  { label: 'תחומי עיסוק', href: '/practice-areas/', children: 'practice' },
  { label: 'אודות', href: '/about/' },
  { label: 'שאלות נפוצות', href: '/faq/' },
  { label: 'יצירת קשר', href: '/contact/' },
];

export const TOPICS = [
  'עסקת מקרקעין',
  'רישום בית משותף',
  'מיסוי מקרקעין',
  'צוואה, ירושה או עיזבון',
  'ייפוי כוח מתמשך',
  'כינוס נכסים ופירוק שיתוף',
  'אחר',
];

export const DISCLAIMER =
  'המידע באתר הוא כללי בלבד ואינו מהווה ייעוץ משפטי, חוות דעת משפטית או תחליף לייעוץ פרטני. כל מקרה נבחן לפי נסיבותיו, הדין החל והמסמכים הרלוונטיים.';

export const FORM_NOTE =
  'הפנייה אינה יוצרת יחסי עורך דין–לקוח ואינה מהווה ייעוץ משפטי.';

// Netlify Forms works with no backend; swap for Formspree/EmailJS/a server
// handler if hosting elsewhere.
export const FORM_ACTION = '/thank-you/';
