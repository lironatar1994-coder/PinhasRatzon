---
name: עו״ד פנחס רצון — Ratzon Law
description: The Israeli premium-lawyer canon played straight — near-black and gold bands, all-Heebo, cinematic photography, machine-verified restraint.
colors:
  ink: "#14110c"
  ink-2: "#3a352c"
  muted: "#655d4f"
  paper: "#fbfaf7"
  paper-2: "#f3efe8"
  stone: "#ddd5c8"
  accent: "#86641f"
  accent-lt: "#c19b45"
  champagne: "#dcc186"
  deep: "#0e0c09"
  deep-2: "#1a1712"
  on-deep: "#f0ebe1"
  on-deep-2: "#aaa295"
  line-deep: "rgba(240, 235, 225, .16)"
  gold-line: "rgba(193, 155, 69, .45)"
typography:
  display:
    fontFamily: "Heebo, Segoe UI, Arial, sans-serif"
    fontSize: "clamp(2.4rem, 1.2rem + 4.4vw, 4.6rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "normal"
  headline:
    fontFamily: "Heebo, Segoe UI, Arial, sans-serif"
    fontSize: "clamp(1.8rem, 1.25rem + 2.1vw, 2.8rem)"
    fontWeight: 600
    lineHeight: 1.22
    letterSpacing: "normal"
  title:
    fontFamily: "Heebo, Segoe UI, Arial, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "Heebo, Segoe UI, Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 300
    lineHeight: 2
    letterSpacing: "normal"
  lead:
    fontFamily: "Heebo, Segoe UI, Arial, sans-serif"
    fontSize: "clamp(1.15rem, 1rem + .55vw, 1.4rem)"
    fontWeight: 300
    lineHeight: 1.9
    letterSpacing: "normal"
  label:
    fontFamily: "Heebo, Segoe UI, Arial, sans-serif"
    fontSize: ".95rem"
    fontWeight: 600
    lineHeight: 1.6
    letterSpacing: "normal"
spacing:
  section-gap: "clamp(3.75rem, 2rem + 5.5vw, 7rem)"
components:
  button-primary:
    backgroundColor: "{colors.accent-lt}"
    textColor: "{colors.deep}"
    padding: "1rem 3rem"
    height: "56px"
---

# Design System: עו״ד פנחס רצון

## Overview

**Creative North Star: "The Israeli Premium-Lawyer Canon, Played Straight"**

This is the category standard of the Israeli high-end lawyer vertical — near-black cinematic
bands, warm gold, an airy light Hebrew sans — executed at the vertical's craft ceiling
(quality bar: mazeh.co.il) with none of its defects. The commitment is user-pinned
(2026-08-25/26, recorded in PRODUCT.md): not a unique identity, but the canon done better —
one H1 per page, AA contrast everywhere, tiny CSS, honest facts only. The world's glamour is
kept; the vertical's plugin clutter is refused, and that refusal is machine-enforced
(see Verification), not a taste preference.

The page reads as short one-idea bands alternating full-bleed dark and light, generous
whitespace, and photographs doing the emotional work — including full-viewport photo bands
that carry no words at all. Everything is Hebrew, RTL, and typographically quiet: no
tracking, no cards, no shadows, sharp corners, hairlines instead of chrome.

**Key Characteristics:**
- Full-bleed band alternation: warm white / warm off-white / near-black
- Gold as jewelry: kickers, short rules, numerals, hairlines, and exactly one loud button
- All-Heebo; heavy short display lines over a 20px / weight-300 / line-height-2 body
- Cinematic environmental photography, including wordless full-viewport pauses
- Flat, sharp-cornered, hairline-divided surfaces — zero radius, zero shadows
- Restraint by law: pressure-selling UI is banned by a gate, not by convention

## Colors

A two-ground palette — warm paper and warm near-black — with one gold voice tuned per ground.

