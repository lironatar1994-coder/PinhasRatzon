/* Home-page study V2 — "נסח טאבו" (The Registry Extract).
   The page is set as one document on registry paper: a masthead with the
   lawyer's identity as labeled fields and an affixed photo stamped across its
   corner, then numbered parts (חלק א׳–ג׳), an appendix of questions and an
   application form. Every word comes from ./content.mjs; field LABELS are
   registry-style, field VALUES are only the site's own content. No registry
   data (block/parcel/file numbers, dates) is invented anywhere. */
import { page, esc, icon, leadDialog } from '../layout.mjs';
import { HERO, SITUATIONS, METHOD, ABOUT, FAQ, CLOSING, META } from './content.mjs';

const HEB = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח'];

/* ------------------------------------------------------------ guilloche
   The security rosette printed on certificates: concentric rings, each a
   circle modulated by a sine, drawn several times with a small phase turn so
   the lines interlace. Pure geometry, computed once at build time. */
const n1 = (v) => String(Math.round(v * 10) / 10);
function rosetteSymbol() {
  const rings = [
    { R: 182, a: 12, k: 40, copies: 3 },
    { R: 138, a: 20, k: 28, copies: 3 },
    { R: 88, a: 16, k: 20, copies: 3 },
    { R: 44, a: 9, k: 12, copies: 2 },
  ];
  let out = '';
  for (const g of rings) {
    const N = g.k * 9;
    const pts = [];
    for (let i = 0; i < N; i++) {
      const t = (i / N) * 2 * Math.PI;
      const r = g.R + g.a * Math.sin(g.k * t);
      pts.push(`${n1(r * Math.cos(t))},${n1(r * Math.sin(t))}`);
    }
    out += `<polygon id="v2g${g.k}" points="${pts.join(' ')}"/>`;
    for (let c = 1; c < g.copies; c++) out += `<use href="#v2g${g.k}" transform="rotate(${n1((360 / g.k / g.copies) * c)})"/>`;
  }
  return `<symbol id="v2-rosette" viewBox="-200 -200 400 400">${out}<circle r="196"/><circle r="191"/><circle r="22"/></symbol>`;
}
const rosette = (cls, withSymbol = false) =>
  `<svg class="v2-rosette ${cls}" viewBox="0 0 400 400" aria-hidden="true" focusable="false">${withSymbol ? `<defs>${rosetteSymbol()}</defs>` : ''}<use href="#v2-rosette" width="400" height="400"/></svg>`;

/* A drawn check, same stroke family as the site's hairline icons. */
const check = `<svg class="v2-check" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 12.8l5 5L20 6.6"/></svg>`;

/* Part header: the part designation in an inverted cell, the real h2 beside
   it on the same rule, the section's name at the far edge. Not an eyebrow:
   one ruled row, the way a registry extract heads each part. */
const partBar = ({ no, h2, id, name = '', marker = '' }) => `
  <div class="v2-partbar">
    <span class="v2-partno">${esc(no)}</span>
    <h2 id="${id}"${marker ? ` data-manager-text="${marker}"` : ''}>${esc(h2)}</h2>
    ${name ? `<span class="v2-partname">${esc(name)}</span>` : ''}
  </div>`;

const field = (k, v, cls = '') => `<div${cls ? ` class="${cls}"` : ''}><dt>${esc(k)}</dt><dd>${v}</dd></div>`;

/* Stamps: violet rubber-stamp impressions. Decorative (aria-hidden): every
   word they carry is already said in text nearby. data-reveal lets main.js
   press each one once as it scrolls into view. */
const STEP_STAMPS = [
  { word: 'נבדק', tilt: '-5deg', kind: 'check' },
  { word: 'תוכנן', tilt: '3deg', kind: 'check' },
  { word: 'נרשם', tilt: '-8deg', kind: 'reg' },
];
const stepStamp = ({ word, tilt, kind }) => kind === 'reg'
  ? `<span class="v2-stamp v2-stamp-reg" style="--tilt:${tilt}" data-reveal aria-hidden="true"><span>${esc(word)}</span></span>`
  : `<span class="v2-stamp v2-stamp-check" style="--tilt:${tilt}" data-reveal aria-hidden="true">${check}<span>${esc(word)}</span></span>`;

