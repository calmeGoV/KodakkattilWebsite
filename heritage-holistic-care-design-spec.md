# Heritage Holistic Care — Design Specification

A complete build spec for a heritage Ayurvedic hospital site, derived from
`heritage-holistic-care.lovable.app`.

---

## 0. Provenance — read this first

Two different confidence levels are mixed in this document. They're labelled
throughout, but here's the summary:

**Verified from the live site** — page architecture, section order, component
inventory, content patterns, navigation and IA, image subjects and filenames,
copy voice, meta/SEO setup, interaction affordances (accordion, sticky header,
anchor navigation), stack.

**Reconstructed** — exact colour values, typeface names, type scale, spacing
scale, radii, shadows, motion timings. The site's compiled CSS is served from a
content-hashed bundle that I couldn't retrieve, so these are specified to fit
the brief and the observed visual direction rather than read off the source.
Every reconstructed section is marked `[RECONSTRUCTED]`.

To make the reconstructed layer exact, paste the project's `index.css` (the
`:root` token block) and `tailwind.config.ts`. Those two files carry the entire
palette, radius and font stack, and the values below can be swapped in directly.

---

## 1. Brief and positioning

| | |
|---|---|
| Subject | Ayurvedic hospital, Kerala, founded 1876 |
| Claim | 150+ years of continuous practice |
| Audience | Families — parents of young children, expectant and new mothers, women across life stages, people seeking mental health support |
| Specialities | Balachikitsa (paediatrics), maternity, women's wellness, mental well-being |
| Primary job of the page | Convert a worried family into a booked consultation |
| Emotional target | Calm, unhurried, credible, warm. Not clinical, not mystical, not spa |

The design tension worth naming: it must read as **medical enough to trust** and
**human enough to soothe**. Everything below is in service of that. Avoid both
hospital-blue sterility and wellness-brand incense-and-linen.

---

## 2. Colour system `[RECONSTRUCTED]`

Grounded in the material world of a Kerala *vaidyasala*: unbleached cotton and
palm-leaf manuscript, dark herbal *kashayam*, turmeric, copper vessels, teak.

### 2.1 Core palette — six values

| Token | Name | Hex | HSL | Role |
|---|---|---|---|---|
| `--sand` | Sandal | `#F6F2E9` | `42 42% 94%` | Page background |
| `--surface` | Paper | `#FDFBF6` | `43 64% 98%` | Cards, elevated panels |
| `--kashaya` | Kashaya | `#1D3A2C` | `151 33% 17%` | Primary. Headings, footer, solid buttons |
| `--tulsi` | Tulsi | `#35705A` | `158 36% 32%` | Secondary green. Links, icon strokes, hover fills |
| `--haldi` | Haldi | `#B8873B` | `37 51% 48%` | Accent. Rules, large numerals, badge borders |
| `--chembu` | Copper | `#8C4A2F` | `17 50% 37%` | Emergency / urgent actions only |

### 2.2 Text and line

| Token | Hex | HSL | Role |
|---|---|---|---|
| `--ink` | `#2E332D` | `110 6% 19%` | Body text |
| `--ink-muted` | `#5F665C` | `102 5% 38%` | Secondary text, captions, meta |
| `--haldi-ink` | `#8A6224` | `37 59% 34%` | Eyebrow text only — see contrast note |
| `--line` | `#E3DCCB` | `43 30% 84%` | Hairlines, card borders, dividers |
| `--line-strong` | `#CFC5AE` | `41 25% 75%` | Input borders, focus-adjacent |

### 2.3 Section tints

Used to separate alternating bands without introducing new hues.

| Token | Hex | HSL | Use |
|---|---|---|---|
| `--tint-leaf` | `#E8EFE7` | `113 20% 92%` | Philosophy / specialities band |
| `--tint-clay` | `#EBD9CF` | `21 41% 87%` | Maternity and paediatric contexts |
| `--kashaya-950` | `#16261E` | `154 27% 12%` | Footer, dark CTA band |

### 2.4 Contrast rules — non-negotiable

- **`--haldi` (`#B8873B`) fails AA against `--sand` at body sizes** (≈2.8:1). Use
  it for rules, icon strokes, borders, and numerals at 32px+ only. For eyebrow
  text use `--haldi-ink` (≈5.0:1).
- `--ink` on `--sand` ≈ 13:1. `--ink-muted` on `--sand` ≈ 5.2:1 — acceptable at
  16px+, do not go below.
