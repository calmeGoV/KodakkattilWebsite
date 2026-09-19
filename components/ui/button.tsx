import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Four intents, and the turmeric one is load-bearing.
 *
 * `action` is the only place --warm appears in the whole UI. It means "a tap
 * here reaches a human" — booking, calling, submitting. Using it anywhere else
 * breaks the rule set out in DESIGN.md §2.
 */
type Intent = "action" | "primary" | "ghost" | "ghost-dark";

const base =
  "inline-flex items-center justify-center gap-2 rounded-cta px-5 py-3 " +
  "font-medium tracking-[0.01em] transition-[background-color,border-color,color,transform] " +
  "duration-150 ease-out active:translate-y-px whitespace-nowrap " +
  "disabled:pointer-events-none disabled:opacity-50";

const intents: Record<Intent, string> = {
  action:
    "bg-warm text-ink hover:bg-warm-deep hover:text-surface border border-warm-deep/30",
  primary: "bg-primary text-surface hover:bg-primary-mid border border-primary",
  ghost:
    "border border-ink/25 text-ink hover:border-accent hover:text-accent-ink bg-transparent",
  "ghost-dark":
    "border border-accent-glow/40 text-surface hover:border-accent-glow hover:text-accent-glow bg-transparent",
};

type ButtonProps = {
  intent?: Intent;
  children: ReactNode;
  className?: string;
};

export function Button({
  intent = "action",
  className,
  children,
  ...rest
}: ButtonProps & ComponentProps<"button">) {
  return (
    <button className={cn(base, intents[intent], className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  intent = "action",
  className,
  children,
  href,
  ...rest
}: ButtonProps & ComponentProps<typeof Link>) {
  return (
    <Link href={href} className={cn(base, intents[intent], className)} {...rest}>
      {children}
    </Link>
  );
}

/**
 * The inline text link: a brass rule that extends on hover, rather than an
 * arrow glyph. Used for every "more" affordance on the site.
 */
export function TextLink({
  href,
  children,
  className,
  tone = "ink",
  ...rest
}: ComponentProps<typeof Link> & { tone?: "ink" | "light" }) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-3 transition-colors duration-150",
        tone === "light"
          ? "text-accent-glow hover:text-surface"
          : "text-accent-ink hover:text-primary",
        className,
      )}
      {...rest}
    >
      <span className="label-caps">{children}</span>
      <span
        aria-hidden="true"
        className={cn(
          "inline-block h-px w-10 transition-all duration-200 group-hover:w-14",
          tone === "light" ? "bg-accent-glow" : "bg-accent",
        )}
      />
    </Link>
  );
}
