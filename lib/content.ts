import aboutJson from "@/content/about.json";
import blogJson from "@/content/blog.json";
import doctorsJson from "@/content/doctors.json";
import faqJson from "@/content/faq.json";
import galleryJson from "@/content/gallery.json";
import homeJson from "@/content/home.json";
import journeyJson from "@/content/journey.json";
import legacyJson from "@/content/legacy.json";
import packagesJson from "@/content/packages.json";
import siteJson from "@/content/site.json";
import specialitiesJson from "@/content/specialities.json";
import treatmentsJson from "@/content/treatments.json";
import testimonialsFile from "@/content/testimonials.json";

import type {
  BlogPost,
  GalleryItem,
  Doctor,
  Generation,
  Legacy,
  Speciality,
  Testimonial,
  TestimonialGroup,
  Treatment,
} from "@/types/content";

export const site = siteJson;
export const home = homeJson;
export const about = aboutJson;
export const journey = journeyJson;
export const faq = faqJson;
export const packages = packagesJson;

export const blog = blogJson as unknown as {
  title: string;
  intro: string;
  topics: string[];
  posts: BlogPost[];
};

export const specialities = specialitiesJson as unknown as Speciality[];
export const treatments = treatmentsJson as unknown as {
  title: string;
  intro: string;
  items: Treatment[];
};

export const legacy = legacyJson as unknown as Legacy;

export const doctors = doctorsJson as unknown as Doctor[];

export function getSpeciality(slug: string): Speciality | undefined {
  return specialities.find((s) => s.slug === slug);
}

export function getDoctor(slug: string): Doctor | undefined {
  return doctors.find((d) => d.slug === slug);
}

/** Founders first, then everyone else, then placeholders last. */
export function orderedDoctors(): Doctor[] {
  return [...doctors].sort((a, b) => {
    const rank = (d: Doctor) => (d.isFounder ? 0 : d.placeholder ? 2 : 1);
    return rank(a) - rank(b);
  });
}

export function generations(): Generation[] {
  return [...legacy.generations].sort((a, b) => a.order - b.order);
}

/**
 * Strips everything a visitor's browser has no business receiving.
 *
 * Voices of Trust is a client component, so whatever it is handed is
 * serialized into the page payload and is readable in view-source. A patient
 * who agreed to appear as "Anjali M." must not have her full name shipped to
 * every visitor in the RSC stream — so the private name is collapsed into the
 * display name here, on the server, and never crosses the boundary.
 */
function toPublic(t: Testimonial): Testimonial {
  const { name, displayName, consentOnFile: _consent, ...rest } = t;
  void _consent;
  return {
    ...rest,
    // Whatever is shown publicly becomes the only name that exists client-side.
    name: displayName?.trim() || name,
    consentOnFile: true,
  };
}

/**
 * The consent gate. A testimonial without written consent on file is never
 * returned by the data layer, so no component can render one by accident.
 */
export function consentedTestimonials(): Testimonial[] {
  const all = testimonialsFile.items as unknown as Testimonial[];
  return all.filter((t) => t.consentOnFile === true).map(toPublic);
}

export function testimonialsByGroup(group: TestimonialGroup): Testimonial[] {
  return consentedTestimonials().filter((t) => t.group === group);
}

export const testimonialGroups = testimonialsFile.groups as {
  id: TestimonialGroup;
  label: string;
  blurb: string;
}[];

export const testimonialsMeta = {
  title: testimonialsFile.title,
  intro: testimonialsFile.intro,
};

export const gallery = galleryJson as unknown as {
  title: string;
  intro: string;
  groups: { id: string; label: string }[];
  items: GalleryItem[];
};

/** Newest first. */
export function sortedPosts(): BlogPost[] {
  return [...blog.posts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): BlogPost | undefined {
  return blog.posts.find((p) => p.slug === slug);
}

export function getTestimonial(slug: string): Testimonial | undefined {
  return consentedTestimonials().find((t) => t.slug === slug);
}

/** Doctors who list this speciality, founders first. */
export function doctorsForSpeciality(slug: string): Doctor[] {
  return orderedDoctors().filter((d) => d.specialities.includes(slug as never));
}

export function packagesForSpeciality(slug: string) {
  return packages.items.filter((p) => p.speciality === slug);
}
