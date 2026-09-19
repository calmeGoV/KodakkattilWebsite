#!/usr/bin/env node
/**
 * Builds the site's stand-in imagery.
 *
 *   npm run gen:imagery
 *
 * These are ILLUSTRATIONS, not photographs. There is no image-generation tool
 * in this toolchain, so nothing here is an AI photo — each scene is composed
 * from layered vector shapes and rasterised to WebP with sharp.
 *
 * ── Why they look the way they do ───────────────────────────────────────────
 *
 * The palette and lighting are sampled from the real hero photograph
 * (Images/mother-child-hero-DJxqrRI0.jpg) rather than invented, so the
 * placeholders sit in the same room as the photo instead of fighting it:
 *
 *   wall upper-left   #D3CAC2      green wall panel  #6F7260
 *   wall mid-left     #D8D4D0      her sage top      #919987
 *   bed linen         #E2E1E3      warm trim strip   #B8B59B
 *   pillow            #C4B9AF      brass vase        #B28E53
 *   window light      #DDE2DD      marigolds         #D88E22
 *
 * Two of those are worth noting: the brass vase lands on the site's own accent
 * (#B08C4F) and the marigolds on its turmeric (#C8871B). The photograph was
 * already in the brand's key, which is why the accents need no adjustment.
 *
 * The lighting model follows the photo too — a bright, soft window on one side
 * with visible falloff across a pale wall, a sage panel as the one dark mass,
 * and grounded objects with soft contact shadows. The previous set was dark
 * green and brass line art, which read as icons on a slab once a real
 * photograph was on the page beside it.
 *
 * Output behaves like photography so swapping in real images changes nothing
 * structural: real pixel dimensions, WebP, and a 20px blur-up per image in
 * `lib/generated/imagery.json`.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import sharp from "sharp";

const IMG_OUT = join(process.cwd(), "public", "images");
const MANIFEST = join(process.cwd(), "lib", "generated");

/* ── palette, sampled from the hero photograph ─────────────────────────────── */
const P = {
  wallHi: "#EAE7E2",
  wall: "#D8D4D0",
  wallWarm: "#D3CAC2",
  linen: "#E7E6E6",
  taupe: "#C4B9AF",
  sage: "#919987",
  sageDeep: "#6F7260",
  sageInk: "#525845",
  trim: "#B8B59B",
  brass: "#B28E53",
  brassDeep: "#8A6A34",
  marigold: "#D88E22",
  light: "#DDE2DD",
};

/* ── primitives ────────────────────────────────────────────────────────────── */

const rnd = (seed) => {
  let s = seed;
  return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
};

/**
 * A torso as an elliptical arc from one hip to the other, peaking at `topY`,
 * so shoulders always meet the neck.
 */
const bell = (cx, topY, halfW, bottomY) =>
  `M${cx - halfW} ${bottomY} A ${halfW} ${bottomY - topY} 0 0 1 ${cx + halfW} ${bottomY}`;

/** Pale room: warm wall, cool window light spilling in from the right. */
const room = (w, h, id, lightFrom = "right") => {
  const lx = lightFrom === "right" ? 0.86 : 0.14;
  return `
  <defs>
    <linearGradient id="wall${id}" x1="0" y1="0" x2="0.75" y2="1">
      <stop offset="0%" stop-color="${P.wallHi}"/>
      <stop offset="55%" stop-color="${P.wall}"/>
      <stop offset="100%" stop-color="${P.wallWarm}"/>
    </linearGradient>
    <radialGradient id="sun${id}" cx="${lx}" cy="0.22" r="0.75">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.85"/>
      <stop offset="42%" stop-color="${P.light}" stop-opacity="0.42"/>
      <stop offset="100%" stop-color="${P.light}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="floor${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${P.taupe}" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="${P.taupe}" stop-opacity="0.12"/>
    </linearGradient>
    <filter id="soft${id}"><feGaussianBlur stdDeviation="${Math.max(3, w / 190)}"/></filter>
    <filter id="blur${id}"><feGaussianBlur stdDeviation="${Math.max(6, w / 70)}"/></filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#wall${id})"/>
  <rect width="${w}" height="${h}" fill="url(#sun${id})"/>`;
};

