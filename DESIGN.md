# Design Plan — Kodakkattil Ayurveda

> **Naming note:** the source document never states the hospital's name. I have used
> **Kodakkattil** (from the project directory) as the working brand name. The formal legal
> name, address, phone numbers and registration details are `TODO_` placeholders in
> `content/site.json`.

---

## 1. The problem, stated honestly

A worried mother at 11pm, on a phone, with two bars of signal, is the reader. She is not
browsing. She is trying to answer one question: *are these real people who have actually
done this before, and can I get to them?*

Everything below is judged against that. Beauty that delays the answer is a bug.

Corollary: the heritage claim is the whole product. "150 years" as a number in a stat band
is a marketing claim — every competitor has one. **150 years you can scroll through,
generation by generation, with faces and dates and objects, is evidence.** That is where
the boldness goes.

---

## 2. Palette

Grounded in a vaidyasala interior, not a spa: unbleached mundu cotton, dark teak, oxidised
brass vessels, neem and palm, turmeric stain, oil-lamp light.

| Token | Hex | Role |
|---|---|---|
| `--surface` | `#EEEFE7` | Page ground. Unbleached khadi. Hue ~75° — **green-cast, not yellow-cast** |
| `--surface-raised` | `#F6F6F1` | Cards, sheets |
| `--surface-sunken` | `#E3E5DA` | Inset wells, image mattes |
| `--ink` | `#131A15` | Body text. Very dark warm green-black |
| `--ink-muted` | `#4A554C` | Secondary text (7.1:1 on surface) |
| `--ink-faint` | `#6E7A70` | Captions, meta (4.6:1 on surface) |
| `--primary` | `#1C4131` | **Anchor.** Deep palm green |
| `--primary-deep` | `#10261D` | Footer, lineage ground |
| `--primary-mid` | `#2E6B51` | Hover, links |
| `--primary-tint` | `#DCE5DF` | Quiet fills, tags |
| `--accent` | `#B08C4F` | **Aged brass.** Rules, numerals, the lineage cord, active states |
| `--accent-ink` | `#7E5F28` | Brass *as text* — the only brass allowed at body size (4.8:1) |
| `--accent-glow` | `#D8BC85` | Brass on dark grounds only |
| `--warm` | `#C8871B` | **Turmeric. Reserved for exactly one thing → below** |

### The one-thing rule for `--warm`

Turmeric means **"you may act here."** It appears on primary action affordances and nowhere
else — never as a heading colour, a border, a highlight, an icon tint, or a section
background. In practice: the Book-a-consultation button, the sticky mobile call/WhatsApp
bar, and form submits. If turmeric appears anywhere a tap does not book or call a human,
it is a bug.

Turmeric buttons carry `--ink` text, not white (8.1:1 — and ink-on-ochre reads like a
lacquered signboard, where white-on-ochre reads like a cookie banner).

### Accessibility baked into the palette

- Brass `#B08C4F` is **decorative only** — 2.9:1 on surface. Brass text always uses
  `--accent-ink`. Enforced by only exposing `text-accent-ink` as a text utility.
- Dark bands use `--primary-deep` with `--surface` text (14.9:1) and `--accent-glow` for
  numerals (7.3:1).

### Deliberately not chosen

`#F4F1EA` cream + `#D97757` terracotta is the house style of every AI-generated wellness
site of the last two years. Our ground is **green-cast** (75° vs 43°) and reads cooler and
more linen-like; our warm accent is **ochre/turmeric** (42° hue, high chroma, low
lightness) rather than terracotta's soft orange-red (18°). Side by side they are not
confusable.

---

## 3. Typography

| Role | Face | Why |
|---|---|---|
| Display | **Fraunces** (variable, `SOFT 20`, `WONK 0`) | Warm, slightly calligraphic terminals; a real optical-size axis. Not a costume face, not Playfair. Wonk explicitly disabled — the quirky version is a different, worse font |
| Body / UI | **IBM Plex Sans** | Institutional warmth, tall x-height, unmistakable `a` and `g`. Reads as a well-run hospital, not a startup |
| Malayalam | **Noto Sans Malayalam** | Stacked as fallback on the body face so `ml` strings render correctly the day they land |

Fraunces is **not** set at the huge airy sizes that mark the template look. It is tight,
dark and reasonably heavy — closer to a letterpress title page than a fashion editorial.
Small-caps labels are IBM Plex Sans, `0.14em` tracked, in `--accent-ink`.

