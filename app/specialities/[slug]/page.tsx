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
      <header className="relative isolate overflow-hidden bg-primary pb-16 pt-12 lg:pb-24 lg:pt-16">
        <div className="grain grain-light absolute inset-0" aria-hidden="true" />
        
        <div className="relative mx-auto max-w-[84rem] px-5 lg:px-10">
          <nav aria-label="Breadcrumb" className="mb-8 lg:mb-16">
            <ol className="flex flex-wrap items-center gap-2 text-xs">
              <li className="flex items-center gap-2">
                <Link href="/" className="text-surface/60 transition-colors hover:text-accent-glow">Home</Link>
                <span aria-hidden="true" className="text-surface/30">/</span>
              </li>
              <li className="flex items-center gap-2">
                <Link href="/specialities" className="text-surface/60 transition-colors hover:text-accent-glow">Specialities</Link>
                <span aria-hidden="true" className="text-surface/30">/</span>
              </li>
              <li className="flex items-center gap-2">
                <span aria-current="page" className="text-accent-glow">{s.name}</span>
              </li>
            </ol>
          </nav>

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            {/* Left: Image */}
            <Reveal>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-surface/10 bg-primary-deep shadow-2xl lg:aspect-[4/3]">
                <img
                  src={`/images/specialities/${s.slug}.jpg`}
                  alt={s.name}
                  loading="eager"
                  decoding="sync"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              </div>
            </Reveal>

            {/* Right: Heading and Text */}
            <Reveal index={1} className="flex flex-col justify-center">
              {s.sanskrit && (
                <p className="label-caps mb-5 flex items-center gap-3 text-accent-glow">
                  <span className="inline-block h-px w-8 bg-accent" aria-hidden="true" />
                  {s.sanskrit}
                </p>
              )}
              <h1 className="text-4xl font-semibold text-surface lg:text-5xl">
                {s.name}
              </h1>

              <div className="mt-6 flex items-center gap-4 lg:mt-8">
                <SpecialityIcon name={s.icon} className="h-10 w-10 text-accent-glow" />
                {s.malayalam && (
                  <p lang="ml" className="text-lg text-surface/70">
                    {s.malayalam}
                  </p>
                )}
              </div>

              {s.summary && (
                <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-surface/80 lg:mt-8">
                  {s.summary}
                </p>
              )}
            </Reveal>
          </div>
        </div>
      </header>

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