- White on `--kashaya` ≈ 13:1, on `--tulsi` ≈ 5.5:1, on `--chembu` ≈ 7.4:1. All pass.
- Never place `--tulsi` text on `--tint-leaf`. It's only ~3.3:1.

### 2.5 Shadows

Warm-tinted, never neutral grey. A neutral `rgba(0,0,0,.1)` under everything is
the single fastest way to make this look like a template.

```css
--shadow-xs: 0 1px 2px rgba(29, 58, 44, 0.05);
--shadow-sm: 0 2px 6px rgba(29, 58, 44, 0.06);
--shadow-md: 0 8px 24px -8px rgba(29, 58, 44, 0.12);
--shadow-lg: 0 24px 56px -20px rgba(29, 58, 44, 0.18);
```

Shadow is for genuine elevation only — sticky header once scrolled, open
dropdowns, the image cards. Static content cards get a `--line` border instead.

---

## 3. Typography `[RECONSTRUCTED]`

### 3.1 Families

| Role | Family | Weights | Notes |
|---|---|---|---|
| Display / headings | **Fraunces** (variable) | 400, 500, 600 + italic | `opsz` and `SOFT` axes give it warmth without going decorative. Its italic is the reason to pick it — see §3.4 |
| Body / UI | **Karla** | 400, 500, 700 | Humanist, slightly quirky, sits well under a serif without competing |
| Malayalam (if bilingual) | **Manjari** or **Noto Serif Malayalam** | 400, 700 | Pair Manjari with Karla; match x-height by bumping Malayalam 4% |

Alternates if Fraunces is unavailable: **Newsreader**, then **Instrument
Serif**. Avoid Playfair Display — it's the default reach for this brief and
reads as generated.

```css
--font-display: "Fraunces", "Newsreader", Georgia, serif;
--font-body: "Karla", "Work Sans", system-ui, -apple-system, sans-serif;
```

Load only the weights listed. Subset to `latin` + `latin-ext` (+ `malayalam`
if used). Use `font-display: swap` and preload the display face — the H1 is
above the fold and a FOUT on a serif headline is very visible.

### 3.2 Scale

Base 17px, modular ratio 1.25 for text, larger jumps for display. All fluid
values clamp between 375px and 1440px viewports.

| Token | Size | Line-height | Tracking | Weight | Family |
|---|---|---|---|---|---|
| `display-xl` (H1) | `clamp(2.75rem, 1.6rem + 4.9vw, 5rem)` | 1.02 | −0.02em | 400 | display |
| `display-lg` (H2) | `clamp(2rem, 1.4rem + 2.6vw, 3.25rem)` | 1.1 | −0.015em | 400 | display |
| `display-md` (H3) | `clamp(1.5rem, 1.25rem + 1.1vw, 2rem)` | 1.18 | −0.01em | 500 | display |
| `title` (card H4) | `1.25rem` | 1.3 | −0.005em | 600 | display |
| `lead` | `clamp(1.0625rem, 1rem + 0.4vw, 1.25rem)` | 1.65 | 0 | 400 | body |
| `body` | `1.0625rem` (17px) | 1.7 | 0 | 400 | body |
| `body-sm` | `0.9375rem` | 1.6 | 0 | 400 | body |
| `eyebrow` | `0.8125rem` | 1.2 | 0.06em | 500 | body |
| `micro` | `0.75rem` | 1.4 | 0.02em | 500 | body |
| `numeral` | `clamp(2rem, 1.6rem + 1.7vw, 3rem)` | 1 | −0.02em | 400 | display |

### 3.3 Measure

- Body prose: **62–68 characters**. On the serif lead paragraph you can push to
  72. Set `max-width: 34rem` on body columns, `40rem` on the lead.
- Headings: cap at 16–20 characters per line for the H1, ~28 for H2s. Use
  `text-wrap: balance` on all headings and `text-wrap: pretty` on paragraphs.
- Give the serif lead paragraph `line-height: 1.65`; the sans body sits at 1.7
  because Karla's x-height is large.

### 3.4 The headline treatment — verified pattern

Headlines are written as **two short declarative sentences, both closed with a
full stop**, with the second sentence set in **display italic** as an accent.
The hero H1 does this; the "philosophy" H2 does the same thing across a line
break.

```
Sentence one.  <em>Sentence two.</em>
```

