import { BIZ, DISCLAIMER, isManaged } from './site.mjs';
import { PRACTICE, bySlug } from './content/practice.mjs';
import {
  esc, icon, page, contactForm, closing, faqBlock,
  breadcrumbSchema, faqSchema, serviceSchema, url,
} from './layout.mjs';

const telHref = `tel:${BIZ.phoneE164}`;
const YEARS = BIZ.yearsExperience;

/* ---------------------------------------------------------------- images
   Set a path to swap a placeholder for a real photo. Keep width/height so the
   browser reserves the space and nothing shifts on load. */
/* Paths carry no extension — photo() pairs each with its .webp and .jpg,
   except the CMS-managed slots (site.mjs MANAGED_IMAGES), which ship as the
   JPG alone so a client upload is what the browser shows. */
export const IMAGES = {
  portrait: '/assets/img/pinchas-ratzon',
  hero: '/assets/img/hero-room',
  heroPortrait: '/assets/img/hero-listening-mobile',
  /* September 14: daylight stills open the paper bands on phones. */
  bandPlansDay: '/assets/img/band-plans-daylight',
  bandKeyDay: '/assets/img/band-key-daylight',
  bandStampDay: '/assets/img/band-stamp-daylight',
  quietPlans: '/assets/img/band-plans',
  bandKey: '/assets/img/band-key',
  bandStampLight: '/assets/img/band-stamp-light-v1',
  bandChairs: '/assets/img/band-chairs',
  bandStatement: '/assets/img/band-statement',
};

/* The wide room photograph opens desktop; phones use the listening cover.
   Managed slots use JPG so edits in Manager Site remain visible. */
const webpSource = (src, media = '') =>
  isManaged(src) ? '' : `<source${media ? ` media="${media}"` : ''} type="image/webp" srcset="${src}.webp">\n      `;

const heroPhoto = (alt) => `<picture>
      ${webpSource(IMAGES.heroPortrait, '(max-width: 1100px)')}<source media="(max-width: 1100px)" type="image/jpeg" srcset="${IMAGES.heroPortrait}.jpg">
      ${webpSource(IMAGES.hero)}<img src="${IMAGES.hero}.jpg" alt="${esc(alt)}" width="1920" height="1084" fetchpriority="high" decoding="async">
    </picture>`;

/* The home-page introduction uses a composed portrait on phones rather than
   forcing the desktop frame through a shallow crop. */
const portraitPhoto = (alt) => `<picture>
      <source media="(max-width: 860px)" type="image/jpeg" srcset="/assets/img/about-mobile-portrait-v1.jpg">
      ${webpSource(IMAGES.portrait)}<img src="${IMAGES.portrait}.jpg" alt="${esc(alt)}" width="980" height="1225" loading="lazy" decoding="async">
    </picture>`;

/* A daylight still that opens a paper band on phones. */
const dayFigure = (src) => `<div class="day-figure" aria-hidden="true">
    <picture>
      ${webpSource(src)}<img src="${src}.jpg" alt="" width="1672" height="941" loading="lazy" decoding="async">
    </picture>
  </div>`;

function photo(src, { alt, w, h, cls = '', note = 'תמונה, להוספה', priority = false }) {
  if (!src) {
    return `<div class="ph ${cls}" style="aspect-ratio:${w}/${h}" role="img" aria-label="${esc(alt)}"><span>${esc(note)}</span></div>`;
  }
  const load = priority
    ? 'fetchpriority="high" decoding="async"'
    : 'loading="lazy" decoding="async"';
  return `<picture>
      ${webpSource(src)}<img class="${cls}" src="${src}.jpg" alt="${esc(alt)}" width="${w}" height="${h}" ${load}>
    </picture>`;
}

const secHead = (label, h2, sub = '') => `
<div class="sec-head">
  <p class="label">${esc(label)}</p>
  <h2>${esc(h2)}</h2>
  ${sub ? `<p class="sec-sub">${esc(sub)}</p>` : ''}
</div>`;

/* An editorial index, not a card grid: number, name, one line, hairline. */
const practiceIndexList = (level = 3) => `
<ol class="index">
  ${PRACTICE.map((p, i) => `<li>
    <a href="/practice-areas/${p.slug}/">
      <span class="idx-n" dir="ltr">${String(i + 1).padStart(2, '0')}</span>
      <span class="idx-body">
        <h${level}>${esc(p.nav)}</h${level}>
        <span class="idx-teaser">${esc(p.teaser)}</span>
      </span>
      <span class="idx-arrow" aria-hidden="true">${icon('arrow', 20)}</span>
    </a>
  </li>`).join('\n  ')}
</ol>`;

/* The home page routes by the reader's own situation rather than by practice
   area. Each entry still resolves to one practice page, so the taxonomy is
   fully covered and nothing is listed twice on the page. */
