"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { ArchivalImage } from "@/components/legacy/archival-image";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { t } from "@/lib/i18n";
import type { Generation } from "@/types/content";
import { cn, copy, isTodo } from "@/lib/utils";

type Props = {
  generations: Generation[];
  kicker: string;
  title: string;
  intro: string;
  outro: string;
  cta: { label: string; href: string };
};

/**
 * ── The signature element ────────────────────────────────────────────────
 *
 * A thaliyola — a palm-leaf manuscript — unrolled sideways. Each generation is
 * a leaf; a brass binding cord runs above them and fills left to right as you
 * scroll. See DESIGN.md §5.
 *
 * Deliberately built on NATIVE horizontal scroll rather than a pinned,
 * scroll-jacked section. Scroll progress drives the cord; the cord never
 * drives the page. That keeps it usable with a trackpad, a keyboard, a screen
 * reader and a slow phone — which is most of this audience.
 *
 * Performance note: cord fill is written straight to a CSS custom property in
 * a rAF, so continuous scrolling never re-renders React. Only the discrete
 * `activeIndex` — which changes a handful of times — goes through state.
 */
export function LineageRail({
  generations,
  kicker,
  title,
  intro,
  outro,
  cta,
}: Props) {
  const railRef = useRef<HTMLDivElement>(null);
  const cordRef = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const total = generations.length;

  const measure = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;

    const max = rail.scrollWidth - rail.clientWidth;
    const progress = max > 0 ? Math.min(1, Math.max(0, rail.scrollLeft / max)) : 1;

    cordRef.current?.style.setProperty("--lineage-progress", String(progress));

    setActiveIndex(Math.round(progress * (total - 1)));
    setAtStart(rail.scrollLeft <= 4);
    setAtEnd(rail.scrollLeft >= max - 4);
  }, [total]);

  const onScroll = useCallback(() => {
    if (frame.current !== null) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      measure();
    });
  }, [measure]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [measure]);

  const step = (direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const leaf = rail.querySelector<HTMLElement>("[data-leaf]");
    const distance = leaf ? leaf.offsetWidth + 32 : rail.clientWidth * 0.8;
    rail.scrollBy({ left: distance * direction, behavior: "smooth" });
  };

  return (
    <section
      aria-labelledby="lineage-heading"
      className="on-dark relative isolate overflow-hidden bg-primary-deep py-20 text-surface lg:py-28"
    >
      <div className="grain grain-light absolute inset-0" aria-hidden="true" />

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="relative mx-auto max-w-[84rem] px-5 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="label-caps flex items-center gap-3 text-accent-glow">
              <span className="inline-block h-px w-8 bg-accent" aria-hidden="true" />
              {kicker}
            </p>
            <h2
              id="lineage-heading"
              className="mt-5 max-w-[14ch] text-4xl font-semibold text-surface"
            >
              {title}
            </h2>
          </div>
          <div className="flex flex-col justify-end lg:col-span-5">
            <p className="max-w-[46ch] text-surface/70">{intro}</p>
          </div>
        </div>
      </div>

      {/* ── The binding cord ───────────────────────────────────────────── */}
      <div className="relative mx-auto mt-16 max-w-[84rem] px-5 lg:px-10">
        <div ref={cordRef} className="relative h-10">
          {/* unlit cord */}
          <div
            className="absolute left-0 right-0 top-4 h-px bg-accent/20"
            aria-hidden="true"
          />
          {/* brass fills to scroll progress — the one orchestrated moment */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-4 h-px origin-left bg-gradient-to-r from-accent to-accent-glow"
            style={{
              transform: "scaleX(var(--lineage-progress, 0))",
              willChange: "transform",
            }}
          />

          {/* generation markers */}
          <ul className="absolute inset-x-0 top-0 flex items-start justify-between">
            {generations.map((gen, i) => {
              const lit = i <= activeIndex;
              const present = gen.isPresent === true;
              return (
                <li key={gen.order} className="flex flex-col items-center">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-[0.5625rem] block h-[0.875rem] w-[0.875rem] rounded-full border transition-colors duration-300",
                      present
                        ? lit
                          ? // The living generation. The one documented exception
                            // to the turmeric-means-action rule. DESIGN.md §5.
                            "border-warm bg-warm"
                          : "border-warm/50 bg-primary-deep"
                        : lit
                          ? "border-accent-glow bg-accent-glow"
                          : "border-accent/40 bg-primary-deep",
                    )}
                  />
                  <span
                    className={cn(
                      "label-caps mt-3 hidden text-[0.5625rem] transition-colors duration-300 sm:block",
                      lit ? "text-accent-glow" : "text-surface/35",
                    )}
                  >
                    {isTodo(gen.era) ? `0${gen.order}` : gen.era.split("–")[0].trim()}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ── Rail controls ───────────────────────────────────────────── */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="max-w-[44ch] text-xs text-surface/50">
            {t("legacy.rail.instructions")}
          </p>
          <div className="flex shrink-0 gap-2">
            <RailButton
              direction="prev"
              onClick={() => step(-1)}
              disabled={atStart}
              label={t("legacy.rail.prev")}
            />
            <RailButton
              direction="next"
              onClick={() => step(1)}
              disabled={atEnd}
              label={t("legacy.rail.next")}
            />
          </div>
        </div>
      </div>

      {/* ── The leaves ─────────────────────────────────────────────────── */}
      <div
        ref={railRef}
        onScroll={onScroll}
        tabIndex={0}
        role="group"
        aria-label={t("legacy.rail.label")}
        data-snap
        className={cn(
          "rail-scroll relative mt-8 flex snap-x snap-mandatory gap-8 overflow-x-auto",
          "scroll-px-5 px-5 pb-6 lg:scroll-px-10 lg:px-10",
          // Let the last leaf rest against the right edge rather than the gutter.
          "[&>*:last-child]:mr-5 lg:[&>*:last-child]:mr-10",
        )}
      >
        {generations.map((gen, i) => (
          <LineageLeaf key={gen.order} generation={gen} index={i} total={total} />
        ))}
      </div>

      {/* ── Close ──────────────────────────────────────────────────────── */}
      <div className="relative mx-auto mt-10 max-w-[84rem] px-5 lg:px-10">
        <div className="flex flex-col gap-5 border-t border-accent/25 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[48ch] text-surface/70">{outro}</p>
          <Link
            href={cta.href}
            className="group inline-flex shrink-0 items-center gap-3 text-accent-glow transition-colors hover:text-surface"
          >
            <span className="label-caps">{cta.label}</span>
            <span
              aria-hidden="true"
              className="inline-block h-px w-10 bg-accent-glow transition-all duration-200 group-hover:w-14"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

function RailButton({
  direction,
  onClick,
  disabled,
  label,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-cta border transition-colors duration-150",
        disabled
          ? "cursor-not-allowed border-accent/15 text-surface/25"
          : "border-accent/45 text-accent-glow hover:border-accent-glow hover:bg-accent/10",
      )}
    >
      <span className="sr-only">{label}</span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d={direction === "next" ? "M3 8h10M9 4l4 4-4 4" : "M13 8H3M7 4L3 8l4 4"}
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

function LineageLeaf({
  generation: gen,
  index,
  total,
}: {
  generation: Generation;
  index: number;
  total: number;
}) {
  const nameMissing = isTodo(gen.name);
  const eraMissing = isTodo(gen.era);

  return (
    <article
      data-leaf
      className={cn(
        "group relative flex w-[19rem] shrink-0 snap-start flex-col",
        "border border-accent/20 bg-[#132C21] p-6 transition-colors duration-200",
        "hover:border-accent/50 sm:w-[21rem] lg:w-[23rem]",
      )}
    >
      {/* Generation numeral, letterpress-heavy, in brass. */}
      <div className="flex items-baseline justify-between">
        <span
          className="font-display text-2xl font-semibold text-accent/70"
          data-numeral
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="label-caps text-surface/35">
          {t("legacy.generation")} {index + 1} / {total}
        </span>
      </div>

      <p className="label-caps mt-5 text-accent-glow">
        {eraMissing ? <PlaceholderBadge label={gen.era} /> : gen.era}
      </p>

      <h3 className="mt-2 font-display text-xl font-semibold text-surface">
        {nameMissing ? (
          <span className="inline-flex flex-col items-start gap-2">
            <span className="text-surface/40">Name to be confirmed</span>
            <PlaceholderBadge label={gen.name} />
          </span>
        ) : (
          gen.name
        )}
      </h3>

      <p className="label-caps mt-2 text-surface/45">{copy(gen.title, "—")}</p>

      <div className="mt-6">
        <ArchivalImage
          src={gen.image}
          placeholderKey={gen.name}
          placeholderOrdinal={index}
          alt={copy(gen.artifact, `Archival image, generation ${index + 1}`)}
          className="aspect-[4/3] w-full"
          sizes="(max-width: 640px) 80vw, 23rem"
        />
        {/* Letterpress caption under the plate. */}
        <p className="mt-3 border-l border-accent/40 pl-3 text-xs leading-relaxed text-surface/50">
          {isTodo(gen.artifact) || !gen.artifact ? (
            <PlaceholderBadge label={gen.artifact ?? "TODO_ARTIFACT_CAPTION"} />
          ) : (
            gen.artifact
          )}
        </p>
      </div>

      <p className="mt-6 text-sm leading-relaxed text-surface/75">
        {isTodo(gen.contribution) ? (
          <span className="flex flex-col gap-2">
            <PlaceholderBadge label="TODO_CONTRIBUTION" />
            <span className="text-surface/40">{gen.contribution}</span>
          </span>
        ) : (
          gen.contribution
        )}
      </p>

      {gen.isPresent && (
        <p className="label-caps mt-6 flex items-center gap-2 text-warm">
          <span className="inline-block h-2 w-2 rounded-full bg-warm" aria-hidden="true" />
          {t("legacy.present")}
        </p>
      )}
    </article>
  );
}
