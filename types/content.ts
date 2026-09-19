export type SpecialitySlug =
  | "paediatric-care"
  | "maternity-care"
  | "womens-care"
  | "mental-health";

export type ConsultationMode = "in-person" | "teleconsultation";

export type TestimonialGroup =
  | "pregnancy"
  | "postnatal"
  | "children"
  | "wellbeing";

/** Anything that can ship un-filled. Rendered with a loud badge in development. */
export type Placeholderable = {
  placeholder?: boolean;
};

export type Generation = Placeholderable & {
  order: number;
  /** "c. 1875 – 1910" */
  era: string;
  name: string;
  /** "Founding Vaidyan" */
  title: string;
  /** 2–3 sentences */
  contribution: string;
  /** Caption for the archival image */
  artifact?: string | null;
  image?: string | null;
  portrait?: string | null;
  /** Pull-quote or classical verse, where one genuinely exists */
  verse?: {
    text: string;
    transliteration?: string;
    translation?: string;
    source?: string;
  } | null;
  /** What this generation handed down */
  preserved?: string[];
  isPresent?: boolean;
};

export type Legacy = {
  title: string;
  kicker: string;
  intro: string;
  outro: string;
  note: string;
  generations: Generation[];
  preservedThread: {
    title: string;
    intro: string;
    items: { kind: string; body: string }[];
  };
};

export type Doctor = Placeholderable & {
  slug: string;
  name: string;
  /** "BAMS | Ayurvedic Physician" */
  qualifications: string;
  role: string;
  specialities: SpecialitySlug[];
  focusAreas: string[];
  /** paragraphs */
  bio: string[];
  languages: string[];
  experienceYears?: number | null;
  experienceNote?: string;
  consultationModes: ConsultationMode[];
  clinicHours?: { day: string; hours: string }[];
  publications?: string[];
  portrait?: string | null;
  isFounder?: boolean;
  /** true while the real photograph has not been supplied — renders the brand silhouette */
  portraitPlaceholder?: boolean;
};

export type Testimonial = Placeholderable & {
  slug: string;
  group: TestimonialGroup;
  quote: string;
  fullStory?: string[];
  name: string;
  /** "Anjali M." — preferred over `name` wherever a testimonial is displayed */
  displayName?: string;
  city?: string;
  treatment?: string;
  duration?: string;
  rating?: number | null;
  photo?: string | null;
  videoId?: string | null;
  featured?: boolean;
  /** Must be true to render. Enforced in the data layer, not the component. */
  consentOnFile: boolean;
};

export type Speciality = {
  slug: SpecialitySlug;
  name: string;
  sanskrit?: string;
  sanskritAlt?: string;
  malayalam?: string;
  icon: string;
  emphasis: "wide" | "narrow";
  summary: string;
  services?: string[];
  groups?: { title: string; services: string[] }[];
};

export type Treatment = {
  slug: string;
  name: string;
  sanskrit?: string;
  malayalam?: string;
  note?: string;
};

export type JourneyStep = {
  order: number;
  name: string;
  body: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  /** Awaiting clinician sign-off. Badged in development. */
  draft?: boolean;
};

export type Stat = {
  id: string;
  value: number | null;
  suffix: string;
  label: string;
  verified: boolean;
  placeholder?: string;
  /**
   * Rendered text, overriding the numeral. Use where the figure reads better
   * as words than digits — "1 lakh+" rather than "100000+". Setting it also
   * skips the count-up, since animating toward a worded figure is meaningless.
   */
  display?: string;
};

export type BlogPost = Placeholderable & {
  slug: string;
  title: string;
  excerpt: string;
  topic: string;
  /** ISO date, used for ordering */
  date: string;
  readingMinutes?: number;
  author?: string;
  cover?: string | null;
  body?: string[];
};

export type GalleryItem = Placeholderable & {
  id: string;
  group: string;
  caption: string;
  image?: string | null;
  width: number;
  height: number;
};

export type Package = Placeholderable & {
  slug: string;
  name: string;
  speciality: SpecialitySlug;
  duration: string;
  summary?: string;
  includes: string[];
  price?: string;
};
