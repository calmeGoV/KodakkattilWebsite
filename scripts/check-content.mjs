#!/usr/bin/env node
/**
 * Pre-launch content gate.
 *
 * The site currently ships with dummy content so it can be designed and
 * reviewed. This script lists everything that must be replaced, and FAILS the
 * build on the one combination that is genuinely dangerous: an invented
 * testimonial marked as having patient consent on file.
 *
 *   npm run check:content
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIR = join(process.cwd(), "content");
const read = (f) => JSON.parse(readFileSync(join(DIR, f), "utf8"));

let errors = 0;
let warnings = 0;

const fail = (msg) => {
  errors++;
  console.error(`  ERROR    ${msg}`);
};
const warn = (msg) => {
  warnings++;
  console.warn(`  pending  ${msg}`);
};

console.log("\nContent check\n=============\n");

/* -- 1. Hard failure: fabricated testimonials claiming consent -------------- */
console.log("Testimonials");
const testimonials = read("testimonials.json");
for (const item of testimonials.items) {
  if (item.placeholder && item.consentOnFile) {
    fail(
      `${item.slug}: placeholder testimonial has consentOnFile:true — ` +
        `an invented patient quote must never claim consent. Replace it or set consentOnFile:false.`,
    );
  }
  if (!item.placeholder && !item.consentOnFile) {
    warn(`${item.slug}: real testimonial without consent on file — will not render.`);
  }
}

/* -- 2. Everything still flagged as unfinished ----------------------------- */
const scanFlags = (file) => {
  const raw = readFileSync(join(DIR, file), "utf8");
  const todos = raw.match(/TODO_[A-Z_]+/g) ?? [];
  const unique = [...new Set(todos)];
  const placeholders = (raw.match(/"placeholder":\s*true/g) ?? []).length;
  const drafts = (raw.match(/"draft":\s*true/g) ?? []).length;
  const dummy = (raw.match(/DUMMY/g) ?? []).length;
  if (unique.length || placeholders || drafts || dummy) {
    console.log(`\n${file}`);
    if (unique.length) warn(`TODO tokens: ${unique.join(", ")}`);
    if (placeholders) warn(`${placeholders} entries flagged placeholder:true`);
    if (drafts) warn(`${drafts} entries flagged draft:true (need clinician sign-off)`);
    if (dummy) warn(`${dummy} mentions of DUMMY content`);
  }
};

for (const file of readdirSync(DIR).filter((f) => f.endsWith(".json"))) {
  if (file !== "testimonials.json") scanFlags(file);
}

/* -- Summary --------------------------------------------------------------- */
console.log(`\n-------------------------------------------`);
console.log(`${errors} blocking, ${warnings} pending replacement\n`);

if (errors > 0) {
  console.error(
    "Blocking issues must be resolved before launch. See README.md → Before you go live.\n",
  );
  process.exit(1);
}
