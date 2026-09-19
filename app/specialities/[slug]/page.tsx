import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DoctorCard } from "@/components/doctors/doctor-card";
import { BookingCta } from "@/components/home/booking-cta";
import { SpecialityIcon } from "@/components/icons/speciality-icons";
import { PageHeader } from "@/components/layout/page-header";
import { MedicalDisclaimer } from "@/components/ui/medical-disclaimer";
import { Reveal } from "@/components/ui/reveal";
import {
  doctorsForSpeciality,
  getSpeciality,
  packagesForSpeciality,
  specialities,
} from "@/lib/content";
import type { Package } from "@/types/content";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return specialities.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const s = getSpeciality(slug);
  if (!s) return {};
  return {
    title: s.name,
    description: s.summary,
    alternates: { canonical: `/specialities/${s.slug}` },
    openGraph: { title: s.name, description: s.summary },
  };
}

export default async function SpecialityPage({ params }: Params) {
  const { slug } = await params;
  const s = getSpeciality(slug);
  if (!s) notFound();

  const doctors = doctorsForSpeciality(s.slug);
  const progs = packagesForSpeciality(s.slug) as unknown as Package[];

  const groups = s.groups ?? [{ title: "What we treat", services: s.services ?? [] }];

  return (
    <>
      <PageHeader
        kicker={s.sanskrit}
        title={s.name}
        intro={s.summary}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Specialities", href: "/specialities" },
          { label: s.name },
        ]}
      >
        <div className="flex items-center gap-4">
          <SpecialityIcon name={s.icon} className="h-10 w-10 text-accent-ink" />
          {s.malayalam && (
            <p lang="ml" className="text-lg text-ink-muted">
              {s.malayalam}
            </p>
          )}
        </div>
      </PageHeader>

      <section className="bg-surface pt-12 lg:pt-20">
        <div className="mx-auto max-w-[84rem] px-5 lg:px-10">
          <Reveal>
            <div className="relative aspect-[16/9] lg:aspect-[21/9] w-full overflow-hidden rounded-xl border border-ink/10 bg-surface-raised shadow-sm">
              <img
                src={`/images/specialities/${s.slug}.jpg`}
                alt={s.name}
                loading="eager"
                decoding="sync"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── What we treat ─────────────────────────────────────────── */}
      <section
        aria-labelledby="treats-heading"
        className="hairline-b bg-surface py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[84rem] px-5 lg:px-10">
          <Reveal>
            <h2 id="treats-heading" className="text-3xl font-semibold text-ink">
              What we treat
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            {groups.map((g, gi) => (
              <Reveal key={g.title} index={gi}>
                <h3 className="label-caps border-t border-accent/40 pt-4 text-accent-ink">
                  {g.title}
                </h3>
                <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {g.services.map((item) => (
                    <li key={item} className="flex gap-3 text-ink-muted">
                      <span
                        aria-hidden="true"
                        className="mt-3 h-px w-4 shrink-0 bg-accent"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Programmes ────────────────────────────────────────────── */}
      {progs.length > 0 && (
        <section
          aria-labelledby="progs-heading"
          className="hairline-b bg-surface-raised py-20 lg:py-28"
        >
          <div className="mx-auto max-w-[84rem] px-5 lg:px-10">
            <Reveal>
              <h2 id="progs-heading" className="text-3xl font-semibold text-ink">
                Programmes for {s.name.toLowerCase()}
              </h2>
            </Reveal>

            <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {progs.map((p, i) => (
                <Reveal as="li" key={p.slug} index={i} className="flex">
                  <Link
                    href={`/packages#${p.slug}`}
                    className="group flex w-full flex-col rounded-card border border-ink/12 bg-surface p-6 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent/60"
                  >
                    <p className="label-caps text-accent-ink">{p.duration}</p>
                    <h3 className="mt-3 font-display text-lg font-semibold text-ink">
                      {p.name}
                    </h3>
                    {p.summary && (
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
                        {p.summary}
                      </p>
                    )}
                    <span
                      aria-hidden="true"
                      className="mt-6 inline-block h-px w-8 bg-accent transition-all duration-200 group-hover:w-14"
                    />
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── Who you will see ──────────────────────────────────────── */}
      {doctors.length > 0 && (
        <section
          aria-labelledby="who-heading"
          className="hairline-b bg-surface py-20 lg:py-28"
        >
          <div className="mx-auto max-w-[84rem] px-5 lg:px-10">
            <Reveal>
              <h2 id="who-heading" className="text-3xl font-semibold text-ink">
                Who you will see
              </h2>
            </Reveal>

            <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {doctors.map((d, i) => (
                <Reveal as="li" key={d.slug} index={i} className="flex">
                  <DoctorCard
                    doctor={d}
                    className="w-full"
                    sizes="(max-width: 640px) 90vw, 22vw"
                  />
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      <MedicalDisclaimer />
      <BookingCta />
    </>
  );
}
