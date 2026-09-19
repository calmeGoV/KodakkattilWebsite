import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isDev = process.env.NODE_ENV !== "production";

/** A content string that has not been filled in yet. */
export function isTodo(value: unknown): boolean {
  return typeof value === "string" && value.startsWith("TODO_");
}

/**
 * Renders `value` unless it is an unfilled placeholder, in which case the
 * caller decides what to show instead. Keeps `TODO_` strings off production
 * pages without deleting them from the content files.
 */
export function copy(value: string | null | undefined, fallback = ""): string {
  if (!value || isTodo(value)) return fallback;
  return value;
}

export function telHref(number: string): string {
  if (isTodo(number)) return "#";
  return `tel:${number.replace(/\s+/g, "")}`;
}

export function waHref(number: string, message?: string): string {
  if (isTodo(number)) return "#";
  const digits = number.replace(/[^\d]/g, "");
  const q = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${q}`;
}