const CONTRACT = `THESIS: The home page as an Israeli land-registry extract (נסח רישום). Every
matter is documented row by row, and the escort ends with the violet stamp
"נרשם": the lawyer's mechanism, from the first check to the registration of
rights, made visible.
OWN-WORLD: One sheet of security-tinted registry paper #f5f3ec (faint guilloche
micro-waves, a printed rosette) lying on a deeper desk tone #e4dfd2. Navy ink
#1f2b45 for every word, rule and fill; stamp violet #5d3f8e for stamps and
nothing else; rule grey #c9c3b5 for hairlines. David Libre for display and
reading (the Israeli legal serif), Miriam Libre for field labels, numerals and
the phone. Ruled label|value fields, parts headed in inverted cells.
STORY: Masthead (identity as fields, photo affixed and stamped), part A where
you stand (two ledgers + a registry remark), part B how I work (three entries
each receiving its stamp, the last one "נרשם"), part C the lawyer (portrait +
fields), appendix of questions, then the application form: three steps,
channels as fields, one button. Ask comes last.
FIRST VIEWPORT: Paper header with a thin+thick rule; the sheet opens on a
guilloche ribbon and the doc bar "נסח ליווי"; the name set large, the fields
beneath it, the subtitle as the big first-person value; at the end edge the
affixed colour photo over a navy rosette, the lawyer's violet stamp across its
corner. Phones: the same document, photo beside the name like an ID page.
MOTION: one physical rule, a rubber stamp. Each stamp lands once as it enters
the screen (short press from 1.16 scale and a few degrees of turn to rest, ink
at full strength). Nothing else moves. Hidden states exist only under
html.reveal-on without data-motion=0, inside @media screen.
STATE: a mark, never a hue: checks, stamps, a minus, a dashed rule on error.
WARMTH: the colour photographs, large plain first-person copy, generous space,
a human closing.`;

