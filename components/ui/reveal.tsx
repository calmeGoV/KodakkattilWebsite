import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  /** Stagger index — 90ms apart, capped so a long list never crawls. */
  index?: number;
  as?: "div" | "section" | "li" | "article" | "header";
};

/**
 * Section-entry reveal: 16px rise + fade, once.
 *
 * This is a SERVER component. It used to be a client component driven by
 * Framer Motion, which meant ~50KB of animation library shipped on every page
 * of the site to move things 16px. The motion is now two CSS properties, and a
 * ~500-byte observer in the root layout flips the attribute that triggers them
 * (see `components/layout/reveal-script.tsx`).
 *
 * Because nothing here is a hook, using `Reveal` no longer drags its callers
 * across the client boundary.
 *
 * The reduced-motion and no-JavaScript cases are both handled in CSS: the
 * element renders in its final state rather than staying invisible.
 */
export function Reveal({ children, className, index = 0, as = "div" }: Props) {
  const Tag = as;
  const delay = Math.min(index, 5) * 90;

  return (
    <Tag
      className={cn("reveal", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      suppressHydrationWarning
    >
      {children}
    </Tag>
  );
}
