import type { Metadata } from "next";
import Link from "next/link";

import { BookingCta } from "@/components/home/booking-cta";
import { FoundersNote } from "@/components/home/founders-note";
import { PageHeader } from "@/components/layout/page-header";
import { MedicalDisclaimer } from "@/components/ui/medical-disclaimer";
import { Reveal } from "@/components/ui/reveal";
import heroPhoto from "@/lib/generated/hero-photo.json";
import { about } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "A 150-year Ayurvedic family practice in Kerala: our story, vision, mission, philosophy and values.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        kicker="About us"
        title={about.story.title}
        intro={about.story.paragraphs[0]}
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      {/* ── Our Story ─────────────────────────────────────────────── */}
      <section className="hairline-b bg-surface py-20 lg:py-28">
        <div className="mx-auto max-w-[84rem] px-5 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-12">
            <Reveal className="hidden lg:block lg:col-span-5 relative overflow-hidden rounded-cta border border-accent/20 bg-surface-raised h-full min-h-[400px]">
              <img
                src="/images/about/story.jpg"
                alt="Mother and infant in a serene Ayurvedic setting"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
            </Reveal>

            <div className="lg:col-span-7 lg:col-start-6">
              {about.story.paragraphs.slice(1).map((p, i) => (
                <Reveal key={i} index={i}>
                  <p className="mb-6 max-w-[64ch] text-lg leading-relaxed text-ink-muted">
                    {p}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal className="mt-10 border-t border-accent/40 pt-8">
            <p className="font-display text-2xl font-semibold text-accent-ink">
              {about.story.strapline}
            </p>
            <Link
              href="/about/legacy"
              className="group mt-6 inline-flex items-center gap-3 text-accent-ink hover:text-primary"
            >
              <span className="label-caps">Walk the full lineage</span>
              <span
                aria-hidden="true"
                className="inline-block h-px w-10 bg-accent transition-all duration-200 group-hover:w-14"
              />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── Vision & Mission ──────────────────────────────────────── */}
      <section
        aria-label="Vision and mission"
        className="on-dark hairline-b relative isolate overflow-hidden bg-primary py-20 text-surface lg:py-28"
      >
        <div className="grain grain-light absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-[84rem] gap-px overflow-hidden border border-accent/30 bg-accent/30 px-0 md:grid-cols-2 lg:mx-auto lg:max-w-[80rem]">
          {[about.vision, about.mission].map((item, i) => (
            <Reveal key={item.title} index={i} className="bg-primary p-8 lg:p-12">
              <h2 className="label-caps text-accent-glow">{item.title}</h2>
              <p className="mt-6 font-display text-2xl font-semibold leading-[1.3] text-surface">
                <span aria-hidden="true" className="text-accent">
                  &ldquo;
                </span>
                {item.statement}
                <span aria-hidden="true" className="text-accent">
                  &rdquo;
                </span>
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Why Choose Us ─────────────────────────────────────────── */}
      <section
        aria-labelledby="why-heading"
        className="hairline-b bg-surface-raised py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[84rem] px-5 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <h2 id="why-heading" className="max-w-[12ch] text-3xl font-semibold text-ink">
                {about.whyChooseUs.title}
              </h2>
            </Reveal>
            <Reveal index={1} className="flex items-end lg:col-span-6 lg:col-start-7">
              <p className="max-w-[52ch] text-lg text-ink-muted">
                {about.whyChooseUs.intro}
              </p>
            </Reveal>
          </div>

          <ol className="mt-14 grid gap-x-10 gap-y-10 md:grid-cols-2">
            {about.whyChooseUs.reasons.map((r, i) => (
              <Reveal as="li" key={r.title} index={i % 4} className="flex gap-5">
                <span
                  className="font-display text-lg font-semibold text-accent/70"
                  data-numeral
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="border-t border-accent/30 pt-1">
                  <h3 className="font-display text-lg font-semibold text-ink">
                    {r.title}
                  </h3>
                  <p className="mt-2 max-w-[52ch] text-ink-muted">{r.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Philosophy ────────────────────────────────────────────── */}
      <section
        aria-labelledby="philosophy-heading"
        className="hairline-b bg-surface py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[84rem] px-5 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-12">
            <Reveal className="hidden lg:block lg:col-span-5 relative overflow-hidden rounded-cta border border-accent/20 bg-surface-raised h-full min-h-[400px]">
              <img
                src="/images/about/philosophy.jpg"
                alt="Ayurveda Philosophy"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
            </Reveal>

            <div className="lg:col-span-7 lg:col-start-6">
              <Reveal>
                <h2
                  id="philosophy-heading"
                  className="mb-8 text-3xl font-semibold text-ink"
                >
                  {about.philosophy.title}
                </h2>
              </Reveal>
              {about.philosophy.paragraphs.map((p, i) => (
                <Reveal key={i} index={i + 1}>
                  <p className="mb-6 max-w-[62ch] text-lg leading-relaxed text-ink-muted">
                    {p}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal className="mt-12">
            <p className="text-lg text-ink">{about.philosophy.principlesIntro}</p>
          </Reveal>

          <ol className="mt-8 grid gap-px overflow-hidden border border-accent/30 bg-accent/30 md:grid-cols-2 lg:grid-cols-4">
            {about.philosophy.principles.map((p, i) => (
              <Reveal as="li" key={p.title} index={i} className="bg-surface p-7">
                <span
                  className="font-display text-xl font-semibold text-accent"
                  data-numeral
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{p.body}</p>
              </Reveal>
            ))}
          </ol>

          <Reveal className="mt-12">
            <p className="max-w-[72ch] text-lg leading-relaxed text-ink-muted">
              {about.philosophy.closing}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────────────── */}
      <section
        aria-labelledby="values-heading"
        className="hairline-b bg-surface-raised py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[84rem] px-5 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <h2 id="values-heading" className="text-3xl font-semibold text-ink">
                {about.values.title}
              </h2>
            </Reveal>
            <Reveal index={1} className="flex items-end lg:col-span-6 lg:col-start-7">
              <p className="max-w-[52ch] text-lg text-ink-muted">{about.values.intro}</p>
            </Reveal>
          </div>

          <dl className="mt-14 grid gap-x-10 gap-y-9 md:grid-cols-2 lg:grid-cols-3">
            {about.values.items.map((v, i) => (
              <Reveal key={v.title} index={i % 3}>
                <dt className="border-t border-accent/40 pt-4 font-display text-lg font-semibold text-ink">
                  {v.title}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-muted">{v.body}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <FoundersNote />

      <MedicalDisclaimer />
      <BookingCta />
    </>
  );
}
