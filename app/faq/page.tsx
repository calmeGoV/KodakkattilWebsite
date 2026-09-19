import type { Metadata } from "next";

import { FaqSection } from "@/components/home/faq-section";
import { BookingCta } from "@/components/home/booking-cta";
import { PageHeader } from "@/components/layout/page-header";
import { MedicalDisclaimer } from "@/components/ui/medical-disclaimer";
import { faq } from "@/lib/content";
import type { FaqItem } from "@/types/content";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Is Ayurveda safe during pregnancy? When should postnatal care begin? Can Ayurveda help with PCOS? The questions we are asked most.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const items = faq.items as FaqItem[];

  /* FAQPage JSON-LD. Draft answers are still the answers on the page, so they
     are described accurately here; replace both together at sign-off. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHeader
        kicker="Questions"
        title={faq.title}
        intro={faq.intro}
        crumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
      />

      <FaqSection title="Questions we are asked most" items={items} />

      <MedicalDisclaimer />
      <BookingCta />
    </>
  );
}
