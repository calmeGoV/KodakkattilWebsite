#!/usr/bin/env node
/**
 * Derives the brand asset set from the supplied logo.
 *
 *   npm run gen:logo
 *
 * Source: Images/logo2-colored2.svg — a "KB" monogram with a leaf over an
 * "ESTD 1870" line, 82x147.
 *
 * Two derivations are needed, and both are mechanical so re-running after a
 * logo revision costs nothing:
 *
 * 1. A MARK without the "ESTD 1870" line. In the header the lockup is about
 *    40px tall; at that size the date line is three pixels high and reads as
 *    grey mud. Dropping it and trimming the viewBox lets the monogram fill the
 *    space it has.
 *
 * 2. A REVERSED pair for dark grounds. The K and the swoosh are #207C38, which
 *    against the footer's #10261D is roughly 1.5:1 — the monogram all but
 *    disappears. On dark they are redrawn in the page's own surface colour
 *    while the leaf keeps its greens, which stay bright enough to read.
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const SRC = "Images/logo2-colored2.svg";
const OUT = join(process.cwd(), "public", "brand");
mkdirSync(OUT, { recursive: true });

const raw = readFileSync(SRC, "utf8");

/** The "ESTD 1870" lettering is the one path that starts at the date row. */
const DATE_PATH = /<path d="M9\.80713 120\.05[^/]*\/>\s*/;

/** Dark greens → light, for reversed use. The leaf gradients are untouched. */
const reverse = (svg) =>
  svg
    .replace(/#207C38/g, "#EEEFE7")
    .replace(/#1A5F2C/g, "#DCE5DF")
    .replace(/stroke="black"/g, 'stroke="none"');

const write = (name, svg) => {
  writeFileSync(join(OUT, name), svg, "utf8");
  console.log(`  public/brand/${name}`);
};

// ── Full lockup, as supplied ────────────────────────────────────────────────
write("logo-full.svg", raw);
write("logo-full-reversed.svg", reverse(raw));

// ── Monogram only: drop the date line, trim the viewBox to the artwork ──────
if (!DATE_PATH.test(raw)) {
  console.error("ERROR: could not find the ESTD lettering path — has the logo changed?");
  process.exit(1);
}

const markBody = raw.replace(DATE_PATH, "");
const MARK_H = 105; // the K stem and the B both bottom out at y=104.05
const mark = markBody
  .replace(/width="82"/, `width="82"`)
  .replace(/height="147"/, `height="${MARK_H}"`)
  .replace(/viewBox="0 0 82 147"/, `viewBox="0 0 82 ${MARK_H}"`);

write("logo-mark.svg", mark);
write("logo-mark-reversed.svg", reverse(mark));

console.log(`\nMark aspect: 82 x ${MARK_H} (${(82 / MARK_H).toFixed(3)})`);