Rules for it:
- The italic span is a **full clause**, never a single highlighted word.
- Italic at the same size and colour as the roman — the contrast is the italic
  itself, not a colour change.
- Add `padding-right: 0.08em` to the italic span so the terminal doesn't clip.
- Optionally set the italic in `--tulsi` rather than `--kashaya` at H2 sizes.
  Do not do both italic and colour and weight.

### 3.5 Other verified type patterns

- **Every section carries an eyebrow** above its heading — a 2–4 word phrase in
  sentence case. Site examples: "A tradition of healing", "Our specialities",
  "Why choose us", "Patient journey", "Common questions".
- **Sentence case everywhere.** No ALL CAPS labels anywhere on the page,
  including the eyebrow. Keep it that way; tracked-out caps would undo the
  heritage feel.
- **Middle-dot meta strings** (`A · B · C`) in the announcement bar, doctor
  credential lines, and footer hours.
- **Two-digit ordinals** (`01`–`04`) on the specialities grid and the
  trust list; **single digits** (`1`–`4`) on the patient-journey steps.

---

## 4. Layout and spacing `[RECONSTRUCTED]`

### 4.1 Grid

```
--container:      1200px
--container-prose: 720px
--gutter-sm:      20px   (< 640px)
--gutter-md:      32px   (640–1024px)
--gutter-lg:      48px   (> 1024px)
columns:          12, gap 24px desktop / 16px tablet / stacked mobile
```

### 4.2 Spacing scale

4px base, geometric-ish. Only these values — no arbitrary numbers.

`2 · 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 128 · 160`

### 4.3 Section rhythm

| Viewport | Section padding-block | Header→first-element gap |
|---|---|---|
| Mobile | 64px | 24px |
| Tablet | 88px | 32px |
| Desktop | 128px | 40px |

Bands alternate `--sand` → `--surface` → `--tint-leaf` → `--sand`. Never two
tinted bands in a row. The footer and the final CTA are the only dark bands.

### 4.4 Radii

Deliberately **not** one radius on everything — the radius encodes what kind of
thing it is.

```css
--radius-pill:   999px;  /* badges, pills, primary buttons */
--radius-card:   14px;   /* content cards, doctor cards */
--radius-media:  20px;   /* images */
--radius-input:  8px;    /* form fields, accordion triggers */
--radius-hair:   4px;    /* small chips, numerals in boxes */
```

**Signature move — the arch.** Kerala temple and *vaidyasala* doorways are
arched. Mask the two feature images with a top arch instead of a plain rounded
rectangle:

```css
border-radius: 999px 999px var(--radius-media) var(--radius-media);
/* or, for a shallower arch: 40% 40% var(--radius-media) var(--radius-media) / 22% 22% 0 0 */
```

Use it on exactly the two hero/philosophy images and nowhere else. This is the
one place to spend boldness.

### 4.5 Breakpoints

`480 · 640 · 768 · 1024 · 1280 · 1440`

- Specialities grid: 1 col → 2 col at 640 → 4 col at 1024
- Hero: stacked (image above copy) → side-by-side 6/6 at 1024
- Doctors: 1 col → 2 col at 768
- Footer: 1 col → 2 col at 640 → 4 col at 1024
- Stat row: horizontal 3-up at every breakpoint, shrinking numerals

---

## 5. Page architecture — verified

Single page, anchor-navigated. Section IDs: `#home`, `#legacy`, `#specialities`,
`#philosophy`, `#treatments`, `#doctors`, `#appointment`, `#contact`.

```
┌────────────────────────────────────────────────────────┐
│ ANNOUNCEMENT BAR   meta · meta · meta        [link →]  │  dark, 40px
├────────────────────────────────────────────────────────┤
│ [mark] Name          nav nav nav nav nav   [ghost][cta]│  sticky, 72–80px
│        tagline                                          │
└────────────────────────────────────────────────────────┘

  HERO ─────────────────────────────────────────────────
   ┌──────────────────┐   ( badge )
   │                  │   H1 sentence.
   │   arched image   │   H1 italic sentence.
   │                  │   lead paragraph
   └──────────────────┘   [ Book ] [ Emergency ]
   ─────────────────────────────────────────────────────
     150+          │     4          │    1:1
     label         │     label      │    label
  ───────────────────────────────────────────────────────

  LEGACY        eyebrow / H2 / 2 paragraphs / text link
  SPECIALITIES  eyebrow / H2 / lead / 4-card grid (01–04)
  PHILOSOPHY    arched image  |  eyebrow / H2 / para / 4 checks
  TRUST         eyebrow / H2 / lead / 4 numbered rows
  DOCTORS       eyebrow / H2 / 2 profile cards
  TESTIMONIAL   H2 / single pull-quote / attribution
  JOURNEY       eyebrow / H2 / 4 numbered steps
  FAQ           eyebrow / H2 / accordion, first item open
  CTA BAND      eyebrow / H2 / [ Book ] [ Call ]
  FOOTER        brand + blurb | Explore | Contact | legal bar
```

