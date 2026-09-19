import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { home, journey } from "@/lib/content";
import type { JourneyStep } from "@/types/content";

/**
 * Numbering is legitimate here — this is a real sequence, not decoration.
 *
 * The steps sit on a brass rule that runs through the numerals, echoing the
 * lineage cord: the same visual language for "this progresses in order".
 */
export function PatientJourney() {
  const { journey: section } = home.sections;
  const steps = journey.steps as JourneyStep[];

  return (
    <section
      aria-labelledby="journey-heading"
      className="on-dark hairline-b relative isolate overflow-hidden bg-primary py-20 text-surface lg:py-28"
    >
      <div className="grain grain-light absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-[84rem] px-5 lg:px-10">
        <SectionHeader
          id="journey-heading"
          kicker={section.kicker}
          title={journey.title}
          intro={journey.intro}
          cta={section.cta}
          tone="light"
        />

        <ol className="mt-16 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal as="li" key={step.order} index={i} className="relative">
              {/* The rule runs out of the numeral and across the cell. */}
              <div className="flex items-center gap-4">
                <span
                  className="font-display text-2xl font-semibold leading-none text-accent-glow"
                  data-numeral
                  aria-hidden="true"
                >
                  {String(step.order).padStart(2, "0")}
                </span>
                <span aria-hidden="true" className="h-px flex-1 bg-accent/35" />
              </div>

              <h3 className="mt-5 font-display text-xl font-semibold text-surface">
                {step.name}
              </h3>
              <p className="mt-3 max-w-[42ch] text-sm leading-relaxed text-surface/70">
                {step.body}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
