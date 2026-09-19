"use client";

import { useEffect, useRef, useState } from "react";

import { StatPending } from "@/components/ui/placeholder-badge";
import type { Stat } from "@/types/content";
import { cn } from "@/lib/utils";

/**
 * Not a row of big thin numbers. An inscription: dark ground, brass hairline
 * verticals, Fraunces tabular numerals. See DESIGN.md §7, row 4.
 *
 * Only figures verifiable from the source document carry a number. Anything
 * else renders as a visible TODO_STAT chip rather than an invented figure.
 *
 * The count-up runs on a plain IntersectionObserver and `matchMedia`. It used
 * Framer Motion's `useInView` / `useReducedMotion`, which meant the whole
 * animation library was pulled in for two hooks.
 */
export function LedgerBand({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      aria-label="Practice at a glance"
      className="on-dark relative isolate overflow-hidden bg-primary py-12 text-surface lg:py-16"
      ref={ref}
    >
      <div className="grain grain-light absolute inset-0" aria-hidden="true" />
      <dl className="relative mx-auto grid max-w-[84rem] grid-cols-2 gap-y-10 px-5 lg:grid-cols-4 lg:px-10">
        {stats.map((stat, i) => (
          <div
            key={stat.id}
            className={cn(
              "flex flex-col items-start px-2 lg:px-8",
              // Brass hairline verticals between cells, not around them.
              i % 2 === 1 && "border-l border-accent/30",
              "lg:border-l lg:border-accent/30 lg:first:border-l-0",
            )}
          >
            <dd
              className="font-display text-4xl font-semibold leading-none text-accent-glow"
              data-numeral
            >
              {!stat.verified || stat.value === null ? (
                <StatPending />
              ) : stat.display ? (
                // A worded figure. Rendered as-is — there is nothing sensible
                // to count up to.
                stat.display
              ) : (
                <CountUp
                  to={stat.value}
                  suffix={stat.suffix}
                  start={inView}
                  delay={i * 120}
                />
              )}
            </dd>
            <dt className="label-caps mt-4 text-surface/60">{stat.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** Honours the OS reduced-motion setting without a library. */
function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  );
}

function CountUp({
  to,
  suffix,
  start,
  delay,
}: {
  to: number;
  suffix: string;
  start: boolean;
  delay: number;
}) {
  // Render the final value on the server and on first paint, so the number is
  // never missing if scripting or the observer is unavailable.
  const [value, setValue] = useState(to);

  useEffect(() => {
    if (!start || prefersReducedMotion()) return;

    let raf = 0;
    const DURATION = 1400;
    setValue(0);

    const timeout = window.setTimeout(() => {
      const began = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - began) / DURATION);
        // ease-out cubic — arrives, does not overshoot
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(Math.round(eased * to));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);

    return () => {
      window.clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [start, to, delay]);

  return (
    <span>
      {/* The final value is always in the accessibility tree, never the
          intermediate count. */}
      <span aria-hidden="true">{value}</span>
      <span className="sr-only">{to}</span>
      {suffix}
    </span>
  );
}
