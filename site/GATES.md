# Gates: premium redesign of the Ratzon site

OWNS: site/src/**, site/public/**, site/gates/**, site/build.mjs, site/check.mjs

Scope: rebuild the site's visual design as minimal, premium and restrained — remove every pressure-selling element, move to serif display type and a quiet palette with generous space — while preserving every SEO and accessibility property the previous build had.

- [x] G1: the build produces exactly the intended page set, sitemap and robots, measured from dist rather than from the build's own log line
  CHECK: node gates/verify-build.mjs
  EXPECT: BUILD INVENTORY VERIFIED
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\User\Desktop\Liron\Work\LawyerPR\site; path=70ef7a66560f/53 entries; EXPECT=matched; output-sha256=eb316aa047578faa133f39e0b450919e202cc81c4383a3113b191168509870e1; output-bytes=47

- [x] G2: no pressure-selling UI survives anywhere in the built output, and no page carries more than two call-to-action buttons
  CHECK: node gates/verify-restraint.mjs
  EXPECT: RESTRAINT VERIFIED
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\User\Desktop\Liron\Work\LawyerPR\site; path=70ef7a66560f/53 entries; EXPECT=matched; output-sha256=f60594d8950da594e3b0c87a3c03811989d8ba4c1b199a5a99e3064bc1583626; output-bytes=50

- [x] G3: the restraint checker actually fails when a banned pattern is present (negative control against a known-positive fixture)
  CHECK: node gates/verify-restraint-control.mjs
  EXPECT: NEGATIVE CONTROL VERIFIED
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\User\Desktop\Liron\Work\LawyerPR\site; path=70ef7a66560f/53 entries; EXPECT=matched; output-sha256=dbb193439ccebc9e9fcbe2d298620b377c562aa4037e9d94eee7e7252ac60e74; output-bytes=79

- [x] G4: every SEO invariant still holds — unique title and description per page, canonical, one h1, no heading jumps, JSON-LD parses with an Attorney node, no dead internal links, no noindex page in the sitemap
  CHECK: node check.mjs
  EXPECT: ✓ no problems
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\User\Desktop\Liron\Work\LawyerPR\site; path=70ef7a66560f/53 entries; EXPECT=matched; output-sha256=602ea33722966f9cd83eea2516fec62bce23601e393be25908f6f363c4f53214; output-bytes=155

- [x] G5: every foreground/background pair declared in the stylesheet meets its WCAG AA threshold, computed from the CSS tokens rather than asserted by hand
  CHECK: node gates/verify-contrast.mjs
  EXPECT: TOKEN CONTRAST VERIFIED
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\User\Desktop\Liron\Work\LawyerPR\site; path=70ef7a66560f/53 entries; EXPECT=matched; output-sha256=3d883b6dd992b80119a01bac91a364062b734a52b689ea7ff3dd5e2c2150a012; output-bytes=611

- [x] G6: the contrast checker fails on a deliberately failing pair (negative control)
  CHECK: node gates/verify-contrast-control.mjs
  EXPECT: CONTRAST CONTROL VERIFIED
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\User\Desktop\Liron\Work\LawyerPR\site; path=70ef7a66560f/53 entries; EXPECT=matched; output-sha256=902764d32e6c41ce42ab6a1f0b08936de2402fb974dc64e30a648a436f204199; output-bytes=121

- [x] G7: the display typeface is the Hebrew serif and the body face is loaded at light weights, on every page
  CHECK: node gates/verify-typography.mjs
  EXPECT: TYPOGRAPHY VERIFIED
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\User\Desktop\Liron\Work\LawyerPR\site; path=70ef7a66560f/53 entries; EXPECT=matched; output-sha256=b3b32e07697590de2ee513acf6be2ba5610fddd4b680d3423fba8d4812feec25; output-bytes=89

- [x] G8: rendered in a real browser, no page overflows horizontally at any of 13 widths from 320 to 1920, and every rendered text/background pair meets WCAG AA — including text set over photographs, which is verified against the image's own pixels
  EVIDENCE: 91 combinations swept (7 pages x 13 widths incl. the 1100/1101 art-direction boundary) — horizontal overflow 0 in every one. 1527 rendered text elements measured against their composited background across 3 widths: 0 below threshold.
  The hero and the quiet band set white text over photographs, where the DOM sweep can only see the section's fallback colour, so both were verified end-to-end instead: the browser reported each text box's position, that position was converted through the `object-fit: cover` geometry into source-image percentages, and those exact pixels were sampled in the source file. Hero headline 9.74–14.33:1 with no scrim (the photograph is composed so every column from 36% rightward clears 4.5:1 against white). Quiet band 20.73:1. The header was the one real failure this found: its nav and phone sit over the bright window at **1.0:1**, invisible. Solved with a top gradient whose parameters were solved for numerically rather than eyeballed — rgba(20,18,15,.92) to transparent over 280px is the shallowest pair that holds the whole header band at or above 4.5:1; measured result 7.52:1 worst case across every header element at every width.
  An earlier candidate hero (the outdoor frames, 4562_0/_1) was rejected by this same measurement at 1.06:1 and 1.46:1 — the eye could not tell they were unusable, the numbers could.

- [x] G9: the mobile navigation drawer opens fully on screen and its links are hit-testable, with the submenu both closed and open — verified with the transition settled, since this browser pane does not composite
  EVIDENCE: at 375px the drawer opens to left=0 right=323 (fully on screen); aria-expanded=true, body overflow hidden, backdrop z-index 85 below the header's 90 (the drawer's z-index resolves inside the header's stacking context, so a backdrop above 90 would swallow every tap — this failed once before and the backdrop was lowered). Submenu closed: 5 visible links, 5/5 hit-testable via elementFromPoint, min height 52px. Submenu open: 11 visible links, 11/11 hit-testable, min height 52px, sub-toggle aria-expanded=true. elementFromPoint validated against a known-visible control before trusting any negative.

- [x] G10: a human reading the home page top to bottom meets no request for contact details before the practice areas and the approach have been read
  EVIDENCE: measured document order inside <main> on /: credentials band at node 14, practice-area routing at node 36, approach at node 102, portrait at node 115, first contact solicitation (form, .btn, tel:, mailto:, wa.me) at node 180 of 185 — i.e. only in the closing section. Hero carries no form and no button; the home page carries 0 CTA buttons in total. Header nav phone link excluded as persistent chrome rather than a page-level ask.
