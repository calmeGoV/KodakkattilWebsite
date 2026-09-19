import type { Metadata } from "next";
import Link from "next/link";

import { BookingCta } from "@/components/home/booking-cta";
import { SpecialityIcon } from "@/components/icons/speciality-icons";
import { PageHeader } from "@/components/layout/page-header";
import { MedicalDisclaimer } from "@/components/ui/medical-disclaimer";
import { Reveal } from "@/components/ui/reveal";
import { specialities } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Specialities",
  description:
    "Paediatric care, maternity care, holistic women's care and mental health care — the four pillars of our practice.",
  alternates: { canonical: "/specialities" },
};

export default function SpecialitiesPage() {
  return (
    <>
      <PageHeader
        kicker="Our Specialities"
        title="Four kinds of care, practised deeply rather than broadly."
        intro="Rather than offering everything, the practice has concentrated on four areas across generations. These are they."
        crumbs={[{ label: "Home", href: "/" }, { label: "Specialities" }]}
      />

      <div className="bg-surface">
        {specialities.map((s) => (
          <section
            key={s.slug}
            aria-labelledby={`spec-${s.slug}`}
            className="hairline-b py-16 lg:py-20"
          >
            <div className="mx-auto grid max-w-[84rem] gap-10 px-5 lg:grid-cols-12 lg:px-10">
              <Reveal className="hidden lg:block lg:col-span-3 relative overflow-hidden rounded-cta border border-accent/20 bg-surface-raised h-full min-h-[300px]">
                <img
                  src={`/images/specialities/${s.slug}.jpg`}
                  alt={s.name}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              </Reveal>

              <Reveal className="lg:col-span-4">
                <div className="flex items-start gap-5">
                  <SpecialityIcon
                    name={s.icon}
                    className="h-10 w-10 shrink-0 text-accent-ink"
                  />
                  <div>
                    <p className="label-caps text-accent-ink">{s.sanskrit}</p>
                    <h2
                      id={`spec-${s.slug}`}
                      className="mt-2 text-2xl font-semibold text-ink"
                    >
                      {s.name}
                    </h2>
                    {s.malayalam && (
                      <p lang="ml" className="mt-2 text-ink-faint">
                        {s.malayalam}
                      </p>
                    )}
                  </div>
                </div>

                <p className="mt-6 max-w-[48ch] text-ink-muted">{s.summary}</p>

                <Link
                  href={`/specialities/${s.slug}`}
                  className="group mt-7 inline-flex items-center gap-3 text-accent-ink hover:text-primary"
                >
                  <span className="label-caps">Explore {s.name}</span>
                  <span
                    aria-hidden="true"
                    className="inline-block h-px w-10 bg-accent transition-all duration-200 group-hover:w-14"
                  />
                </Link>
              </Reveal>

              <Reveal index={1} className="lg:col-span-5">
                {s.groups ? (
                  <div className="grid gap-8 sm:grid-cols-2">
                    {s.groups.map((g) => (
                      <div key={g.title}>
                        <h3 className="label-caps border-t border-accent/40 pt-4 text-ink-faint">
                          {g.title}
                        </h3>
                        <ul className="mt-4 space-y-2">
                          {g.services.map((item) => (
                            <li key={item} className="text-sm text-ink-muted">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="grid grid-cols-2 gap-x-8 gap-y-2 border-t border-accent/40 pt-4">
                    {s.services?.map((item) => (
                      <li key={item} className="text-sm text-ink-muted">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </Reveal>
            </div>
          </section>
        ))}
      </div>

      <MedicalDisclaimer />
      <BookingCta />
    </>
  );
}
