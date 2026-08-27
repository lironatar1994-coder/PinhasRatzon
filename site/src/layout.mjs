import { SITE_URL, BIZ, NAV, TOPICS, DISCLAIMER, FORM_NOTE, FORM_ACTION } from './site.mjs';
import { PRACTICE } from './content/practice.mjs';

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const url = (path) => SITE_URL.replace(/\/$/, '') + path;

/* Cache-busting stamp for /assets/*. build.mjs sets it from a hash of the CSS +
   JS, so those files can carry a long max-age and still update on change. */
let ASSET_V = 'dev';
export const setAssetVersion = (v) => { ASSET_V = v; };

/* ------------------------------------------------------------------ icons
   Hairline icons only, and used sparingly. The design carries its weight
   through type and space, not iconography. */

const ICONS = {
  arrow: '<path d="M19 12H5M12 5l-7 7 7 7"/>',
  arrowDown: '<path d="M12 5v14M5 12l7 7 7-7"/>',
  menu: '<path d="M4 8h16M4 16h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  phone:
    '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z"/>',
  whatsapp:
    '<path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  mail: '<path d="M3 5.5h18v13H3z"/><path d="m3 7 9 6 9-6"/>',
  a11y:
    '<circle cx="12" cy="12" r="9.2"/><circle cx="12" cy="6.6" r="1.3" fill="currentColor" stroke="none"/><path d="M7.4 9.4h9.2M12 9.6v3.2m0 0-2.2 4.6M12 12.8l2.2 4.6"/>',
};

export const icon = (name, size = 20, cls = '') =>
  `<svg class="ic ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name] || ''}</svg>`;

/* ------------------------------------------------------------------ JSON-LD */

const ATTORNEY_ID = url('/#attorney');

export function attorneySchema() {
  const node = {
    '@type': 'Attorney',
    '@id': ATTORNEY_ID,
    name: BIZ.name,
    legalName: BIZ.legalName,
    description: `עורך דין בפתח תקווה המתמחה בדיני מקרקעין, מיסוי מקרקעין, רישום בתים משותפים, צוואות, ירושות וייפוי כוח מתמשך. ${BIZ.yearsExperience} שנות ניסיון.`,
    url: url('/'),
    telephone: BIZ.phoneE164,
    email: BIZ.email,
    foundingDate: BIZ.founded,
    image: url('/assets/img/og-default.jpg'),
    // Street address published at the client's instruction. No
    // openingHoursSpecification and no geo — neither has ever been supplied,
    // and both would be invented rather than sourced.
    address: {
      '@type': 'PostalAddress',
      streetAddress: BIZ.street,
      addressLocality: BIZ.city,
      addressRegion: BIZ.region,
      addressCountry: BIZ.country,
    },
    areaServed: BIZ.areaServed.map((n) => ({ '@type': 'City', name: n })),
    knowsLanguage: BIZ.languages,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'תחומי עיסוק',
      itemListElement: PRACTICE.map((p) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: p.nav, url: url(`/practice-areas/${p.slug}/`) },
      })),
    },
  };
  if (BIZ.sameAs.length) node.sameAs = BIZ.sameAs;
  return node;
}

export const breadcrumbSchema = (trail) => ({
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((t, i) => ({
    '@type': 'ListItem', position: i + 1, name: t.label, item: url(t.href),
  })),
});

