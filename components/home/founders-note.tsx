import Link from "next/link";

import { DoctorPortrait } from "@/components/doctors/doctor-portrait";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { Reveal } from "@/components/ui/reveal";
import { TextLink } from "@/components/ui/button";
import { doctors, home } from "@/lib/content";
import type { Doctor } from "@/types/content";

/**
 * The source document has founder biographies but no signed joint note, so
 * nothing here is written in their voice. The pull-quote is lifted verbatim
 * from "Our Story"; each founder's paragraph is verbatim from their own bio.
 * A real letter drops into the TODO_FOUNDERS_LETTER slot below.
 */
const PULL_QUOTE =
  "For us, every patient is more than a diagnosis—they are a valued member of our extended family.";

export function FoundersNote() {
  const founders = doctors.filter((d) => d.isFounder);
  const { founders: section } = home.sections;

  return (
    <section
      aria-labelledby="founders-heading"
      className="hairline-b relative isolate overflow-hidden bg-surface-raised py-20 lg:py-28"
    >
      <div className="grain absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-[84rem] px-5 lg:px-10">
        <Reveal>
          <p className="label-caps flex items-center gap-3 text-accent-ink">
            <span className="inline-block h-px w-8 bg-accent" aria-hidden="true" />
            {section.kicker}
          </p>
        </Reveal>

        <Reveal index={1}>
          {/*
            The quote is set on a single line from `lg` up.

            It is 96 characters, so the size that fits is derived from the
            container rather than picked: the column is min(84rem, 100vw − 5rem)
            wide, and Fraunces sets this string in roughly 47em, so dividing the
            column by 50 leaves about 6% headroom against overflow. Capping at
            1.68rem stops it growing past the container on very wide screens.

            Below `lg` it wraps. One line on a 390px phone would be about 8px
            type, so the nowrap is deliberately not applied there.
          */}
          <blockquote className="mt-8 max-w-[24ch] lg:max-w-none">
            <p
              id="founders-heading"
              className="font-display text-4xl font-semibold leading-[1.1] text-ink lg:whitespace-nowrap lg:text-[min(1.68rem,calc((100vw-5rem)/50))]"
            >
              <span aria-hidden="true" className="text-accent">
                &ldquo;
              </span>
              {PULL_QUOTE}
            </p>
          </blockquote>
        </Reveal>

        <div className="mt-16 grid gap-x-10 gap-y-14 lg:grid-cols-2">
          {founders.map((founder, i) => (
            <Reveal key={founder.slug} index={i} className="flex flex-col">
              <FounderBlock doctor={founder} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 border-t border-accent/30 pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <PlaceholderBadge label="TODO_FOUNDERS_LETTER — a signed note in the founders' own words belongs here" />
            <TextLink href={section.cta.href}>{section.cta.label}</TextLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FounderBlock({ doctor }: { doctor: Doctor }) {
  return (
    <figure className="flex flex-col gap-6 sm:flex-row sm:items-start">
      <DoctorPortrait
        doctor={doctor}
        className="w-full shrink-0 sm:w-64 sm:h-[434.73px]"
        sizes="(max-width: 640px) 90vw, 16rem"
      />

      <figcaption className="flex min-w-0 flex-col">
        <h3 className="font-display text-xl font-semibold text-ink">{doctor.name}</h3>
        <p className="mt-1.5 text-sm text-accent-ink">{doctor.qualifications}</p>
        <p className="label-caps mt-3 text-ink-faint">{doctor.role}</p>

        <p className="mt-5 text-sm leading-relaxed text-ink-muted">{doctor.bio[1]}</p>

        {/* Signature-styled setting of the name — a scanned signature can
            replace this without touching the layout. */}
        <div className="mt-6 flex items-end gap-3">
          <span className="font-display text-2xl italic text-primary">
            {doctor.name}
          </span>
          <span aria-hidden="true" className="mb-1.5 h-px flex-1 bg-accent/50" />
        </div>
        <PlaceholderBadge className="mt-2 self-start" label="TODO_SIGNATURE_SCAN" />

        <Link
          href={`/doctors/${doctor.slug}`}
          className="label-caps mt-6 inline-flex items-center gap-2 self-start text-accent-ink hover:text-primary"
        >
          Read full profile
          <span aria-hidden="true">→</span>
        </Link>
      </figcaption>
    </figure>
  );
}
