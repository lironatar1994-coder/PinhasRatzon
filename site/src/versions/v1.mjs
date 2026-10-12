/* Home-page study V1 — "הבניין המשותף" (The Shared Building).
   The lawyer of your home: the page is the entrance of a Gush Dan
   International-Style apartment block. Façade and letter board, the lobby's
   mailbox panel as the practice directory, the stairwell as the method, the
   neighbour on his balcony, and the apartment door as the closing.
   All copy comes verbatim from ./content.mjs. Styling: /assets/css/v1.css. */
import { page, leadDialog, esc, icon } from '../layout.mjs';
import { META, HERO, SITUATIONS, METHOD, ABOUT, FAQ, CLOSING } from './content.mjs';

const CONTRACT = `THESIS: The lawyer of your home. The page is the entrance of a Gush Dan
International-Style apartment block: the facade and its letter board, the
lobby's mailbox panel as the practice directory, the stairwell as the method,
the neighbour on his balcony, and arrival at his apartment door.
OWN-WORLD: Three inks at page scale. Plaster white #f2efe8 is the ground; felt
black #1a1a19 is the letter boards, the door and the footer; stairwell orange
#d9772b is the single signal (switch glow, the one button, the lit phone).
Terrazzo grey #bdb5a6 and aluminum #c9ccce are supporting neutrals only
(mailboxes, plates, treads, terrazzo chips). Orange never sets small text on
plaster (2.76:1); orange as text is #9a4a16 on plaster (5.43:1) or the
signal orange on felt (5.49:1).
TYPE: Secular One is the building's modernist signage (section titles, plates).
Rubik 400/500 is the rounded press-in plastic letter of the felt boards and the
mailbox name cards. Heebo 400 at 19px reads. Hebrew is never tracked.
MOTION: One physical rule, the stairwell timer light. Each section arrives
unlit and switches on: the plaster lifts, the ceiling pool lights, its switch
glows. State is a stamped mark, never a hue: the method and the after-contact
steps are stamped once their light is on. Without motion everything is lit.
FIRST VIEWPORT: A plaster facade with horizontal nautical balcony rails running
the full width; the portrait sits in a steel-framed opening between two slabs,
the rail of his balcony in front of him. Beside it the felt letter board
carries the name, the services and the subtitle in white pressed letters, and
its foot switch leads down to the lobby directory.
RESTRAINT: One button, at the door in the closing. Header phone is the only
other ask. No floating or sticky actions, no form in the hero, no numbers strip.`;

/* ------------------------------------------------------------- parts */

const telHref = CLOSING.telHref;

/* The stairwell timer switch: a plaster plate with an orange rocker. Purely
   the world's light, never a control. */
const sw = (mod = '') => `<span class="v1-switch${mod ? ` v1-switch--${mod}` : ''}" aria-hidden="true"><span class="v1-rocker"></span></span>`;

/* A rubber-stamped check: the mark that carries state. */
const stamp = (i = 0) => `<span class="v1-stamp" style="--i:${i}" aria-hidden="true"><svg viewBox="0 0 40 40" width="40" height="40" focusable="false"><path d="M9.5 21.5 17 29 31.5 12" fill="none" stroke="currentColor" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;

/* Facade bands: a balcony slab (the floor one carries the nautical rail). They
   live inside a window figure and run out across the whole facade. */
const slab = (where) => `<span class="v1-slab v1-slab--${where}" aria-hidden="true"></span>`;

const lineBreaks = (s) => esc(s).replace(/\n/g, '<br>');
const paragraphs = (s) => s.split(/\n\s*\n/).map((p) => `<p>${esc(p)}</p>`).join('');

/* ------------------------------------------------------------- hero */

const hero = () => `
<section class="v1-hero" aria-labelledby="v1-name">
  <div class="v1-wrap v1-hero-grid">
    <div class="v1-board v1-hero-board">
      <div class="v1-board-top">
        <h1 class="v1-board-name" id="v1-name">${esc(HERO.name)}</h1>
        <p class="v1-board-services">${esc(HERO.services)}</p>
        <p class="v1-board-sub" data-manager-text="${HERO.subtitleMarker}">${esc(HERO.subtitle)}</p>
      </div>
      <div class="v1-board-foot">
        <p class="v1-board-loc">${esc(HERO.location)}</p>
        <a class="v1-down" href="${HERO.link.href}"><span class="v1-down-key" aria-hidden="true">${icon('arrowDown', 20)}</span><span>${esc(HERO.link.label)}</span></a>
      </div>
    </div>
    <figure class="v1-window v1-hero-window">
      ${slab('top')}
      <div class="v1-frame">
        <img src="/assets/img/pinchas-ratzon.jpg" alt="${esc(HERO.name)}" width="980" height="1225" fetchpriority="high" decoding="async">
      </div>
      ${slab('floor')}
    </figure>
  </div>
