import type { Metadata } from "next";

import { BookingCta } from "@/components/home/booking-cta";
import { DoctorRail } from "@/components/home/doctor-rail";
import { FaqSection } from "@/components/home/faq-section";
import { FoundersNote } from "@/components/home/founders-note";
import { Hero } from "@/components/home/hero";
import { Intro } from "@/components/home/intro";

import { LedgerBand } from "@/components/home/ledger-band";
import { PatientJourney } from "@/components/home/patient-journey";
import { Pillars } from "@/components/home/pillars";
import { VoicesOfTrust } from "@/components/home/voices-of-trust";
import { LineageRail } from "@/components/legacy/lineage-rail";
import {
  consentedTestimonials,
  faq,
  generations,
  home,
  legacy,
  site,
  testimonialGroups,
  testimonialsMeta,
} from "@/lib/content";
import type { FaqItem, Stat } from "@/types/content";

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.descriptionShort,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Intro />
      <LedgerBand stats={home.trustBand.stats as Stat[]} />
      <Pillars />

      <LineageRail
        generations={generations()}
        kicker={legacy.kicker}
        title={legacy.title}
        intro={legacy.intro}
        outro={legacy.outro}
        cta={home.sections.legacy.cta}
      />

      <FoundersNote />
      <DoctorRail />

      <VoicesOfTrust
        groups={testimonialGroups}
        items={consentedTestimonials()}
        kicker={home.sections.testimonials.kicker}
        title={testimonialsMeta.title}
        intro={testimonialsMeta.intro}
        cta={home.sections.testimonials.cta}
      />

      <PatientJourney />


      <FaqSection
        kicker={home.sections.faq.kicker}
        title={faq.title}
        intro={faq.intro}
        items={faq.items as FaqItem[]}
        cta={home.sections.faq.cta}
      />

      <BookingCta />
    </>
  );
}
