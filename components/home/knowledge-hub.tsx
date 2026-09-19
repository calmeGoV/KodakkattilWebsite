import Link from "next/link";

import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { blog, home } from "@/lib/content";
import type { BlogPost } from "@/types/content";

/**
 * Three latest posts. Until any exist, this renders the planned topic list and
 * says plainly that articles are on the way — rather than three cards of
 * invented health writing, which on a medical site is the worst possible thing
 * to fake.
 */
export function KnowledgeHub() {
  const { knowledge: section } = home.sections;
  const posts = [...blog.posts]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 3);

  return (
    <section className="hairline-b bg-surface-raised py-20 lg:py-28">
      <div className="mx-auto max-w-[84rem] px-5 lg:px-10">
        <SectionHeader
          kicker={section.kicker}
          title={section.title}
          intro={blog.intro}
          cta={section.cta}
        />

        {posts.length > 0 ? (
          <ul className="mt-14 grid gap-5 md:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal as="li" key={post.slug} index={i} className="flex">
                <PostCard post={post} />
              </Reveal>
            ))}
          </ul>
        ) : (
          <Reveal className="mt-12 rounded-card border border-dashed border-accent/50 bg-surface p-8 lg:p-12">
            <p className="max-w-[52ch] text-ink-muted">
              Articles are being written by our doctors and will appear here.
              These are the subjects they will cover.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {blog.topics.map((topic) => (
                <li
                  key={topic}
                  className="rounded-xs bg-primary-tint px-3 py-1.5 text-xs text-primary"
                >
                  {topic}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <PlaceholderBadge label="TODO_BLOG_POSTS — content/blog.json posts[] is empty" />
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <article className="group flex w-full flex-col rounded-card border border-ink/12 bg-surface p-6 transition-colors duration-200 hover:border-accent/60">
      <p className="label-caps text-accent-ink">{post.topic}</p>

      <h3 className="mt-3 font-display text-xl font-semibold text-ink">
        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      </h3>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
        {post.excerpt}
      </p>

      <div className="mt-6 flex items-center justify-between border-t border-accent/25 pt-4 text-xs text-ink-faint">
        <time dateTime={post.date}>
          {new Date(post.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </time>
        {post.readingMinutes && <span>{post.readingMinutes} min read</span>}
      </div>
    </article>
  );
}