### 5.1 Section-by-section notes

**Announcement bar.** Full-width, `--kashaya-950`, 13px, centred meta string on
the left/centre and a single anchor link to contact on the right. Collapses to
the meta string only below 640px. Dismissible is optional — if you add it, use
`sessionStorage`, not `localStorage`.

**Header.** Two-line brand lockup (name in display 600, tagline in `micro`
`--ink-muted`) linking to `#home`. Five nav anchors. Two CTAs: a ghost/outline
"Emergency" wired to `tel:` and a solid primary "Book appointment" to
`#appointment`. Starts transparent over the hero, transitions to
`--surface` + `--shadow-sm` + a `--line` bottom border after 24px scroll.
Mobile: hamburger → full-height sheet, CTAs pinned to the bottom of the sheet.

**Hero.** Badge pill above the H1 stating the founding year. Two buttons. Below
them, a 3-up stat row separated by 1px `--line` verticals — numerals in display
serif `--kashaya`, labels in `body-sm` `--ink-muted`.

**Specialities.** Four cards. Each card: two-digit numeral in `--haldi` display
serif, a kicker line in `--ink-muted` naming the domain, an H4 title, a 2-line
description, and a text link to `#treatments`. Card is `--surface` with a
`--line` border, no shadow at rest.

**Philosophy.** Image left, content right at ≥1024. Four short check items in a
2×2 grid, each with a `Check` icon in a `--tint-leaf` circle.

**Trust.** Four rows, numbered `01`–`04`, each a single line of claim text.
Separated by `--line` rules rather than boxed as cards — it's a list, not a set
of objects.

**Doctors.** Two cards. Name in `display-md`, credential line in `body-sm`
`--ink-muted` with a middle-dot separator, then a 2–3 line bio. If portraits are
added, use a 1:1 arch-masked crop at 96px, top-left of the card.

**Testimonial.** One quote only. Display serif, `display-md`, curly quotes,
attribution on its own line prefixed with an em dash. No card, no avatar, no
star rating — a single quiet quote reads more credible than a carousel.

**Journey.** Four steps, `1`–`4`, horizontal on desktop with a connecting
1px `--haldi` rule running behind the numerals; stacked vertically on mobile
with the rule running down the left.

**FAQ.** Accordion, single-open. First item expanded on load. Trigger is
`title` size, left-aligned, with a `Plus`/`Minus` or rotating `ChevronDown` on
the right. Answers in `body` at `--ink-muted`.

**CTA band.** `--kashaya-950`. Primary button inverts to `--sand` background
with `--kashaya` text; secondary is an outline in `--sand`.

**Footer.** Four columns. Brand lockup + 2-line blurb, then "Explore" links,
then "Contact" with icon-prefixed rows (location, phone, email, hours). Bottom
bar: copyright left, `Privacy · Terms · Careers` right, separated by a
`--line` rule at 12% opacity.

---

## 6. Components

### 6.1 Buttons

| Variant | Fill | Text | Border | Radius | Use |
|---|---|---|---|---|---|
| Primary | `--kashaya` | `--sand` | none | pill | Book appointment |
| Primary-invert | `--sand` | `--kashaya` | none | pill | On dark bands |
| Secondary | transparent | `--kashaya` | 1px `--kashaya` | pill | Emergency, secondary CTA |
| Ghost | transparent | `--ink` | none | pill | Header nav actions |
| Link | — | `--tulsi` | — | — | In-card "learn more" |

```
height:        44px (md) / 52px (lg, hero only) / 36px (sm)
padding-inline: 24px (md) / 32px (lg)
font:          body, 500, 0.9375rem
gap to icon:   8px
```

