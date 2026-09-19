import type { Metadata } from "next";

import { VoicesOfTrust } from "@/components/home/voices-of-trust";
import { BookingCta } from "@/components/home/booking-cta";
import { PageHeader } from "@/components/layout/page-header";
import { MedicalDisclaimer } from "@/components/ui/medical-disclaimer";
import {
  consentedTestimonials,
  testimonialGroups,
  testimonialsMeta,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Voices of Trust",
  description:
    "Families who came to us worried, and what happened next — grouped by pregnancy, after birth, children, and finding balance.",
  alternates: { canonical: "/stories" },
};

export default function StoriesPage() {
  return (
    <>
      <PageHeader
        kicker="Success Stories"
        title={testimonialsMeta.title}
        intro={testimonialsMeta.intro}
        crumbs={[{ label: "Home", href: "/" }, { label: "Stories" }]}
      />

      <VoicesOfTrust
        groups={testimonialGroups}
        items={consentedTestimonials()}
        kicker="By stage of care"
        title="Find someone in your situation."
        intro="Choose the stage you are at. Every story is published with the family's written consent, and names are shown as they asked us to show them."
        cta={{ label: "Book a consultation", href: "/book" }}
      />

      <MedicalDisclaimer />
      <BookingCta />
    </>
  );
}
