"use client";

import Image from "next/image";
import { useState } from "react";

import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { Reveal } from "@/components/ui/reveal";
import { galleryPlaceholder } from "@/lib/placeholders";
import type { GalleryItem } from "@/types/content";
import { cn } from "@/lib/utils";

/**
 * Filtered by area. No lightbox: on a phone over patchy data, a full-screen
 * overlay that loads a second, larger copy of an image the visitor has already
 * seen is cost without benefit. Images are sized and lazy-loaded instead.
 */
export function GalleryGrid({
  groups,
  items,
}: {
  groups: { id: string; label: string }[];
  items: GalleryItem[];
}) {
  const [active, setActive] = useState<string | null>(null);
  const shown = active ? items.filter((i) => i.group === active) : items;

  return (
    <div>
      <div role="group" aria-label="Filter gallery by area" className="flex flex-wrap gap-2">
        <Chip active={active === null} onClick={() => setActive(null)}>
          All
        </Chip>
        {groups.map((g) => (
          <Chip key={g.id} active={active === g.id} onClick={() => setActive(g.id)}>
            {g.label}
          </Chip>
        ))}
      </div>

      <p aria-live="polite" className="mt-6 text-sm text-ink-faint">
        {shown.length} {shown.length === 1 ? "image" : "images"}
      </p>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((item, i) => (
          <Reveal as="li" key={item.id} index={i % 6}>
            <figure className="group">
              <div className="relative aspect-[4/3] overflow-hidden bg-surface-sunken">
                <Image
                  src={item.image ?? galleryPlaceholder(item.group, item.id)}
                  alt={item.image ? item.caption : ""}
                  aria-hidden={!item.image || undefined}
                  fill
                  unoptimized={!item.image}
                  loading="lazy"
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                  className="object-cover transition-transform duration-300"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 border border-accent/25"
                />
              </div>
              <figcaption className="mt-3 flex flex-wrap items-center gap-2 border-l border-accent/40 pl-3 text-xs leading-relaxed text-ink-faint">
                {item.caption.replace(/^DUMMY — /, "")}
                {!item.image && <PlaceholderBadge label="TODO_PHOTOGRAPH" />}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-cta border px-3.5 py-2 text-sm transition-colors duration-150",
        active
          ? "border-primary bg-primary text-surface"
          : "border-ink/20 text-ink-muted hover:border-accent hover:text-accent-ink",
      )}
    >
      {children}
    </button>
  );
}
