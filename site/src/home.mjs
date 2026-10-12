/* The home page. October 12: chosen from three studies (V3) — the canon,
   executed at its best: near-black + gold + warm white, all-Heebo, graded
   photography, hairlines, no cards, with the restructured content: situations grouped by life moment, the method as a
   titled sequence, a real About, the FAQ, and a closing that reassures
   before it asks. Bands alternate dark / paper so the page breathes. */
import { page, esc, icon, leadDialog, faqSchema, url } from './layout.mjs';
import { BIZ } from './site.mjs';
import { HERO, SITUATIONS, METHOD, ABOUT, FAQ, CLOSING, META } from './content/home.mjs';

const IMG = '/assets/img';

/* Digit runs outside managed slots sit in their own LTR isolate, so a
   number never borrows direction from the Hebrew around it. */
const ltrNums = (s) => esc(s).replace(/\d+/g, (n) => `<bdi dir="ltr">${n}</bdi>`);
/* A Latin abbreviation in parentheses ("(LL.B)") isolated the same way, so
   the brackets resolve to the Hebrew line and never swap sides. */
const ltrLatin = (html) => html.replace(/\(([A-Za-z][A-Za-z.]*)\)/g, '(<bdi dir="ltr">$1</bdi>)');

/* The office line is two facts joined by " · ". Each fact keeps itself
   whole, so a narrow column breaks at the dot, never inside the address. */
const officeLine = (s) => s.split(' · ').map((part) => `<span class="home-nb">${ltrNums(part)}</span>`).join(' · ');

const telHref = CLOSING.telHref;

/* ------------------------------------------------------------ hero */

const hero = () => `
<section class="hero home-hero" aria-labelledby="home-h1">
  <div class="hero-figure">
    <img src="${IMG}/hero-room.jpg" alt="${esc(`${BIZ.shortName}, עורך דין מקרקעין, מיסוי מקרקעין וצוואות ב${BIZ.city}`)}" width="1920" height="1084" fetchpriority="high" decoding="async">
  </div>
  <div class="wrap hero-inner">
    <div class="hero-col">
      <h1 id="home-h1"><span class="hero-line">${esc(HERO.name)}</span></h1>
      <p class="hero-services">${esc(HERO.services)}</p>
      <span class="hero-rule home-hero-rule" aria-hidden="true"></span>
      <p class="hero-sub" data-manager-text="${HERO.subtitleMarker}">${esc(HERO.subtitle)}</p>
      <div class="hero-footer">
        <p class="hero-location">${esc(HERO.location)}</p>
        <a class="hero-more" href="${HERO.link.href}">${esc(HERO.link.label)} ${icon('arrowDown', 18)}</a>
      </div>
    </div>
  </div>
</section>`;

/* ------------------------------------------------------------ situations
   Two life moments side by side on wide screens, so the family visitor
   finds their group at the same scroll depth as the property buyer. No
   global numbering: the six areas are not a sequence. */

const situationItem = (it) => `<li data-reveal>
          <a href="/practice-areas/${it.slug}/">
            <span class="home-item-body">
              <h4 class="home-item-t">${esc(it.title)}</h4>
              <span class="home-item-l">${esc(it.line)}</span>
            </span>
            <span class="home-item-arrow" aria-hidden="true">${icon('arrow', 20)}</span>
          </a>
        </li>`;

const situations = () => `
<section class="home-situations" id="${SITUATIONS.id}" aria-labelledby="home-sit-h">
  <div class="wrap">
    <header class="home-head">
      <p class="label">${esc(SITUATIONS.label)}</p>
      <h2 id="home-sit-h">${esc(SITUATIONS.h2)}</h2>
    </header>
    <div class="home-groups">
      ${SITUATIONS.groups.map((g, i) => `<section class="home-group home-group-${i + 1}" aria-labelledby="home-g${i + 1}">
        <div class="home-group-head">
          <h3 id="home-g${i + 1}">${esc(g.title)}</h3>
          <p class="home-group-note">${esc(g.note)}</p>
        </div>
        <ul class="home-items">
        ${g.items.map(situationItem).join('\n        ')}
        </ul>
      </section>`).join('\n      ')}
      <p class="home-together" data-reveal>${esc(SITUATIONS.together)}</p>
    </div>
  </div>
</section>`;

/* ------------------------------------------------------------ method
   The stamp still life opens the band; the managed question is the
   section's real heading, set on the dark wood; three titled steps follow
   on the solid ground. */