/** Soft contact shadow so objects sit on the floor rather than float. */
const contact = (cx, cy, rx, id, opacity = 0.3) =>
  `  <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${rx * 0.13}" fill="${P.taupe}" fill-opacity="${opacity}" filter="url(#soft${id})"/>`;

const floor = (w, h, y, id) =>
  `  <rect x="0" y="${y}" width="${w}" height="${h - y}" fill="url(#floor${id})"/>
  <line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="${P.taupe}" stroke-opacity="0.55" stroke-width="1.5"/>`;

/**
 * The sage wall panel — the one dark mass, straight out of the photograph.
 *
 * The warm strip beside it is drawn only when `trim` is set. It is off for
 * portraits, where the strip fell straight across the subject's head.
 */
const panel = (x, y, w, h, trim = true) =>
  `  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${P.sageDeep}"/>` +
  (trim
    ? `\n  <rect x="${x - w * 0.09}" y="${y}" width="${w * 0.045}" height="${h}" fill="${P.trim}"/>`
    : "");

/** A tall window, blown out with daylight. */
const windowPane = (x, y, w, h, id) =>
  `  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#FFFFFF" fill-opacity="0.92"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${P.taupe}" stroke-opacity="0.7" stroke-width="2.5"/>
  <line x1="${x + w / 2}" y1="${y}" x2="${x + w / 2}" y2="${y + h}" stroke="${P.taupe}" stroke-opacity="0.5" stroke-width="2"/>
  <rect x="${x - w * 0.35}" y="${y}" width="${w * 1.7}" height="${h * 1.5}" fill="#FFFFFF" fill-opacity="0.28" filter="url(#blur${id})"/>`;

const ink = (content, { stroke = P.sageInk, width = 3, opacity = 0.85 } = {}) =>
  `  <g fill="none" stroke="${stroke}" stroke-opacity="${opacity}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round">
${content}
  </g>`;

/* ── objects ───────────────────────────────────────────────────────────────── */

/** Marigolds in a small brass vase — lifted straight from the photograph. */
function marigolds(cx, baseY, s, id) {
  const r = rnd(7);
  let blooms = "";
  for (let i = 0; i < 5; i++) {
    const bx = cx + (r() - 0.5) * 58 * s;
    const by = baseY - (72 + r() * 34) * s;
    blooms += `<circle cx="${bx}" cy="${by}" r="${(13 + r() * 5) * s}" fill="${P.marigold}" fill-opacity="${0.8 + r() * 0.2}"/>`;
    blooms += `<line x1="${bx}" y1="${by}" x2="${cx}" y2="${baseY - 34 * s}" stroke="${P.sage}" stroke-opacity="0.75" stroke-width="${2.4 * s}"/>`;
  }
  return `${contact(cx, baseY + 4 * s, 34 * s, id, 0.35)}
  ${blooms}
  <path d="M${cx - 20 * s} ${baseY - 36 * s} q${20 * s} ${-8 * s} ${40 * s} 0 l${-6 * s} ${36 * s} q${-14 * s} ${8 * s} ${-28 * s} 0 Z" fill="${P.brass}"/>
  <ellipse cx="${cx}" cy="${baseY - 36 * s}" rx="${20 * s}" ry="${5 * s}" fill="${P.brassDeep}" fill-opacity="0.7"/>`;
}

/** Droni — the carved treatment table, draped in linen. */
function droni(cx, cy, s, id) {
  return `${contact(cx, cy + 132 * s, 250 * s, id)}
  <path d="M${cx - 250 * s} ${cy} q${250 * s} ${70 * s} ${500 * s} 0 q${-250 * s} ${26 * s} ${-500 * s} 0 Z" fill="${P.linen}"/>
  <path d="M${cx - 250 * s} ${cy} q${12 * s} ${-46 * s} ${52 * s} ${-46 * s} h${396 * s} q${40 * s} 0 ${52 * s} ${46 * s} Z" fill="${P.linen}"/>
${ink(`    <path d="M${cx - 250 * s} ${cy} q${250 * s} ${70 * s} ${500 * s} 0"/>
    <path d="M${cx - 250 * s} ${cy} q${12 * s} ${-46 * s} ${52 * s} ${-46 * s} h${396 * s} q${40 * s} 0 ${52 * s} ${46 * s}"/>
    <path d="M${cx - 168 * s} ${cy + 48 * s} v${80 * s} M${cx + 168 * s} ${cy + 48 * s} v${80 * s}"/>`, { width: 3.2 * s, opacity: 0.6 })}
  <ellipse cx="${cx - 150 * s}" cy="${cy - 34 * s}" rx="${62 * s}" ry="${18 * s}" fill="${P.taupe}" fill-opacity="0.6"/>`;
}