export function homeV2() {
  const body = `
<div class="v2-sheet">

<section class="v2-masthead" aria-labelledby="v2-title">
  <div class="v2-ribbon" aria-hidden="true"></div>
  <div class="v2-docbar">
    <p class="v2-doctype">נסח ליווי</p>
    <nav class="v2-toc" aria-label="חלקי העמוד">
      <ol>
        <li><a href="#situations"><span class="v2-toc-k">חלק א׳</span>${esc(SITUATIONS.label)}</a></li>
        <li><a href="#method"><span class="v2-toc-k">חלק ב׳</span>${esc(METHOD.label)}</a></li>
        <li><a href="#about"><span class="v2-toc-k">חלק ג׳</span>${esc(ABOUT.label)}</a></li>
        <li><a href="#faq"><span class="v2-toc-k">נספח</span>${esc(FAQ.h2)}</a></li>
        <li><a href="#contact"><span class="v2-toc-k">פנייה</span>${esc(CLOSING.h2)}</a></li>
      </ol>
    </nav>
  </div>

  <div class="v2-mast-grid">
    <div class="v2-mast-copy">
      <h1 id="v2-title">${esc(HERO.name)}</h1>
      <dl class="v2-fields v2-mast-fields">
        ${field('תחומים', esc(HERO.services))}
        ${field('פירוט', `<p class="v2-subtitle" data-manager-text="${HERO.subtitleMarker}">${esc(HERO.subtitle)}</p>`, 'v2-field-lead')}
        ${field('אזור', esc(HERO.location))}
      </dl>
      <a class="v2-xref" href="${HERO.link.href}"><span class="v2-xref-k">חלק א׳</span><span class="v2-xref-t">${esc(HERO.link.label)}</span>${icon('arrowDown', 20)}</a>
    </div>

    <figure class="v2-idphoto">
      ${rosette('v2-rosette-mast', true)}
      <div class="v2-idframe">
        <picture>
          <source type="image/webp" srcset="/assets/img/id-portrait.webp">
          <img src="/assets/img/id-portrait.jpg" alt="${esc(HERO.name)}" width="500" height="625" fetchpriority="high" decoding="async">
        </picture>
      </div>
      <span class="v2-stamp v2-stamp-seal" style="--tilt:-7deg" data-reveal aria-hidden="true">
        <span class="v2-stamp-l1">פנחס רצון</span>
        <span class="v2-stamp-l2">עורך דין</span>
      </span>
    </figure>
  </div>
</section>

<section class="v2-part v2-situations" id="${SITUATIONS.id}" aria-labelledby="v2-sit-h">
  ${partBar({ no: 'חלק א׳', h2: SITUATIONS.h2, id: 'v2-sit-h', name: SITUATIONS.label })}
  <div class="v2-ledger">
    ${SITUATIONS.groups.map((g) => `<div class="v2-group">
      <div class="v2-group-head">
        <h3>${esc(g.title)}</h3>
        <p>${esc(g.note)}</p>
      </div>
      <ol class="v2-rows">
        ${g.items.map((it, i) => `<li>
          <a href="/practice-areas/${it.slug}/">
            <span class="v2-row-n" aria-hidden="true">(${HEB[i]})</span>
            <h4 class="v2-row-t">${esc(it.title)}</h4>
            <span class="v2-row-l">${esc(it.line)}</span>
            <span class="v2-row-go" aria-hidden="true">${icon('arrow', 20)}</span>
          </a>
        </li>`).join('\n        ')}
      </ol>
    </div>`).join('\n    ')}
    <div class="v2-remark">
      <p class="v2-remark-k">הערה</p>
      <p class="v2-remark-v">${esc(SITUATIONS.together)}</p>
    </div>
  </div>
</section>

<section class="v2-part v2-method" id="method" aria-labelledby="v2-method-h">
  ${partBar({ no: 'חלק ב׳', h2: METHOD.title, id: 'v2-method-h', name: METHOD.label, marker: METHOD.titleMarker })}
  <div class="v2-entries">
    <div class="v2-entries-head" aria-hidden="true"><span>רישום</span><span>פרטים</span><span>מצב</span></div>
    <ol>
      ${METHOD.steps.map((s, i) => `<li class="v2-entry">
        <span class="v2-entry-n" aria-hidden="true">${i + 1}</span>
        <div class="v2-entry-body">
          <h3>${esc(s.h3)}</h3>
          <p data-manager-text="${s.marker}">${esc(s.body)}</p>
        </div>
        <div class="v2-entry-mark">${stepStamp(STEP_STAMPS[i])}</div>
      </li>`).join('\n      ')}
    </ol>
  </div>
</section>

<section class="v2-part v2-about" id="about" aria-labelledby="v2-about-h">
  ${partBar({ no: 'חלק ג׳', h2: ABOUT.h2, id: 'v2-about-h', name: ABOUT.label })}
  <div class="v2-about-grid">
    <figure class="v2-portrait">
      <div class="v2-portrait-frame">
        <img src="/assets/img/pinchas-ratzon.jpg" alt="${esc(HERO.name)}, עורך דין" width="980" height="1225" loading="lazy" decoding="async">
      </div>
    </figure>
    <div class="v2-about-copy">
      <p class="v2-about-lead" data-manager-text="${ABOUT.leadMarker}">${esc(ABOUT.lead)}</p>
      <p class="v2-about-note" data-manager-text="${ABOUT.noteMarker}">${esc(ABOUT.note)}</p>
      <h3 class="v2-fields-title">עורך הדין</h3>
      <dl class="v2-fields v2-about-fields">
        ${field('רישיון', esc(ABOUT.credentials[0]))}
        ${field('השכלה', esc(ABOUT.credentials[1]))}
        ${field('הסמכה', esc(ABOUT.credentials[2]))}
        ${field('שפות', esc(ABOUT.credentials[3]))}
        ${field('משרד', esc(ABOUT.office))}
      </dl>
      <a class="v2-textlink" href="${ABOUT.link.href}">${esc(ABOUT.link.label)}${icon('arrow', 20)}</a>
    </div>
  </div>
</section>

<section class="v2-part v2-faq" id="faq" aria-labelledby="v2-faq-h">
  ${partBar({ no: 'נספח', h2: FAQ.h2, id: 'v2-faq-h' })}
  <p class="v2-faq-desc" data-manager-text="${FAQ.descriptionMarker}">${esc(FAQ.description)}</p>
  <div class="v2-faq-list">
    ${FAQ.items.map((f, i) => `<details class="v2-q"${i === 0 ? ' open' : ''}>
      <summary><span class="v2-q-n" aria-hidden="true">${i + 1}.</span><span class="v2-q-t">${esc(f.q)}</span><span class="v2-q-ic" aria-hidden="true"></span></summary>
      <div class="v2-q-a">${f.a.split(/\n\s*\n/).map((p) => `<p>${esc(p)}</p>`).join('')}</div>
    </details>`).join('\n    ')}
  </div>
  <a class="v2-textlink" href="${FAQ.more.href}">${esc(FAQ.more.label)}${icon('arrow', 20)}</a>
</section>

<section class="v2-part v2-closing" id="contact" aria-labelledby="v2-close-h">
  ${partBar({ no: 'פנייה', h2: CLOSING.h2, id: 'v2-close-h' })}
  <p class="v2-close-sub">${esc(CLOSING.sub)}</p>
  <div class="v2-close-grid">
    <div class="v2-after">
      <h3>${esc(CLOSING.stepsTitle)}</h3>
      <ol class="v2-after-list">
        ${CLOSING.steps.map((s, i) => `<li>
          <span class="v2-box" aria-hidden="true">${i + 1}</span>
          <div>
            <h4>${esc(s.h3)}</h4>
            <p>${esc(s.body)}</p>
          </div>
        </li>`).join('\n        ')}
      </ol>
    </div>
    <div class="v2-apply">
      <p class="v2-apply-k" aria-hidden="true">דרכי יצירת קשר</p>
      <ul class="v2-channels" aria-label="דרכי יצירת קשר">
        <li><a href="${CLOSING.telHref}" aria-label="חיוג אל ${esc(CLOSING.phone)}"><span class="v2-ch-k">טלפון</span><span class="v2-ch-v v2-ch-tel"><bdi dir="ltr">${esc(CLOSING.phone)}</bdi></span>${icon('phone', 22)}</a></li>
        <li><a href="${CLOSING.whatsapp}" target="_blank" rel="noopener"><span class="v2-ch-k">וואטסאפ</span><span class="v2-ch-v">שליחת הודעה</span>${icon('whatsapp', 22)}</a></li>
        <li><a href="mailto:${esc(CLOSING.email)}" aria-label="אימייל אל ${esc(CLOSING.email)}"><span class="v2-ch-k">אימייל</span><span class="v2-ch-v"><bdi dir="ltr">${esc(CLOSING.email)}</bdi></span>${icon('mail', 22)}</a></li>
      </ul>
      <p class="v2-office"><span class="v2-ch-k">משרד</span><span class="v2-office-v">${esc(CLOSING.office)}</span></p>
      <a href="${CLOSING.cta.href}" class="btn closing-cta">${esc(CLOSING.cta.label)}</a>
    </div>
  </div>
  ${leadDialog()}
  <div class="v2-ribbon v2-ribbon-end" aria-hidden="true"></div>
</section>

</div>`;

  return page({
    path: '/v2/',
    title: META.title,
    description: META.description,
    noindex: true,
    bodyClass: 'v2',
    contract: CONTRACT,
    preloadImage: '/assets/img/id-portrait',
    themeColor: '#f5f3ec',
    extraHead: `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=David+Libre:wght@400;500;700&family=Miriam+Libre:wght@400..700&display=swap">
<link rel="stylesheet" href="/assets/css/v2.css?v={v}">`,
    body,
  });
}