/* Headlines in the client's own voice, answers tuned to the situation —
   not the practice teasers, which speak the taxonomy this band exists to
   spare the visitor from. */
const ROUTE = [
  ['real-estate-transactions',   'קנייה או מכירה של נכס',
   'בדיקת הנכס וההסכם, טיפול במיסוי וליווי עד לרישום הזכויות.'],
  ['real-estate-tax',            'מיסוי מקרקעין',
   'תכנון מס ודיווח על עסקאות, בדיקת פטורים אפשריים, השגות והחזרי מס.'],
  ['condominium-registration',   'רישום זכויות בנכס',
   'רישום ותיקון צו בית משותף, כולל הצמדות, תקנונים וזיקות הנאה.'],
  ['wills-inheritance',          'צוואות וירושות',
   'עריכת צוואות, בקשות לצווי ירושה ולצווי קיום צוואה, והסכמות בין יורשים.'],
  ['enduring-power-of-attorney', 'ייפוי כוח מתמשך',
   'עריכת ייפוי כוח מתמשך, הנחיות מקדימות ומסמכי הבעת רצון.'],
  ['partition-receivership',     'פירוק שיתוף וכינוס נכסים',
   'טיפול בנכסים משותפים, בהליכי פירוק שיתוף, בכינוס נכסים ובמימושם.'],
];

const routeList = () => `
<ol class="route-list">
  ${ROUTE.map(([slug, situation, answer], i) => {
    const p = bySlug[slug];
    return `<li>
    <a href="/practice-areas/${p.slug}/">
      <span class="route-n" dir="ltr" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
      <span class="route-body">
        <h3 class="route-q">${esc(situation)}</h3>
        <span class="route-a">${esc(answer)}</span>
      </span>
      <span class="route-arrow" aria-hidden="true">${icon('arrow', 20)}</span>
    </a>
  </li>`;
  }).join('\n  ')}
</ol>`;

/* The credentials band this vertical ships (medallions/stats) was tried here
   as an honest facts strip and DELETED at the client's call (2026-08-26):
   every fact it carried already lives elsewhere (hero eyebrow: since 2011;
   statement: the 15 years; the POA certification: its own page + about;
   LL.B: about), and it occupied the most valuable scroll position on the
   page answering a question nobody asked there. */

const PRINCIPLES = [
  ['בדיקה לפני התחייבות',
   'לפני החתימה נבדקים הרישום, המצב התכנוני, היתרי הבנייה, השעבודים, העיקולים והערות האזהרה.'],
  ['מס בשלב התכנון',
   'לפני החתימה נבדקים מס השבח, מס הרכישה והפטורים שעשויים לחול על העסקה.'],
  ['ליווי עד הרישום',
   'הליווי כולל את רישום הזכויות בטאבו, ברמ״י או בחברה המשכנת, לפי סוג הנכס.'],
];

const HOME_FAQS = [
  {
    q: 'אני קונה דירה מקבלן.\nצריך עורך דין מטעמי?',
    a: 'כן. עורך הדין של הקבלן מייצג את הקבלן.\n\nחשוב לבדוק את תנאי ההסכם, מועדי המסירה, הערבויות ותנאי התשלום.',
  },
  {
    q: 'מה ההבדל בין צו ירושה לצו קיום צוואה?',
    a: 'כשאין צוואה, החלוקה נעשית לפי חוק הירושה ומוגשת בקשה לצו ירושה. כשיש צוואה, מגישים בקשה לצו קיום צוואה שנותן לה תוקף. שתי הבקשות מוגשות לרשם לענייני ירושה, ובמקרים מסוימים מועברות לבית המשפט לענייני משפחה.',
  },
  {
    q: 'מתי כדאי לערוך ייפוי כוח מתמשך?',
    a: 'אפשר לערוך אותו כל עוד האדם כשיר ומבין את משמעות המסמך. הוא מאפשר לקבוע מראש מי יטפל בענייניכם ואילו הנחיות יחולו.',
  },
  {
    q: 'שילמתי מס שבח. אפשר לקבל החזר?',
    a: 'לעיתים כן. החזרים נובעים בדרך כלל מפטורים שלא נוצלו, מחישוב לינארי, מפריסת מס או מהוצאות מוכרות שלא נכללו בדיווח המקורי. להגשת השגה קבועים בחוק מועדים, ולכן כדאי לבדוק מוקדם.',
  },
  {
    q: 'באילו אזורים אתה מטפל?',
    a: `${BIZ.areaServed.slice(0, 6).join(', ')} ויתר אזור גוש דן והמרכז. חלק ניכר מהעבודה ממילא מתנהל מול לשכות רישום, רשות המסים ורשם הירושות, ולכן המרחק פחות קריטי ממה שנדמה.`,
  },
];

/* ---------------------------------------------------------------- home */

