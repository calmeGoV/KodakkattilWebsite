import en from "./en.json";
import ml from "./ml.json";

export const locales = ["en", "ml"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

type Dict = Record<string, string>;

const dictionaries: Record<Locale, Dict> = {
  en: en as Dict,
  ml: ml as Dict,
};

/**
 * Minimal string layer. Every UI string in the app goes through `t()` so that
 * Malayalam can be switched on later without touching a component — populate
 * lib/i18n/ml.json and flip the locale.
 *
 * Deliberately not a full i18n library: nothing here needs plurals or dates
 * yet, and adding next-intl before it is needed would be a cost with no return.
 */
export function t(key: keyof typeof en, locale: Locale = defaultLocale): string {
  const dict = dictionaries[locale];
  const value = dict?.[key];
  if (value) return value;

  // Fall back to English rather than showing a key to a patient.
  const fallback = dictionaries.en[key];
  if (fallback) return fallback;

  if (process.env.NODE_ENV !== "production") {
    console.warn(`[i18n] missing string: ${String(key)}`);
  }
  return String(key);
}

export type StringKey = keyof typeof en;