States:
- Hover — primary darkens to `#16301F`, lifts 1px (`translateY(-1px)`), gains
  `--shadow-sm`. Secondary fills with `--kashaya` at 6% alpha.
- Active — returns to `translateY(0)`, no shadow.
- Focus-visible — `outline: 2px solid var(--tulsi); outline-offset: 3px`. Never
  remove the outline. Same ring on every interactive element on the page.
- Disabled — 45% opacity, `cursor: not-allowed`, no hover transform.

**Do not append `→` to button labels.** A visible arrow glyph inside button
text is the strongest template tell on this kind of page. Arrows are fine on
inline text links, where they animate 3px right on hover.

### 6.2 Badge / pill

`--surface` fill, 1px `--haldi` border at 45% alpha, `--haldi-ink` text,
`micro` size, `12px` inline padding, `28px` height, pill radius. Optional 6px
dot in `--haldi` before the label.

### 6.3 Eyebrow

`eyebrow` token, `--haldi-ink`, sentence case, preceded by a 24px × 1px
`--haldi` rule with 12px gap. Margin-bottom 12px.

### 6.4 Card

```css
background: var(--surface);
border: 1px solid var(--line);
border-radius: var(--radius-card);
padding: 28px;       /* 24px below 640px */
transition: border-color 200ms, transform 200ms, box-shadow 200ms;
```

Hover: `border-color: var(--haldi)` at 50%, `transform: translateY(-2px)`,
`box-shadow: var(--shadow-md)`. Apply hover lift to the specialities cards
**only** — not to the trust rows, journey steps, or doctor cards. Lifting every
card on the page is the generic default.

### 6.5 Accordion

Trigger 20px vertical padding, `--line` bottom border, `title` type. Icon
rotates 180° over 200ms. Content animates height with
`grid-template-rows: 0fr → 1fr` (smoother than `max-height`). Content padding-
bottom 20px, `--ink-muted`.

### 6.6 Stat block

Numeral `numeral` token in display serif `--kashaya`; label `body-sm`
`--ink-muted` directly beneath with 6px gap. Dividers are 1px × 40px `--line`
verticals, hidden below 640px in favour of 24px gaps.

---

## 7. Icons — verified stack, specified usage

The site is a Lovable/Vite/React build, so the icon set is **lucide-react**.

```
stroke-width: 1.5      (1.25 at 32px+, 1.75 at 16px)
sizes:        16 / 20 / 24 / 32
colour:       --tulsi in content, --haldi on dark bands, currentColor in buttons
corners:      round caps and joins (lucide default — keep it)
```

Suggested mapping:

| Context | Icon |
|---|---|
| Paediatric care | `Baby` |
| Maternity care | `HeartHandshake` |
| Women's wellness | `Flower2` |
| Mental well-being | `BrainCog` (or `Sparkles` if too technical) |
| Philosophy checklist | `Check` in a `--tint-leaf` 28px circle |
| Location / phone / email / hours | `MapPin` `Phone` `Mail` `Clock` |
| Book appointment | `CalendarCheck` |
| Emergency | `PhoneCall` in `--chembu` |
| FAQ trigger | `ChevronDown` or `Plus`/`Minus` |
| Mobile menu | `Menu` / `X` |
| Inline link | `ArrowRight`, 16px, animates 3px right on hover |

**Differentiation note:** lucide across the whole page is what makes AI-built
sites recognisable to each other. If you want this to feel authored, commission
or draw ~8 custom line icons on lucide's grid (24px, 1.5px stroke, round caps)
from the actual vocabulary: *ulakka* mortar and pestle, *nilavilakku* lamp,
tulsi sprig, copper *kindi*, banana leaf, palm-leaf manuscript, *kizhi* poultice
bundle, mortar-and-herb. Keep lucide for the purely functional UI icons
(chevrons, close, menu) so the custom set stays meaningful.

---

## 8. Imagery — verified subjects, specified treatment

Two photographs on the page, both real and specific:

1. `mother-child-hero.jpg` — a mother holding her baby in a calm consultation
   room. Hero, right/left column.
2. `ayurvedic-care.jpg` — a practitioner preparing a traditional therapy.
   Philosophy section.

### Direction

- **Documentary, not stock.** Subjects mid-action and looking at each other or
  at their work — never a direct-to-camera arms-folded portrait.
- **Warm natural light**, ideally window light with visible falloff. No flash,
  no ring light, no blue-white clinical fluorescents.
