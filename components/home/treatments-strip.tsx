import Link from "next/link";

import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { home, treatments } from "@/lib/content";

/**
 * A horizontal rail of the classical therapies, each carrying its Sanskrit or
 * Malayalam name. Utility section, and knowingly an ordinary card rail — the
 * boldness budget is spent on the lineage. See DESIGN.md §7, closing note.
 */
export function TreatmentsStrip() {
  const { treatments: section } = home.sections;

  return (
    <section className="hairline-b bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-[84rem] px-5 lg:px-10">
        <SectionHeader
          kicker={section.kicker}
          title={section.title}
          intro={treatments.intro}
          cta={section.cta}
        />
      </div>

      <Reveal>
        <ul
          className="mt-12 grid grid-cols-1 gap-4 px-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 lg:px-10"
          aria-label="Classical therapies"
        >
          {treatments.items.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/treatments#${item.slug}`}
                className="group flex h-full flex-col justify-between rounded-card border border-ink/12 bg-surface-raised p-5 transition-colors duration-200 hover:border-accent/60"
              >
                <div>
                  {(item.sanskrit || item.malayalam) && (
                    <p
                      lang={item.sanskrit ? "sa" : "ml"}
                      className="text-lg text-accent-ink"
                    >
                      {item.sanskrit ?? item.malayalam}
                    </p>
                  )}
                  <h3 className="mt-2 font-display text-lg font-semibold text-ink">
                    {item.name}
                  </h3>
                </div>

                {item.malayalam && item.sanskrit && (
                  <p lang="ml" className="mt-4 text-sm text-ink-faint">
                    {item.malayalam}
                  </p>
                )}

                <span
                  aria-hidden="true"
                  className="mt-5 inline-block h-px w-8 bg-accent transition-all duration-200 group-hover:w-14"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