const method = () => `
<section class="home-method" id="method" data-reveal aria-labelledby="home-method-h">
  <div class="home-method-stage">
    <div class="home-method-figure" aria-hidden="true">
      <picture>
        <source type="image/webp" srcset="${IMG}/band-stamp.webp">
        <img src="${IMG}/band-stamp.jpg" alt="" width="1672" height="941" loading="lazy" decoding="async">
      </picture>
    </div>
    <div class="wrap home-method-head">
      <p class="label">${esc(METHOD.label)}</p>
      <h2 id="home-method-h" data-manager-text="${METHOD.titleMarker}">${esc(METHOD.title)}</h2>
    </div>
  </div>
  <div class="wrap">
    <ol class="home-steps">
      ${METHOD.steps.map((s) => `<li>
        <h3>${esc(s.h3)}</h3>
        <p data-manager-text="${s.marker}">${esc(s.body)}</p>
      </li>`).join('\n      ')}
    </ol>
  </div>
</section>`;

/* ------------------------------------------------------------ about */

const about = () => `
<section class="home-about" id="about" aria-labelledby="home-about-h">
  <div class="wrap home-about-grid">
    <figure class="home-about-figure">
      <picture>
        <source media="(max-width: 860px)" type="image/jpeg" srcset="${IMG}/about-mobile-portrait-v1.jpg" width="1122" height="1402">
        <img src="${IMG}/pinchas-ratzon.jpg" alt="${esc(`${BIZ.shortName}, עורך דין מקרקעין וצוואות ב${BIZ.city}`)}" width="980" height="1225" loading="lazy" decoding="async">
      </picture>
      <figcaption>${esc(HERO.name)} · ${esc(BIZ.city)}</figcaption>
    </figure>
    <div class="home-about-copy">
      <p class="label">${esc(ABOUT.label)}</p>
      <h2 id="home-about-h">${esc(ABOUT.h2)}</h2>
      <p class="home-lead" data-manager-text="${ABOUT.leadMarker}">${esc(ABOUT.lead)}</p>
      <p class="home-note" data-manager-text="${ABOUT.noteMarker}">${esc(ABOUT.note)}</p>
      <ul class="home-creds">
        ${ABOUT.credentials.map((c) => `<li>${ltrLatin(ltrNums(c))}</li>`).join('\n        ')}
      </ul>
      <p class="home-office">${officeLine(ABOUT.office)}</p>
      <a class="textlink home-link" href="${ABOUT.link.href}">${esc(ABOUT.link.label)} ${icon('arrow', 18)}</a>
    </div>
  </div>
</section>`;

/* ------------------------------------------------------------ faq */

const faq = () => `
<section class="home-faq" id="faq" aria-labelledby="home-faq-h">
  <div class="wrap home-faq-grid">
    <div class="home-faq-head">
      <h2 id="home-faq-h">${esc(FAQ.h2)}</h2>
      <p class="home-faq-desc" data-manager-text="${FAQ.descriptionMarker}">${esc(FAQ.description)}</p>
    </div>
    <div class="home-faq-body">
      <div class="faq-list home-faq-list">
        ${FAQ.items.map((f, i) => `<details class="faq-item"${i === 0 ? ' open' : ''}>
          <summary><span class="faq-q">${esc(f.q)}</span><span class="faq-ic" aria-hidden="true"></span></summary>
          <div class="faq-a">${f.a.split(/\n\s*\n/).map((p) => `<p>${esc(p)}</p>`).join('')}</div>
        </details>`).join('\n        ')}
      </div>
      <a class="textlink home-link" href="${FAQ.more.href}">${esc(FAQ.more.label)} ${icon('arrow', 18)}</a>
    </div>
  </div>
</section>`;

/* ------------------------------------------------------------ closing
   Reuses .closing / .closing-figure, so the lamp glow and the room warming
   on arrival come from the shared stylesheet. Reassurance (what happens
   after you reach out) precedes the channels and the one button. */