- **Shallow depth of field** at f/2–f/2.8; background readable but soft.
- **Real environment.** Wood, terracotta floor, brass and copper vessels, plain
  cotton, green plants. Avoid staged spa props: no stacked river stones, no
  floating flowers, no folded towels, no incense smoke.
- **Grade:** lift shadows slightly warm, pull highlights back, keep greens
  natural rather than pushed. Target the palette — the photos and the UI should
  share the same temperature.
- **Skin tone accuracy matters more than the grade.** Kerala skin tones go
  orange fast under a warm grade; protect them with a hue-vs-hue correction.

### Technical

| | |
|---|---|
| Hero ratio | 4:5 portrait (side-by-side) / 16:10 (stacked mobile) |
| Philosophy ratio | 4:5 portrait |
| Mask | Arch — see §4.4 |
| Format | AVIF with WebP fallback, `<picture>` with 3 widths (640/1024/1600) |
| Hero loading | `fetchpriority="high"`, `loading="eager"`, preloaded |
| Below-fold | `loading="lazy"`, `decoding="async"` |
| Placeholder | Solid `--tint-leaf`, not a blur-up — blur-up on a face is unpleasant |
| Alt text | Describe the care being given, not the composition. The site does this well: subject, action, setting |

Add a subtle inner border on images: `box-shadow: inset 0 0 0 1px rgba(29,58,44,.08)` — keeps them from floating off a light background.

---

## 9. Motion `[RECONSTRUCTED]`

```css
--ease-out:   cubic-bezier(0.16, 1, 0.3, 1);
--ease-inout: cubic-bezier(0.65, 0, 0.35, 1);
--dur-fast:   150ms;   /* hover, focus, colour */
--dur-base:   250ms;   /* accordion, card lift */
--dur-slow:   600ms;   /* hero reveal only */
```

**One orchestrated moment, then quiet.** The hero gets a single staged reveal on
load — badge, H1, lead, buttons, stat row, each offset 70ms, fading in and
rising 12px over 600ms. Nothing else on the page animates on scroll.

Scroll-triggered fade-and-slide on every section is the default and it reads as
generated. If you want scroll motion, spend it in exactly one place — a
parallax of 6–8% on the philosophy image, or the journey rule drawing itself
left-to-right once. Not both.

Interaction motion is always welcome: accordion height, button hover, mobile
sheet slide, focus rings.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Also set `scroll-behavior: smooth` on `html` and
`scroll-margin-top: 96px` on every anchored section so the sticky header
doesn't cover the heading.

---

## 10. Accessibility floor

- Contrast per §2.4. Test the haldi accents specifically — they're the failure point.
- Visible focus ring on every interactive element, 2px `--tulsi`, 3px offset.
- Tap targets ≥44×44px, including footer links and the FAQ triggers.
- Accordion: `<button aria-expanded aria-controls>` inside a heading element;
  panel gets `role="region"` and `aria-labelledby`.
- Mobile menu: focus trap, `Esc` to close, `aria-modal`, return focus to the
  trigger.
- Skip link to `#main`, visible on focus.
- Landmarks: `header`, `nav`, `main`, `section` with `aria-labelledby` pointing
  at each section heading, `footer`.
- Heading order: one `h1`, then `h2` per section, `h3` inside cards. The eyebrow
  is a `<p>` or `<span>`, never a heading.
- `tel:` and `mailto:` links get descriptive `aria-label` (not just the number).
- Reduced motion respected as above.

---

## 11. Content and voice — verified

The copy is doing real work here and it's worth matching.

- **Short declarative headlines closed with a full stop.** Not questions, not
  gerunds, not "Your journey to wellness".
- **Sentence case throughout.**
- **British/Indian spelling** — "specialities", "personalised", "programme",
  "centred". Keep it consistent.
- **Sanskrit terms used plainly and immediately glossed**: *Balachikitsa* sits
  next to "Paediatric Care"; *Prakriti* appears in a sentence that explains it
  by context. Never a glossary, never italicised-and-unexplained.
- **Named conditions, not vibes** — PCOS, fertility, hormonal balance,
  menstrual health, menopause, postpartum. This is what makes it read as a
  hospital rather than a wellness brand, and it's the most important copy
  decision on the page.
- **No superlatives, no urgency, no counts of happy patients.** One patient
  quote, unattributed beyond "a patient family". That restraint is deliberate
  and it earns trust.
