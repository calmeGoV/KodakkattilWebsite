import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BookingCta } from "@/components/home/booking-cta";
import { PageHeader } from "@/components/layout/page-header";
import { RatingStars } from "@/components/testimonials/rating-stars";
import { VideoFacade } from "@/components/testimonials/video-facade";
import { MedicalDisclaimer } from "@/components/ui/medical-disclaimer";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { Reveal } from "@/components/ui/reveal";
import { consentedTestimonials, getTestimonial } from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

/** Only consented stories get a page at all. */
export function generateStaticParams() {
  return consentedTestimonials()
    .filter((t) => (t.fullStory?.length ?? 0) > 0)
    .map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const story = getTestimonial(slug);
  if (!story) return {};
  return {
    title: `${story.name}'s story`,
    description: story.quote.slice(0, 180),
    alternates: { canonical: `/stories/${story.slug}` },
  };
}

export default async function StoryPage({ params }: Params) {
  const { slug } = await params;
  const story = getTestimonial(slug);
  if (!story || !story.fullStory?.length) notFound();

  const meta = [story.treatment, story.duration, story.city].filter(Boolean);

  return (
    <>
      <PageHeader
        kicker="A patient story"
        title={`${story.name}'s story`}
        intro={meta.join(" · ")}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Stories", href: "/stories" },
          { label: story.name },
        ]}
      >
        <RatingStars rating={story.rating} />
      </PageHeader>

      <article className="hairline-b bg-surface py-16 lg:py-24">
        <div className="mx-auto max-w-[84rem] px-5 lg:px-10">
          <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <blockquote>
                <p className="font-display text-2xl font-semibold leading-[1.25] text-ink">
                  <span aria-hidden="true" className="text-accent">&ldquo;</span>
                  {story.quote}
                  <span aria-hidden="true" className="text-accent">&rdquo;</span>
                </p>
                <footer className="mt-6 border-t border-accent/40 pt-4">
                  <p className="font-display text-lg font-semibold text-ink">
                    {story.name}
                  </p>
                  {story.city && (
                    <p className="mt-1 text-sm text-ink-faint">{story.city}</p>
                  )}
                </footer>
              </blockquote>

              {story.placeholder && <PlaceholderBadge className="mt-5" />}
            </Reveal>

            <div className="lg:col-span-7">
              {story.videoId && (
                <Reveal className="mb-10">
                  <VideoFacade
                    videoId={story.videoId}
                    title={`${story.name} — patient story`}
                  />
                </Reveal>
              )}

              {story.fullStory.map((p, i) => (
                <Reveal key={i} index={i}>
                  <p className="mb-6 max-w-[62ch] text-lg leading-relaxed text-ink-muted">
                    {p}
                  </p>
                </Reveal>
              ))}

              <Reveal className="mt-10 border-t border-accent/30 pt-6">
                <p className="text-sm text-ink-faint">
                  Published with written consent. Names are shown as the family
                  asked us to show them.
                </p>
                <Link
                  href="/stories"
                  className="group mt-5 inline-flex items-center gap-3 text-accent-ink hover:text-primary"
                >
                  <span className="label-caps">All stories</span>
                  <span
                    aria-hidden="true"
                    className="inline-block h-px w-10 bg-accent transition-all duration-200 group-hover:w-14"
                  />
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </article>

      <MedicalDisclaimer />
      <BookingCta />
    </>
  );
}