### Primary
- **Bright Gold** (`--accent-lt` #c19b45): gold on the deep ground — kickers on dark, rules,
  numerals, hairline accents, the phone box border, and the single button fill. Verified
  7.48:1 on `--deep`.
- **Text Gold** (`--accent` #86641f): the same voice darkened to survive as text on paper —
  links, kickers, and labels on light grounds. Verified 5.22:1 on `--paper`, 4.75:1 on
  `--paper-2`.
- **Champagne** (`#dcc186`): the one deliberate off-token color. The hero eyebrow sits on the
  photograph itself, and Bright Gold measures only 3.63:1 against the wall's brightest
  pixels; champagne measures 5.41:1 worst-case — verified against the image's pixels, not
  the DOM. Use it only for text over photography.

### Neutral
- **Ink** (`--ink` #14110c): body text on paper. **Ink 2** (`--ink-2` #3a352c): secondary
  prose. **Muted** (`--muted` #655d4f): meta, captions, teasers.
- **Paper** (`--paper` #fbfaf7) and **Paper 2** (`--paper-2` #f3efe8): the light grounds;
  Paper 2 is the alternating band (`.section-alt`, FAQ).
- **Deep** (`--deep` #0e0c09) and **Deep 2** (`--deep-2` #1a1712): the near-black grounds —
  header, heroes, route, credentials band, closing, footer.
- **On-Deep** (`--on-deep` #f0ebe1) and **On-Deep 2** (`--on-deep-2` #aaa295): text on the
  dark grounds (primary / secondary).
- **Hairlines (non-text):** **Stone** (`--stone` #ddd5c8) on light; `--line-deep`
  rgba(240,235,225,.16) on dark; `--gold-line` rgba(193,155,69,.45) for the gold structural
  borders (header/footer edges, submenu, portrait frame).
- **Separator (glyph, not hairline):** `--sep-deep` #74706a — the breadcrumb dash. 3.97:1
  on Deep, gated at the 3:1 UI bar; deliberately quieter than the 7.73:1 crumb links.

### Named Rules
**The Verified-Pair Rule.** The tokens live in `:root` of
`site/public/assets/css/style.css` under the `@contrast-tokens` comment, and every
foreground/background pair the design renders is machine-checked by
`site/gates/verify-contrast.mjs` against the `PAIRS` table in
`site/gates/lib/contrast.mjs`. Any token change must keep every declared pair ≥ 4.5:1 or
the build fails. Do not add a text color without adding its pair to the table.

**The Glyph-Is-Not-A-Hairline Rule.** A hairline is a border and answers to nothing; a
character you can read is text and answers to contrast. The breadcrumb `—` borrowed
`--line-deep` and shipped at **1.48:1** — invisible, so the trail read as one run-on
phrase — because neither the token gate (it parses only `#hex` from `:root`) nor the
rendered sweep (it walks text nodes, and `::before` content is not one) could see it. Any
`content:` glyph gets its own gated token. When you sweep contrast, sweep pseudo-elements.

**The Two-Golds Rule.** Gold is one voice with two registers: #c19b45 on dark grounds and
as the button fill; #86641f as text on light grounds. Never swap them — bright gold is not
AA as text on paper, and text gold disappears on deep.

**The Pixel-Truth Rule.** Text placed over a photograph is verified against the image's
actual pixels, not against a DOM background color. That measurement is what licenses
champagne #dcc186 in the hero eyebrow and forbids Bright Gold there.

## Typography

**Display Font:** Heebo (with Segoe UI, Arial, sans-serif)
**Body Font:** Heebo (same stack — the system is deliberately single-face)

**Character:** One Hebrew sans doing everything through weight contrast alone: heavy, tightly
leaded display lines (600–700) over an unusually light, airy body — the vertical's premium
tell. The retired faces (Frank Ruhl Libre, Assistant) must never return.

### Hierarchy
- **Display / H1** (700, clamp(2.4rem, 1.2rem + 4.4vw, 4.6rem), lh 1.12): hero and page-hero
  headlines; white (#fff) on the dark mastheads.
- **Headline / H2** (600, clamp(1.8rem, 1.25rem + 2.1vw, 2.8rem), lh 1.22): band headings.
- **Title / H3** (600, 1.35rem, lh 1.4): sub-heads inside bands.
- **Body** (300, 1.25rem = 20px, lh 2): all prose; columns cap near 42–46rem.
- **Lead** (300, clamp(1.15rem, 1rem + .55vw, 1.4rem), lh 1.9): standfirst paragraphs.
- **Label** (600, .95rem, lh 1.6): the gold kicker; also footer column headings (.9rem).
- **Pull** (600, clamp(1.7rem, 1.15rem + 2.4vw, 3rem), lh 1.35): the statement pull-quote.

### Named Rules
**The No-Tracking Rule.** Hebrew never gets letter-spacing — the stylesheet may not contain
the property at all (machine-enforced). The kicker's short gold bar supplies the
"small-caps" signal that tracking would in Latin.

**The Word-Space Rule.** Hebrew has no capitals and little ascender variety, so the word
gap is the only word-boundary cue the reader gets — running copy carries
`word-spacing: var(--word-space-he)` (.05em, ~1px at the 20px body). The display faces opt
out via one dedicated rule (`h1–h4, .pull, .wm-name, .cb-k, .route-q, .side-tel, .btn,
.wordmark { word-spacing: normal }`); they are set tight on purpose. This is the *only*
inter-glyph adjustment Hebrew gets — see the No-Tracking Rule. Measured cost across the
matrix: zero at 768px and up, two extra text lines on the longest pages at 390px.

**The Airy-Body Rule.** Body stays at weight ≤ 300 and line-height ≥ 1.9 (built at 300 /
2.0), headings at ≥ 500 (built at 600–700), everything Heebo with a generic sans fallback.
All of this, plus the webfont request on every page (weights 300–700, display=swap) and
the absence of the retired faces, is machine-enforced by `site/gates/verify-typography.mjs`.

## Layout

The site is `dir="rtl"` hardcoded on `<html lang="he">`, styled almost entirely with logical
properties. Content sits in `.wrap` — min(1180px, 100% − 3rem), centered — with a
`.wrap.narrow` variant at 760px for prose pages. Vertical rhythm is one token:
`--gap-sec: clamp(3.75rem, 2rem + 5.5vw, 7rem)` of block padding per band.

**Band grammar.** Pages are stacks of full-bleed one-idea bands: warm paper, warm off-white
(`.section-alt`), and near-black (`.section-dark`, `.route`, `.closing`). The home page runs
hero (dark) → credentials band (dark) → statement (paper) → practice index → quiet pause →
route (dark) → quiet pause → closing (dark). Every interior page opens on the dark masthead
(`.page-hero`: black ground, gold kicker, white display type, gold hairline base), followed
on practice pages by a letterboxed full-bleed photograph (`.page-figure`, 21/7, 16/9 under
860px). Long pages use `.layout-aside`: prose column plus a 16rem sticky sidebar.

**The quiet band.** A full-viewport photograph carrying no words at all — `min(100svh,
950px)` tall on desktop, 62svh under 1100px, 55svh under 560px, `aria-hidden`. Two on the
home page, one on the practice index. This is a load-bearing canon element (the wordless
pause between dense bands), not decoration; do not fill it with text or captions.

**Hero.** Full-bleed cinema under the solid header, min(88vh, 880px). The photograph is
composed with the reading column already in it: subject in the left third, dark stone wall
in the right two-thirds; measured on the source file, every column from 36% rightward clears
4.5:1 against white, so the headline needs no scrim. The physical (not logical) directions
here are deliberate — the figure is always the left half regardless of RTL. Below 1100px the
hero splits: type first on the dark ground, then the photograph full-bleed beneath it with a
bottom fade mask (`mask-image`, physical direction deliberate).

**Numerals and RTL.** Numerals (year, phone, counts) are wrapped `dir="ltr"` inline — which
is why the site needs no `<bdi>`: measured character-by-character, every mixed run renders
correctly, `תואר ראשון במשפטים (LL.B), הקריה` included. The phone input is `text-align: end`
(it is `dir="ltr"`, so that is its right edge — the same edge the Hebrew label above sits
on). Outside the hero and its mask, the stylesheet contains no physical directional
property. Hover motion travels leftward (`translateX(−…)`) — "forward" in an RTL reading. Breakpoints observed: 1100, 1000, 860 (drawer nav), 560.

## Elevation & Depth

Entirely flat: the stylesheet declares no box-shadow anywhere. Depth is conveyed by ground
alternation (paper vs. near-black bands), hairline dividers, and photography. The one
framing device is the portrait's offset 1px gold border (`.portrait-media::before`) — a
drawn line, not a lift. Motion is the only "life": a single easing token
`--ease: cubic-bezier(.22, .61, .36, 1)`, 0.25–0.4s state transitions, and an 0.8s
fade-and-rise reveal (`[data-reveal]`) that is fully disabled under
`prefers-reduced-motion` and the widget's motion-off mode.

**The Flat-World Rule.** No shadows, no gradients, no glass. If a surface needs separation,
it gets a hairline or a darker ground.

## Shapes

Sharp corners everywhere — the stylesheet contains no border-radius. Rectangles, hairline
rules, and thin gold bars are the entire form language: the kicker's 2.4rem × 2px bar, the
hero/pull 5.5rem × 3px gold rule, 1px list dividers, the 1px gold-boxed phone. There is no
card chrome (machine-banned); groupings are expressed as bordered list rows and
hairline-topped columns.

## Components

### Buttons
- **Character:** the canon's one loud object; everything else stays quiet so it can.
- **Shape:** sharp rectangle (0 radius), min-height 56px, padding 1rem 3rem.
- **Primary:** Bright Gold fill (#c19b45), Deep text (#0e0c09), Heebo 600 at 1.05rem.
- **Hover:** `brightness(.94)` + 1px rise; no color swap.
- **Discipline:** at most 2 per page, machine-enforced; the reading order puts it after the
  content (the closing band), never in the hero. There is no secondary button — the
  alternatives are the gold text-link with a traveling arrow (`.textlink`) and the
  gold-boxed phone.

### The Gold Kicker (`.label` / `.hero-eyebrow`)
Gold 600-weight label preceded by a short 2px gold bar (2.4rem; 2.6rem in the hero). Text
Gold on light grounds, Bright Gold on dark, champagne only over photography. This is the
canon's signature and every band heading carries one.

### Header & Navigation
Sticky solid near-black bar (88px; 72px mobile), gold hairline bottom border — never
transparent, no scrim dependency. Two-line wordmark (name 1.4rem/600, role in Bright Gold
.8rem). Nav links On-Deep 400, hover/current in Bright Gold, no underline. The phone number
sits in a 1px Bright Gold box ("a hairline, not a siren") that inverts to gold fill on
hover. Desktop submenu: Deep-2 panel, gold hairline frame, 2px gold top edge, fade/slide in.
Under 860px the nav becomes a full-height drawer from the inline-end (min(21rem, 86vw),
translateX slide, gold hairline edge) over a rgba(14,12,9,.55) backdrop that must stay
below the header's z-index 90 (the drawer lives inside the header's stacking context).
Breadcrumbs render on the dark ground with em-dash separators.

### Route List & Index List
The two signature list components — bordered rows, no cards. The route ("where are you
standing?") is the dark version: 5.5rem light-weight gold display numeral, 500-weight
question, muted answer, arrow; the whole row slides 0.7rem leftward on hover and the
question turns gold. The index is the light-ground sibling with a small gold index numeral.
Arrows hide on mobile; the rows keep working.

### Credentials Band
The vertical's medallion strip, done honestly: Deep-2 band, 4 columns divided by hairlines
(2 under 1000px, 1 under 560px), large gold figure (`dir="ltr"`) over a muted caption.
Facts only — every line is on the CV; no rankings, no invented counts.

The divider goes on the **inline-start** of each `li + li` — the side that faces the
previous cell. On `border-inline-end` it lands on the far side instead: the first two facts
run together and a stray rule hangs off the band's outer edge (which is what shipped until
2026-08-26, at every breakpoint, and the 2-column override then zeroed the one correct
border). Verify by rect, not by eye: no divider may sit at the `ul`'s own left or right x.

### Inputs / Fields
Underline fields: transparent background, 1px Stone bottom border only, min-height 52px,
label above in Muted .92rem. Focus: border thickens to 2px Bright Gold (outline suppressed).
Invalid: dark-red underline (#9d3b33); error text #8f342c. Honeypot field visually clipped
(`.hp`). No boxes, no fills, no radius.

### FAQ Item
Native `<details>` rows divided by Stone hairlines; 500-weight question, gold plus-to-minus
icon drawn with two 2px bars. Answer prose capped at 44rem.

### Closing & Footer
Closing: centered dark band — gold kicker, white H2, short muted paragraph, the single gold
button, then phone/email as display-weight text links separated by hairline pips. Footer:
dark ground, gold hairline top edge, wordmark + address block (NAP), link columns with gold
.9rem headings, fine-print bar at .84rem.

### Accessibility Widget & Modes
Fixed 42px square button (bottom inline-start, dark with gold border) opening a Deep-2
panel: contrast mode (`html[data-contrast="1"]` swaps the whole token table to pure
black/white with adjusted golds #5c4526 / #ffd9a0), underlined-links mode, motion-off mode,
and font scaling via `--fs` multiplying the root font-size. Also standing: skip link,
2px gold `:focus-visible` outlines (Text Gold on light contexts, Bright Gold on dark),
`prefers-reduced-motion` support, print stylesheet.

### Photography
Environmental and cinematic, color-restrained (browns, greys, wood — sits with the gold),
natural side light, shallow depth of field. The hero composition reserves two-thirds of the
frame as quiet dark space for the headline. **Never:** gavels or scales of justice (Israeli
courts don't use gavels — the AI generator has to be actively fought on this), law-book
walls, white studio backdrops, stock, or an office/library that implies premises the
practice doesn't have. AI-generated documents must be angled or defocused: Kling cannot
render Hebrew, so no legible text may survive in frame. Every image ships as `<picture>`
with a WebP source (`picture { display: contents }` keeps the sizing rules working).

## Do's and Don'ts

### Do:
- **Do** run every token change through the contrast gate; add new fg/bg pairs to `PAIRS`
  in `site/gates/lib/contrast.mjs` so they stay verified ≥ 4.5:1.
- **Do** open every interior page on the dark masthead (gold kicker, white H1, gold
  hairline base) and end pages on the dark closing band with the single button.
- **Do** keep the wordless full-viewport photo pauses; they are the canon's breathing room.
- **Do** wrap every numeral (years, phone, counts) in `dir="ltr"`.
- **Do** hang a divider on the side of an element that *faces its neighbour*
  (`border-inline-start` on `li + li`), and check the rects: a rule at the container's own
  outer edge means the side is wrong.
- **Do** use hairlines (`--stone` / `--line-deep` / `--gold-line`) for all separation, and
  bordered list rows for anything another site would make a card grid.
- **Do** keep hover motion leftward — that is "forward" in this RTL world.

### Don't:
- **Don't** ship pressure-selling UI: floating call/WhatsApp buttons, sticky action bars,
  hero forms, trust strips, vanity-number strips, calculators, ten-reasons lists,
  placeholder testimonials, "call now" copy, or a third CTA button. This is the client's
  standing rule (Liron, 2026-08-25), machine-enforced by `site/gates/verify-restraint.mjs`
  — it survives every redesign.
- **Don't** use letter-spacing, ever — Hebrew type never gets tracking (machine-enforced).
- **Don't** reintroduce Frank Ruhl Libre or Assistant, any serif, cards, shadows, or
  border-radius.
- **Don't** put Bright Gold text over a photograph — verify text-over-photo against the
  image's pixels and use champagne #dcc186.
- **Don't** invent facts for the credentials band or anywhere else; unknowns stay marked
  `[ להשלמה על ידי הלקוח ]` per PRODUCT.md.
- **Don't** "fix" the hero's physical (left/right) directions to logical ones — the figure
  belongs in the left third by composition, independent of RTL.

## Verification

The system is enforced, not aspirational. The workflow after any visual change, from
`site/`:

1. `node build.mjs` — regenerate `dist/`.
2. `node check.mjs` — SEO tags, JSON-LD validity, heading structure, dead internal links.
3. Gates: `node gates/verify-contrast.mjs` (token pairs ≥ 4.5:1),
   `node gates/verify-typography.mjs` (all-Heebo, body ≤ 300 / lh ≥ 1.9, no tracking, no
   retired faces, webfont on every page), `node gates/verify-restraint.mjs` (banned
   pressure UI, ≤ 2 CTA buttons/page), `node gates/verify-build.mjs`. The `*-control.mjs`
   twins run the same checkers against known-bad fixtures so a checker that can never fail
   is caught.
4. Browser matrix + pixel sweep — the gates can't see rendering; the browser pass catches
   CSS defects, and text-over-photo contrast is measured against image pixels (the
   champagne rule came from this sweep). Two blind spots the sweep must cover explicitly,
   because both shipped defects past it: **`::before` / `::after` content** (a text-node
   walk never visits it — this is how the 1.48:1 breadcrumb dash survived), and **which
   side a border landed on** (a `border-inline-*` on the wrong side still computes to 1px,
   so only the rects show it — this is how the credentials band's stray outer rule
   survived). Ignore the closed mobile drawer when measuring overflow: `.primary` is
   `position: fixed` at `translateX(-100%)`, so it and its whole subtree report negative
   x by design. Measure overflow from `documentElement.scrollWidth` plus non-fixed
   subtrees.
