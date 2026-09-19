import Link from "next/link";

import { DoctorPortrait } from "@/components/doctors/doctor-portrait";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { getSpeciality } from "@/lib/content";
import { t } from "@/lib/i18n";
import type { Doctor } from "@/types/content";
import { cn, isTodo } from "@/lib/utils";

/**
 * The card is not wrapped in a link. The name carries a stretched link over
 * the whole card, and the booking action sits above it — so "Book with Dr. X"
 * is a real, separately-focusable control rather than a nested anchor.
 *
 * The booking action is revealed on hover, but also on keyboard focus, so it
 * is never hover-only.
 */
export function DoctorCard({
  doctor,
  className,
  sizes,
}: {
  doctor: Doctor;
  className?: string;
  sizes?: string;
}) {
  const missingName = isTodo(doctor.name);
  const shortName = missingName
    ? "this doctor"
    : doctor.name.replace(/^Dr\.\s*/, "").split(" ")[0];

  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-card border border-ink/12 bg-surface-raised",
        "transition-[border-color,transform,box-shadow] duration-200",
        "hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-lift",
        "focus-within:-translate-y-0.5 focus-within:border-accent/60",
        className,
      )}
    >
      <div className="relative">
        <DoctorPortrait
          doctor={doctor}
          className="aspect-[4/3] w-full"
          sizes={sizes}
        />

        {doctor.isFounder && (
          <span className="label-caps absolute left-0 top-4 bg-primary-deep px-3 py-1.5 text-accent-glow">
            {t("doctors.founder")}
          </span>
        )}

        {/* Revealed on hover or focus. Sits above the stretched link. */}
        <Link
          href={`/book?doctor=${doctor.slug}`}
          className={cn(
            "label-caps absolute inset-x-3 bottom-3 z-10 flex items-center justify-center gap-2",
            "rounded-cta bg-warm px-3 py-2.5 text-ink opacity-0 transition-opacity duration-200",
            "group-hover:opacity-100 focus-visible:opacity-100",
          )}
        >
          {t("cta.bookWith")} {missingName ? "—" : `Dr. ${shortName}`}
        </Link>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold text-ink">
          <Link
            href={`/doctors/${doctor.slug}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {missingName ? (
              <span className="flex flex-col items-start gap-2">
                <span className="text-ink-faint">Name to be confirmed</span>
                <PlaceholderBadge label={doctor.name} />
              </span>
            ) : (
              doctor.name
            )}
          </Link>
        </h3>

        <p className="mt-1.5 text-xs text-accent-ink">
          {isTodo(doctor.qualifications) ? (
            <PlaceholderBadge label={doctor.qualifications} />
          ) : (
            doctor.qualifications
          )}
        </p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {doctor.specialities.map((slug) => {
            const s = getSpeciality(slug);
            if (!s) return null;
            return (
              <li
                key={slug}
                className="rounded-xs bg-primary-tint px-2 py-0.5 text-[0.6875rem] text-primary"
              >
                {s.name}
              </li>
            );
          })}
        </ul>

        <p className="mt-auto pt-5 text-xs text-ink-faint">
          <span className="label-caps text-ink-faint/80">
            {t("doctors.languages")}
          </span>
          <br />
          {doctor.languages.join(" · ")}
        </p>
      </div>
    </article>
  );
}
