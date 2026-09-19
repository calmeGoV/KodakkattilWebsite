import manifest from "@/lib/generated/imagery.json";

/**
 * Stand-in imagery for subjects that have no photograph yet.
 *
 * Every entry is a rasterised illustration produced by
 * `npm run gen:imagery` — not a photograph, and not a stock image of a
 * stranger standing in for a real doctor.
 *
 * Selection is keyed to the subject's position in its canonical content list,
 * so a doctor keeps the same image on the home rail, the team grid and their
 * own profile, and neighbours never collide.
 *
 * Per spec §8, images use a solid `--tint-leaf` placeholder rather than a
 * blur-up: blur-up on a face is unpleasant. The manifest still carries a
 * `blurDataURL` for anyone who wants it on non-portrait subjects.
 */

type Entry = {
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
};

const M = manifest as Record<string, Entry>;

const pickFrom = (prefix: string, count: number, ordinal?: number, key?: string) => {
  const n =
    typeof ordinal === "number" && ordinal >= 0 ? ordinal : hash(key ?? prefix);
  return M[`${prefix}-${(n % count) + 1}`];
};

/** djb2 — small, stable, and enough to spread a handful of slugs. */
function hash(input: string): number {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) + h + input.charCodeAt(i)) >>> 0;
  }
  return h;
}

export const imagery = {
  hero: M.hero,
};

export function doctorImage(slug: string, ordinal?: number): Entry {
  return pickFrom("doctor", 6, ordinal, slug);
}

export function ancestorImage(key: string, ordinal?: number): Entry {
  return pickFrom("ancestor", 6, ordinal, key);
}

export function archivalImage(key: string, ordinal?: number): Entry {
  return pickFrom("archival", 6, ordinal, key);
}

export function blogImage(slug: string, ordinal?: number): Entry {
  return pickFrom("blog", 6, ordinal, slug);
}

const GALLERY_GROUPS = [
  "hospital",
  "therapy-rooms",
  "mother-baby",
  "childrens-area",
  "doctors",
  "events",
];

/**
 * Gallery images are keyed to their area, so a therapy-room tile shows a droni
 * and a mother-and-baby tile shows a cradle — the stand-in still tells the
 * visitor what the photograph will be of.
 */
export function galleryImage(group: string, id: string): Entry {
  const known = GALLERY_GROUPS.includes(group) ? group : "hospital";
  return M[`gallery-${known}-${(hash(id) % 3) + 1}`];
}

/* Legacy string-only helpers, kept for call sites that only need a src. */
export const doctorPlaceholder = (slug: string, ordinal?: number) =>
  doctorImage(slug, ordinal).src;
export const ancestorPortraitPlaceholder = (key: string, ordinal?: number) =>
  ancestorImage(key, ordinal).src;
export const archivalPlaceholder = (key: string, ordinal?: number) =>
  archivalImage(key, ordinal).src;
export const galleryPlaceholder = (group: string, id: string) =>
  galleryImage(group, id).src;

export const HERO_PLACEHOLDER = M.hero.src;
export const OG_PLACEHOLDER = "/og/default.png";
