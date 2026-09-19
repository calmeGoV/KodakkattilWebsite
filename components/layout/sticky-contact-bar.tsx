"use client";

import { site } from "@/lib/content";
import { t } from "@/lib/i18n";
import { telHref, waHref } from "@/lib/utils";

/**
 * Mobile only. The audience arrives on a phone, often anxious, often on a poor
 * connection — the two things that reach a human stay pinned to the bottom of
 * the screen and never scroll away.
 *
 * Turmeric is correct here: both taps reach a person. See DESIGN.md §2.
 */
export function StickyContactBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 sm:hidden">
      <div className="grid grid-cols-2 border-t border-warm-deep/30">
        <a
          href={telHref(site.contact.phonePrimary)}
          className="flex items-center justify-center gap-2 bg-warm py-3.5 font-medium text-ink"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 7 7l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.8 16.8 0 0 1 3.5 5.7 2 2 0 0 1 5.5 3.5Z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
          {t("cta.call")}
        </a>
        <a
          href={waHref(site.contact.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 border-l border-warm-deep/30 bg-warm py-3.5 font-medium text-ink"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M3.5 20.5l1.3-4.2A8.2 8.2 0 1 1 8 19.3l-4.5 1.2Z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <path
              d="M9 8.5c.4 2.3 2.2 4.1 4.5 4.5l.9-1.3 2 .8v1.4c0 .6-.5 1-1.1 1A7.6 7.6 0 0 1 8.1 8.7c0-.6.4-1.1 1-1.1h1.4l.8 2L10 10.5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
          {t("cta.whatsapp")}
        </a>
      </div>
    </div>
  );
}
