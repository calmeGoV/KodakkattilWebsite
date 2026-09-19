import type { Metadata } from "next";

import { BookingCta } from "@/components/home/booking-cta";
import { PageHeader } from "@/components/layout/page-header";
import { MedicalDisclaimer } from "@/components/ui/medical-disclaimer";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { Reveal } from "@/components/ui/reveal";
import { treatments } from "@/lib/content";

export const metadata: Metadata = {
  title: "Treatments & Therapies",
  description:
    "Panchakarma, Abhyanga, Shirodhara, Kizhi and the other classical therapies practised here.",
  alternates: { canonical: "/treatments" },
};

export default function TreatmentsPage() {
  return (
    <>
      <PageHeader
        kicker="Treatments & Therapies"
        title="Classical therapies, prepared the way they always have been here."
        intro={treatments.intro}
        crumbs={[{ label: "Home", href: "/" }, { label: "Treatments" }]}
      />

      <section className="hairline-b bg-surface py-16 lg:py-20">
        <div className="mx-auto max-w-[84rem] px-5 lg:px-10">
          <dl className="grid gap-px overflow-hidden border border-accent/30 bg-accent/30 md:grid-cols-2">
            {treatments.items.map((item, i) => (
              <Reveal
                key={item.slug}
                index={i % 4}
                className="scroll-mt-28 bg-surface p-7 lg:p-9"
              >
                <div id={item.slug} className="scroll-mt-28">
                  {["panchakarma", "abhyanga", "pizhichil", "njavarakizhi", "shirodhara", "kizhi"].includes(item.slug) && (
                    <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-sm border border-accent/20 bg-surface-raised">
                      <img
                        src={`/images/treatments/${item.slug}.jpg`}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover object-center"
                      />
                    </div>
                  )}
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <dt className="font-display text-xl font-semibold text-ink">
                      {item.name}
                    </dt>
                    <div className="flex items-baseline gap-3">
                      {item.sanskrit && (
                        <span lang="sa" className="text-accent-ink">
                          {item.sanskrit}
                        </span>
                      )}
                      {item.malayalam && (
                        <span lang="ml" className="text-sm text-ink-faint">
                          {item.malayalam}
                        </span>
                      )}
                    </div>
                  </div>

                  <dd className="mt-4 max-w-[54ch] leading-relaxed text-ink-muted">
                    {item.note}
                  </dd>

                  <PlaceholderBadge kind="draft" className="mt-4" />
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <MedicalDisclaimer />
      <BookingCta />
    </>
  );
}
