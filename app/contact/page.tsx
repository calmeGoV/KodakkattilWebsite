import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { Reveal } from "@/components/ui/reveal";
import { site } from "@/lib/content";
import { t } from "@/lib/i18n";
import { isTodo, telHref, waHref } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Address, phone numbers, WhatsApp, email and working hours. Teleconsultation available for families abroad.",
  alternates: { canonical: "/contact" },
};

function Value({ value, href }: { value: string; href?: string }) {
  if (isTodo(value)) return <PlaceholderBadge label={value} />;
  return href ? (
    <a href={href} className="text-ink transition-colors hover:text-accent-ink">
      {value}
    </a>
  ) : (
    <span className="text-ink">{value}</span>
  );
}

export default function ContactPage() {
  const { contact, address, hours } = site;

  return (
    <>
      <PageHeader
        kicker="Contact Us"
        title="Come and see us, or start with a phone call."
        intro="We answer the phone during working hours and reply to WhatsApp through the day. Teleconsultation is available for families outside Kerala and abroad."
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/book" intent="action">
            {t("cta.book")}
          </ButtonLink>
        </div>
      </PageHeader>

      <section className="hairline-b bg-surface py-16 lg:py-24">
        <div className="mx-auto grid max-w-[84rem] gap-x-12 gap-y-12 px-5 lg:grid-cols-12 lg:px-10">
          <Reveal className="lg:col-span-5">
            <dl className="space-y-9">
              <div>
                <dt className="label-caps border-t border-accent/40 pt-4 text-accent-ink">
                  Address
                </dt>
                <dd className="mt-3">
                  <address className="not-italic leading-relaxed">
                    <Value value={address.street} />
                    <br />
                    <Value value={address.locality} />
                    <br />
                    <span className="text-ink">{address.region}</span>{" "}
                    <Value value={address.postalCode} />
                  </address>
                </dd>
              </div>

              <div>
                <dt className="label-caps border-t border-accent/40 pt-4 text-accent-ink">
                  Phone
                </dt>
                <dd className="mt-3 space-y-2">
                  <p>
                    <Value
                      value={contact.phonePrimary}
                      href={telHref(contact.phonePrimary)}
                    />
                  </p>
                  <p className="text-sm">
                    <span className="text-ink-faint">Emergency: </span>
                    <Value
                      value={contact.phoneEmergency}
                      href={telHref(contact.phoneEmergency)}
                    />
                  </p>
                </dd>
              </div>

              <div>
                <dt className="label-caps border-t border-accent/40 pt-4 text-accent-ink">
                  WhatsApp & email
                </dt>
                <dd className="mt-3 space-y-2">
                  <p>
                    <Value value={contact.whatsapp} href={waHref(contact.whatsapp)} />
                  </p>
                  <p>
                    <Value
                      value={contact.email}
                      href={isTodo(contact.email) ? undefined : `mailto:${contact.email}`}
                    />
                  </p>
                </dd>
              </div>

              <div>
                <dt className="label-caps border-t border-accent/40 pt-4 text-accent-ink">
                  Working hours
                </dt>
                <dd className="mt-3 space-y-2">
                  {hours.map((h) => (
                    <p key={h.day} className="flex flex-wrap gap-x-3">
                      <span className="text-ink-faint">{h.day}</span>
                      <Value value={h.hours} />
                    </p>
                  ))}
                </dd>
              </div>
            </dl>

            <PlaceholderBadge
              className="mt-8"
              label="DUMMY — every contact detail on this page is invented"
            />
          </Reveal>

          {/* ── Map ────────────────────────────────────────────────── */}
          <Reveal index={1} className="lg:col-span-7">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card border border-accent/30 bg-surface-sunken">
              {/* No third-party map iframe until a real address exists — an
                  embedded Google Map costs the visitor a large third-party
                  payload and sets cookies before they have chosen anything. */}
              <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
                <svg
                  width="42"
                  height="42"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="text-accent"
                >
                  <path
                    d="M12 21.5s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="10.4" r="2.6" stroke="currentColor" strokeWidth="1.25" />
                </svg>
                <p className="max-w-[36ch] text-sm text-ink-muted">
                  The map loads only when you ask for it, so the page stays light
                  on a slow connection.
                </p>
                {isTodo(contact.mapsUrl) ? (
                  <PlaceholderBadge label={contact.mapsUrl} />
                ) : (
                  <ButtonLink
                    href={contact.mapsUrl}
                    intent="primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open in Google Maps
                  </ButtonLink>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
