import type { Metadata } from "next";
import Link from "next/link";

import { BookingCta } from "@/components/home/booking-cta";
import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { MedicalDisclaimer } from "@/components/ui/medical-disclaimer";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { Reveal } from "@/components/ui/reveal";
import { getSpeciality, packages } from "@/lib/content";
import type { Package } from "@/types/content";

export const metadata: Metadata = {
  title: "Programs & Packages",
  description:
    "Structured Ayurvedic programmes built around a stage of life — pregnancy, postnatal recovery, PCOS, child development and mental wellness.",
  alternates: { canonical: "/packages" },
};

export default function PackagesPage() {
  const items = packages.items as unknown as Package[];

  return (
    <>
      <PageHeader
        kicker="Programs & Packages"
        title="Programmes built around a stage of life, not a single complaint."
        intro={packages.intro}
        crumbs={[{ label: "Home", href: "/" }, { label: "Packages" }]}
      />

      <section className="hairline-b bg-surface py-16 lg:py-20">
        <div className="mx-auto max-w-[84rem] px-5 lg:px-10">
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {items.map((p, i) => {
              const spec = getSpeciality(p.speciality);
              return (
                <Reveal as="li" key={p.slug} index={i % 3} className="flex">
                  <article
                    id={p.slug}
                    className="flex w-full scroll-mt-28 flex-col rounded-card border border-ink/12 bg-surface-raised p-7"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="label-caps text-accent-ink">{p.duration}</p>
                      {spec && (
                        <Link
                          href={`/specialities/${spec.slug}`}
                          className="rounded-xs bg-primary-tint px-2 py-0.5 text-[0.6875rem] text-primary hover:bg-primary hover:text-surface"
                        >
                          {spec.name}
                        </Link>
                      )}
                    </div>

                    <h2 className="mt-3 font-display text-xl font-semibold text-ink">
                      {p.name}
                    </h2>

                    {p.summary && (
                      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                        {p.summary}
                      </p>
                    )}

                    <h3 className="label-caps mt-6 border-t border-accent/30 pt-4 text-ink-faint">
                      Includes
                    </h3>
                    <ul className="mt-3 flex-1 space-y-2">
                      {p.includes.map((inc) => (
                        <li key={inc} className="flex gap-2.5 text-sm text-ink-muted">
                          <span aria-hidden="true" className="mt-2.5 h-px w-3 shrink-0 bg-accent" />
                          {inc}
                        </li>
                      ))}
                    </ul>

                    {/* Pricing is deliberately not published; it follows assessment. */}
                    <p className="mt-6 text-xs text-ink-faint">
                      Cost is confirmed after your first consultation, once the plan
                      and its length are known.
                    </p>

                    <PlaceholderBadge className="mt-3 self-start" />

                    <ButtonLink
                      href={`/book?package=${p.slug}`}
                      intent="action"
                      className="mt-5 w-full"
                    >
                      Enquire about this programme
                    </ButtonLink>
                  </article>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      <MedicalDisclaimer />
      <BookingCta />
    </>
  );
}
