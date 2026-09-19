import { Reveal } from "@/components/ui/reveal";
import { TextLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  kicker?: string;
  title: string;
  intro?: string;
  cta?: { label: string; href: string };
  tone?: "ink" | "light";
  className?: string;
  id?: string;
};

/**
 * The 7/5 asymmetry, applied once so every band inherits the same rhythm:
 * kicker and heading hang left, supporting text sits right. Never 6/6.
 */
export function SectionHeader({
  kicker,
  title,
  intro,
  cta,
  tone = "ink",
  className,
  id,
}: Props) {
  const light = tone === "light";

  return (
    <div className={cn("grid gap-8 lg:grid-cols-12", className)}>
      <Reveal className="lg:col-span-7">
        {kicker && (
          <p
            className={cn(
              "label-caps flex items-center gap-3",
              light ? "text-accent-glow" : "text-accent-ink",
            )}
          >
            <span className="inline-block h-px w-8 bg-accent" aria-hidden="true" />
            {kicker}
          </p>
        )}
        <h2
          id={id}
          className={cn(
            "mt-5 max-w-[18ch] text-3xl font-semibold",
            light ? "text-surface" : "text-ink",
          )}
        >
          {title}
        </h2>
      </Reveal>

      <Reveal index={1} className="flex flex-col justify-end gap-5 lg:col-span-5">
        {intro && (
          <p className={cn("max-w-[46ch]", light ? "text-surface/70" : "text-ink-muted")}>
            {intro}
          </p>
        )}
        {cta && (
          <TextLink href={cta.href} tone={tone} className="self-start">
            {cta.label}
          </TextLink>
        )}
      </Reveal>
    </div>
  );
}
