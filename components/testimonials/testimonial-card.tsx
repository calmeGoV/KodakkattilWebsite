import Image from "next/image";
import Link from "next/link";

import { RatingStars } from "@/components/testimonials/rating-stars";
import { VideoFacade } from "@/components/testimonials/video-facade";
import { t } from "@/lib/i18n";
import type { Testimonial } from "@/types/content";
import { cn } from "@/lib/utils";

/** Privacy first: the display name wins wherever one has been supplied. */
function attributionName(item: Testimonial) {
  return item.displayName?.trim() || item.name;
}

function Meta({ item, light }: { item: Testimonial; light?: boolean }) {
  const bits = [item.treatment, item.duration].filter(Boolean) as string[];
  return (
    <div className="mt-4">
      <p
        className={cn(
          "font-display text-base font-semibold",
          light ? "text-surface" : "text-ink",
        )}
      >
        {attributionName(item)}
        {item.city && (
          <span className={cn("font-body text-sm font-normal", light ? "text-surface/55" : "text-ink-faint")}>
            {" "}
            · {item.city}
          </span>
        )}
      </p>
      {bits.length > 0 && (
        <p className={cn("label-caps mt-2", light ? "text-accent-glow" : "text-accent-ink")}>
          {bits.join(" · ")}
        </p>
      )}
    </div>
  );
}

/** The compact quote card. */
export function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <figure className="flex h-full w-full flex-col rounded-card border border-ink/12 bg-surface-raised overflow-hidden">
      {item.photo && (
        <div className="relative w-full aspect-[4/5] bg-ink/5">
          <Image src={item.photo} alt={item.name} fill className="object-cover" />
        </div>
      )}
      <div className="flex flex-col flex-1 p-6">
        <RatingStars rating={item.rating} className="mb-4" />
        <blockquote className="flex-1">
          <p className="text-ink-muted line-clamp-4">
            <span aria-hidden="true" className="text-accent">
              &ldquo;
            </span>
            {item.quote}
            <span aria-hidden="true" className="text-accent">
              &rdquo;
            </span>
          </p>
        </blockquote>
        <figcaption className="mt-6 border-t border-accent/25 pt-4">
          <Meta item={item} />
        </figcaption>
      </div>
    </figure>
  );
}

/**
 * The featured long-form story: one per group, rendered on the dark ground so
 * it reads as the anchor of the panel rather than a bigger card.
 */
export function FeaturedStory({ item }: { item: Testimonial }) {
  const hasStory = (item.fullStory?.length ?? 0) > 0;

  return (
    <figure className="on-dark relative isolate flex h-full flex-col overflow-hidden rounded-card bg-primary-deep p-7 text-surface lg:p-10">
      <div className="grain grain-light absolute inset-0" aria-hidden="true" />

      <div className="relative flex flex-1 flex-col">
        <RatingStars rating={item.rating} className="mb-5" />

        <blockquote className="flex-1">
          <p className="font-display text-2xl font-semibold leading-[1.25] text-surface">
            <span aria-hidden="true" className="text-accent">
              &ldquo;
            </span>
            {item.quote}
            <span aria-hidden="true" className="text-accent">
              &rdquo;
            </span>
          </p>
        </blockquote>

        {item.videoId && (
          <VideoFacade
            videoId={item.videoId}
            title={`${attributionName(item)} — patient story`}
            className="mt-7 rounded-card"
          />
        )}

        <figcaption className="mt-7 border-t border-accent/30 pt-1">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              {item.photo && (
                <Image
                  src={item.photo}
                  alt=""
                  aria-hidden="true"
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full object-cover"
                />
              )}
              <Meta item={item} light />
            </div>

            {hasStory && (
              <Link
                href={`/stories/${item.slug}`}
                className="group inline-flex items-center gap-3 text-accent-glow transition-colors hover:text-surface"
              >
                <span className="label-caps">{t("cta.readStory")}</span>
                <span
                  aria-hidden="true"
                  className="inline-block h-px w-8 bg-accent-glow transition-all duration-200 group-hover:w-12"
                />
              </Link>
            )}
          </div>
        </figcaption>
      </div>
    </figure>
  );
}
