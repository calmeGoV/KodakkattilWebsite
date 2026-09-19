import { cn, isDev } from "@/lib/utils";

type Props = {
  kind?: "placeholder" | "draft" | "stat";
  label?: string;
  className?: string;
};

const COPY = {
  placeholder: "PLACEHOLDER — not real content",
  draft: "DRAFT — awaiting clinician sign-off",
  stat: "TODO_STAT — figure not verified",
} as const;

/**
 * Loud in development, absent in production.
 *
 * The point is that unfinished content is impossible to miss while building,
 * and impossible to ship by accident. Nothing here is styled to blend in.
 */
export function PlaceholderBadge({ kind = "placeholder", label, className }: Props) {
  if (!isDev) return null;

  return (
    <span
      className={cn(
        "label-caps inline-flex items-center gap-1.5 rounded-xs border border-danger/70",
        "bg-danger/10 px-1.5 py-0.5 text-[0.625rem] leading-none text-danger",
        className,
      )}
      data-dev-placeholder={kind}
    >
      <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true">
        <path d="M5 0.5 9.5 9h-9z" fill="currentColor" />
      </svg>
      {label ?? COPY[kind]}
    </span>
  );
}

/**
 * Production-safe stand-in for an unverified number. Renders a quiet em dash
 * for patients and a loud badge for us.
 */
export function StatPending({ className }: { className?: string }) {
  if (isDev) return <PlaceholderBadge kind="stat" className={className} />;
  return (
    <span className={cn("text-accent-glow/60", className)} aria-hidden="true">
      —
    </span>
  );
}
