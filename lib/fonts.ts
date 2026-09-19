import { Fraunces, IBM_Plex_Sans, Noto_Sans_Malayalam } from "next/font/google";

/**
 * Display. Variable, with the optical-size axis doing real work.
 * WONK is pinned to 0 in globals.css — the quirky version is a different,
 * worse font. See DESIGN.md §3.
 */
export const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
  // Metric-matched fallback so nothing shifts when the webfont lands.
  adjustFontFallback: true,
});

/** Body / UI. */
export const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plex",
  weight: ["400", "500", "600"],
  adjustFontFallback: true,
});

/**
 * Malayalam glyph coverage, stacked behind the body face so `ml` strings
 * render correctly the day they are added. See lib/i18n.ts.
 */
export const malayalam = Noto_Sans_Malayalam({
  subsets: ["malayalam"],
  display: "swap",
  variable: "--font-malayalam",
  // A single weight. Malayalam appears on a handful of card labels; shipping
  // three weights of a CJK-scale font for that was most of a font budget spent
  // on a dozen glyphs.
  weight: ["400"],
  preload: false,
});

export const fontVariables = `${fraunces.variable} ${plex.variable} ${malayalam.variable}`;
