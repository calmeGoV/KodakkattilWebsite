import type { Metadata } from "next";
import Link from "next/link";

import { BookingCta } from "@/components/home/booking-cta";
import { PageHeader } from "@/components/layout/page-header";
import { MedicalDisclaimer } from "@/components/ui/medical-disclaimer";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { Reveal } from "@/components/ui/reveal";
import { blog, getDoctor, sortedPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Knowledge Hub",
  description:
    "Health education for parents and mothers: pregnancy, child nutrition, breastfeeding, PCOS, mental wellness and seasonal health.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = sortedPosts();

  return (
    <>
      <PageHeader
        kicker="Knowledge Hub"
        title="Reading for parents and mothers."
        intro={blog.intro}
        crumbs={[{ label: "Home", href: "/" }, { label: "Knowledge Hub" }]}
      />

      <section className="hairline-b bg-surface py-16 lg:py-20">
        <div className="mx-auto max-w-[84rem] px-5 lg:px-10">
          <ul className="flex flex-wrap gap-2">
            {blog.topics.map((topic) => (
              <li
                key={topic}
                className="rounded-xs bg-primary-tint px-3 py-1.5 text-xs text-primary"
              >
                {topic}
              </li>
            ))}
          </ul>

          {posts.length > 0 ? (
            <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => {
                const author = post.author ? getDoctor(post.author) : undefined;
                return (
                  <Reveal as="li" key={post.slug} index={i % 3} className="flex">
                    <article className="group flex w-full flex-col rounded-card border border-ink/12 bg-surface-raised p-6 transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-lift">
                      <p className="label-caps text-accent-ink">{post.topic}</p>

                      <h2 className="mt-3 font-display text-xl font-semibold text-ink">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>

                      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
                        {post.excerpt}
                      </p>

                      {post.placeholder && (
                        <PlaceholderBadge className="mt-4 self-start" />
                      )}

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-accent/25 pt-4 text-xs text-ink-faint">
                        <span>{author?.name ?? "Our clinical team"}</span>
                        <span className="flex gap-3">
                          <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </time>
                          {post.readingMinutes && (
                            <span>{post.readingMinutes} min</span>
                          )}
                        </span>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </ul>
          ) : (
            <p className="mt-12 rounded-card border border-dashed border-accent/50 p-8 text-ink-muted">
              Articles are being written by our doctors and will appear here.
            </p>
          )}
        </div>
      </section>

      <MedicalDisclaimer />
      <BookingCta />
    </>
  );
}