/** A cradle, slung and still. */
function cradle(cx, cy, s, id) {
  return `${contact(cx, cy + 196 * s, 210 * s, id)}
  <path d="M${cx - 170 * s} ${cy} q${170 * s} ${155 * s} ${340 * s} 0 Z" fill="${P.linen}"/>
${ink(`    <path d="M${cx - 170 * s} ${cy} q${170 * s} ${155 * s} ${340 * s} 0"/>
    <path d="M${cx - 196 * s} ${cy} h${392 * s}"/>
    <path d="M${cx - 150 * s} ${cy + 100 * s} l${-52 * s} ${90 * s} M${cx + 150 * s} ${cy + 100 * s} l${52 * s} ${90 * s}"/>`, { width: 3.4 * s, opacity: 0.7 })}
  <circle cx="${cx}" cy="${cy + 40 * s}" r="${34 * s}" fill="${P.taupe}" fill-opacity="0.55"/>`;
}

/** Uruli — the wide bronze vessel. */
function uruli(cx, cy, s, id) {
  return `${contact(cx, cy + 130 * s, 176 * s, id)}
  <path d="M${cx - 176 * s} ${cy} q${176 * s} ${165 * s} ${352 * s} 0 Z" fill="${P.brass}"/>
  <path d="M${cx - 176 * s} ${cy} q${120 * s} ${60 * s} ${120 * s} ${150 * s} q${-90 * s} ${-40 * s} ${-120 * s} ${-150 * s} Z" fill="${P.brassDeep}" fill-opacity="0.45"/>
  <ellipse cx="${cx}" cy="${cy}" rx="${176 * s}" ry="${26 * s}" fill="${P.brassDeep}" fill-opacity="0.55"/>
  <ellipse cx="${cx}" cy="${cy}" rx="${150 * s}" ry="${18 * s}" fill="${P.sageInk}" fill-opacity="0.28"/>
${ink(`    <path d="M${cx - 176 * s} ${cy} q${176 * s} ${165 * s} ${352 * s} 0"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${176 * s}" ry="${26 * s}"/>`, { stroke: P.brassDeep, width: 3 * s, opacity: 0.8 })}`;
}

/** Nilavilakku — the tiered oil lamp, lit. */
function lamp(cx, cy, s, id) {
  return `${contact(cx, cy + 128 * s, 92 * s, id)}
  <circle cx="${cx}" cy="${cy - 150 * s}" r="${86 * s}" fill="${P.marigold}" fill-opacity="0.22" filter="url(#soft${id})"/>
  <path d="M${cx} ${cy - 150 * s} c0 ${28 * s} ${32 * s} ${44 * s} ${32 * s} ${74 * s} a${32 * s} ${32 * s} 0 0 1 ${-64 * s} 0 c0 ${-30 * s} ${32 * s} ${-46 * s} ${32 * s} ${-74 * s} Z" fill="${P.marigold}"/>
  <path d="M${cx - 78 * s} ${cy - 14 * s} q${78 * s} ${46 * s} ${156 * s} 0 Z" fill="${P.brass}"/>
  <path d="M${cx - 56 * s} ${cy + 68 * s} q${56 * s} ${36 * s} ${112 * s} 0 Z" fill="${P.brass}"/>
  <rect x="${cx - 7 * s}" y="${cy + 6 * s}" width="${14 * s}" height="${64 * s}" fill="${P.brass}"/>
  <rect x="${cx - 88 * s}" y="${cy + 116 * s}" width="${176 * s}" height="${12 * s}" rx="${5 * s}" fill="${P.brassDeep}"/>
${ink(`    <path d="M${cx - 78 * s} ${cy - 14 * s} q${78 * s} ${46 * s} ${156 * s} 0"/>
    <path d="M${cx - 56 * s} ${cy + 68 * s} q${56 * s} ${36 * s} ${112 * s} 0"/>`, { stroke: P.brassDeep, width: 2.6 * s, opacity: 0.75 })}`;
}

