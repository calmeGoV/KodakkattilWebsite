import Image from "next/image";

import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { doctors as allDoctors } from "@/lib/content";
import { t } from "@/lib/i18n";
import { doctorImage } from "@/lib/placeholders";
import type { Doctor } from "@/types/content";
import { cn } from "@/lib/utils";

/**
 * A missing portrait renders a drawn stand-in in the brand palette, never a
 * stock photograph of a stranger.
 *
 * Below-fold portraits load lazily and decode async.
 */
export function DoctorPortrait({
  doctor,
  className,
  sizes,
  priority,
}: {
  doctor: Doctor;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const missing =
    !doctor.portrait || doctor.portraitPlaceholder || doctor.placeholder;

  const ordinal = allDoctors.findIndex((d) => d.slug === doctor.slug);
  const entry = doctorImage(doctor.slug, ordinal);
  const src = missing ? entry.src : (doctor.portrait as string);

  return (
    <div
      className={cn("relative overflow-hidden bg-surface-sunken", className)}
    >
      <Image
        src={src}
        alt={missing ? "" : `${doctor.name}, ${doctor.qualifications}`}
        aria-hidden={missing || undefined}
        fill
        priority={priority}
        loading={priority ? undefined : "lazy"}
        decoding="async"
        sizes={sizes ?? "(max-width: 768px) 60vw, 20rem"}
        className="object-cover object-top"
        style={{ objectFit: "cover", objectPosition: "top" }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border border-accent/20"
      />
      {missing && (
        <span className="absolute bottom-2 left-2">
          <PlaceholderBadge label={t("a11y.placeholderPortrait")} />
        </span>
      )}
    </div>
  );
}