export function home() {
  const body = `
<section class="hero">
  <div class="hero-figure">
    ${heroPhoto(`${BIZ.shortName}, עורך דין מקרקעין, מיסוי מקרקעין ועיזבונות ב${BIZ.city}`)}
  </div>
  <div class="wrap hero-inner">
    <div class="hero-col">
      <h1>
        <span class="hero-kicker">מקרקעין, מיסוי, צוואות וירושות · ${esc(BIZ.city)}</span>
        <span class="hero-line">עו״ד פנחס רצון</span>
      </h1>
      <div class="hero-rule" aria-hidden="true"></div>
      <p class="hero-sub" data-manager-text="hero.subtitle">אני מלווה קונים ומוכרים לאורך העסקה, מהבדיקות לפני החתימה ועד לרישום הזכויות. אפשר לפנות אליי גם בענייני מיסוי, צוואות וירושות.</p>
      <a class="hero-more" href="#statement">איך אני עובד ${icon('arrowDown', 18)}</a>
    </div>
  </div>
  <a class="hero-cue" href="#statement" aria-label="המשך לתוכן">${icon('arrowDown', 22)}</a>
</section>
<ul class="hero-facts" aria-label="על המשרד">
  <li><strong>${esc(BIZ.founded)}</strong><span>משרד עצמאי מאז</span></li>
  <li><strong>ליווי אישי</strong><span>עו״ד אחד, מתחילה ועד סוף</span></li>
  <li><strong>${esc(BIZ.city)}</strong><span>וכל גוש דן</span></li>
</ul>

<section class="statement" id="statement">
  ${dayFigure(IMAGES.bandPlansDay)}
  <div class="statement-figure">
    ${photo(IMAGES.bandStatement, { alt: '', w: 1920, h: 1072 })}
  </div>
  <div class="statement-portrait" aria-hidden="true">
    <picture>
      <source srcset="/assets/img/closing-portrait-left.webp" type="image/webp">
      <img src="/assets/img/closing-portrait-left.jpg" alt="" width="1000" height="908" loading="lazy" decoding="async">
    </picture>
  </div>
  <div class="wrap statement-inner">
      <p class="pull" data-manager-text="content.statement.title">מה בודקים לפני החתימה?</p>
      <div class="statement-body">
        <p data-manager-text="content.statement.paragraph1">אני מתחיל בבדיקת המסמכים: הזכויות בנכס, המצב התכנוני וההתחייבויות בהסכם.</p>
        <p data-manager-text="content.statement.paragraph2">בהמשך נבדקים המיסוי ורישום הזכויות. אם יש פרט שצריך לברר או להסדיר, חשוב לטפל בו לפני שמתחייבים לעסקה.</p>
        <p data-manager-text="content.statement.paragraph3">אני מטפל גם בהסכם ובדיווחים לרשויות, ומלווה את העסקה עד לרישום הזכויות.</p>
      </div>
  </div>
</section>

<section class="route" id="practice-areas">
  ${dayFigure(IMAGES.bandKeyDay)}
  <div class="wrap">
      ${secHead('תחומי עיסוק', 'באילו נושאים אני מטפל')}
    ${routeList()}
  </div>
</section>

<section class="section portrait-sec portrait-introduction" id="about-intro" aria-labelledby="portrait-heading">
  <div class="wrap">
    <div class="portrait-media">
      ${portraitPhoto(`${BIZ.shortName}, עורך דין מקרקעין ועיזבונות ב${BIZ.city}`)}
    </div>
    <div class="portrait-copy">
      <h2 id="portrait-heading">${esc(BIZ.shortName)}</h2>
      <p class="lead" data-manager-text="about.home.lead">אני עורך דין מאז 2011. עיקר העבודה שלי הוא בעסקאות מקרקעין, במיסוי מקרקעין, בצוואות ובירושות.</p>
      <p class="portrait-note" data-manager-text="about.home.note">לאורך הטיפול אפשר לפנות אליי ישירות.</p>
      <a class="textlink" href="/about/">עוד עליי ${icon('arrow', 18)}</a>
    </div>
  </div>
</section>

<section class="quiet quiet-light faq-introduction" id="faq-intro">
  <div class="quiet-figure">
    <picture>
      <source media="(max-width: 860px)" srcset="${IMAGES.bandStampDay}.webp" type="image/webp">
      <source media="(max-width: 860px)" srcset="${IMAGES.bandStampDay}.jpg" type="image/jpeg">
      ${webpSource(IMAGES.bandStampLight)}<img src="${IMAGES.bandStampLight}.jpg" alt="" width="1920" height="1080" loading="lazy" decoding="async">
    </picture>
  </div>
  <div class="wrap quiet-inner">
    <h2 id="faq-heading">שאלות נפוצות</h2>
    <p class="faq-description" data-manager-text="faq.home.title">על קניית דירה, מיסוי, צוואות וירושות.</p>
  </div>
</section>

${faqBlock(HOME_FAQS, { h2: '', open: 0, className: 'faq-home', labelledBy: 'faq-heading', more: true })}

${closing({ h2: 'נדבר על המקרה שלכם' })}`;

  return page({
    path: '/',
    title: `עורך דין מקרקעין וצוואות ב${BIZ.city} | ${BIZ.shortName}`,
    description: `עו״ד פנחס רצון, ${BIZ.yearsExperience} שנות ניסיון בעסקאות מקרקעין, מיסוי, רישום בתים משותפים, צוואות וירושות ב${BIZ.city} ובמרכז.`,
    shareDescription: `ניסיון של ${BIZ.yearsExperience} שנים במקרקעין, מיסוי, צוואות וירושות, ${BIZ.city} והמרכז`,
    body,
    overHero: true,
    preloadImage: IMAGES.hero,
    preloadPortrait: IMAGES.heroPortrait,
    schema: [
      { '@type': 'WebSite', '@id': url('/#website'), url: url('/'), name: BIZ.name, inLanguage: 'he-IL' },
      faqSchema(HOME_FAQS),
    ],
  });
}

