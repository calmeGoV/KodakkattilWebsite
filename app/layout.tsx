import type { Metadata, Viewport } from "next";

import { RevealInit, RevealScript } from "@/components/layout/reveal-script";
import { SvgFilters } from "@/components/layout/svg-filters";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StickyContactBar } from "@/components/layout/sticky-contact-bar";
import { site } from "@/lib/content";
import { fontVariables } from "@/lib/fonts";
import { t } from "@/lib/i18n";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"), // TODO_SITE_URL
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.descriptionShort,
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.descriptionShort,
    // Static PNG rather than next/og: ImageResponse crashes at build time on
    // Windows in 15.1.6. Regenerate with `npm run gen:og`.
    images: [{ url: "/og/default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og/default.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#10261d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      {/*
        Grammarly and similar extensions write attributes onto <body>
        (data-gr-ext-installed, data-new-gr-c-s-check-loaded) before React
        hydrates, which React reports as a hydration mismatch. Nothing in the
        app renders those; suppressing the warning on this one element is the
        supported fix and does not mask mismatches in our own markup, which
        lives in the children.
      */}
      <body className="min-h-dvh antialiased" suppressHydrationWarning>
        {/* Marks the document script-capable before first paint. Without it
            the CSS never hides anything — which is the safe default. */}
        <RevealInit />

        <a
          href="#main"
          className="label-caps sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-cta focus:bg-primary-deep focus:px-4 focus:py-3 focus:text-surface"
        >
          {t("nav.skipToContent")}
        </a>

        <SvgFilters />
        <SiteHeader />

        <main id="main" tabIndex={-1}>
          {children}
        </main>

        <SiteFooter />
        <StickyContactBar />

        {/* Flips `.reveal` elements into view. Must be present: without it
            every revealed section stays at opacity 0. */}
        <RevealScript />
      </body>
    </html>
  );
}
