"use client";

import Link from "next/link";
import { useRef } from "react";

import { GoogleReviewsBadge } from "@/components/testimonials/google-reviews-badge";
import {
  FeaturedStory,
  TestimonialCard,
} from "@/components/testimonials/testimonial-card";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { Reveal } from "@/components/ui/reveal";
import { t } from "@/lib/i18n";
import type { Testimonial, TestimonialGroup } from "@/types/content";

type Group = { id: TestimonialGroup; label: string; blurb: string };

type Props = {
  groups: Group[];
  /** Already filtered by the data layer — nothing without consent reaches here. */
  items: Testimonial[];
  kicker: string;
  title: string;
  intro: string;
  cta: { label: string; href: string };
};

/**
 * ── Voices of Trust ──────────────────────────────────────────────────────
 */
export function VoicesOfTrust({
  groups,
  items,
  kicker,
  title,
  intro,
  cta,
}: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const hasAny = items.length > 0;

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  return (
    <section
      aria-labelledby="voices-heading"
      className="hairline-b bg-surface-raised py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[84rem] px-5 lg:px-10">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="grid gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="label-caps flex items-center gap-3 text-accent-ink">
              <span className="inline-block h-px w-8 bg-accent" aria-hidden="true" />
              {kicker}
            </p>
            <h2
              id="voices-heading"
              className="mt-5 max-w-[16ch] text-3xl font-semibold text-ink"
            >
              {title}
            </h2>
          </Reveal>

          <Reveal index={1} className="flex flex-col justify-end gap-5 lg:col-span-5">
            <p className="max-w-[46ch] text-ink-muted">{intro}</p>
            <div className="flex flex-wrap items-center gap-4">
              <GoogleReviewsBadge />
              <Link
                href={cta.href}
                className="group inline-flex items-center gap-3 text-accent-ink transition-colors hover:text-primary"
              >
                <span className="label-caps">{cta.label}</span>
                <span
                  aria-hidden="true"
                  className="inline-block h-px w-10 bg-accent transition-all duration-200 group-hover:w-14"
                />
              </Link>
            </div>
          </Reveal>
        </div>

        {/* ── Panels ─────────────────────────────────────────────────── */}
        {hasAny ? (
          <Reveal className="mt-14 relative group/slider">
            <button 
              onClick={scrollLeft}
              aria-label="Scroll left"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 lg:-translate-x-6 z-10 hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-surface shadow-md border border-ink/10 text-ink opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-surface-raised"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>

            <button 
              onClick={scrollRight}
              aria-label="Scroll right"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 lg:translate-x-6 z-10 hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-surface shadow-md border border-ink/10 text-ink opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-surface-raised"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>

            <div 
              ref={scrollContainerRef}
              className="-mx-5 overflow-x-auto px-5 pb-8 lg:-mx-10 lg:px-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
            >
              <ul className="flex w-max gap-5 snap-x snap-mandatory">
                {items.map((item) => (
                  <li key={item.slug} className="flex w-[85vw] max-w-[400px] snap-center lg:w-[400px]">
                    <TestimonialCard item={item} />
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ) : (
          <EmptyState groups={groups} />
        )}
      </div>
    </section>
  );
}

/**
 * What a visitor sees before any consented story exists. Deliberately honest
 * rather than filled with invented quotes.
 */
function EmptyState({ groups }: { groups: Group[] }) {
  return (
    <Reveal className="mt-12 rounded-card border border-dashed border-accent/50 bg-surface p-8 lg:p-12">
      <p className="max-w-[52ch] text-ink-muted">{t("testimonials.empty")}</p>

      <ul className="mt-6 flex flex-wrap gap-2">
        {groups.map((g) => (
          <li
            key={g.id}
            className="rounded-xs bg-primary-tint px-3 py-1.5 text-xs text-primary"
          >
            {g.label}
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <PlaceholderBadge label="TODO_TESTIMONIALS — 6 seeded entries all have consentOnFile: false, so none render" />
      </div>
    </Reveal>
  );
}