**Type scale** — fluid, base 17px (this audience reads on phones, often tired):

```
--text-2xs   0.6875rem / 1.45      labels
--text-xs    0.8125rem / 1.5
--text-sm    0.9375rem / 1.6
--text-base  1.0625rem / 1.65      body
--text-lg    1.1875rem / 1.6
--text-xl    clamp(1.30rem, 1.10rem + 0.9vw, 1.55rem)
--text-2xl   clamp(1.60rem, 1.30rem + 1.4vw, 2.05rem)
--text-3xl   clamp(1.95rem, 1.50rem + 2.1vw, 2.70rem)
--text-4xl   clamp(2.35rem, 1.70rem + 3.1vw, 3.60rem)
--text-5xl   clamp(2.80rem, 1.90rem + 4.4vw, 4.75rem)
```

No layout shift on font load: both faces via `next/font` with `display: swap` and
size-adjusted fallback metrics; `font-variant-numeric: tabular-nums` on every counter so
digits do not reflow mid-animation.

---

## 4. Layout concept — *thaliyola*

A **thaliyola** is a palm-leaf manuscript: long narrow leaves, written the wide way,
stacked and bound through a hole with a cord. It is the physical object in which this
family's knowledge would actually have been kept.

That gives the page its structure — as a system, not a texture:

- The page is a **stack of horizontal bands**, each a "leaf," separated by a **1px brass
  hairline at full bleed.** No section floats in whitespace; each one is bound.
- Bands alternate `--surface` / `--surface-raised` / occasional full `--primary-deep`.
- Content sits on a 12-column grid with a **persistent asymmetry** — the default split is
  7/5, never 6/6. Headings hang into the left margin. This single decision does more
  anti-template work than any amount of ornament.
- **Radii are 2px.** Not `rounded-2xl`. Hard, printed edges. Only avatar masks are round.
- **No soft grey drop shadows.** Depth is hairline borders plus a 1px warm offset on hover.
- One **grain overlay** (inline SVG `feTurbulence`, 3%, `mix-blend-multiply`) on heritage
  sections only — enough to feel like paper, not enough to cost a Lighthouse point.
- Archival imagery gets a **duotone in brand colours** (`--primary-deep` → `--accent-glow`)
  rather than a sepia filter. Sepia is a costume; a two-colour separation looks printed.

---

## 5. Signature element — The Ancestral Line

Keeping your suggestion, sharpened by the thaliyola idea, because the justification is
strong: heritage is the only claim on this site a competitor cannot copy in an afternoon,
and right now it is a sentence where it should be an object.

**On the home page** — the lineage is a horizontally-scrolling manuscript that *unrolls.*

- Ground `--primary-deep`, grain overlay, everything else brass and bone.
- A **brass cord** runs the full width at a fixed vertical position — the binding cord of
  the manuscript. Drawn unlit (`--accent` at 18%) and **filling solid brass left-to-right
  in proportion to horizontal scroll progress.** That is the one orchestrated moment.
- Each generation is a **leaf**: a tall panel with the era in tracked brass caps, the name
  in Fraunces, a one-line title, 2–3 sentences of contribution, and a duotoned archival
  image with a letterpress-feeling caption (`artifact`).
- Generation markers are **brass discs on the cord**, filled once passed. The current
  generation's disc is turmeric — the only place turmeric appears outside an action, and
  the exception earns itself: it marks the living generation, the one you can actually
  book. *(A deliberate, documented exception to the one-thing rule, used exactly once.)*
- Driven by **native horizontal scroll** (`overflow-x` + scroll-snap), not a scroll-jacked
  pinned section. Native scroll stays usable with a trackpad, a keyboard, a screen reader
  and a slow phone. Framer Motion `useScroll` maps container progress to cord fill. Arrow
  keys and visible focus move leaf to leaf.
- Ends on a present-generation leaf linking into `/about/legacy`.
- `prefers-reduced-motion`: cord renders fully lit immediately, snap off, reveals
  opacity-only.

**On `/about/legacy`** — same data, vertical, at full depth: each generation a proper
section with portrait, era, what they were known for, archival image with caption, and a
pull-quote or classical verse where one genuinely exists. Plus a **"What Was Preserved"**
thread — manuscripts, formulations, training — running alongside as a second, quieter
column.

**Integrity:** there are no real names or dates yet. `content/legacy.json` ships five
generations all flagged `"placeholder": true`, and every placeholder renders a loud
dev-only badge. Real names, dates and scans drop into the JSON with no component changes.

