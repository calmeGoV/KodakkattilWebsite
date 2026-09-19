import type { Metadata } from "next";

import { BookingCta } from "@/components/home/booking-cta";
import { PageHeader } from "@/components/layout/page-header";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { Reveal } from "@/components/ui/reveal";
import { journey } from "@/lib/content";
import type { JourneyStep } from "@/types/content";

export const metadata: Metadata = {
  title: "Your Patient Journey",
  description:
    "From the first message to follow-up care: booking, consultation, assessment, plan, therapies and review.",
  alternates: { canonical: "/patient-journey" },
};

export default function PatientJourneyPage() {
  const steps = journey.steps as JourneyStep[];

  return (
    <>
      <PageHeader
        kicker="Patient Journey"
        title={journey.title}
        intro={journey.intro}
        crumbs={[{ label: "Home", href: "/" }, { label: "Patient Journey" }]}
      />

      <section className="hairline-b bg-surface py-16 lg:py-24">
        <div className="mx-auto max-w-[84rem] px-5 lg:px-10">
          <ol className="relative">
            {steps.map((step, i) => (
              <Reveal as="li" key={step.order} index={i} className="relative grid gap-x-10 pb-14 lg:grid-cols-12">
                {/* the vertical rule, echoing the lineage cord */}
                {i < steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-[7px] top-9 w-px bg-accent/30"
                  />
                )}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-2 h-[15px] w-[15px] rounded-full border border-accent bg-surface"
                />

                <div className="pl-9 lg:col-span-4">
                  <span
                    className="font-display text-3xl font-semibold leading-none text-accent/50"
                    data-numeral
                    aria-hidden="true"
                  >
                    {String(step.order).padStart(2, "0")}
                  </span>
                  <h2 className="mt-4 font-display text-2xl font-semibold text-ink">
                    {step.name}
                  </h2>
                </div>

                <div className="mt-4 pl-9 lg:col-span-7 lg:mt-0 lg:pl-0">
                  <p className="max-w-[58ch] text-lg leading-relaxed text-ink-muted">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal className="mt-6">
            <PlaceholderBadge
              kind="draft"
              label="DRAFT — step names are verbatim from the brief; the descriptions need clinician sign-off"
            />
          </Reveal>
        </div>
      </section>

      <BookingCta />
    </>
  );
}
