import { ButtonLink } from "@/components/ui/button";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { Reveal } from "@/components/ui/reveal";
import { site } from "@/lib/content";
import { t } from "@/lib/i18n";
import { isTodo, telHref, waHref } from "@/lib/utils";

/**
 * The last thing on the page, and the whole point of it: three ways to reach
 * a person, on a dark ground so it reads as an endpoint rather than another
 * band. Turmeric on the primary action, per the one-thing rule.
 */
export function BookingCta() {
  const phone = site.contact.phonePrimary;
  const whatsapp = site.contact.whatsapp;

  return (
    <section
      aria-labelledby="booking-heading"
      className="on-dark relative isolate overflow-hidden bg-primary-deep py-20 text-surface lg:py-28"
    >
      <div className="grain grain-light absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-[84rem] px-5 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="label-caps flex items-center gap-3 text-accent-glow">
              <span className="inline-block h-px w-8 bg-accent" aria-hidden="true" />
              {t("cta.book")}
            </p>
            <h2
              id="booking-heading"
              className="mt-5 max-w-[18ch] text-4xl font-semibold text-surface"
            >
              Tell us what is worrying you. That is enough to begin.
            </h2>
            <p className="mt-6 max-w-[52ch] text-surface/70">
              Book online, ask us on WhatsApp, or simply call. Consultations are
              available in person, by teleconsultation, and by video consultation for families abroad.
            </p>
          </Reveal>

          <Reveal index={1} className="flex flex-col justify-end gap-4 lg:col-span-5">
            <ButtonLink href="/book" intent="action" className="w-full">
              {t("cta.book")}
            </ButtonLink>

            <div className="grid gap-3 sm:grid-cols-2">
              {isTodo(phone) ? (
                <div className="flex flex-col gap-2">
                  <ButtonLink href="/contact" intent="ghost-dark" className="w-full">
                    {t("cta.call")}
                  </ButtonLink>
                  <PlaceholderBadge label="TODO_PHONE_PRIMARY" />
                </div>
              ) : (
                <a
                  href={telHref(phone)}
                  aria-label={`Call the clinic on ${phone}`}
                  className="inline-flex items-center justify-center rounded-cta border border-accent-glow/40 px-5 py-3 font-medium text-surface transition-colors hover:border-accent-glow hover:text-accent-glow"
                >
                  {t("cta.call")}
                </a>
              )}

              {isTodo(whatsapp) ? (
                <div className="flex flex-col gap-2">
                  <ButtonLink href="/contact" intent="ghost-dark" className="w-full">
                    {t("cta.whatsapp")}
                  </ButtonLink>
                  <PlaceholderBadge label="TODO_WHATSAPP_NUMBER" />
                </div>
              ) : (
                <a
                  href={waHref(whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-cta border border-accent-glow/40 px-5 py-3 font-medium text-surface transition-colors hover:border-accent-glow hover:text-accent-glow"
                >
                  {t("cta.whatsapp")}
                </a>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
