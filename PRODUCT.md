# PRODUCT.md — עו״ד פנחס רצון

## What this is
Marketing/authority site for Adv. Pinchas Ratzon — solo practitioner, Petah Tikva.
Real-estate transactions, real-estate taxation, condominium registration, wills/inheritance/estates,
enduring power of attorney, receivership. Admitted 2011 (years of experience are DERIVED from that,
never hardcoded). Phone 054-2221155, email Ratzon@gmail.com, address האר״י הקדוש 20, פתח תקווה
(published at the client's instruction). Hebrew-only, RTL. Implementation: zero-dependency static
build in `site/` (`node build.mjs` / `check.mjs` / `serve.mjs`), machine-verified gates in `site/gates/`.

## Audience & job (Persuade)
Private individuals in Gush Dan before/inside a real-estate transaction, an inheritance, or an
aging-planning decision. The site must convince through substance first; the ask comes at the end
of the reading. Client's standing rule (Liron, 2026-08-25): "תהיה פחות נואש שיחזרו אליך —
קודם כל הלקוח משתכנע, ורק לאחר מכן הוא יתקשר." Enforced by `gates/verify-restraint.mjs`
(no floating call buttons, no hero form, no trust strips, no vanity numbers, ≤2 CTA buttons/page).

## Brand commitment (recorded 2026-08-26)
The client chose the **category standard in plain words**: "אני לא צריך ייחודי — תסתכל איך אחרים
בישראל עושים את זה ותעתיק מהם, ותעשה יותר טוב." The commitment is therefore the Israeli
premium-lawyer canon, played straight, at the craft ceiling of the vertical:
**mazeh.co.il is the quality bar** (measured 2026-08-25: black + gold #BA923E + white, all-Heebo,
body 20px/weight 300/line-height 2.0, short one-idea bands alternating full-bleed dark/light,
cinematic environmental photography, wordless full-viewport photo pauses).
"Better" means their look without their defects: one H1 per page, real schema, tiny CSS,
AA contrast everywhere, honest facts only. The restraint gates are NOT part of the old look —
they encode the client's pressure rule and survive every redesign.

## Uninventable facts (never fabricate)
Testimonials, transaction counts, office hours, geo coordinates, physical-accessibility details
(marked `[ להשלמה על ידי הלקוח ]`), social profiles, logo. `SITE_URL` must be set to the real
domain before deploy.
