import Link from "next/link";

import { SpecialityIcon } from "@/components/icons/speciality-icons";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { home, specialities } from "@/lib/content";
import type { Speciality } from "@/types/content";
import { cn } from "@/lib/utils";

/**
 * Not four equal cards with a circle icon and a "Learn more →".
 *
 * An unequal brick: paediatric and maternity sit on the top row, taller,
 * because they are the practice's actual centre of gravity. Widths run 7/5
 * then 5/7 so the rows offset against each other. Each card carries the
 * classical term above the English name and lists real conditions from the
 * source document rather than a generic tagline. See DESIGN.md §7, row 3.
 */

const LAYOUT: Record<string, string> = {
  "paediatric-care": "lg:col-span-7 lg:min-h-[26rem]",
  "maternity-care": "lg:col-span-5 lg:min-h-[26rem]",
  "womens-care": "lg:col-span-5",
  "mental-health": "lg:col-span-7",
};

/** Maternity nests its services under pre/postnatal groups; the rest are flat. */
function flatServices(s: Speciality): string[] {
  if (s.services) return s.services;
  return (s.groups ?? []).flatMap((g) => g.services);
}

export function Pillars() {
  const { pillars } = home.sections;

  return (
    <section className="hairline-b bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-[84rem] px-5 lg:px-10">
        <SectionHeader
          kicker={pillars.kicker}
          title={pillars.title}
          cta={pillars.cta}
        />

        <ul className="mt-14 grid gap-5 lg:grid-cols-12">
          {specialities.map((s, i) => (
            <Reveal
              as="li"
              key={s.slug}
              index={i}
              className={cn("flex", LAYOUT[s.slug])}
            >
              <PillarCard speciality={s} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function PillarCard({ speciality: s }: { speciality: Speciality }) {
  const services = flatServices(s);
  const lead = services.slice(0, 3);
  const rest = services.slice(3);

  return (
    <Link
      href={`/specialities/${s.slug}`}
      className={cn(
        "group flex w-full flex-col rounded-card border border-ink/12 bg-surface-raised p-7",
        "transition-[border-color,transform,box-shadow] duration-200",
        "hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-lift",
        "focus-visible:-translate-y-0.5 focus-visible:border-accent/60",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <SpecialityIcon
          name={s.icon}
          className="h-9 w-9 shrink-0 text-accent-ink transition-colors duration-200 group-hover:text-primary"
        />
        {s.malayalam && (
          <span lang="ml" className="text-sm text-ink-faint">
            {s.malayalam}
          </span>
        )}
      </div>

      {s.sanskrit && (
        <p className="label-caps mt-7 text-accent-ink">{s.sanskrit}</p>
      )}

      <h3 className="mt-2 text-2xl font-semibold text-ink">{s.name}</h3>

      <p className="mt-3 max-w-[52ch] text-ink-muted">{s.summary}</p>

      {/* The lead three conditions are always visible. The remainder unfold on
          hover or keyboard focus — a real answer to "do you treat my thing?",
          rather than an arrow that promises one on the next page. */}
      <div className="mt-6 border-t border-accent/30 pt-5">
        <ul className="flex flex-wrap gap-x-2 gap-y-2">
          {lead.map((item) => (
            <li
              key={item}
              className="rounded-xs bg-primary-tint px-2.5 py-1 text-xs text-primary"
            >
              {item}
            </li>
          ))}
        </ul>

        {rest.length > 0 && (
          <div
            className={cn(
              "grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out",
              "group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]",
            )}
          >
            <div className="overflow-hidden">
              <ul className="flex flex-wrap gap-x-2 gap-y-2 pt-2">
                {rest.map((item) => (
                  <li
                    key={item}
                    className="rounded-xs border border-ink/12 px-2.5 py-1 text-xs text-ink-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <span className="label-caps mt-auto flex items-center gap-3 pt-7 text-ink-faint transition-colors group-hover:text-accent-ink">
        {s.name}
        <span
          aria-hidden="true"
          className="inline-block h-px w-8 bg-accent transition-all duration-200 group-hover:w-12"
        />
      </span>
    </Link>
  );
}