/* ---------------------------------------------------------------- practice index */

export function practiceIndex() {
  const trail = [
    { label: 'ראשי', href: '/' },
    { label: 'תחומי עיסוק', href: '/practice-areas/' },
  ];
  const body = `
<section class="page-hero has-figure">
  <div class="page-hero-figure figure-pinhas" aria-hidden="true">
    ${photo('/assets/img/practice-hero', { alt: '', w: 1000, h: 908, priority: true })}
  </div>
  <div class="wrap">
    <h1>תחומי העיסוק של המשרד</h1>
    <p class="lead">אני מטפל בעסקאות מקרקעין, במיסוי, ברישום נכסים, בצוואות ובירושות. כשבתיק אחד יש כמה נושאים, אני בודק אותם יחד.</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    ${practiceIndexList(2)}
  </div>
</section>

<section class="quiet">
  <div class="quiet-figure">
    ${photo(IMAGES.quietPlans, { alt: '', w: 1920, h: 1080 })}
  </div>
  <div class="wrap quiet-inner">
    <h2 class="quiet-line">בדיקת מסמכי הנכס<br>והיבטי המס והרישום.</h2>
  </div>
</section>

${closing({ h2: 'לא בטוחים לאיזה תחום זה שייך?' })}`;

  return page({
    path: '/practice-areas/',
    title: `תחומי עיסוק | ${BIZ.shortName}`,
    description: `מקרקעין, מיסוי מקרקעין, רישום בתים משותפים, צוואות וירושות, ייפוי כוח מתמשך, כינוס נכסים ופירוק שיתוף. עו״ד פנחס רצון, ${BIZ.city}.`,
    body,
    trail,
    schema: [
      breadcrumbSchema(trail),
      {
        '@type': 'ItemList',
        itemListElement: PRACTICE.map((p, i) => ({
          '@type': 'ListItem', position: i + 1, name: p.nav, url: url(`/practice-areas/${p.slug}/`),
        })),
      },
    ],
  });
}

/* ---------------------------------------------------------------- practice detail */

