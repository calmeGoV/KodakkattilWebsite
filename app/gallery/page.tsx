import type { Metadata } from "next";

import { BookingCta } from "@/components/home/booking-cta";
import { PageHeader } from "@/components/layout/page-header";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { gallery } from "@/lib/content";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "The hospital, therapy rooms, mother and baby suites, and the children's therapy area.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        kicker="Gallery"
        title="The building, the rooms, and the people in them."
        intro={gallery.intro}
        crumbs={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
      />

      <section className="hairline-b bg-surface py-16 lg:py-20">
        <div className="mx-auto max-w-[84rem] px-5 lg:px-10">
          <GalleryGrid groups={gallery.groups} items={gallery.items} />
        </div>
      </section>

      <BookingCta />
    </>
  );
}
