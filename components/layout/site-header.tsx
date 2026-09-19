"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { ButtonLink } from "@/components/ui/button";
import { Wordmark } from "@/components/layout/wordmark";
import { site } from "@/lib/content";
import { t } from "@/lib/i18n";
import { cn, telHref } from "@/lib/utils";

const NAV = [
  { href: "/about", label: t("nav.about") },
  { href: "/specialities", label: t("nav.specialities") },
  { href: "/doctors", label: t("nav.doctors") },
  { href: "/treatments", label: t("nav.treatments") },
  { href: "/packages", label: t("nav.packages") },
  { href: "/stories", label: t("nav.stories") },
  { href: "/contact", label: t("nav.contact") },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the sheet on navigation, and lock the body while it is open.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        document.getElementById("nav-toggle")?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-surface/92 backdrop-blur-[6px] transition-shadow duration-200",
        scrolled && "hairline-b",
      )}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-[84rem] items-center justify-between gap-6 px-5 lg:px-10">
        <Wordmark />

        <nav aria-label={t("nav.primary")} className="hidden xl:block">
          <ul className="flex items-center gap-7">
            {NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative py-2 text-sm transition-colors duration-150 hover:text-accent-ink",
                      active ? "text-accent-ink" : "text-ink-muted",
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-0 -bottom-0.5 h-px origin-left bg-accent transition-transform duration-200",
                        active ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={telHref(site.contact.phonePrimary)}
            className="label-caps hidden text-ink-muted transition-colors hover:text-accent-ink lg:inline"
          >
            {t("cta.call")}
          </a>
          <ButtonLink
            href="/book"
            intent="action"
            className="hidden px-4 py-2.5 text-sm sm:inline-flex"
          >
            {t("cta.book")}
          </ButtonLink>

          <button
            id="nav-toggle"
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="flex h-10 w-10 items-center justify-center rounded-cta border border-ink/20 xl:hidden"
          >
            <span className="sr-only">{open ? t("nav.close") : t("nav.menu")}</span>
            <svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true">
              {open ? (
                <path d="M2 2l14 10M16 2L2 12" stroke="currentColor" strokeWidth="1.4" />
              ) : (
                <path d="M0 1h18M0 7h18M0 13h12" stroke="currentColor" strokeWidth="1.4" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label={t("nav.menu")}
          className="hairline-t max-h-[calc(100dvh-4.5rem)] overflow-y-auto bg-surface-raised px-5 pb-10 pt-4 xl:hidden"
        >
          <ul className="flex flex-col">
            {NAV.map((item) => (
              <li key={item.href} className="hairline-b">
                <Link
                  href={item.href}
                  className="block py-3.5 font-display text-xl text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ButtonLink href="/book" intent="action" className="mt-6 w-full">
            {t("cta.book")}
          </ButtonLink>
        </div>
      )}
    </header>
  );
}
