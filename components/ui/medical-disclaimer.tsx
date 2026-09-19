import { site } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Required on every page that discusses a health condition.
 *
 * The global footer carries the same line, but a page about PCOS or postpartum
 * depression should say it in context, next to the content it qualifies —
 * not only in small print at the bottom of the site.
 */
export function MedicalDisclaimer({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        "mx-auto max-w-[84rem] px-5 py-10 lg:px-10",
        className,
      )}
    >
      <p className="flex max-w-[76ch] gap-3 border-l-2 border-accent/60 pl-4 text-sm leading-relaxed text-ink-muted">
        <span className="label-caps shrink-0 pt-1 text-accent-ink">Please note</span>
        <span>{site.disclaimer}</span>
      </p>
    </aside>
  );
}
