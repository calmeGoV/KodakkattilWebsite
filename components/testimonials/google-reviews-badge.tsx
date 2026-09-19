import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { site } from "@/lib/content";
import { isTodo } from "@/lib/utils";

/**
 * Aggregate rating, linked out to the real listing. Both figures and the URL
 * are TODO until the clinic supplies them — an invented rating is exactly the
 * kind of number that must never ship.
 */
export function GoogleReviewsBadge() {
  const { rating, count, url } = site.googleReviews;
  const pending = isTodo(rating) || isTodo(count) || isTodo(url);

  const inner = (
    <>
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
        <path
          d="M21.6 12.2c0-.7-.1-1.3-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3Z"
          fill="#4285F4"
        />
        <path
          d="M12 22c2.7 0 5-.9 6.6-2.5l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z"
          fill="#34A853"
        />
        <path d="M6.4 13.9a6 6 0 0 1 0-3.8V7.5H3.1a10 10 0 0 0 0 9l3.3-2.6Z" fill="#FBBC05" />
        <path
          d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3.1 7.5l3.3 2.6C7.2 7.7 9.4 5.9 12 5.9Z"
          fill="#EA4335"
        />
      </svg>

      {pending ? (
        <PlaceholderBadge label="TODO_STAT — Google rating & review count" />
      ) : (
        <span className="flex items-baseline gap-2">
          <span className="font-display text-lg font-semibold text-ink" data-numeral>
            {rating}
          </span>
          <span className="text-xs text-ink-faint">
            from <span data-numeral>{count}</span> Google reviews
          </span>
        </span>
      )}
    </>
  );

  const classes =
    "inline-flex items-center gap-3 rounded-card border border-ink/15 bg-surface-raised px-4 py-2.5";

  if (pending) return <div className={classes}>{inner}</div>;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${classes} transition-colors hover:border-accent/60`}
    >
      {inner}
    </a>
  );
}
