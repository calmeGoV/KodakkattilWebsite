import { ButtonLink } from "@/components/ui/button";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { Reveal } from "@/components/ui/reveal";
import heroPhoto from "@/lib/generated/hero-photo.json";
import { home, site } from "@/lib/content";
import { t } from "@/lib/i18n";
import { copy, isTodo, telHref } from "@/lib/utils";

/**
 * Full-bleed hero: the photograph is the background, the copy sits in its
 * negative space.
 *
 * The frame is art-directed rather than one image squeezed into every shape.
 * The photograph is landscape with the mother and child hard right and a large
 * clean wall on the left — so on wide screens the copy goes in that empty left
 * third and the subject is left alone. Below `lg` that composition collapses
 * (a narrow crop of the full width would lose her entirely), so a second,
 * tighter crop is served and the copy moves above her.
 *
 * A khadi scrim guarantees text contrast at every crop: the underlying wall is
 * light but not uniform, and the copy must not depend on where the browser
 * happens to cut the frame.
 *
 * The photograph is decorative markup — its meaning is carried by the copy in
 * front of it and by the visually-hidden caption at the foot of the section —
 * so the <img> is `alt=""` and hidden from the accessibility tree.
 */
export function Hero() {
  const { hero } = home;
  const phone = site.contact.phonePrimary;

  return (
    <section className="hairline-b relative isolate overflow-hidden bg-surface">
      {/* ── The photograph ──────────────────────────────────────────── */}
      {/*
        A plain <picture> rather than two <Image> elements.
        next/image has no art-direction primitive, so serving both crops meant
        two <img> tags and — because both were marked `priority` — two preload
        links. Every phone downloaded the desktop landscape master as well as
        the crop it actually used. <source media> is resolved by the browser
        before any bytes move, so exactly one file is ever fetched.
      */}
      <picture className="absolute inset-0 -z-10">
        <source
          media="(min-width: 1024px)"
          srcSet={heroPhoto.wide.srcset}
          sizes="100vw"
          type="image/webp"
        />
        <source
          srcSet={heroPhoto.narrow.srcset}
          sizes="100vw"
          type="image/webp"
        />
        <img
          src={heroPhoto.wide.fallback}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-[75%_center] lg:object-[75%_center] max-lg:object-[center_top]"
          style={{
            backgroundImage: `url(${heroPhoto.blurDataURL})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </picture>

      {/* ── Scrim ───────────────────────────────────────────────────── */}
      {/* Left-to-right on wide screens, top-down on narrow ones. Both land
          the copy on effectively solid khadi. */}
      <div
        aria-hidden="true"
        className={
          // Narrow: opaque at the foot, clear by 45% so the faces stay bright.
          "absolute inset-0 -z-10 bg-gradient-to-t from-surface from-30% via-surface/80 via-46% to-transparent to-62% " +
          // Wide: protects the left third only, gone by 58%.
          "lg:bg-gradient-to-r lg:from-surface lg:from-0% lg:via-surface/55 lg:via-30% lg:to-transparent lg:to-58%"
        }
      />

      {/* ── Copy ────────────────────────────────────────────────────── */}
      <div className="mx-auto grid max-w-[84rem] grid-cols-1 px-5 lg:grid-cols-12 lg:px-10">
        {/* The vertical brass legend, running up the left gutter. */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-10 items-end justify-center pb-24 lg:flex"
          aria-hidden="true"
        >
          <span className="label-caps whitespace-nowrap text-accent-ink/70 [writing-mode:vertical-rl] [transform:rotate(180deg)]">
            {copy(hero.verticalLegend, "Vaidyasala")}
          </span>
        </div>

        <div className="col-span-1 flex min-h-[40rem] flex-col justify-end pb-14 pt-[22rem] lg:col-span-6 lg:min-h-[42rem] lg:justify-center lg:pb-24 lg:pt-24">
          <Reveal>
            <p className="label-caps flex flex-wrap items-center gap-2 text-accent-ink">
              {isTodo(hero.eyebrow) ? (
                <PlaceholderBadge label={hero.eyebrow} />
              ) : (
                <>
                  <span className="inline-block h-px w-8 bg-accent" aria-hidden="true" />
                  {hero.eyebrow}
                </>
              )}
            </p>
          </Reveal>

          <Reveal index={1}>
            <h1 className="mt-6 max-w-[15ch] text-5xl font-semibold text-ink">
              {hero.heading}
            </h1>
          </Reveal>

          <Reveal index={2}>
            <p className="label-caps mt-7 flex items-center gap-3 text-accent-ink">
              <span className="inline-block h-px w-6 bg-accent" aria-hidden="true" />
              {hero.tagline}
            </p>
          </Reveal>

          <Reveal index={3}>
            <p className="mt-5 max-w-[46ch] text-lg text-ink-muted">
              {hero.subheading}
            </p>
          </Reveal>

          <Reveal index={4}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink href={hero.primaryCta.href} intent="action">
                {hero.primaryCta.label}
              </ButtonLink>

              {isTodo(phone) ? (
                <span className="inline-flex items-center gap-2">
                  <ButtonLink href="/contact" intent="ghost">
                    {t("cta.call")}
                  </ButtonLink>
                  <PlaceholderBadge label="TODO_PHONE_PRIMARY" />
                </span>
              ) : (
                <a
                  href={telHref(phone)}
                  aria-label={`Call the clinic on ${phone}`}
                  className="inline-flex items-center justify-center gap-2 rounded-cta border border-ink/25 bg-surface/70 px-5 py-3 font-medium backdrop-blur-[2px] transition-colors duration-150 hover:border-accent hover:text-accent-ink"
                >
                  {t("cta.call")}
                  <span className="text-ink-faint" data-numeral>
                    {phone}
                  </span>
                </a>
              )}
            </div>
          </Reveal>

          {/* Ledger line: only figures that can actually be verified. */}
          <Reveal index={5}>
            <dl className="mt-12 flex flex-wrap items-baseline gap-x-8 gap-y-3 border-t border-accent/35 pt-5">
              {[
                { v: "150+", l: "years" },
                { v: "5", l: "generations" },
                { v: "4", l: "specialities" },
              ].map((item) => (
                <div key={item.l} className="flex items-baseline gap-2">
                  <dt className="sr-only">{item.l}</dt>
                  <dd
                    className="font-display text-xl font-semibold text-accent-ink"
                    data-numeral
                  >
                    {item.v}
                  </dd>
                  <span className="label-caps text-ink-faint">{item.l}</span>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>

      {/* The photograph is decorative here — it is described by the copy it
          sits behind — so its meaning is carried in a visually-hidden caption
          rather than an alt on a background layer. */}
      <p className="sr-only">{hero.imageAlt}</p>
    </section>
  );
}
