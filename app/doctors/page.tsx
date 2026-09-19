import type { Metadata } from "next";

import { DoctorFilters } from "@/components/doctors/doctor-filters";
import { BookingCta } from "@/components/home/booking-cta";
import { PageHeader } from "@/components/layout/page-header";
import { orderedDoctors, specialities } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Doctors",
  description:
    "The physicians and psychologists you will sit with — filter by speciality and by in-person or teleconsultation.",
  alternates: { canonical: "/doctors" },
};

export default function DoctorsPage() {
  return (
    <>
      <PageHeader
        kicker="Meet Our Doctors"
        title="The people you will actually sit with."
        intro="Founders first, then the wider clinical team. Every one of them consults in Malayalam as well as English."
        crumbs={[{ label: "Home", href: "/" }, { label: "Doctors" }]}
      />

      <section className="hairline-b bg-surface py-16 lg:py-20">
        <div className="mx-auto max-w-[84rem] px-5 lg:px-10">
          <DoctorFilters doctors={orderedDoctors()} specialities={specialities} />
        </div>
      </section>

      <BookingCta />
    </>
  );
}
