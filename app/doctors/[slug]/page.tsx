import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DoctorPortrait } from "@/components/doctors/doctor-portrait";
import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { MedicalDisclaimer } from "@/components/ui/medical-disclaimer";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { Reveal } from "@/components/ui/reveal";
import { doctors, getDoctor, getSpeciality, site } from "@/lib/content";
import { t } from "@/lib/i18n";
import { isTodo } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return doctors.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const d = getDoctor(slug);
  if (!d) return {};
  const description = d.bio[0]?.slice(0, 180);
  return {
    title: d.name,
    description,
    alternates: { canonical: `/doctors/${d.slug}` },
    openGraph: { title: `${d.name} · ${site.name}`, description },
  };
}

export default async function DoctorProfilePage({ params }: Params) {
  const { slug } = await params;
  const doctor = getDoctor(slug);
  if (!doctor) notFound();

  const displayName = isTodo(doctor.name) ? "This doctor" : doctor.name;

  /* Physician JSON-LD — only fields we actually hold. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: displayName,
    jobTitle: doctor.role,
    knowsLanguage: doctor.languages,
    medicalSpecialty: doctor.specialities
      .map((s) => getSpeciality(s)?.name)
      .filter(Boolean),
    worksFor: { "@type": "MedicalOrganization", name: site.nameFull },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHeader
        kicker={doctor.role}
        title={displayName}
        intro={doctor.qualifications}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Doctors", href: "/doctors" },
          { label: displayName },
        ]}
      >
        {doctor.placeholder && <PlaceholderBadge className="self-start" />}
      </PageHeader>

      <section className="hairline-b bg-surface py-16 lg:py-24">
        <div className="mx-auto grid max-w-[84rem] gap-x-12 gap-y-12 px-5 lg:grid-cols-12 lg:px-10">
          {/* ── Left: portrait and the practical facts ─────────────── */}
          <Reveal className="lg:col-span-4">
            <DoctorPortrait
              doctor={doctor}
              className="aspect-[4/5] w-full"
              sizes="(max-width: 1024px) 90vw, 28vw"
              priority
            />

            <dl className="mt-8 space-y-6">
              {doctor.experienceYears != null && (
                <div>
                  <dt className="label-caps text-accent-ink">Years of practice</dt>
                  <dd className="mt-2 flex flex-wrap items-center gap-2 font-display text-2xl font-semibold text-ink">
                    <span data-numeral>{doctor.experienceYears}</span>
                    {doctor.experienceNote?.startsWith("DUMMY") && (
                      <PlaceholderBadge label="DUMMY figure" />
                    )}
                  </dd>
                </div>
              )}

              <div>
                <dt className="label-caps text-accent-ink">{t("doctors.languages")}</dt>
                <dd className="mt-2 text-ink-muted">{doctor.languages.join(" · ")}</dd>
              </div>

              <div>
                <dt className="label-caps text-accent-ink">{t("doctors.modes")}</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {doctor.consultationModes.map((m) => (
                    <span
                      key={m}
                      className="rounded-xs bg-primary-tint px-2.5 py-1 text-xs text-primary"
                    >
                      {m === "in-person"
                        ? t("doctors.inPerson")
                        : t("doctors.teleconsultation")}
                    </span>
                  ))}
                </dd>
              </div>

              {doctor.clinicHours && doctor.clinicHours.length > 0 && (
                <div>
                  <dt className="label-caps text-accent-ink">Consultation hours</dt>
                  <dd className="mt-2 space-y-1.5">
                    {doctor.clinicHours.map((h) => (
                      <p key={h.day} className="text-sm text-ink-muted">
                        <span className="text-ink-faint">{h.day}</span>
                        <br />
                        {isTodo(h.hours) ? <PlaceholderBadge label={h.hours} /> : h.hours}
                      </p>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </Reveal>

          {/* ── Right: bio, focus, booking ─────────────────────────── */}
          <div className="lg:col-span-7 lg:col-start-6">
            <Reveal>
              <h2 className="text-2xl font-semibold text-ink">About {displayName}</h2>
              <div className="mt-6">
                {doctor.bio.map((p, i) => (
                  <p
                    key={i}
                    className="mb-5 max-w-[62ch] text-lg leading-relaxed text-ink-muted"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>

            {doctor.focusAreas.length > 0 && (
              <Reveal index={1} className="mt-10">
                <h3 className="label-caps border-t border-accent/40 pt-4 text-accent-ink">
                  Areas of focus
                </h3>
                <ul className="mt-5 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                  {doctor.focusAreas.map((f) => (
                    <li key={f} className="flex gap-3 text-ink-muted">
                      <span
                        aria-hidden="true"
                        className="mt-3 h-px w-4 shrink-0 bg-accent"
                      />
                      {f}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {doctor.specialities.length > 0 && (
              <Reveal index={2} className="mt-10">
                <h3 className="label-caps border-t border-accent/40 pt-4 text-accent-ink">
                  Specialities
                </h3>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {doctor.specialities.map((s) => {
                    const spec = getSpeciality(s);
                    if (!spec) return null;
                    return (
                      <li key={s}>
                        <Link
                          href={`/specialities/${spec.slug}`}
                          className="inline-block rounded-cta border border-ink/15 px-3 py-1.5 text-sm text-ink-muted transition-colors hover:border-accent hover:text-accent-ink"
                        >
                          {spec.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </Reveal>
            )}

            {doctor.publications && doctor.publications.length > 0 && (
              <Reveal index={3} className="mt-10">
                <h3 className="label-caps border-t border-accent/40 pt-4 text-accent-ink">
                  Publications & talks
                </h3>
                <ul className="mt-5 space-y-2">
                  {doctor.publications.map((p) => (
                    <li key={p} className="text-ink-muted">
                      {p.startsWith("DUMMY") || isTodo(p) ? (
                        <PlaceholderBadge label={p} />
                      ) : (
                        p
                      )}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {/* ── Booking widget, pre-filled with this doctor ───────── */}
            <Reveal index={4} className="mt-12">
              <div className="on-dark relative isolate overflow-hidden rounded-card bg-primary-deep p-7 text-surface lg:p-9">
                <div className="grain grain-light absolute inset-0" aria-hidden="true" />
                <div className="relative">
                  <h3 className="font-display text-xl font-semibold text-surface">
                    Book with {displayName}
                  </h3>
                  <p className="mt-3 max-w-[46ch] text-surface/70">
                    The form arrives with this doctor already selected. Tell us
                    who the appointment is for and roughly what is worrying you.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <ButtonLink href={`/book?doctor=${doctor.slug}`} intent="action">
                      {t("cta.book")}
                    </ButtonLink>
                    <ButtonLink href="/contact" intent="ghost-dark">
                      Contact the clinic
                    </ButtonLink>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <MedicalDisclaimer />
    </>
  );
}
