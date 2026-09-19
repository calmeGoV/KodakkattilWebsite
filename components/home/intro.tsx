import { Reveal } from "@/components/ui/reveal";
import { home } from "@/lib/content";

/**
 * The 7/5 asymmetric split that governs the whole page: heading hangs left,
 * body sits right. Never 6/6. See DESIGN.md §4.
 */
export function Intro() {
  const { intro } = home;

  return (
    <section className="hairline-b bg-surface-raised py-20 lg:py-28">
      <div className="mx-auto grid max-w-[84rem] gap-10 px-5 lg:grid-cols-12 lg:px-10">
        <Reveal className="lg:col-span-5">
          <h2 className="max-w-[16ch] text-3xl font-semibold text-ink">
            {intro.title}
          </h2>
        </Reveal>
        <Reveal index={1} className="lg:col-span-6 lg:col-start-7">
          <p className="max-w-[62ch] text-lg leading-relaxed text-ink-muted">
            {intro.body}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
