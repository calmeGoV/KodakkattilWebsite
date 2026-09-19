#!/usr/bin/env node
/**
 * Generates the placeholder image set.
 *
 *   npm run gen:placeholders
 *
 * Everything here is drawn line art in the brand palette — a vaidyasala
 * facade, a droni table, a nilavilakku, an uruli, a thaliyola. Never a stock
 * photograph, and never a stranger's face standing in for a real doctor.
 *
 * Output is deterministic: re-running overwrites the same files with the same
 * bytes. Delete a generated file and drop a real photograph in its place —
 * nothing in the app references these paths directly, they are chosen by
 * `lib/placeholders.ts` from a stable hash of the subject's slug.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "images");

/* ── palette (mirrors app/globals.css) ───────────────────────────────────── */
const INK_DEEP = "#0D2018";
const GREEN_MID = "#1A3A2B";
const BRASS = "#B08C4F";
const BRASS_GLOW = "#D8BC85";
const KHADI = "#EEEFE7";
const SUNKEN = "#E3E5DA";

const defs = (id, from, to) => `
    <linearGradient id="bg${id}" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
    <filter id="gr${id}">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>`;

/** Shared wrapper: ground, grain, inset brass hairline. */
function frame({ id, w, h, title, light = false, body }) {
  const from = light ? KHADI : GREEN_MID;
  const to = light ? SUNKEN : INK_DEEP;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-labelledby="t${id}">
  <title id="t${id}">${title}</title>
  <defs>${defs(id, from, to)}</defs>
  <rect width="${w}" height="${h}" fill="url(#bg${id})"/>
${body}
  <rect x="8" y="8" width="${w - 16}" height="${h - 16}" fill="none" stroke="${BRASS}" stroke-opacity="0.28" stroke-width="1"/>
  <rect width="${w}" height="${h}" filter="url(#gr${id})" opacity="${light ? 0.05 : 0.06}" style="mix-blend-mode:${light ? "multiply" : "screen"}"/>
</svg>
`;
}

const g = (content, { stroke = BRASS_GLOW, opacity = 0.8, width = 2.5 } = {}) =>
  `  <g fill="none" stroke="${stroke}" stroke-opacity="${opacity}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round">
${content}
  </g>`;

/* ── motifs ──────────────────────────────────────────────────────────────── */

/** Kerala vaidyasala facade: steep tiled roof, columns, steps. */
const building = (cx, cy, s) =>
  g(`    <path d="M${cx - 150 * s} ${cy + 10 * s}L${cx} ${cy - 80 * s}l${150 * s} ${90 * s}"/>
    <path d="M${cx - 132 * s} ${cy + 10 * s}v${86 * s}h${264 * s}v${-86 * s}"/>
    <path d="M${cx - 96 * s} ${cy + 96 * s}v${-62 * s}M${cx - 32 * s} ${cy + 96 * s}v${-62 * s}M${cx + 32 * s} ${cy + 96 * s}v${-62 * s}M${cx + 96 * s} ${cy + 96 * s}v${-62 * s}"/>
    <path d="M${cx - 160 * s} ${cy + 96 * s}h${320 * s}M${cx - 176 * s} ${cy + 112 * s}h${352 * s}"/>
    <path d="M${cx - 18 * s} ${cy + 96 * s}v${-40 * s}h${36 * s}v${40 * s}"/>`);

/** Droni — the carved treatment table. */
const droni = (cx, cy, s) =>
  g(`    <path d="M${cx - 170 * s} ${cy}q${170 * s} ${46 * s} ${340 * s} 0"/>
    <path d="M${cx - 170 * s} ${cy}q${8 * s} ${-30 * s} ${34 * s} ${-30 * s}h${272 * s}q${26 * s} 0 ${34 * s} ${30 * s}"/>
    <path d="M${cx - 120 * s} ${cy + 30 * s}v${52 * s}M${cx + 120 * s} ${cy + 30 * s}v${52 * s}"/>
    <path d="M${cx - 150 * s} ${cy + 82 * s}h${60 * s}M${cx + 90 * s} ${cy + 82 * s}h${60 * s}"/>
    <circle cx="${cx + 138 * s}" cy="${cy - 78 * s}" r="${16 * s}"/>
    <path d="M${cx + 138 * s} ${cy - 62 * s}v${32 * s}"/>`);

/** Nilavilakku — the tiered oil lamp. */
const lamp = (cx, cy, s) =>
  g(`    <path d="M${cx} ${cy - 96 * s}c0 ${22 * s} ${26 * s} ${34 * s} ${26 * s} ${58 * s}a${26 * s} ${26 * s} 0 0 1 ${-52 * s} 0c0 ${-24 * s} ${26 * s} ${-36 * s} ${26 * s} ${-58 * s}Z"/>
    <path d="M${cx - 56 * s} ${cy - 10 * s}q${56 * s} ${30 * s} ${112 * s} 0"/>
    <path d="M${cx} ${cy + 4 * s}v${46 * s}"/>
    <path d="M${cx - 40 * s} ${cy + 50 * s}q${40 * s} ${24 * s} ${80 * s} 0"/>
    <path d="M${cx} ${cy + 62 * s}v${26 * s}"/>
    <path d="M${cx - 62 * s} ${cy + 88 * s}h${124 * s}"/>`);

/** Uruli — the wide bronze vessel. */
const uruli = (cx, cy, s) =>
  g(`    <path d="M${cx - 130 * s} ${cy - 20 * s}q${130 * s} ${118 * s} ${260 * s} 0"/>
    <path d="M${cx - 150 * s} ${cy - 20 * s}h${300 * s}"/>
    <ellipse cx="${cx}" cy="${cy - 20 * s}" rx="${130 * s}" ry="${20 * s}"/>
    <path d="M${cx - 150 * s} ${cy - 20 * s}a${18 * s} ${18 * s} 0 0 1 ${-24 * s} ${-16 * s}M${cx + 150 * s} ${cy - 20 * s}a${18 * s} ${18 * s} 0 0 0 ${24 * s} ${-16 * s}"/>`);

/** Thaliyola — stacked palm leaves bound with cord. */
const manuscript = (cx, cy, s) => {
  const rows = [-78, -26, 26, 78]
    .map(
      (dy) =>
        `    <rect x="${cx - 190 * s}" y="${cy + dy * s - 18 * s}" width="${380 * s}" height="${36 * s}" rx="4"/>`,
    )
    .join("\n");
  const holes = [-78, -26, 26, 78]
    .map((dy) => `    <circle cx="${cx + 140 * s}" cy="${cy + dy * s}" r="${5 * s}"/>`)
    .join("\n");
  return (
    g(rows + "\n" + holes, { stroke: BRASS, opacity: 0.6, width: 1.8 }) +
    "\n" +
    g(
      `    <path d="M${cx - 160 * s} ${cy - 78 * s}h${120 * s}M${cx - 160 * s} ${cy - 26 * s}h${180 * s}M${cx - 160 * s} ${cy + 26 * s}h${96 * s}M${cx - 160 * s} ${cy + 78 * s}h${210 * s}"/>
    <path d="M${cx + 140 * s} ${cy - 112 * s}c${26 * s} ${34 * s} ${26 * s} ${190 * s} 0 ${224 * s}"/>`,
      { stroke: BRASS_GLOW, opacity: 0.35, width: 1.8 },
    )
  );
};

/** A cradle on a stand. */
const cradle = (cx, cy, s) =>
  g(`    <path d="M${cx - 120 * s} ${cy - 10 * s}q${120 * s} ${110 * s} ${240 * s} 0"/>
    <path d="M${cx - 140 * s} ${cy - 10 * s}h${280 * s}"/>
    <circle cx="${cx}" cy="${cy + 24 * s}" r="${22 * s}"/>
    <path d="M${cx - 108 * s} ${cy + 62 * s}l${-34 * s} ${58 * s}M${cx + 108 * s} ${cy + 62 * s}l${34 * s} ${58 * s}"/>
    <path d="M${cx - 150 * s} ${cy + 120 * s}h${300 * s}"/>`);

/** A palm, for exteriors and events. */
const palm = (cx, cy, s) =>
  g(`    <path d="M${cx} ${cy + 110 * s}q${-14 * s} ${-90 * s} ${4 * s} ${-160 * s}"/>
    <path d="M${cx + 4 * s} ${cy - 50 * s}q${-56 * s} ${-40 * s} ${-104 * s} ${-20 * s}"/>
    <path d="M${cx + 4 * s} ${cy - 50 * s}q${56 * s} ${-44 * s} ${108 * s} ${-24 * s}"/>
    <path d="M${cx + 4 * s} ${cy - 50 * s}q${-30 * s} ${-64 * s} ${-78 * s} ${-78 * s}"/>
    <path d="M${cx + 4 * s} ${cy - 50 * s}q${34 * s} ${-62 * s} ${86 * s} ${-72 * s}"/>
    <path d="M${cx + 4 * s} ${cy - 50 * s}q${4 * s} ${-70 * s} ${-8 * s} ${-104 * s}"/>`);

/** A small group of people. */
const group = (cx, cy, s) =>
  g(`    <circle cx="${cx - 96 * s}" cy="${cy - 44 * s}" r="${30 * s}"/>
    <path d="M${cx - 156 * s} ${cy + 68 * s}q0 ${-58 * s} ${60 * s} ${-58 * s}t${60 * s} ${58 * s}"/>
    <circle cx="${cx + 4 * s}" cy="${cy - 66 * s}" r="${34 * s}"/>
    <path d="M${cx - 62 * s} ${cy + 68 * s}q0 ${-66 * s} ${66 * s} ${-66 * s}t${66 * s} ${66 * s}"/>
    <circle cx="${cx + 104 * s}" cy="${cy - 44 * s}" r="${30 * s}"/>
    <path d="M${cx + 44 * s} ${cy + 68 * s}q0 ${-58 * s} ${60 * s} ${-58 * s}t${60 * s} ${58 * s}"/>`);

/** A child at play. */
const child = (cx, cy, s) =>
  g(`    <circle cx="${cx - 20 * s}" cy="${cy - 56 * s}" r="${32 * s}"/>
    <path d="M${cx - 76 * s} ${cy + 56 * s}q0 ${-62 * s} ${56 * s} ${-62 * s}t${56 * s} ${62 * s}"/>
    <path d="M${cx + 24 * s} ${cy + 4 * s}q${44 * s} ${-10 * s} ${62 * s} ${22 * s}"/>
    <circle cx="${cx + 102 * s}" cy="${cy + 44 * s}" r="${26 * s}"/>
    <path d="M${cx - 120 * s} ${cy + 56 * s}h${240 * s}"/>`);

/** Steam rising from a bowl. */
const steam = (cx, cy, s) =>
  g(`    <path d="M${cx - 96 * s} ${cy + 20 * s}q${96 * s} ${86 * s} ${192 * s} 0"/>
    <path d="M${cx - 112 * s} ${cy + 20 * s}h${224 * s}"/>
    <path d="M${cx - 44 * s} ${cy - 10 * s}q${-20 * s} ${-30 * s} 0 ${-58 * s}t0 ${-56 * s}"/>
    <path d="M${cx + 4 * s} ${cy - 10 * s}q${-20 * s} ${-34 * s} 0 ${-66 * s}t0 ${-64 * s}"/>
    <path d="M${cx + 52 * s} ${cy - 10 * s}q${-20 * s} ${-30 * s} 0 ${-58 * s}t0 ${-56 * s}"/>`);

/** A shuttered window with light falling through. */
const window_ = (cx, cy, s) =>
  g(`    <path d="M${cx - 90 * s} ${cy - 110 * s}h${180 * s}v${210 * s}h${-180 * s}Z"/>
    <path d="M${cx} ${cy - 110 * s}v${210 * s}"/>
    <path d="M${cx - 74 * s} ${cy - 84 * s}h${58 * s}M${cx - 74 * s} ${cy - 54 * s}h${58 * s}M${cx - 74 * s} ${cy - 24 * s}h${58 * s}M${cx - 74 * s} ${cy + 6 * s}h${58 * s}"/>
    <path d="M${cx + 16 * s} ${cy - 84 * s}h${58 * s}M${cx + 16 * s} ${cy - 54 * s}h${58 * s}M${cx + 16 * s} ${cy - 24 * s}h${58 * s}M${cx + 16 * s} ${cy + 6 * s}h${58 * s}"/>
    <path d="M${cx - 110 * s} ${cy - 124 * s}h${220 * s}"/>`);

/** Mortar and pestle, for the medicine kitchen. */
const mortar = (cx, cy, s) =>
  g(`    <path d="M${cx - 76 * s} ${cy - 4 * s}q${76 * s} ${104 * s} ${152 * s} 0"/>
    <path d="M${cx - 96 * s} ${cy - 4 * s}h${192 * s}"/>
    <path d="M${cx - 40 * s} ${cy + 78 * s}h${80 * s}"/>
    <path d="M${cx + 46 * s} ${cy - 34 * s}l${58 * s} ${-104 * s}"/>
    <path d="M${cx + 92 * s} ${cy - 128 * s}a${18 * s} ${18 * s} 0 1 1 ${26 * s} ${14 * s}"/>`);

/* ── portraits ───────────────────────────────────────────────────────────── */

/**
 * Bust silhouettes. Varied by head size, shoulder width and one detail, so a
 * team page does not read as six copies of the same person — while staying
 * clearly a drawing rather than a face.
 */
function portrait(i) {
  const W = 400;
  const H = 500;

  /**
   * Variation comes from silhouette alone — head size, shoulder width, and
   * what is worn below the neck. Deliberately NO facial features: two circles
   * inside a head circle stop reading as an abstract mark and start reading as
   * a face, which is the stock-photo problem in a different costume.
   */
  const variants = [
    { r: 62, sw: 104, drape: "" },
    { r: 57, sw: 118, drape: `    <path d="M142 344q58 26 116 0"/>` },
    { r: 66, sw: 96, drape: `    <path d="M156 356h88"/>` },
    {
      r: 60,
      sw: 124,
      drape: `    <path d="M132 338q68 34 136 0"/><path d="M150 372q50 22 100 0"/>`,
    },
    { r: 64, sw: 108, drape: `    <path d="M172 330l28 34 28-34"/>` },
    { r: 55, sw: 112, drape: `    <path d="M160 340v44M240 340v44"/>` },
  ];
  const v = variants[i % variants.length];
  const cy = 186;

  const body = [
    `  <line x1="0" y1="376" x2="${W}" y2="376" stroke="${BRASS}" stroke-opacity="0.22" stroke-width="1"/>`,
    g(`    <circle cx="200" cy="${cy}" r="${v.r}"/>
    <path d="M${200 - v.sw} 430q0-${v.sw * 0.86} ${v.sw} -${v.sw * 0.86}t${v.sw} ${v.sw * 0.86}"/>
${v.drape}`),
    g(`    <circle cx="200" cy="${cy}" r="${v.r + 28}"/>`, {
      stroke: BRASS,
      opacity: 0.22,
      width: 1,
    }),
  ].join("\n");

  return frame({
    id: `p${i}`,
    w: W,
    h: H,
    title: "Placeholder portrait — photograph not yet supplied",
    body,
  });
}

/* ── assembly ────────────────────────────────────────────────────────────── */

/**
 * Motifs are authored around a ±180 unit box. Scale them to occupy roughly
 * two-thirds of the frame, so a placeholder reads as a considered drawing
 * rather than a small icon marooned in a field of green.
 */
const scene = (id, motif, title, { w = 1200, h = 900, light = false } = {}) =>
  frame({
    id,
    w,
    h,
    title,
    light,
    body: motif(w / 2, h / 2, Math.min(w / 460, h / 380)),
  });

const files = [];

// Doctor portraits
for (let i = 0; i < 6; i++) {
  files.push([`doctors/silhouette-${i + 1}.svg`, portrait(i)]);
}

// Legacy: archival artifacts (4:3-ish plates)
const archival = [
  ["manuscript", manuscript, "Placeholder — archival manuscript"],
  ["building", building, "Placeholder — the original building"],
  ["vessel", uruli, "Placeholder — brass vessel"],
  ["lamp", lamp, "Placeholder — oil lamp"],
  ["mortar", mortar, "Placeholder — medicine kitchen"],
  ["group", group, "Placeholder — archival group photograph"],
];
archival.forEach(([name, motif, title], i) => {
  files.push([`legacy/artifact-${i + 1}-${name}.svg`, scene(`a${i}`, motif, title, { w: 960, h: 660 })]);
});

// Legacy portraits, in the archival key
for (let i = 0; i < 6; i++) {
  files.push([`legacy/portrait-${i + 1}.svg`, portrait(i)]);
}

// Gallery scenes, keyed to the six areas
const galleryScenes = [
  ["hospital", [building, palm, window_]],
  ["therapy-rooms", [droni, steam, uruli]],
  ["mother-baby", [cradle, window_, lamp]],
  ["childrens-area", [child, cradle, palm]],
  ["doctors", [group, droni, mortar]],
  ["events", [palm, lamp, group]],
];
galleryScenes.forEach(([groupId, motifs]) => {
  motifs.forEach((motif, i) => {
    files.push([
      `gallery/${groupId}-${i + 1}.svg`,
      scene(`${groupId}${i}`, motif, `Placeholder — ${groupId.replace(/-/g, " ")}`),
    ]);
  });
});

// Hero
files.push([
  "hero/placeholder-lamp.svg",
  scene("hero1", lamp, "Placeholder — oil lamp", { w: 900, h: 1100 }),
]);

// Open Graph fallback (light ground reads better in social previews)
files.push([
  "og/placeholder-og.svg",
  scene("og1", manuscript, "Placeholder — social preview", {
    w: 1200,
    h: 630,
    light: true,
  }),
]);

for (const [rel, svg] of files) {
  const path = join(OUT, rel);
  mkdirSync(join(path, ".."), { recursive: true });
  writeFileSync(path, svg, "utf8");
}

console.log(`Generated ${files.length} placeholder images under public/images/`);
console.log(
  "All are drawn line art in the brand palette. None is a photograph of a person.",
);
