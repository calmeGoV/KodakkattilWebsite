import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BookingCta } from "@/components/home/booking-cta";
import { PageHeader } from "@/components/layout/page-header";
import { MedicalDisclaimer } from "@/components/ui/medical-disclaimer";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { Reveal } from "@/components/ui/reveal";
import { blog, getDoctor, getPost, sortedPosts } from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blog.posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const author = post.author ? getDoctor(post.author) : undefined;
  const more = sortedPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    ...(author ? { author: { "@type": "Person", name: author.name } } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHeader
        kicker={post.topic}
        title={post.title}
        intro={post.excerpt}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Knowledge Hub", href: "/blog" },
          { label: post.topic },
        ]}
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-faint">
          {author && (
            <Link href={`/doctors/${author.slug}`} className="hover:text-accent-ink">
              {author.name}
            </Link>
          )}
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
          {post.readingMinutes && <span>{post.readingMinutes} min read</span>}
        </div>
      </PageHeader>

      <article className="hairline-b bg-surface py-16 lg:py-24">
        <div className="mx-auto max-w-[84rem] px-5 lg:px-10">
          {post.placeholder && (
            <Reveal className="mb-8">
              <PlaceholderBadge label="DUMMY ARTICLE — not written by a clinician. Replace before launch." />
            </Reveal>
          )}

          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-8">
              {(post.body ?? []).map((paragraph, i) => (
                <Reveal key={i} index={i}>
                  <p className="mb-6 max-w-[64ch] text-lg leading-relaxed text-ink-muted">
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>

            {more.length > 0 && (
              <aside
                className="mt-14 lg:col-span-4 lg:mt-0"
                aria-labelledby="more-heading"
              >
                <h2
                  id="more-heading"
                  className="label-caps border-t border-accent/40 pt-4 text-accent-ink"
                >
                  More reading
                </h2>
                <ul className="mt-5 space-y-5">
                  {more.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/blog/${p.slug}`} className="group block">
                        <p className="label-caps text-ink-faint">{p.topic}</p>
                        <p className="mt-1 font-display text-base font-semibold text-ink group-hover:text-accent-ink">
                          {p.title}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </aside>
            )}
          </div>
        </div>
      </article>

      <MedicalDisclaimer />
      <BookingCta />
    </>
  );
}