/** Thaliyola — a palm-leaf manuscript on cloth. */
function thaliyola(cx, cy, s, id) {
  const r = rnd(23);
  let out = `${contact(cx, cy + 170 * s, 330 * s, id, 0.24)}
  <rect x="${cx - 340 * s}" y="${cy - 165 * s}" width="${680 * s}" height="${330 * s}" rx="${6 * s}" fill="${P.linen}"/>`;
  for (let i = 0; i < 5; i++) {
    const y = cy - 112 * s + i * 56 * s;
    out += `<rect x="${cx - 300 * s}" y="${y - 22 * s}" width="${600 * s}" height="${44 * s}" rx="${6 * s}" fill="${P.trim}" fill-opacity="0.9" stroke="${P.brassDeep}" stroke-opacity="0.55" stroke-width="${2 * s}"/>`;
    let lx = cx - 268 * s;
    while (lx < cx + 200 * s) {
      const seg = (28 + r() * 68) * s;
      out += `<path d="M${lx} ${y} h${seg}" stroke="${P.sageInk}" stroke-opacity="0.5" stroke-width="${2.2 * s}" stroke-linecap="round"/>`;
      lx += seg + 18 * s;
    }
    out += `<circle cx="${cx + 248 * s}" cy="${y}" r="${7 * s}" fill="none" stroke="${P.brassDeep}" stroke-opacity="0.8" stroke-width="${2 * s}"/>`;
  }
  out += `<path d="M${cx + 248 * s} ${cy - 200 * s} c${42 * s} ${58 * s} ${42 * s} ${330 * s} 0 ${390 * s}" stroke="${P.brass}" stroke-opacity="0.8" stroke-width="${3 * s}" fill="none"/>`;
  return out;
}

/** Nalukettu facade: steep tiled roof, columns, plinth. */
function facade(cx, baseY, s, id) {
  const rw = 320 * s, rh = 140 * s, bodyH = 170 * s;
  return `${contact(cx, baseY + 14 * s, rw, id, 0.26)}
  <path d="M${cx - rw} ${baseY - bodyH} L${cx} ${baseY - bodyH - rh} L${cx + rw} ${baseY - bodyH} Z" fill="${P.sageDeep}"/>
  <rect x="${cx - rw * 0.86}" y="${baseY - bodyH}" width="${rw * 1.72}" height="${bodyH}" fill="${P.wallHi}"/>
  <rect x="${cx - rw * 0.86}" y="${baseY - bodyH}" width="${rw * 1.72}" height="${bodyH}" fill="none" stroke="${P.taupe}" stroke-opacity="0.8" stroke-width="${2.4 * s}"/>
  <rect x="${cx - rw * 0.15}" y="${baseY - bodyH * 0.66}" width="${rw * 0.3}" height="${bodyH * 0.66}" fill="${P.sageDeep}" fill-opacity="0.85"/>
${ink(`    ${[-0.62, -0.3, 0.3, 0.62].map((f) => `<path d="M${cx + rw * f} ${baseY} v${-bodyH}"/>`).join("")}
    <path d="M${cx - rw * 1.04} ${baseY} h${rw * 2.08}"/>`, { stroke: P.taupe, width: 2.6 * s, opacity: 0.85 })}`;
}

/** Shelves of dispensary jars. */
function shelves(cx, cy, s, seed) {
  const r = rnd(seed);
  let out = "";
  for (let row = 0; row < 3; row++) {
    const y = cy - 130 * s + row * 132 * s;
    out += `<rect x="${cx - 290 * s}" y="${y}" width="${580 * s}" height="${8 * s}" rx="${3 * s}" fill="${P.taupe}"/>`;
    for (let i = 0; i < 7; i++) {
      const jw = (36 + r() * 16) * s, jh = (58 + r() * 34) * s;
      const x = cx - 268 * s + i * 78 * s;
      const warm = r() > 0.65;
      out += `<rect x="${x}" y="${y - jh}" width="${jw}" height="${jh}" rx="${5 * s}" fill="${warm ? P.brass : P.sage}" fill-opacity="${warm ? 0.85 : 0.6}"/>`;
      out += `<rect x="${x}" y="${y - jh}" width="${jw}" height="${12 * s}" fill="${P.brassDeep}" fill-opacity="0.6"/>`;
    }
  }
  return "  " + out;
}