export function practicePage(p) {
  const trail = [
    { label: 'ראשי', href: '/' },
    { label: 'תחומי עיסוק', href: '/practice-areas/' },
    { label: p.nav, href: `/practice-areas/${p.slug}/` },
  ];

  const sections = p.sections.map((s) => {
    let inner = '';
    if (s.steps) {
      inner = `<ol class="steps">
        ${s.steps.map((st, i) => `<li>
          <span class="idx-n" dir="ltr">${String(i + 1).padStart(2, '0')}</span>
          <div><h3>${esc(st.h3)}</h3><p>${esc(st.body)}</p></div>
        </li>`).join('\n        ')}
      </ol>`;
    }
    if (s.cards) {
      inner = `<div class="pairs">
        ${s.cards.map((c) => `<article><h3>${esc(c.h3)}</h3><p>${esc(c.body)}</p></article>`).join('\n        ')}
      </div>`;
    }
    return `<section class="sub-sec">
      <h2>${esc(s.h2)}</h2>
      ${s.intro ? `<p class="sub-intro">${esc(s.intro)}</p>` : ''}
      ${inner}
    </section>`;
  }).join('\n    ');

  const body = `
<section class="page-hero has-figure">
  <div class="page-hero-figure figure-pinhas" aria-hidden="true">
    ${photo('/assets/img/practice-hero', { alt: '', w: 1000, h: 908, priority: true })}
  </div>
  <div class="wrap">
    <h1>${esc(p.h1)}</h1>
    <p class="lead">${esc(p.lead)}</p>
  </div>
</section>

<div class="section">
  <div class="wrap layout-aside">
    <article class="prose">
      ${p.intro.map((t) => `<p>${esc(t)}</p>`).join('\n      ')}

      <section class="sub-sec">
        <h2>${esc(p.checklist.h2)}</h2>
        <ul class="checks">
          ${p.checklist.items.map((i) => `<li>${esc(i)}</li>`).join('\n          ')}
        </ul>
      </section>

      ${sections}
      ${p.preparation ? `<section class="sub-sec">
        <h2>${esc(p.preparation.h2)}</h2>
        <p>${esc(p.preparation.intro)}</p>
        <ul class="checks">${p.preparation.items.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>
        <p>אין צורך לשלוח מסמכים אישיים בטופס האתר. בשיחה נברר אילו מסמכים נדרשים ואיך להעביר אותם.</p>
      </section>` : ''}
      ${p.resources ? `<section class="sub-sec">
        <h2>מידע ושירותים ממשלתיים</h2>
        <ul>${p.resources.map((r) => `<li><a href="${esc(r.href)}">${esc(r.label)}</a></li>`).join('')}</ul>
        <p class="fineprint">הקישורים מובילים למידע הרשמי של הרשויות. התאמת ההליך למקרה שלכם נבחנת באופן פרטני.</p>
      </section>` : ''}
    </article>

    <aside class="side" aria-label="ניווט ופרטי קשר">
      <div class="side-block">
        <p class="label">תחומים נוספים</p>
        <ul class="side-links">
          ${p.related.map((s) => `<li><a href="/practice-areas/${s}/">${esc(bySlug[s].nav)}</a></li>`).join('\n          ')}
        </ul>
      </div>
      <div class="side-block">
        <p class="label">לשיחה</p>
        <a class="side-tel" href="${telHref}" dir="ltr">${esc(BIZ.phone)}</a>
        <p class="side-note">${esc(BIZ.shortName)} · ${esc(BIZ.areaHuman)}</p>
        <p class="side-note">${esc(BIZ.addressHuman)} · ${esc(BIZ.reception)}</p>
        <a href="/about/">על עו״ד פנחס רצון והניסיון המקצועי</a>
      </div>
    </aside>
  </div>
</div>

${p.quiet ? `<section class="quiet">
  <div class="quiet-figure">
    ${photo(p.quiet.image, { alt: '', w: 1920, h: 1072 })}
  </div>
  <div class="wrap quiet-inner">
    <h2 class="quiet-line">${esc(p.quiet.line1)}${p.quiet.line2 ? `<br>${esc(p.quiet.line2)}` : ''}</h2>
  </div>
</section>

` : ''}${faqBlock(p.faqs, { h2: `שאלות נפוצות בנושא ${p.nav}`, label: '' })}

${closing({ h2: 'לפנייה בנושא הזה' })}`;

  return page({
    path: `/practice-areas/${p.slug}/`,
    title: p.title,
    description: p.description,
    body,
    trail,
    ogType: 'article',
    schema: [breadcrumbSchema(trail), serviceSchema(p), faqSchema(p.faqs)],
  });
}

/* ---------------------------------------------------------------- about */

export function about() {
  const trail = [
    { label: 'ראשי', href: '/' },
    { label: 'אודות', href: '/about/' },
  ];

  const body = `
<section class="page-hero has-figure">
  <div class="page-hero-figure figure-pinhas" aria-hidden="true">
    ${photo('/assets/img/about-hero', { alt: '', w: 1000, h: 973, priority: true })}
  </div>
  <div class="wrap">
    <h1>${esc(BIZ.shortName)}</h1>
    <p class="lead" data-manager-text="about.page.lead">אני עורך דין מאז 2011. אני עוסק בעסקאות מקרקעין, במיסוי, ברישום זכויות בנכס ובצוואות וירושות.</p>
  </div>
</section>

<div class="section">
  <div class="wrap layout-aside">
    <article class="prose">
      <p data-manager-text="about.page.paragraph1">עסקת מקרקעין יכולה לכלול גם ענייני מס או ירושה. לדוגמה, מכירת דירה שהתקבלה בירושה נוגעת גם לזכויות בנכס, למיסוי ולרישום.</p>
      <p data-manager-text="about.page.paragraph2">אני מטפל בבדיקות, בהסכם ובדיווחים לרשויות, וממשיך ללוות את העסקה עד לרישום הזכויות.</p>

      <section class="sub-sec">
        <h2>דרך העבודה</h2>
        <div class="principles">
          ${PRINCIPLES.map(([h, b]) => `<article>
            <h3>${esc(h)}</h3>
            <p>${esc(b)}</p>
          </article>`).join('\n          ')}
        </div>
      </section>

      <section class="sub-sec">
        <h2>השכלה והסמכות</h2>
        <dl class="creds wide">
          <div><dt dir="ltr">${esc(BIZ.founded)}</dt><dd>חבר לשכת עורכי הדין בישראל, רישיון בתוקף ברציפות מאז ההסמכה</dd></div>
          <div><dt dir="ltr">LL.B</dt><dd>תואר ראשון במשפטים, הקריה האקדמית אונו</dd></div>
          <div><dt>הסמכה</dt><dd>עריכת ייפוי כוח מתמשך, האפוטרופוס הכללי ומשרד המשפטים</dd></div>
          <div><dt>השתלמויות</dt><dd>דיני מקרקעין, מיסוי מקרקעין, רישום בתים משותפים, עסקאות קומבינציה, דיני ירושה וכינוס נכסים</dd></div>
          <div><dt>שפות</dt><dd>עברית ואנגלית</dd></div>
        </dl>
      </section>

      <section class="sub-sec">
        <h2>תחומי הטיפול</h2>
        <ul class="checks">
          ${[
            'ניהול עסקאות מקרקעין מורכבות',
            'רישום ותיקון בתים משותפים וניסוח תקנונים',
            'ייעוץ ותכנון מס ללקוחות פרטיים ועסקיים',
            'ליווי הסכמי קומבינציה ודיווחים לרשויות המס',
            'תיקי עיזבונות, צוואות וייצוג מול רשם הירושות',
            'יישוב סכסוכים בין יורשים והסכמי חלוקה',
            'עריכת ייפויי כוח מתמשכים והנחיות מקדימות',
            'הליכי כינוס נכסים ומימוש נכסים',
          ].map((i) => `<li>${esc(i)}</li>`).join('\n          ')}
        </ul>
      </section>

    </article>

    <aside class="side" aria-label="פרטי קשר">
      <div class="side-block">
        <p class="label">אזור שירות</p>
        <p class="side-note">${esc(BIZ.areaHuman)}</p>
        <a class="side-tel" href="${telHref}" dir="ltr">${esc(BIZ.phone)}</a>
      </div>
    </aside>
  </div>
</div>

${closing({ h2: 'לשאלות ולתיאום שיחה' })}`;

  return page({
    path: '/about/',
    title: `אודות | ${BIZ.shortName}`,
    description: `עו״ד פנחס רצון, חבר לשכת עורכי הדין משנת ${BIZ.founded}, בוגר LL.B הקריה האקדמית אונו. מקרקעין, מיסוי, בתים משותפים, צוואות וירושות.`,
    body,
    trail,
    ogType: 'profile',
    schema: [
      breadcrumbSchema(trail),
      {
        '@type': 'Person',
        '@id': url('/about/#person'),
        name: 'פנחס רצון',
        honorificPrefix: 'עו״ד',
        jobTitle: 'עורך דין',
        worksFor: { '@id': url('/#attorney') },
        url: url('/about/'),
        telephone: BIZ.phoneE164,
        email: BIZ.email,
        knowsLanguage: BIZ.languages,
        alumniOf: { '@type': 'CollegeOrUniversity', name: 'הקריה האקדמית אונו' },
        knowsAbout: PRACTICE.map((p) => p.nav),
      },
    ],
  });
}

/* ---------------------------------------------------------------- faq */

export function faqPage() {
  const trail = [
    { label: 'ראשי', href: '/' },
    { label: 'שאלות נפוצות', href: '/faq/' },
  ];
  const all = PRACTICE.flatMap((p) => p.faqs);

  const body = `
<section class="page-hero has-figure">
  <div class="page-hero-figure figure-pinhas" aria-hidden="true">
    ${photo('/assets/img/contact-hero', { alt: '', w: 1000, h: 908, priority: true })}
  </div>
  <div class="wrap">
    <h1>מה שנשאל בשיחה הראשונה</h1>
    <p class="lead" data-manager-text="faq.page.lead">התשובות מסודרות לפי תחום. לשאלה על מקרה מסוים אפשר לפנות אליי בטלפון.</p>
  </div>
</section>

<div class="section">
  <div class="wrap narrow">
    ${PRACTICE.map((p) => `<section class="faq-group">
      <h2><a href="/practice-areas/${p.slug}/">${esc(p.nav)}${icon('arrow', 18)}</a></h2>
      <div class="faq-list">
        ${p.faqs.map((f) => `<details class="faq-item">
          <summary><span class="faq-q">${esc(f.q)}</span><span class="faq-ic" aria-hidden="true"></span></summary>
          <div class="faq-a"><p>${esc(f.a)}</p></div>
        </details>`).join('\n        ')}
      </div>
    </section>`).join('\n    ')}
  </div>
</div>

${closing({ h2: 'לא מצאתם תשובה?' })}`;

  return page({
    path: '/faq/',
    title: `שאלות נפוצות בנושא מקרקעין, מס וירושות | ${BIZ.shortName}`,
    description: 'תשובות לשאלות הנפוצות על עסקאות מקרקעין, רישום בתים משותפים, מס שבח ומס רכישה, צוואות, צווי ירושה, ייפוי כוח מתמשך ופירוק שיתוף.',
    body,
    trail,
    schema: [breadcrumbSchema(trail), faqSchema(all)],
  });
}

/* ---------------------------------------------------------------- contact */

export function contact() {
  const trail = [
    { label: 'ראשי', href: '/' },
    { label: 'יצירת קשר', href: '/contact/' },
  ];

  const body = `
<section class="page-hero has-figure contact-hero">
  <div class="page-hero-figure figure-pinhas" aria-hidden="true">
    ${photo('/assets/img/contact-hero', { alt: `${BIZ.shortName}`, w: 1000, h: 908, priority: true })}
  </div>
  <div class="wrap">
    <h1>יצירת קשר</h1>
    <p class="lead" data-manager-text="contact.page.lead">אפשר להתקשר למשרד או להשאיר שם וטלפון בטופס. אחזור אליכם לשיחה.</p>
  </div>
</section>

<div class="section">
  <div class="wrap contact-grid">
    <div class="contact-details">
      <ul class="contact-ch">
        <li><a href="${telHref}">${icon('phone', 20)}<span class="ch-body"><span class="ch-k">טלפון</span><span class="ch-v"><bdi dir="ltr">${esc(BIZ.phone)}</bdi></span></span></a></li>
        <li><a href="${BIZ.whatsapp}" target="_blank" rel="noopener">${icon('whatsapp', 20)}<span class="ch-body"><span class="ch-k">וואטסאפ</span><span class="ch-v">שליחת הודעה</span></span></a></li>
        <li><a href="mailto:${esc(BIZ.email)}">${icon('mail', 20)}<span class="ch-body"><span class="ch-k">אימייל</span><span class="ch-v"><bdi dir="ltr">${esc(BIZ.email)}</bdi></span></span></a></li>
      </ul>
      <dl class="creds wide">
        <div><dt>כתובת</dt><dd>${esc(BIZ.addressHuman)}</dd></div>
        <div><dt>קבלת קהל</dt><dd>${esc(BIZ.reception)}. לתיאום פגישה אפשר להתקשר ישירות.</dd></div>
        <div><dt>אזור שירות</dt><dd>${esc(BIZ.areaHuman)}</dd></div>
      </dl>

      <section class="after-call">
        <h2>מה קורה אחרי שפונים</h2>
        <ol class="steps">
          <li>
            <span class="idx-n" dir="ltr">01</span>
            <div><h3>שיחה קצרה</h3><p>נברר מה נדרש, אם יש מועד קרוב לטיפול ואילו מסמכים נמצאים ברשותכם.</p></div>
          </li>
          <li>
            <span class="idx-n" dir="ltr">02</span>
            <div><h3>בדיקה והצעת שכר טרחה</h3><p>אברר מה צריך לבדוק ואציג את סדר הפעולות והצעת שכר הטרחה לפני תחילת הטיפול.</p></div>
          </li>
          <li>
            <span class="idx-n" dir="ltr">03</span>
            <div><h3>טיפול בתיק</h3><p>בעסקת מקרקעין אני מלווה את הבדיקות, ההסכם והרישום. בתיקים אחרים הטיפול נקבע לפי העניין.</p></div>
          </li>
        </ol>
      </section>

      <p class="fineprint">${esc(DISCLAIMER)}</p>
    </div>
    <div class="contact-form">
      ${contactForm({ id: 'c' })}
    </div>
  </div>
</div>`;

  return page({
    path: '/contact/',
    title: `יצירת קשר | ${BIZ.shortName}`,
    description: `עו״ד פנחס רצון, מקרקעין, מיסוי, צוואות וירושות ב${BIZ.areaHuman}. טלפון ${BIZ.phone}.`,
    body,
    trail,
    schema: [
      breadcrumbSchema(trail),
      { '@type': 'ContactPage', '@id': url('/contact/#page'), url: url('/contact/'), about: { '@id': url('/#attorney') } },
    ],
  });
}

/* ---------------------------------------------------------------- accessibility */

export function accessibility() {
  const trail = [
    { label: 'ראשי', href: '/' },
    { label: 'הצהרת נגישות', href: '/accessibility/' },
  ];

  const body = `
<section class="page-hero">
  <div class="wrap">
    <p class="label">נגישות</p>
    <h1>הצהרת נגישות</h1>
    <p class="lead">האתר נבנה מתוך מחויבות לאפשר שימוש נוח ושוויוני לכל אדם, לרבות אנשים עם מוגבלות.</p>
  </div>
</section>

<div class="section">
  <div class="wrap narrow prose">
    <section class="sub-sec">
      <h2>רמת הנגישות</h2>
      <p>האתר הותאם לדרישות תקן ישראלי ת״י 5568, המבוסס על הנחיות <span dir="ltr">WCAG 2.0</span> ברמה AA, ולתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות).</p>
    </section>

    <section class="sub-sec">
      <h2>ההתאמות שבוצעו</h2>
      <ul class="checks">
        ${[
          'מבנה סמנטי תקין עם כותרות היררכיות ואזורי ניווט מסומנים',
          'ניווט מלא באמצעות מקלדת, כולל סימון ברור של הפוקוס',
          'קישור דילוג לתוכן הראשי בראש כל עמוד',
          'יחסי ניגודיות של 4.5:1 לפחות בכל טקסט באתר',
          'טקסט חלופי לתמונות ותוויות מקושרות לכל שדות הטופס',
          'תפריט נגישות: הגדלת טקסט, ניגודיות גבוהה, הדגשת קישורים ועצירת אנימציות',
          'התאמה מלאה לגלישה בנייד ובמסכים בגדלים שונים',
          'כיבוד העדפת המערכת להפחתת תנועה',
        ].map((i) => `<li>${esc(i)}</li>`).join('\n        ')}
      </ul>
    </section>

    <section class="sub-sec">
      <h2>מגבלות ידועות</h2>
      <p>ייתכנו עמודים או רכיבים שטרם הונגשו במלואם, לרבות תכנים של צד שלישי המוטמעים באתר. אם נתקלתם בקושי, אפשר לפנות אלינו כדי שנוכל לטפל בו.</p>
    </section>

    <section class="sub-sec">
      <h2>פניות בנושא נגישות</h2>
      <dl class="creds wide">
        <div><dt>רכז נגישות</dt><dd>${esc(BIZ.shortName)}</dd></div>
        <div><dt>טלפון</dt><dd><a href="${telHref}" dir="ltr">${esc(BIZ.phone)}</a></dd></div>
        <div><dt>דוא״ל</dt><dd><a href="mailto:${esc(BIZ.email)}" dir="ltr">${esc(BIZ.email)}</a></dd></div>
      </dl>
    </section>

    <section class="sub-sec">
      <h2>מקום מתן השירות</h2>
      <p>כתובת המשרד: ${esc(BIZ.addressHuman)}. חלק ניכר מהשירות ניתן בטלפון, בדוא״ל ובאמצעות אתר זה.</p>
      <p class="note">פרטי הנגישות הפיזית של המקום (דרכי גישה, חניה, מעלית ושירותים): <span dir="ltr">[ להשלמה על ידי הלקוח ]</span>. עד להשלמתם, ניתן לברר מראש בטלפון ${esc(BIZ.phone)} אילו התאמות נדרשות ואפשריות.</p>
    </section>

    <p class="fineprint">תאריך עדכון ההצהרה: <span dir="ltr">[ להשלמה ]</span></p>
  </div>
</div>`;

  return page({
    path: '/accessibility/',
    title: `הצהרת נגישות | ${BIZ.shortName}`,
    description: 'הצהרת הנגישות של אתר עו״ד פנחס רצון, בהתאם לתקן ישראלי ת״י 5568 ולתקנות שוויון זכויות לאנשים עם מוגבלות.',
    body,
    trail,
  });
}

/* ---------------------------------------------------------------- utility */

export function thankYou() {
  const body = `
<section class="section">
  <div class="wrap narrow prose center">
    <p class="label">תודה</p>
    <h1>הפנייה נשלחה</h1>
    <p class="lead">קיבלתי את הפנייה ואחזור אליכם. אם העניין דחוף, אפשר להתקשר:</p>
    <p><a class="side-tel" href="${telHref}" dir="ltr">${esc(BIZ.phone)}</a></p>
    <p><a class="textlink" href="/">חזרה לעמוד הבית ${icon('arrow', 18)}</a></p>
  </div>
</section>`;
  return page({
    path: '/thank-you/',
    title: `הפנייה נשלחה | ${BIZ.shortName}`,
    description: 'קיבלתי את הפנייה ואחזור אליכם בהקדם. אם העניין דחוף, אפשר להתקשר ישירות בטלפון.',
    body,
    noindex: true,
  });
}

export function notFound() {
  const body = `
<section class="section">
  <div class="wrap narrow prose center">
    <p class="label">404</p>
    <h1>העמוד לא נמצא</h1>
    <p class="lead">ייתכן שהקישור השתנה או שהעמוד הוסר.</p>
    <ul class="side-links center-links">
      <li><a href="/">עמוד הבית</a></li>
      <li><a href="/practice-areas/">תחומי עיסוק</a></li>
      <li><a href="/faq/">שאלות נפוצות</a></li>
      <li><a href="/contact/">יצירת קשר</a></li>
    </ul>
  </div>
</section>`;
  return page({
    path: '/404.html',
    title: 'העמוד לא נמצא | עו״ד פנחס רצון',
    description: 'העמוד המבוקש לא נמצא באתר של עו״ד פנחס רצון. אפשר להמשיך לעמוד הבית, לתחומי העיסוק או ליצירת קשר.',
    body,
    noindex: true,
  });
}
