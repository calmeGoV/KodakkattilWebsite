import Link from "next/link";

import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

/**
 * The masthead every inner page opens with. Keeps the 7/5 asymmetry and the
 * brass hairline binding, so an inner page reads as another leaf in the same
 * manuscript rather than a different site.
 */
export function PageHeader({
  kicker,
  title,
  intro,
  crumbs,
  tone = "ink",
  children,
}: {
  kicker?: string;
  title: string;
  intro?: string;
  crumbs?: Crumb[];
  tone?: "ink" | "light";
  children?: React.ReactNode;
}) {
  const light = tone === "light";

  return (
    <header
      className={cn(
        "hairline-b relative isolate overflow-hidden pb-16 pt-12 lg:pb-20 lg:pt-16",
        light ? "on-dark bg-primary-deep text-surface" : "bg-surface-raised",
      )}
    >
      {light && <div className="grain grain-light absolute inset-0" aria-hidden="true" />}

      <div className="relative mx-auto max-w-[84rem] px-5 lg:px-10">
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-xs">
              {crumbs.map((c, i) => (
                <li key={`${c.label}-${i}`} className="flex items-center gap-2">
                  {i > 0 && (
                    <span aria-hidden="true" className={light ? "text-surface/30" : "text-ink-faint/50"}>
                      /
                    </span>
                  )}
                  {c.href ? (
                    <Link
                      href={c.href}
                      className={cn(
                        "transition-colors",
                        light
                          ? "text-surface/60 hover:text-accent-glow"
                          : "text-ink-faint hover:text-accent-ink",
                      )}
                    >
                      {c.label}
                    </Link>
                  ) : (
                    <span
                      aria-current="page"
                      className={light ? "text-accent-glow" : "text-accent-ink"}
                    >
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="grid gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            {kicker && (
              <p
                className={cn(
                  "label-caps flex items-center gap-3",
                  light ? "text-accent-glow" : "text-accent-ink",
                )}
              >
                <span className="inline-block h-px w-8 bg-accent" aria-hidden="true" />
                {kicker}
              </p>
            )}
            <h1
              className={cn(
                "mt-5 max-w-[18ch] text-4xl font-semibold",
                light ? "text-surface" : "text-ink",
              )}
            >
              {title}
            </h1>
          </Reveal>

          {(intro || children) && (
            <Reveal index={1} className="flex flex-col justify-end gap-5 lg:col-span-5">
              {intro && (
                <p className={cn("max-w-[48ch]", light ? "text-surface/70" : "text-ink-muted")}>
                  {intro}
                </p>
              )}
              {children}
            </Reveal>
          )}
        </div>
      </div>
    </header>
  );
}
