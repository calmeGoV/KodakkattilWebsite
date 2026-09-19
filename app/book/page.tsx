import type { Metadata } from "next";
import { Suspense } from "react";

import { AppointmentForm } from "@/components/booking/appointment-form";
import { PageHeader } from "@/components/layout/page-header";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { Reveal } from "@/components/ui/reveal";
import { site } from "@/lib/content";
import { t } from "@/lib/i18n";
import { isTodo, telHref, waHref } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description:
    "Request a consultation in person, by teleconsultation, or by video consultation. Tell us who it is for and what is worrying you.",
  alternates: { canonical: "/book" },
  robots: { index: true, follow: true },
};

export default function BookPage() {
  const { contact } = site;

  return (
    <>
      <PageHeader
        kicker="Book an appointment"
        title="Tell us what is worrying you. That is enough to begin."
        intro="Fill this in and someone from the clinic will call you back during working hours. If it is urgent, please phone instead of waiting for a reply."
        crumbs={[{ label: "Home", href: "/" }, { label: "Book" }]}
      />

      <section className="hairline-b bg-surface py-16 lg:py-24">
        <div className="mx-auto grid max-w-[84rem] gap-x-12 gap-y-12 px-5 lg:grid-cols-12 lg:px-10">
          <Reveal className="lg:col-span-7">
            <Suspense
              fallback={
                <p className="text-ink-muted">Loading the form…</p>
              }
            >
              <AppointmentForm />
            </Suspense>
          </Reveal>

          {/* ── Faster routes to a human ─────────────────────────────── */}
          <Reveal index={1} className="lg:col-span-4 lg:col-start-9">
            <div className="rounded-card border border-accent/40 bg-surface-raised p-7">
              <h2 className="font-display text-xl font-semibold text-ink">
                Would rather just talk?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                A form is never the fastest way to reach us. These are.
              </p>

              <ul className="mt-6 space-y-4">
                <li>
                  <p className="label-caps text-accent-ink">Phone</p>
                  {isTodo(contact.phonePrimary) ? (
                    <PlaceholderBadge label={contact.phonePrimary} />
                  ) : (
                    <a
                      href={telHref(contact.phonePrimary)}
                      className="text-ink hover:text-accent-ink"
                    >
                      {contact.phonePrimary}
                    </a>
                  )}
                </li>
                <li>
                  <p className="label-caps text-accent-ink">{t("cta.whatsapp")}</p>
                  {isTodo(contact.whatsapp) ? (
                    <PlaceholderBadge label={contact.whatsapp} />
                  ) : (
                    <a
                      href={waHref(contact.whatsapp)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ink hover:text-accent-ink"
                    >
                      {contact.whatsapp}
                    </a>
                  )}
                </li>
                <li>
                  <p className="label-caps text-accent-ink">Working hours</p>
                  {site.hours.map((h) => (
                    <p key={h.day} className="text-sm text-ink-muted">
                      {h.day}: {isTodo(h.hours) ? "—" : h.hours}
                    </p>
                  ))}
                </li>
              </ul>

              <p className="mt-7 border-t border-accent/30 pt-5 text-xs leading-relaxed text-ink-faint">
                {site.disclaimer}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