---

## 6. Motion

Restrained, and all of it opt-out.

- Section entry: 16px rise + fade, 480ms, `cubic-bezier(.22,.61,.36,1)`, `once: true`.
- The orchestrated moment: the brass cord fill on the lineage.
- Count-up on the ledger band: 1400ms ease-out, tabular figures, starts on intersection.
- Cards: 2px lift, hairline border warms to brass, 160ms. No scale, no rotation.
- **`prefers-reduced-motion: reduce` kills all of it at the token level** — one `@media`
  block zeroes durations and pins reveal variants to their final state, so no component
  can forget.

---

## 7. Self-critique — "does this read as templated?"

An honest pass over the plan above, before any code was written.

| # | The templated instinct | Verdict | Revision made |
|---|---|---|---|
| 1 | **Hero:** centred headline over a dark-scrimmed full-bleed photo, two buttons under it | **Guilty.** The single most generated layout on the web | Rebuilt as an asymmetric editorial split. Type block bottom-left on `--surface`; image right in a **hairline brass offset frame**, like a mounted archival print. No scrim, no centring. A tracked brass legend runs **vertically** up the left gutter |
| 2 | **Wellness arch** on the hero image | Nearly guilty | Rejected. The soft-arch photo mask is now as generic as the cream palette. Plain rectangle, mounted-print framing |
| 3 | **Four pillars:** four equal cards, circle icon, title, one line, "Learn more →" | **Guilty** | Rebuilt as an unequal brick — Paediatric and Maternity wide (the practice's actual centre of gravity), Women's and Mental Health narrow. Each card carries the **Sanskrit term** in brass caps above the English name, and lists **three real conditions from the doc** instead of a generic tagline. Hover reveals the rest of the list, not an arrow |
| 4 | **Stat band:** four big numbers, thin sans, centred, count-up | Guilty by default | Restyled as a **ledger band** — `--primary-deep`, brass hairline verticals between cells, Fraunces tabular brass numerals, tracked bone caps. Reads as an inscription. And it carries **only figures I can verify** (150+ years, 4 generations, 4 specialities); patients-treated is a visible `TODO_STAT` chip, not an invented number |
| 5 | **Rounded-2xl + soft shadow everything** | Would be guilty | 2px radii, hairline borders, no ambient shadows |
| 6 | **Palette:** cream + terracotta | Avoided by construction | Green-cast ground, aged brass, turmeric restricted to actions |
| 7 | **Type:** big airy Playfair headings | Avoided | Fraunces, set tight and dark, wonk axis off |
| 8 | **Emoji from the doc** (🌸 👶 🌺 🧠) shipped as icons | Would be guilty | Stripped. Custom 1.25px-stroke line icons on a shared 24px grid |
| 9 | **Timeline as a vertical dotted line with alternating cards** | The default heritage layout | Replaced by the horizontal brass-cord manuscript. The vertical treatment survives only on `/about/legacy`, where depth genuinely needs it — and even there as a two-column preserved-knowledge thread, not alternating bubbles |
| 10 | **Testimonials:** three equal quote cards in a row | Guilty | Rebuilt as grouped **Voices of Trust** — segmented control by journey stage, one featured long-form story per group, privacy-respecting display names |
| 11 | **Scroll-jacked pinned horizontal section** | The "premium agency" cliché, and an accessibility trap | Native horizontal scroll with snap. Progress drives the cord; the cord never drives the page |

**Where the plan still risks blandness after revision:** the treatments strip and the
knowledge-hub row are, structurally, ordinary card rails. I am accepting that — they are
utility sections, and a page cannot be signature all the way down. The boldness budget is
spent on the lineage; spending it twice would flatten both.

---

## 8. Content integrity rules in force

- Any figure not verifiable from the source doc ships as a greppable `TODO_STAT` / `TODO_`
  placeholder — **visually loud in development**, quietly suppressed in production, never
  replaced with a guess.
- Placeholder doctors and generations carry `"placeholder": true` and render a dev badge.
- Placeholder portraits are **designed brass-on-green silhouettes**, never a stock face.
- `consentOnFile: false` testimonials never render. The filter lives in the data layer, not
  the component.
- The doc supplies FAQ *questions* but no answers. Answers ship flagged `"draft": true`
  with a dev badge, for clinician sign-off — not presented as approved copy.
- Every page touching a health condition renders the educational-use disclaimer.