export const faqSchema = (faqs) => ({
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

export const serviceSchema = (p) => ({
  '@type': 'Service',
  name: p.nav,
  serviceType: p.nav,
  description: p.lead,
  url: url(`/practice-areas/${p.slug}/`),
  provider: { '@id': ATTORNEY_ID },
  areaServed: BIZ.areaServed.map((n) => ({ '@type': 'City', name: n })),
});

/* ------------------------------------------------------------------ chrome */

const telHref = `tel:${BIZ.phoneE164}`;

const wordmark = (cls = '') => `
  <a class="wordmark ${cls}" href="/" aria-label="${esc(BIZ.name)} — לעמוד הבית">
    <span class="wm-name">פנחס רצון</span>
    <span class="wm-role">עורך דין</span>
  </a>`;

function navMarkup(current) {
  return NAV.map((item) => {
    const active = current === item.href || (item.children && current.startsWith('/practice-areas/'));
    if (item.children === 'practice') {
      return `<li class="has-sub">
        <a href="${item.href}"${active ? ' aria-current="page"' : ''}>${esc(item.label)}</a>
        <button type="button" class="sub-toggle" aria-expanded="false" aria-label="הצגת תחומי העיסוק">${icon('plus', 15)}</button>
        <ul class="sub">
          ${PRACTICE.map((p) => `<li><a href="/practice-areas/${p.slug}/">${esc(p.nav)}</a></li>`).join('\n          ')}
        </ul>
      </li>`;
    }
    return `<li><a href="${item.href}"${active ? ' aria-current="page"' : ''}>${esc(item.label)}</a></li>`;
  }).join('\n        ');
}

export function header(current) {
  return `
<a class="skip" href="#main">דילוג לתוכן הראשי</a>

<header class="site-header" id="siteHeader">
  <div class="wrap header-inner">
    ${wordmark()}
    <nav class="primary" id="primaryNav" aria-label="ניווט ראשי">
      <ul>
        ${navMarkup(current)}
      </ul>
      <div class="drawer-call">
        <p class="label">לשיחה</p>
        <a class="nav-tel" href="${telHref}" dir="ltr">${esc(BIZ.phone)}</a>
        <a class="nav-wa" href="${BIZ.whatsapp}" target="_blank" rel="noopener">${icon('whatsapp', 18)}וואטסאפ — שליחת הודעה</a>
        <p class="drawer-note">${esc(BIZ.shortName)} · ${esc(BIZ.city)}</p>
      </div>
    </nav>
    <a class="tel-mini" href="${telHref}" aria-label="חיוג אל ${esc(BIZ.phone)}">${icon('phone', 20)}</a>
    <a class="wa-mini" href="${BIZ.whatsapp}" target="_blank" rel="noopener" aria-label="שליחת הודעת וואטסאפ">${icon('whatsapp', 20)}</a>
    <button type="button" class="burger" id="burger" aria-expanded="false" aria-controls="primaryNav" aria-label="פתיחת תפריט">
      <span></span><span></span>
    </button>
  </div>
</header>`;
}

export function breadcrumbs(trail) {
  if (!trail || trail.length < 2) return '';
  return `
<nav class="crumbs" aria-label="מיקום בעמוד">
  <div class="wrap">
    <ol>
      ${trail
        .map((t, i) =>
          i === trail.length - 1
            ? `<li><span aria-current="page">${esc(t.label)}</span></li>`
            : `<li><a href="${t.href}">${esc(t.label)}</a></li>`
        )
        .join('\n      ')}
    </ol>
  </div>
</nav>`;
}

/* A single quiet form, and only where a form belongs — never in a hero. */
export function contactForm({ id = 'c', compact = false } = {}) {
  return `
<form class="form" action="${FORM_ACTION}" method="post" name="contact" novalidate>
  <p class="hp"><label>אל תמלאו שדה זה <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>

  <div class="field">
    <label for="${id}-name">${compact ? 'שם' : 'שם מלא'}</label>
    <input id="${id}-name" name="name" type="text" autocomplete="name" required>
  </div>
  <div class="field">
    <label for="${id}-phone">טלפון</label>
    <input id="${id}-phone" name="phone" type="tel" dir="ltr" inputmode="tel" autocomplete="tel"
           pattern="^(\\+?972[- ]?|0)([23489]|5[0-9]|7[2-9])[- ]?[0-9]{3}[- ]?[0-9]{4}$" required>
  </div>
  ${compact ? '' : `<div class="field">
    <label for="${id}-topic">נושא הפנייה</label>
    <select id="${id}-topic" name="topic">
      ${TOPICS.map((t) => `<option>${esc(t)}</option>`).join('\n      ')}
    </select>
  </div>`}
  <div class="field">
    <label for="${id}-msg">רקע קצר <span class="opt">(לא חובה)</span></label>
    <textarea id="${id}-msg" name="message" rows="${compact ? 3 : 4}"></textarea>
  </div>

  <button type="submit" class="btn">שליחה</button>
  <p class="fineprint">${esc(FORM_NOTE)}</p>
</form>`;
}

/* The closing note — one quiet invitation at the end of the reading, not a
   banner shouting mid-page. */
export function closing({ h2 }) {
  return `
<section class="closing">
  <div class="closing-figure" aria-hidden="true">
    <picture>
      <source media="(max-width: 860px)" srcset="/assets/img/closing-consultation-mobile.jpg" type="image/jpeg">
      <source srcset="/assets/img/band-chairs.webp" type="image/webp">
      <img src="/assets/img/band-chairs.jpg" alt="" width="1920" height="1072" loading="lazy" decoding="async">
    </picture>
  </div>
  <div class="closing-portrait" aria-hidden="true">
    <picture>
      <source srcset="/assets/img/closing-listen.webp" type="image/webp">
      <img src="/assets/img/closing-listen.jpg" alt="" width="1000" height="879" loading="lazy" decoding="async">
    </picture>
  </div>
  <div class="wrap closing-grid">
    <div class="closing-copy">
      <h2>${esc(h2)}</h2>
      <p class="closing-sub">שיחה קצרה מספיקה כדי להבין מה נדרש ומה הצעד הבא.</p>
    </div>
    <div class="closing-act">
      <ul class="closing-ch">
        <li><a href="${telHref}">${icon('phone', 20)}<span class="ch-body"><span class="ch-k">טלפון</span><span class="ch-v"><bdi dir="ltr">${esc(BIZ.phone)}</bdi></span></span></a></li>
        <li><a href="${BIZ.whatsapp}" target="_blank" rel="noopener">${icon('whatsapp', 20)}<span class="ch-body"><span class="ch-k">וואטסאפ</span><span class="ch-v">שליחת הודעה</span></span></a></li>
        <li><a href="mailto:${esc(BIZ.email)}">${icon('mail', 20)}<span class="ch-body"><span class="ch-k">אימייל</span><span class="ch-v"><bdi dir="ltr">${esc(BIZ.email)}</bdi></span></span></a></li>
      </ul>
      <span class="ch-or">או</span>
      <a class="btn closing-cta" href="/contact/">להשארת פרטים</a>
    </div>
  </div>
  <dialog class="lead-dialog" aria-label="השארת פרטים">
    <div class="dlg-body">
      <div class="dlg-head">
        <p class="label">השארת פרטים</p>
        <button type="button" class="dlg-close" aria-label="סגירה">&times;</button>
      </div>
      <p class="dlg-sub">כמה פרטים — ואני חוזר אליכם.</p>
      ${contactForm({ id: 'd', compact: true })}
    </div>
  </dialog>
</section>`;
}

export function faqBlock(faqs, { h2 = 'שאלות נפוצות', label = 'שאלות נפוצות', open = -1 } = {}) {
  return `
<section class="faq" id="faq">
  <div class="wrap">
    ${h2 ? `<div class="sec-head">
      ${label ? `<p class="label">${esc(label)}</p>` : ''}
      <h2>${esc(h2)}</h2>
    </div>` : ''}
    <div class="faq-list">
      ${faqs
        .map(
          (f, i) => `<details class="faq-item"${i === open ? ' open' : ''}>
        <summary><span class="faq-q">${esc(f.q)}</span><span class="faq-ic" aria-hidden="true"></span></summary>
        <div class="faq-a"><p>${esc(f.a)}</p></div>
      </details>`
        )
        .join('\n      ')}
    </div>
  </div>
</section>`;
}

export function footer() {
  return `
<footer class="site-footer">
  <div class="wrap">
    <div class="foot-top">
      ${wordmark('wm-foot')}
      <address class="foot-nap">
        <span>${esc(BIZ.addressHuman)}</span>
        <span>${esc(BIZ.areaHuman)}</span>
      </address>
    </div>

    <div class="foot-cols">
      <nav aria-label="תחומי עיסוק">
        <h2>תחומי עיסוק</h2>
        <ul>
          ${PRACTICE.map((p) => `<li><a href="/practice-areas/${p.slug}/">${esc(p.nav)}</a></li>`).join('\n          ')}
        </ul>
      </nav>
      <nav aria-label="קישורים">
        <h2>מידע</h2>
        <ul>
          <li><a href="/about/">אודות</a></li>
          <li><a href="/faq/">שאלות נפוצות</a></li>
          <li><a href="/contact/">יצירת קשר</a></li>
          <li><a href="/accessibility/">הצהרת נגישות</a></li>
        </ul>
      </nav>
    </div>

    <div class="foot-bottom">
      <p>${esc(DISCLAIMER)}</p>
      <p>© ${new Date().getFullYear()} · נבנה ע״י <a class="credit" href="https://lawebs.co.il" target="_blank" rel="noopener"><bdi dir="ltr">LaWebs</bdi></a> · <a class="credit" href="tel:+972508611888"><bdi dir="ltr">050-8611888</bdi></a> <a class="credit credit-wa" href="https://wa.me/972508611888" target="_blank" rel="noopener" aria-label="וואטסאפ אל LaWebs">${icon('whatsapp', 15)}</a></p>
    </div>
  </div>
</footer>

<button type="button" class="a11y-btn" id="a11yBtn" aria-expanded="false" aria-controls="a11yPanel" aria-label="תפריט נגישות">${icon('a11y', 22)}</button>
<div class="a11y-panel" id="a11yPanel" hidden>
  <h2>נגישות</h2>
  <button type="button" data-a11y="font-up">הגדלת טקסט</button>
  <button type="button" data-a11y="font-down">הקטנת טקסט</button>
  <button type="button" data-a11y="contrast">ניגודיות גבוהה</button>
  <button type="button" data-a11y="links">הדגשת קישורים</button>
  <button type="button" data-a11y="motion">עצירת אנימציות</button>
  <button type="button" data-a11y="reset">איפוס</button>
  <a href="/accessibility/">הצהרת נגישות מלאה</a>
</div>`;
}

/* ------------------------------------------------------------------ shell */

export function page({
  path, title, description, body,
  schema = [], trail = null, ogType = 'website', noindex = false, overHero = false,
  preloadImage = null, preloadPortrait = null,
  /* WhatsApp clamps long descriptions to two lines and drops its RTL
     ellipsis on the wrong side — a share description short enough to fit
     whole never triggers the bug. Defaults to the SEO description. */
  shareDescription = null,
}) {
  const canonical = url(path);
  const graph = [attorneySchema(), ...schema];
  const jsonld = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });

  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1'}">

<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${esc(BIZ.name)}">
<meta property="og:locale" content="he_IL">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc((shareDescription || description).replace(/\.\s*$/, ''))}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${url('/assets/img/og-default.jpg')}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:alt" content="${esc(BIZ.name)}">
<meta name="twitter:card" content="summary_large_image">

