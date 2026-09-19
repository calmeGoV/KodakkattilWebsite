import Image from "next/image";

import { archivalImage } from "@/lib/placeholders";
import { cn } from "@/lib/utils";

type Props = {
  src?: string | null;
  /** Stable key used to choose a stand-in when `src` is missing. */
  placeholderKey?: string;
  /** Position in the canonical list — keeps neighbouring images distinct. */
  placeholderOrdinal?: number;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/**
 * Archival imagery.
 *
 * Real scans get the duotone separation — a two-colour print rather than a
 * sepia costume filter. The generated stand-ins are already in the brand
 * palette, so the duotone is skipped for them.
 */
export function ArchivalImage({
  src,
  alt,
  className,
  sizes,
  priority,
  placeholderKey,
  placeholderOrdinal,
}: Props) {
  const isPlaceholder = !src;
  const entry = archivalImage(placeholderKey ?? alt, placeholderOrdinal);
  const source = src ?? entry.src;

  return (
    <div
      className={cn("relative overflow-hidden bg-surface-sunken", className)}
    >
      <Image
        src={source}
        alt={isPlaceholder ? "" : alt}
        aria-hidden={isPlaceholder || undefined}
        fill
        priority={priority}
        loading={priority ? undefined : "lazy"}
        decoding="async"
        sizes={sizes ?? "(max-width: 768px) 80vw, 30vw"}
        className={cn("object-cover", !isPlaceholder && "duotone")}
      />
      {/* A hairline inside the frame, so the image reads as mounted. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border border-accent/25"
      />
    </div>
  );
}
