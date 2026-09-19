#!/usr/bin/env node
/**
 * Renders the static Open Graph images.
 *
 *   npm run gen:og
 *
 * Why not `next/og` / ImageResponse: it crashes at build time on Windows in
 * Next 15.1.6 — it resolves its bundled font and wasm with
 * `path.join(import.meta.url, ...)`, which mangles a `file:///D:/…` URL, and
 * `fileURLToPath` then throws "Invalid URL". Rasterising a purpose-built SVG
 * with sharp sidesteps that entirely, is deterministic, costs nothing at
 * runtime, and survives `output: "export"`.
 *
 * Rendered here rather than committed by hand so the card follows the palette
 * automatically: edit this file, re-run, done.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import sharp from "sharp";

const OUT = join(process.cwd(), "public", "og");
mkdirSync(OUT, { recursive: true });

const KHADI = "#EEEFE7";
const INK = "#131A15";
const GREEN = "#1C4131";
const BRASS = "#B08C4F";
const BRASS_INK = "#7E5F28";
const TURMERIC = "#C8871B";

const W = 1200;
const H = 630;

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * The lineage cord, with the living generation marked in turmeric — the same
 * device as the site's signature section, so a shared link is recognisable.
 */
function cord(y) {
  const left = 72;
  const right = W - 72;
  const n = 5;
  const gap = (right - left) / (n - 1);
  let out = `<line x1="${left}" y1="${y}" x2="${right}" y2="${y}" stroke="${BRASS}" stroke-width="2"/>`;
  for (let i = 0; i < n; i++) {
    const cx = left + gap * i;
    const fill = i === n - 1 ? TURMERIC : BRASS;
    out += `<circle cx="${cx}" cy="${y}" r="9" fill="${fill}"/>`;
  }
  return out;
}

function card({ kicker, title, subtitle, footnote }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${KHADI}"/>
  <rect width="${W}" height="8" fill="${BRASS}"/>

  <g font-family="Georgia, 'Times New Roman', serif">
    <line x1="72" y1="118" x2="112" y2="118" stroke="${BRASS}" stroke-width="2"/>
    <text x="126" y="126" font-family="Helvetica, Arial, sans-serif" font-size="21"
          letter-spacing="4.5" fill="${BRASS_INK}">${esc(kicker.toUpperCase())}</text>

    <text x="72" y="268" font-size="82" font-weight="600" fill="${INK}">${esc(title)}</text>
    <text x="72" y="332" font-size="40" fill="${GREEN}">${esc(subtitle)}</text>
  </g>

  ${cord(452)}

  <text x="72" y="536" font-family="Helvetica, Arial, sans-serif" font-size="25"
        fill="#4A554C">${esc(footnote)}</text>
</svg>`;
}

const cards = [
  [
    "default.png",
    card({
      kicker: "Ayurveda · Kerala",
      title: "Kodakkattil",
      subtitle: "Ancient Wisdom. Modern Care.",
      footnote:
        "150 years · Five generations · Balachikitsa, maternity, women's health, mental health",
    }),
  ],
  [
    "legacy.png",
    card({
      kicker: "The Ancestral Line",
      title: "Five generations.",
      subtitle: "One unbroken practice.",
      footnote:
        "The vaidyans who kept it, and the manuscripts they handed down.",
    }),
  ],
];

for (const [name, svg] of cards) {
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  writeFileSync(join(OUT, name), buf);
  console.log(`  public/og/${name}  (${(buf.length / 1024).toFixed(1)} kB)`);
}

console.log(`Generated ${cards.length} Open Graph images.`);