</section>`;

/* ------------------------------------------------------------- lobby */

let boxNo = 0;
const box = (item) => {
  boxNo += 1;
  return `<li>
            <a class="v1-box" href="/practice-areas/${item.slug}/">
              <span class="v1-box-top" aria-hidden="true"><span class="v1-box-no">${boxNo}</span><span class="v1-box-slot"></span></span>
              <div class="v1-box-label"><h4 class="v1-box-title">${esc(item.title)}</h4></div>
              <span class="v1-box-line">${esc(item.line)}</span>
              <span class="v1-box-foot" aria-hidden="true"><span class="v1-keyhole"></span><span class="v1-box-go">${icon('arrow', 20)}</span></span>
            </a>
          </li>`;
};

const lobby = () => {
  boxNo = 0;
  const [property, family] = SITUATIONS.groups;
  const floor = (g, mod, extra = '') => `
      <div class="v1-floor v1-floor--${mod}">
        <div class="v1-floor-head">
          <h3 class="v1-floor-title">${esc(g.title)}</h3>
          <p class="v1-floor-note">${esc(g.note)}</p>
        </div>
        <div class="v1-floor-body">
          <ul class="v1-boxes" role="list">
          ${g.items.map(box).join('\n          ')}
          </ul>${extra}
        </div>
      </div>`;
  return `
<section class="v1-lobby v1-lit" id="${SITUATIONS.id}" aria-labelledby="v1-situations-h" data-reveal>
  <span class="v1-pool" aria-hidden="true"></span>
  <div class="v1-wrap">
    <div class="v1-head">
      <h2 class="v1-h2" id="v1-situations-h">${esc(SITUATIONS.h2)}</h2>
      ${sw()}
    </div>
    <div class="v1-panel">
      <p class="v1-panel-plate">${esc(SITUATIONS.label)}</p>
      ${floor(property, 'property')}
      ${floor(family, 'family', `
          <div class="v1-notice"><p>${esc(SITUATIONS.together)}</p></div>`)}
    </div>
  </div>
  <div class="v1-floorband" aria-hidden="true"></div>
</section>`;
};

/* ------------------------------------------------------------- stairwell */

const stairs = () => `
<section class="v1-stairs v1-lit" id="method" aria-labelledby="v1-method-h" data-reveal>
  <span class="v1-pool" aria-hidden="true"></span>
  <div class="v1-wrap">
    <div class="v1-head v1-head--wrap">
      <h2 class="v1-h2" id="v1-method-h" data-manager-text="${METHOD.titleMarker}">${esc(METHOD.title)}</h2>
      <div class="v1-wall">
        <p class="v1-plate">${esc(METHOD.label)}</p>
        ${sw()}
      </div>
    </div>
    <ol class="v1-flight" role="list">
      ${METHOD.steps.map((s, i) => `<li class="v1-tread">
        ${stamp(i)}
        <h3 class="v1-tread-h">${esc(s.h3)}</h3>
        <p data-manager-text="${s.marker}">${esc(s.body)}</p>
      </li>`).join('\n      ')}
    </ol>
  </div>
</section>`;

/* ------------------------------------------------------------- about */

const about = () => `
<section class="v1-about v1-lit" id="about" aria-labelledby="v1-about-h" data-reveal>
  <span class="v1-pool" aria-hidden="true"></span>
  <div class="v1-wrap v1-about-grid">
    <div class="v1-about-copy">
      <div class="v1-head">
        <h2 class="v1-h2" id="v1-about-h">${esc(ABOUT.h2)}</h2>
        ${sw()}
      </div>
      <p class="v1-lead" data-manager-text="${ABOUT.leadMarker}">${esc(ABOUT.lead)}</p>
      <p class="v1-note" data-manager-text="${ABOUT.noteMarker}">${esc(ABOUT.note)}</p>
      <ul class="v1-creds" role="list">
        ${ABOUT.credentials.map((c) => `<li>${esc(c)}</li>`).join('\n        ')}
      </ul>
      <p class="v1-office">${esc(ABOUT.office)}</p>
      <a class="v1-textlink" href="${ABOUT.link.href}">${esc(ABOUT.link.label)} ${icon('arrow', 20)}</a>
    </div>
    <figure class="v1-window v1-about-window">
      ${slab('top')}
      <div class="v1-frame">
        <img src="/assets/img/about-hero.jpg" alt="${esc(HERO.name)}" width="1000" height="973" loading="lazy" decoding="async">
      </div>
      ${slab('sill')}
    </figure>
  </div>
