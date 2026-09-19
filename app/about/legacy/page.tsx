import type { Metadata } from "next";
import Link from "next/link";

import { ArchivalImage } from "@/components/legacy/archival-image";
import { PageHeader } from "@/components/layout/page-header";
import { BookingCta } from "@/components/home/booking-cta";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { Reveal } from "@/components/ui/reveal";
import { generations, legacy, site } from "@/lib/content";
import { ancestorPortraitPlaceholder } from "@/lib/placeholders";
import type { Generation } from "@/types/content";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "The Ancestral Line",
  description:
    "Five generations of one Ayurvedic family practice in Kerala — the vaidyans who kept it, and the manuscripts, formulations and training they handed down.",
  alternates: { canonical: "/about/legacy" },
  openGraph: {
    title: `The Ancestral Line · ${site.name}`,
    description:
      "Five generations of one Ayurvedic family practice in Kerala, generation by generation.",
    images: [{ url: "/og/legacy.png", width: 1200, height: 630 }],
  },
};

export default function LegacyPage() {
  const list = generations();

  return (
    <>
      <PageHeader
        tone="light"
        kicker={legacy.kicker}
        title={legacy.title}
        intro={legacy.intro}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Our Legacy" },
        ]}
      />

      {/* ── The vertical lineage ─────────────────────────────────────── */}
      <div className="relative isolate overflow-hidden bg-primary-deep">
        <div className="grain grain-light absolute inset-0" aria-hidden="true" />

        <ol className="relative mx-auto max-w-[84rem] px-5 lg:px-10">
          {list.map((gen, i) => (
            <GenerationSection
              key={gen.order}
              generation={gen}
              index={i}
              isLast={i === list.length - 1}
            />
          ))}
        </ol>
      </div>

      {/* ── What Was Preserved ───────────────────────────────────────── */}
      <PreservedThread />

      <BookingCta />
    </>
  );
}

/**
 * Each generation gets a proper section: era, portrait, what they were known
 * for, an archival image with caption, and a classical verse where one
 * genuinely exists.
 *
 * The brass cord runs vertically down the left of the whole list — the same
 * binding cord as the home-page rail, turned ninety degrees. Unlike the rail
 * it does not animate: on a page this long, a fill that tracks scroll would be
 * noise rather than an event.
 */
function GenerationSection({
  generation: gen,
  index,
  isLast,
}: {
  generation: Generation;
  index: number;
  isLast: boolean;
}) {
  return (
    <li className="relative grid gap-x-10 pb-20 pt-20 lg:grid-cols-12 lg:pb-28 lg:pt-28">
      {/* the cord */}
      {!isLast && (
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-[7px] top-8 w-px bg-accent/25 lg:left-[7px]"
        />
      )}
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-0 top-[4.75rem] h-[15px] w-[15px] rounded-full border lg:top-[7.25rem]",
          gen.isPresent
            ? "border-warm bg-warm"
            : "border-accent-glow bg-primary-deep",
        )}
      />

      {/* ── Left column: era, name, verse ─────────────────────────── */}
      <Reveal className="pl-8 lg:col-span-5 lg:pl-10">
        <p className="label-caps text-accent-glow">
          {gen.era}
          {gen.placeholder && (
            <PlaceholderBadge className="ml-2 align-middle" />
          )}
        </p>

        <h2 className="mt-3 font-display text-3xl font-semibold text-surface">
          {gen.name}
        </h2>
        <p className="label-caps mt-3 text-surface/45">{gen.title}</p>

        <figure className="mt-8 max-w-[18rem]">
          <ArchivalImage
            src={gen.portrait ?? ancestorPortraitPlaceholder(gen.name, index)}
            alt={gen.portrait ? `Portrait of ${gen.name}` : ""}
            className="aspect-[4/5] w-full"
            sizes="18rem"
          />
          {!gen.portrait && (
            <figcaption className="mt-3">
              <PlaceholderBadge label="TODO_PORTRAIT_SCAN" />
            </figcaption>
          )}
        </figure>

        {gen.verse && (
          <blockquote className="mt-9 border-l border-accent/50 pl-5">
            <p lang="sa" className="font-display text-lg leading-relaxed text-accent-glow">
              {gen.verse.text}
            </p>
            {gen.verse.transliteration && (
              <p className="mt-3 text-sm italic text-surface/50">
                {gen.verse.transliteration}
              </p>
            )}
            {gen.verse.translation && (
              <p className="mt-3 text-sm leading-relaxed text-surface/75">
                {gen.verse.translation}
              </p>
            )}
            {gen.verse.source && (
              <footer className="label-caps mt-4 text-surface/40">
                {gen.verse.source}
              </footer>
            )}
          </blockquote>
        )}
      </Reveal>

      {/* ── Right column: contribution, artifact, what was preserved ── */}
      <Reveal index={1} className="mt-10 pl-8 lg:col-span-7 lg:mt-0 lg:pl-0">
        <span
          className="font-display text-5xl font-semibold leading-none text-accent/25"
          data-numeral
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-surface/80">
          {gen.contribution}
        </p>

        {gen.artifact && (
          <figure className="mt-10 max-w-[38rem]">
            <ArchivalImage
              src={gen.image}
              placeholderKey={gen.name}
              placeholderOrdinal={index}
              alt={gen.artifact}
              className="aspect-[16/11] w-full"
              sizes="(max-width: 1024px) 90vw, 38rem"
            />
            <figcaption className="mt-3 flex flex-wrap items-center gap-2 border-l border-accent/40 pl-3 text-xs leading-relaxed text-surface/50">
              {gen.artifact}
              {!gen.image && <PlaceholderBadge label="TODO_ARCHIVAL_SCAN" />}
            </figcaption>
          </figure>
        )}

        {gen.preserved && gen.preserved.length > 0 && (
          <div className="mt-10 border-t border-accent/25 pt-6">
            <h3 className="label-caps text-accent-glow">Handed down</h3>
            <ul className="mt-4 space-y-2">
              {gen.preserved.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm leading-relaxed text-surface/70"
                >
                  <span aria-hidden="true" className="mt-2.5 h-px w-4 shrink-0 bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {gen.isPresent && (
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/doctors"
              className="group inline-flex items-center gap-3 text-accent-glow transition-colors hover:text-surface"
            >
              <span className="label-caps">Meet the present generation</span>
              <span
                aria-hidden="true"
                className="inline-block h-px w-10 bg-accent-glow transition-all duration-200 group-hover:w-14"
              />
            </Link>
          </div>
        )}
      </Reveal>
    </li>
  );
}

/**
 * The second, quieter thread: not who practised, but what survived them.
 */
function PreservedThread() {
  const { preservedThread: thread } = legacy;

  return (
    <section
      aria-labelledby="preserved-heading"
      className="hairline-t hairline-b bg-surface-raised py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[84rem] px-5 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <h2
              id="preserved-heading"
              className="max-w-[12ch] text-3xl font-semibold text-ink"
            >
              {thread.title}
            </h2>
          </Reveal>
          <Reveal index={1} className="flex items-end lg:col-span-6 lg:col-start-7">
            <p className="max-w-[52ch] text-lg text-ink-muted">{thread.intro}</p>
          </Reveal>
        </div>

        <dl className="mt-14 grid gap-px overflow-hidden border border-accent/30 bg-accent/30 md:grid-cols-3">
          {thread.items.map((item, i) => (
            <Reveal key={item.kind} index={i} className="bg-surface-raised p-7 lg:p-9">
              <dt className="label-caps text-accent-ink">{item.kind}</dt>
              <dd className="mt-4 leading-relaxed text-ink-muted">{item.body}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