- CTAs say what happens: "Book appointment", "Call now". Not "Get started".

### Meta pattern

```
title:       <claim> — e.g. 150 Years of Holistic Ayurvedic Care
description: specialities + heritage claim, ~150 chars
og:title / og:description: a warmer, shorter variant than the SEO pair
og:image:    1200×630, hero photo + wordmark
twitter:card: summary_large_image
```

Add `LocalBusiness` / `MedicalClinic` JSON-LD with address, `openingHours`,
`telephone`, and a `Physician` entry per doctor. The current site doesn't have
it and it matters a lot for a hospital in local search.

---

## 12. Stack and build notes

The reference is **Vite + React + TypeScript + Tailwind + shadcn/ui**, deployed
on Lovable. For a production rebuild on Next.js 15 + Tailwind v4 + shadcn:

- Tokens go in `app/globals.css` under `@theme` (Tailwind v4 syntax), not
  `tailwind.config.ts`.
- shadcn components in play: `Button`, `Badge`, `Accordion`, `Card`,
  `Separator`, `Sheet` (mobile nav). Everything else is plain markup — resist
  wrapping the trust list or journey steps in `Card`.
- `next/font/google` for Fraunces and Karla with `display: 'swap'` and
  `variable` output; wire the CSS variables to `--font-display` / `--font-body`.
- `next/image` for both photographs with explicit `sizes`.
- Framer Motion only for the hero sequence and the mobile sheet. The accordion
  should use CSS grid-rows, not JS.
- Remove the Lovable badge and the `tel:+910000000000` / `example.com`
  placeholders before anything ships.

### Token block to paste

```css
:root {
  --sand: #F6F2E9;
  --surface: #FDFBF6;
  --kashaya: #1D3A2C;
  --kashaya-950: #16261E;
  --tulsi: #35705A;
  --haldi: #B8873B;
  --haldi-ink: #8A6224;
  --chembu: #8C4A2F;
  --ink: #2E332D;
  --ink-muted: #5F665C;
  --line: #E3DCCB;
  --line-strong: #CFC5AE;
  --tint-leaf: #E8EFE7;
  --tint-clay: #EBD9CF;

  --radius-pill: 999px;
  --radius-media: 20px;
  --radius-card: 14px;
  --radius-input: 8px;
  --radius-hair: 4px;

  --shadow-xs: 0 1px 2px rgba(29,58,44,.05);
  --shadow-sm: 0 2px 6px rgba(29,58,44,.06);
  --shadow-md: 0 8px 24px -8px rgba(29,58,44,.12);
  --shadow-lg: 0 24px 56px -20px rgba(29,58,44,.18);

  --ease-out: cubic-bezier(.16,1,.3,1);
  --dur-fast: 150ms;
  --dur-base: 250ms;
  --dur-slow: 600ms;
}
```

---

## 13. If you want it to *not* look AI-generated

The reference page uses several patterns that currently cluster in generated
design. They're all legitimate choices, but using all of them together is the
tell. If differentiation matters, change two or three of these:

1. **An eyebrow above every single heading.** Keep them on three sections where
   they orient the reader; drop them elsewhere.
2. **`01`–`04` numerals on the specialities grid.** Four specialities are a
   *set*, not a sequence — numbering implies an order that doesn't exist. Keep
   the numerals on the patient journey, which genuinely is sequential, and
   replace them on the specialities with the custom icons from §7.
3. **Middle-dot meta strings** in three separate places. Once is a style; three
   times is a template.
4. **Identical rounded cards** for specialities, doctors and trust items. Give
   each a different structure — the trust list as ruled rows, the doctors as
   image-led profiles, only the specialities as cards.
5. **Warm cream + serif + earthy accent** is currently the single most common
   generated palette. The turmeric/copper split and the arch mask in §4.4 are
   the two moves that pull this specific version away from it — lean on them.
6. **A single accented word or phrase in the headline.** The site does this
   correctly (a full italic clause, not one word) — keep it that way.

The strongest differentiator available for this brief isn't a colour or a font.
It's the **150-year timeline** — a real ancestral lineage rendered as a
scroll-driven sequence of generations, dates and photographs. That's content no
other clinic has, and no generated layout will arrive at it by default.

---

*Sections marked `[RECONSTRUCTED]` are specified rather than read from source.
Supply `index.css` and `tailwind.config.ts` to make them exact.*
