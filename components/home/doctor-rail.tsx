import { DoctorCard } from "@/components/doctors/doctor-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { home, orderedDoctors } from "@/lib/content";

/**
 * Founders first, then the wider team, then placeholders — the ordering lives
 * in `orderedDoctors()` so /doctors and this rail can never disagree.
 *
 * Horizontal on small screens (native scroll, no snap jacking), a plain grid
 * from `lg` up where there is room for four across.
 */
export function DoctorRail() {
  const list = orderedDoctors();
  const { doctors: section } = home.sections;

  return (
    <section className="hairline-b bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-[84rem] px-5 lg:px-10">
        <SectionHeader
          kicker={section.kicker}
          title={section.title}
          cta={section.cta}
        />
      </div>

      <ul
        className="rail-scroll mt-14 flex gap-5 overflow-x-auto px-5 pb-4 lg:mx-auto lg:grid lg:max-w-[84rem] lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-10 lg:pb-0"
        aria-label="Our doctors"
      >
        {list.map((doctor, i) => (
          <Reveal
            as="li"
            key={doctor.slug}
            index={i}
            className="flex w-[16rem] shrink-0 lg:w-auto"
          >
            <DoctorCard
              doctor={doctor}
              className="w-full"
              sizes="(max-width: 1024px) 16rem, 20vw"
            />
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
