import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Optional. A testimonial without a rating simply does not render one — we do
 * not default to five stars.
 */
export function RatingStars({
  rating,
  className,
}: {
  rating?: number | null;
  className?: string;
}) {
  if (typeof rating !== "number" || rating <= 0) return null;
  const filled = Math.round(rating);

  return (
    <p className={cn("flex items-center gap-1", className)}>
      <span className="sr-only">
        {rating} {t("testimonials.rating")}
      </span>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          width="13"
          height="13"
          viewBox="0 0 16 16"
          aria-hidden="true"
          className={i < filled ? "text-accent" : "text-ink/15"}
        >
          <path
            d="M8 1.4l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11.2 4.2 13.2l.7-4.3-3.1-3 4.3-.6z"
            fill="currentColor"
          />
        </svg>
      ))}
    </p>
  );
}