<meta name="theme-color" content="#0E0C09">
<link rel="icon" href="/assets/img/favicon.svg?v=pr-20260826" type="image/svg+xml">
<link rel="alternate icon" href="/assets/img/favicon.ico?v=pr-20260826" sizes="any">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png?v=pr-20260826">

${preloadImage ? (preloadPortrait
  ? `<link rel="preload" as="image" href="${preloadPortrait}.jpg" type="image/jpeg" media="(max-width: 1100px)" fetchpriority="high">
<link rel="preload" as="image" href="${preloadImage}.webp" type="image/webp" media="(min-width: 1101px)" fetchpriority="high">
`
  : `<link rel="preload" as="image" href="${preloadImage}.webp" type="image/webp" fetchpriority="high">
`) : ''}<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700&display=swap">
<link rel="stylesheet" href="/assets/css/style.css?v=${ASSET_V}">

<script type="application/ld+json">${jsonld}</script>
</head>
<body>
<!--
THESIS: The Israeli premium-lawyer canon — black, gold, cinematic photography —
executed at the vertical's craft ceiling (mazeh.co.il) with none of its defects.
It refuses the category's plugin clutter, never its glamour.
OWN-WORLD: Near-black #0e0c09 bands alternating with warm white #fbfaf7; gold
#c19b45 on dark / #86641f on light carrying kickers, rules, numerals and the one
button; all-Heebo — display w600-700, body 20px w300 lh2; sharp corners, no cards.
STORY: A visitor before a transaction/inheritance reads substance first — the
route band answers "where am I standing" — and meets the ask only at the end.
FIRST VIEWPORT: Solid black header with gold-boxed phone; full-bleed hero photo,
subject left third, white display headline over the dark stone wall right,
gold eyebrow above, gold bar below.
FORM: Category standard, user-pinned 2026-08-26 ("copy the Israeli market"),
played straight — no concept roll. FINISH: unreviewed and undocumented is
unfinished; this build ends with the finish review, the verdict, DESIGN.md,
and every shipping raster carrying its provenance.
-->
${header(path)}
${trail ? breadcrumbs(trail) : ''}
<main id="main">
${body}
</main>
${footer()}
<script src="/assets/js/main.js?v=${ASSET_V}" defer></script>
</body>
</html>
`;
}