</section>`;

/* ------------------------------------------------------------- faq */

const faq = () => `
<section class="v1-faq v1-lit" id="faq" aria-labelledby="v1-faq-h" data-reveal>
  <span class="v1-pool" aria-hidden="true"></span>
  <div class="v1-wrap v1-faq-grid">
    <div class="v1-faq-head">
      <div class="v1-head">
        <h2 class="v1-h2" id="v1-faq-h">${esc(FAQ.h2)}</h2>
        ${sw()}
      </div>
      <p class="v1-faq-desc" data-manager-text="${FAQ.descriptionMarker}">${esc(FAQ.description)}</p>
    </div>
    <div class="v1-faq-body">
      <div class="v1-faq-list">
        ${FAQ.items.map((f, i) => `<details class="v1-faq-item"${i === 0 ? ' open' : ''}>
          <summary><span class="v1-faq-q">${lineBreaks(f.q)}</span><span class="v1-faq-mark" aria-hidden="true"></span></summary>
          <div class="v1-faq-a">${paragraphs(f.a)}</div>
        </details>`).join('\n        ')}
      </div>
      <a class="v1-textlink v1-faq-more" href="${FAQ.more.href}">${esc(FAQ.more.label)} ${icon('arrow', 20)}</a>
    </div>
  </div>
</section>`;

/* ------------------------------------------------------------- the door */

const landing = () => `
<section class="v1-landing v1-lit" id="contact" aria-labelledby="v1-closing-h" data-reveal>
  <span class="v1-pool" aria-hidden="true"></span>
  <div class="v1-wrap v1-landing-grid">
    <div class="v1-landing-copy">
      <h2 class="v1-h2" id="v1-closing-h">${esc(CLOSING.h2)}</h2>
      <p class="v1-landing-sub">${esc(CLOSING.sub)}</p>
      <h3 class="v1-steps-title">${esc(CLOSING.stepsTitle)}</h3>
      <ol class="v1-steps" role="list">
        ${CLOSING.steps.map((s, i) => `<li>
          ${stamp(i)}
          <div><h4>${esc(s.h3)}</h4><p>${esc(s.body)}</p></div>
        </li>`).join('\n        ')}
      </ol>
    </div>
    <div class="v1-doorway">
      ${sw('big')}
      <div class="v1-jamb">
        <div class="v1-door">
          <span class="v1-peephole" aria-hidden="true"></span>
          <p class="v1-doorplate" aria-hidden="true">${esc(HERO.name)}</p>
          <ul class="v1-channels" aria-label="דרכי יצירת קשר" role="list">
            <li><a href="${telHref}" aria-label="חיוג אל ${esc(CLOSING.phone)}">${icon('phone', 22)}<span><span class="v1-ch-k">טלפון</span><span class="v1-ch-v"><bdi dir="ltr">${esc(CLOSING.phone)}</bdi></span></span></a></li>
            <li><a href="${CLOSING.whatsapp}" target="_blank" rel="noopener">${icon('whatsapp', 22)}<span><span class="v1-ch-k">וואטסאפ</span><span class="v1-ch-v">שליחת הודעה</span></span></a></li>
            <li><a href="mailto:${esc(CLOSING.email)}" aria-label="אימייל אל ${esc(CLOSING.email)}">${icon('mail', 22)}<span><span class="v1-ch-k">אימייל</span><span class="v1-ch-v"><bdi dir="ltr">${esc(CLOSING.email)}</bdi></span></span></a></li>
          </ul>
          <p class="v1-door-office">${esc(CLOSING.office)}</p>
          <a class="btn closing-cta" href="${CLOSING.cta.href}">${esc(CLOSING.cta.label)}</a>
          <span class="v1-handle" aria-hidden="true"></span>
        </div>
      </div>
    </div>
  </div>
  <div class="v1-floorband" aria-hidden="true"></div>
  ${leadDialog()}
</section>`;

/* ------------------------------------------------------------- page */

export function homeV1() {
  const body = `${hero()}
${lobby()}
${stairs()}
${about()}
${faq()}
${landing()}`;

  return page({
    path: '/v1/',
    title: META.title,
    description: META.description,
    noindex: true,
    bodyClass: 'v1',
    themeColor: '#f2efe8',
    contract: CONTRACT,
    preloadImage: '/assets/img/pinchas-ratzon',
    extraHead: `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500&family=Secular+One&display=swap">
<link rel="stylesheet" href="/assets/css/v1.css?v={v}">`,
    body,
  });
}
