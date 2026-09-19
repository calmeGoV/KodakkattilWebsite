import Link from "next/link";

import { Wordmark } from "@/components/layout/wordmark";
import { site, specialities } from "@/lib/content";
import { t } from "@/lib/i18n";
import { copy, isTodo, telHref } from "@/lib/utils";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";

const QUICK = [
  { href: "/about", label: t("nav.about") },
  { href: "/about/legacy", label: t("nav.legacy") },
  { href: "/doctors", label: t("nav.doctors") },
  { href: "/patient-journey", label: t("nav.journey") },
  { href: "/stories", label: t("nav.stories") },
  { href: "/blog", label: t("nav.blog") },
  { href: "/gallery", label: t("nav.gallery") },
  { href: "/faq", label: t("nav.faq") },
];

const LEGAL = [
  { href: "/privacy", label: t("footer.privacy") },
  { href: "/terms", label: t("footer.terms") },
  { href: "/careers", label: t("footer.careers") },
  { href: "/sitemap.xml", label: t("footer.sitemap") },
];

function Line({ value, href }: { value: string; href?: string }) {
  if (isTodo(value)) {
    return (
      <span className="block py-0.5">
        <PlaceholderBadge label={value} />
      </span>
    );
  }
  return href ? (
    <a href={href} className="block py-0.5 hover:text-accent-glow">
      {value}
    </a>
  ) : (
    <span className="block py-0.5">{value}</span>
  );
}

export function SiteFooter() {
  return (
    <footer className="on-dark relative isolate overflow-hidden bg-primary-deep pb-24 text-surface sm:pb-0">
      <div className="grain grain-light absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-[84rem] px-5 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
          <div>
            <Wordmark tone="light" />
            <p className="mt-5 max-w-xs text-sm text-surface/70">
              {site.descriptionShort}
            </p>
            <p className="label-caps mt-6 text-accent-glow/80">{site.strapline}</p>
          </div>

          <nav aria-label={t("footer.quickLinks")}>
            <h2 className="label-caps text-accent-glow">{t("footer.quickLinks")}</h2>
            <ul className="mt-4 space-y-1.5 text-sm text-surface/75">
              {QUICK.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-accent-glow">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t("footer.care")}>
            <h2 className="label-caps text-accent-glow">{t("footer.care")}</h2>
            <ul className="mt-4 space-y-1.5 text-sm text-surface/75">
              {specialities.map((s) => (
                <li key={s.slug}>
                  <Link href={`/specialities/${s.slug}`} className="hover:text-accent-glow">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="label-caps text-accent-glow">{t("footer.visit")}</h2>
            <address className="mt-4 space-y-1 text-sm not-italic text-surface/75">
              <Line value={site.address.street} />
              <Line value={site.address.locality} />
              <Line value={`${site.address.region} ${copy(site.address.postalCode)}`} />
              <Line
                value={site.contact.phonePrimary}
                href={telHref(site.contact.phonePrimary)}
              />
              <Line
                value={site.contact.email}
                href={isTodo(site.contact.email) ? undefined : `mailto:${site.contact.email}`}
              />
            </address>
            <div className="mt-4 space-y-1 text-sm text-surface/75">
              {site.hours.map((h) => (
                <div key={h.day} className="flex flex-wrap gap-x-2">
                  <span className="text-surface/60">{h.day}</span>
                  {isTodo(h.hours) ? <PlaceholderBadge label={h.hours} /> : <span>{h.hours}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* The educational-use line. Required on every page that touches a
            health condition, so it lives in the global footer. */}
        <p className="mt-14 border-t border-accent/25 pt-6 text-xs leading-relaxed text-surface/55">
          {site.disclaimer}
        </p>

        <div className="mt-6 flex flex-col gap-4 text-xs text-surface/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {LEGAL.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-accent-glow">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