/** Steam off a bowl. */
function steamBowl(cx, cy, s, id) {
  return `${contact(cx, cy + 116 * s, 150 * s, id)}
  <path d="M${cx - 140 * s} ${cy} q${140 * s} ${130 * s} ${280 * s} 0 Z" fill="${P.brass}"/>
  <ellipse cx="${cx}" cy="${cy}" rx="${140 * s}" ry="${20 * s}" fill="${P.brassDeep}" fill-opacity="0.6"/>
${ink(`    <path d="M${cx - 66 * s} ${cy - 44 * s} q${-30 * s} ${-48 * s} 0 ${-92 * s} t0 ${-86 * s}"/>
    <path d="M${cx + 4 * s} ${cy - 44 * s} q${-30 * s} ${-54 * s} 0 ${-104 * s} t0 ${-98 * s}"/>
    <path d="M${cx + 74 * s} ${cy - 44 * s} q${-30 * s} ${-48 * s} 0 ${-92 * s} t0 ${-86 * s}"/>`, { stroke: P.sage, width: 3.4 * s, opacity: 0.55 })}`;
}

/** Two people, seated, at a consultation. */
function consultation(cx, cy, s, id) {
  const person = (x, y, r, sw, fill) =>
    `<path d="${bell(x, y + r * 1.05, sw, y + r * 4.2)}" fill="${fill}"/>
     <circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
  return `${contact(cx, cy + 190 * s, 240 * s, id, 0.22)}
  ${person(cx - 170 * s, cy - 30 * s, 46 * s, 92 * s, P.sageDeep)}
  ${person(cx + 168 * s, cy - 14 * s, 42 * s, 84 * s, P.sage)}
${ink(`    <path d="M${cx - 132 * s} ${cy + 152 * s} h${264 * s}"/>
    <path d="M${cx - 108 * s} ${cy + 152 * s} v${88 * s} M${cx + 108 * s} ${cy + 152 * s} v${88 * s}"/>`, { stroke: P.taupe, width: 3.2 * s, opacity: 0.9 })}`;
}

/** A mother holding her child — the hero fallback. */
function motherAndChild(cx, cy, s, id) {
  const headR = 92 * s, headCy = cy - 150 * s;
  const neckY = headCy + headR * 1.02, hipY = cy + 300 * s, halfW = 196 * s;
  const childR = 48 * s, childCx = cx - 34 * s, childCy = cy + 92 * s;
  return `${contact(cx, hipY + 16 * s, halfW, id, 0.22)}
  <path d="${bell(cx, neckY, halfW, hipY)}" fill="${P.sage}"/>
  <circle cx="${cx}" cy="${headCy}" r="${headR}" fill="${P.sageDeep}"/>
  <path d="${bell(childCx, childCy + childR, childR * 1.5, childCy + childR * 2.6)}" fill="${P.linen}"/>
  <circle cx="${childCx}" cy="${childCy}" r="${childR}" fill="${P.linen}"/>
  <path d="M${cx - halfW * 0.92} ${neckY + 96 * s} Q ${childCx} ${childCy + childR * 3.1} ${cx + halfW * 0.78} ${neckY + 52 * s}"
        fill="none" stroke="${P.sage}" stroke-width="${16 * s}" stroke-linecap="round"/>`;
}

/**
 * A child, seated, with a ball on the floor beside them.
 *
 * An earlier version drew the child reaching for the ball. At this level of
 * abstraction a limb between two blobs reads as a handle rather than an arm,
 * so the gesture is implied by proximity instead.
 */
function childAtPlay(cx, cy, s, id) {
  const headR = 44 * s;
  const headCx = cx - 46 * s;
  const headCy = cy - 66 * s;
  const hipY = cy + 76 * s;
  const ballR = 30 * s;
  const ballCx = cx + 156 * s;
  const ballCy = hipY - ballR;

  return `${contact(headCx, hipY + 6 * s, 100 * s, id)}
  ${contact(ballCx, ballCy + ballR + 4 * s, ballR * 1.15, id, 0.34)}
  <path d="${bell(headCx, headCy + headR, 88 * s, hipY)}" fill="${P.sage}"/>
  <circle cx="${headCx}" cy="${headCy}" r="${headR}" fill="${P.sageDeep}"/>
  <circle cx="${ballCx}" cy="${ballCy}" r="${ballR}" fill="${P.marigold}"/>`;
}

/** Verandah columns, spanning the frame from lintel to floor. */
function verandah(w, h, baseY) {
  const top = h * 0.12;
  const colW = Math.max(18, w * 0.022);
  let out = `<rect x="0" y="${top}" width="${w}" height="${h * 0.05}" fill="${P.sageDeep}"/>
  <rect x="0" y="${top + h * 0.05}" width="${w}" height="${h * 0.014}" fill="${P.trim}"/>`;
  for (let i = 0; i < 5; i++) {
    const x = w * (0.11 + i * 0.195);
    out += `<rect x="${x - colW / 2}" y="${top + h * 0.064}" width="${colW}" height="${baseY - top - h * 0.064}" fill="${P.wallHi}" stroke="${P.taupe}" stroke-opacity="0.7" stroke-width="2.4"/>`;
    out += `<rect x="${x - colW * 0.85}" y="${top + h * 0.064}" width="${colW * 1.7}" height="${h * 0.018}" fill="${P.trim}"/>`;
    out += `<rect x="${x - colW * 0.85}" y="${baseY - h * 0.018}" width="${colW * 1.7}" height="${h * 0.018}" fill="${P.trim}"/>`;
  }
  return "  " + out;
}

/* ── scenes ────────────────────────────────────────────────────────────────── */

const S = (w, h) => Math.min(w / 460, h / 400);

const SCENES = {
  "hero-mother-child": (w, h, id) =>
    `${room(w, h, id)}
${panel(w * 0.58, 0, w * 0.3, h * 0.72)}
${windowPane(w * 0.9, h * 0.06, w * 0.16, h * 0.6, id)}
${floor(w, h, h * 0.78, id)}
${motherAndChild(w * 0.44, h * 0.5, Math.min(w / 640, h / 940), id)}`,

  "consult-room": (w, h, id) =>
    `${room(w, h, id)}
${panel(w * 0.06, 0, w * 0.26, h * 0.68)}
${windowPane(w * 0.78, h * 0.1, w * 0.17, h * 0.5, id)}
${floor(w, h, h * 0.74, id)}
${consultation(w * 0.47, h * 0.44, S(w, h) * 0.9, id)}
${marigolds(w * 0.13, h * 0.72, S(w, h) * 0.7, id)}`,

  "therapy-room": (w, h, id) =>
    `${room(w, h, id)}
${panel(w * 0.04, 0, w * 0.22, h * 0.66)}
${windowPane(w * 0.8, h * 0.08, w * 0.16, h * 0.52, id)}
${floor(w, h, h * 0.76, id)}
${droni(w * 0.48, h * 0.58, S(w, h) * 0.82, id)}`,

  "steam-room": (w, h, id) =>
    `${room(w, h, id, "left")}
${windowPane(w * 0.1, h * 0.1, w * 0.15, h * 0.48, id)}
${panel(w * 0.72, 0, w * 0.24, h * 0.6)}
${floor(w, h, h * 0.75, id)}
${steamBowl(w * 0.52, h * 0.6, S(w, h) * 0.86, id)}`,

  "medicine-kitchen": (w, h, id) =>
    `${room(w, h, id)}
${floor(w, h, h * 0.8, id)}
${shelves(w * 0.5, h * 0.4, S(w, h) * 0.9, 17)}
${uruli(w * 0.5, h * 0.74, S(w, h) * 0.62, id)}`,

  "mother-baby-suite": (w, h, id) =>
    `${room(w, h, id)}
${panel(w * 0.05, 0, w * 0.2, h * 0.64)}
${windowPane(w * 0.8, h * 0.08, w * 0.16, h * 0.5, id)}
${floor(w, h, h * 0.8, id)}
${cradle(w * 0.45, h * 0.5, S(w, h) * 0.78, id)}
${marigolds(w * 0.88, h * 0.78, S(w, h) * 0.62, id)}`,

  "childrens-area": (w, h, id) =>
    `${room(w, h, id)}
${panel(w * 0.66, 0, w * 0.28, h * 0.6)}
${windowPane(w * 0.06, h * 0.1, w * 0.15, h * 0.46, id)}
${floor(w, h, h * 0.76, id)}
${childAtPlay(w * 0.44, h * 0.56, S(w, h) * 0.92, id)}`,

  "exterior-day": (w, h, id) =>
    `${room(w, h, id)}
${floor(w, h, h * 0.8, id)}
${facade(w * 0.5, h * 0.78, Math.min(w / 900, h / 700), id)}`,

  verandah: (w, h, id) =>
    `${room(w, h, id)}
${verandah(w, h, h * 0.82)}
${floor(w, h, h * 0.82, id)}
${marigolds(w * 0.82, h * 0.8, S(w, h) * 0.6, id)}`,

  "lamp-still": (w, h, id) =>
    `${room(w, h, id)}
${panel(w * 0.62, 0, w * 0.3, h * 0.66)}
${floor(w, h, h * 0.72, id)}
${lamp(w * 0.44, h * 0.56, S(w, h) * 0.9, id)}`,

  "vessel-still": (w, h, id) =>
    `${room(w, h, id)}
${floor(w, h, h * 0.7, id)}
${uruli(w * 0.5, h * 0.54, S(w, h) * 0.72, id)}
${marigolds(w * 0.84, h * 0.68, S(w, h) * 0.58, id)}`,

  "manuscript-still": (w, h, id) =>
    `${room(w, h, id)}
${floor(w, h, h * 0.72, id)}
${thaliyola(w * 0.5, h * 0.48, S(w, h) * 0.8, id)}`,

  gathering: (w, h, id) =>
    `${room(w, h, id)}
${panel(w * 0.04, 0, w * 0.18, h * 0.62)}
${windowPane(w * 0.84, h * 0.08, w * 0.14, h * 0.5, id)}
${floor(w, h, h * 0.76, id)}
${consultation(w * 0.52, h * 0.46, S(w, h) * 0.86, id)}
${lamp(w * 0.16, h * 0.66, S(w, h) * 0.44, id)}`,
};

/** Portrait plates: soft studio light, sage panel, abstract bust. */
function portraitScene(w, h, id, i, archival = false) {
  const variants = [
    { r: 118, sw: 210, drape: "" },
    { r: 108, sw: 238, drape: "shawl" },
    { r: 126, sw: 196, drape: "collar" },
    { r: 112, sw: 250, drape: "double" },
    { r: 122, sw: 218, drape: "v" },
    { r: 104, sw: 228, drape: "lapel" },
  ];
  const v = variants[i % variants.length];
  const cx = w * 0.5, cy = h * 0.4;
  const neckY = cy + v.r * 1.04;
  const torso = bell(cx, neckY, v.sw, h + 40);
  const body = archival ? P.taupe : P.sage;
  const head = archival ? P.brassDeep : P.sageDeep;

  const drapes = {
    "": "",
    shawl: `<path d="M${cx - 120} ${neckY + 132} q120 58 240 0" stroke="${P.linen}" stroke-opacity="0.75" stroke-width="5" fill="none"/>`,
    collar: `<path d="M${cx - 92} ${neckY + 108} h184" stroke="${P.linen}" stroke-opacity="0.75" stroke-width="5" fill="none"/>`,
    double: `<path d="M${cx - 140} ${neckY + 120} q140 68 280 0" stroke="${P.linen}" stroke-opacity="0.7" stroke-width="5" fill="none"/><path d="M${cx - 104} ${neckY + 186} q104 48 208 0" stroke="${P.linen}" stroke-opacity="0.55" stroke-width="4" fill="none"/>`,
    v: `<path d="M${cx - 62} ${neckY + 116} l62 74 62 -74" stroke="${P.linen}" stroke-opacity="0.75" stroke-width="5" fill="none"/>`,
    lapel: `<path d="M${cx - 70} ${neckY + 116} v96 M${cx + 70} ${neckY + 116} v96" stroke="${P.linen}" stroke-opacity="0.7" stroke-width="5" fill="none"/>`,
  };

  return `${room(w, h, id)}
${panel(w * 0.6, 0, w * 0.4, h * 0.55, false)}
  <ellipse cx="${cx}" cy="${cy}" rx="${v.r + 120}" ry="${v.r + 140}" fill="#FFFFFF" fill-opacity="0.35" filter="url(#blur${id})"/>
  <path d="${torso}" fill="${body}"/>
  <circle cx="${cx}" cy="${cy}" r="${v.r}" fill="${head}"/>
  ${drapes[v.drape]}`;
}

/* ── build ─────────────────────────────────────────────────────────────────── */

const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;

const jobs = [];

jobs.push({ key: "hero", rel: "hero/hero.webp", w: 1500, h: 1800, scene: "hero-mother-child" });

for (let i = 0; i < 6; i++) {
  jobs.push({ key: `doctor-${i + 1}`, rel: `doctors/portrait-${i + 1}.webp`, w: 900, h: 1125, portrait: i });
  jobs.push({ key: `ancestor-${i + 1}`, rel: `legacy/ancestor-${i + 1}.webp`, w: 900, h: 1125, portrait: i, archival: true });
}

["manuscript-still", "exterior-day", "vessel-still", "lamp-still", "medicine-kitchen", "gathering"]
  .forEach((scene, i) => {
    jobs.push({ key: `archival-${i + 1}`, rel: `legacy/archival-${i + 1}.webp`, w: 1500, h: 1030, scene });
  });

const galleryScenes = {
  hospital: ["exterior-day", "verandah", "consult-room"],
  "therapy-rooms": ["therapy-room", "steam-room", "medicine-kitchen"],
  "mother-baby": ["mother-baby-suite", "verandah", "lamp-still"],
  "childrens-area": ["childrens-area", "consult-room", "verandah"],
  doctors: ["consult-room", "therapy-room", "medicine-kitchen"],
  events: ["gathering", "verandah", "lamp-still"],
};
for (const [groupId, scenes] of Object.entries(galleryScenes)) {
  scenes.forEach((scene, i) => {
    jobs.push({ key: `gallery-${groupId}-${i + 1}`, rel: `gallery/${groupId}-${i + 1}.webp`, w: 1600, h: 1200, scene });
  });
}

["consult-room", "mother-baby-suite", "childrens-area", "medicine-kitchen", "lamp-still", "verandah"]
  .forEach((scene, i) => {
    jobs.push({ key: `blog-${i + 1}`, rel: `blog/cover-${i + 1}.webp`, w: 1600, h: 900, scene });
  });

const manifest = {};

for (const job of jobs) {
  const id = job.key.replace(/[^a-z0-9]/gi, "");
  const body =
    job.portrait !== undefined
      ? portraitScene(job.w, job.h, id, job.portrait, job.archival)
      : SCENES[job.scene](job.w, job.h, id);

  const out = join(IMG_OUT, job.rel);
  mkdirSync(join(out, ".."), { recursive: true });

  const png = await sharp(Buffer.from(svg(job.w, job.h, body)), { density: 144 }).png().toBuffer();
  await sharp(png).webp({ quality: 84 }).toFile(out);

  const blur = await sharp(png).resize(20).webp({ quality: 45 }).toBuffer();
  manifest[job.key] = {
    src: `/images/${job.rel.replace(/\\/g, "/")}`,
    width: job.w,
    height: job.h,
    blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
  };
}

mkdirSync(MANIFEST, { recursive: true });
writeFileSync(join(MANIFEST, "imagery.json"), JSON.stringify(manifest, null, 2) + "\n", "utf8");

console.log(`Generated ${jobs.length} WebP images + blur placeholders.`);
console.log("Illustrations in the hero photograph's palette — not photographs.");