const closing = () => `
<section class="closing home-closing" id="contact" data-reveal aria-labelledby="home-close-h">
  <div class="closing-figure" aria-hidden="true">
    <img src="${IMG}/band-chairs.jpg" alt="" width="1672" height="941" loading="lazy" decoding="async">
  </div>
  <div class="wrap closing-grid home-closing-grid">
    <div class="closing-copy">
      <h2 id="home-close-h">${esc(CLOSING.h2)}</h2>
      <p class="closing-sub">${esc(CLOSING.sub)}</p>
    </div>
    <div class="home-after">
      <h3>${esc(CLOSING.stepsTitle)}</h3>
      <ol class="home-after-list">
        ${CLOSING.steps.map((s) => `<li>
          <h4>${esc(s.h3)}</h4>
          <p>${esc(s.body)}</p>
        </li>`).join('\n        ')}
      </ol>
    </div>
    <div class="closing-act">
      <ul class="closing-ch" aria-label="דרכי יצירת קשר">
        <li class="closing-phone"><a href="${telHref}" aria-label="חיוג אל ${esc(CLOSING.phone)}">${icon('phone', 20)}<span class="ch-body"><span class="ch-k">טלפון</span><span class="ch-v"><bdi dir="ltr">${esc(CLOSING.phone)}</bdi></span></span></a></li>
        <li class="closing-whatsapp"><a href="${CLOSING.whatsapp}" target="_blank" rel="noopener">${icon('whatsapp', 20)}<span class="ch-body"><span class="ch-k">וואטסאפ</span><span class="ch-v">שליחת הודעה</span></span></a></li>
        <li class="closing-email"><a href="mailto:${esc(CLOSING.email)}" aria-label="אימייל אל ${esc(CLOSING.email)}">${icon('mail', 20)}<span class="ch-body"><span class="ch-k">אימייל</span><span class="ch-v"><bdi dir="ltr">${esc(CLOSING.email)}</bdi></span></span></a></li>
      </ul>
      <a class="btn closing-cta" href="${CLOSING.cta.href}">${esc(CLOSING.cta.label)}</a>
      <p class="home-close-office">${officeLine(CLOSING.office)}</p>
    </div>
  </div>
  ${leadDialog()}
</section>`;

const CONTRACT = `THESIS: The Israeli premium-lawyer canon (near-black, gold, warm white,
all-Heebo, graded cinema photography, hairlines) kept exactly, and executed
at its best: the same world, a better-built page.
OWN-WORLD: style.css tokens only. Dark and paper bands alternate (hero dark,
situations paper, method dark, about paper, FAQ paper-2, closing dark), so
no stretch of black runs past one band. Running text weight 400, never
below 18px on dark. Gold stays jewelry: kickers, bars, the one button.
STORY: A visitor arrives before a transaction OR a family matter. Both life
moments sit side by side in the first band after the hero; the method
answers "what gets checked"; the About says who you will work with and his
credentials; the FAQ settles doubts; the closing explains what happens after
you reach out before it asks.
FIRST VIEWPORT: Solid header, the window portrait full-bleed with its glare
pulled down by a warm gradient on the window side, the name in white on
the dark wall, the services in champagne, a gold bar, the subtitle.
FORM: Category standard, played straight (study V3 of three, chosen by the
client 2026-10-12 over the building and registry worlds).
MOTION: Situation rows rise as their hairlines draw from the RTL edge; the
method's gold bars draw and the stamp settles closer; the closing lamp
switches on. Nothing else moves.`;

/* Manager Site slots this layout no longer shows. check-manager-content.mjs
   requires every slot path in the generated HTML, and a <template> keeps the
   references inert: nothing inside it is rendered or fetched. */
const retiredSlots = () => `<template class="managed-retired">
  <img src="${IMG}/hero-listening-mobile.jpg" alt="">
  <img src="${IMG}/band-plans-daylight.jpg" alt="">
  <img src="${IMG}/band-stamp-light-v1.jpg" alt="">
  <img src="${IMG}/round7/contact-consultation-desktop-v2.png" alt="">
  <img src="${IMG}/closing-consultation-mobile.jpg" alt="">
</template>`;

export function home() {
  const body = `${hero()}
${situations()}
${method()}
${about()}
${faq()}
${closing()}

${retiredSlots()}`;

  return page({
    path: '/',
    title: META.title,
    description: META.description,
    shareDescription: `ניסיון של ${BIZ.yearsExperience} שנים במקרקעין, מיסוי, צוואות וירושות, ${BIZ.city} והמרכז`,
    bodyClass: 'home',
    extraHead: '<link rel="stylesheet" href="/assets/css/home.css?v={v}">',
    contract: CONTRACT,
    preloadImage: `${IMG}/hero-room`,
    overHero: true,
    body,
    schema: [
      { '@type': 'WebSite', '@id': url('/#website'), url: url('/'), name: BIZ.name, inLanguage: 'he-IL' },
      /* Formerly injected by nginx (fleet SEO, 2026-10-09); page() adds the
         language and primary image to every WebPage node. */
      { '@type': 'WebPage', '@id': url('/#page'), url: url('/'), name: META.title, description: META.description },
      faqSchema(FAQ.items),
    ],
  });
}
