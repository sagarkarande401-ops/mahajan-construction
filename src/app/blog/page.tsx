import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getBlogPosts } from "@/lib/data/content";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

export const metadata: Metadata = {
  title: "Journal",
  description: "Notes on design, planning, and construction from the Mahajan Construction studio in Ashta, Maharashtra.",
};

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <section className="container-px mx-auto pb-24 pt-40 md:pb-32">
      <span className="eyebrow">Journal</span>
      <h1 className="mt-6 max-w-3xl text-balance text-display-1 font-display font-normal text-ink dark:text-canvas">
        Notes from the site and the drawing board.
      </h1>
      <p className="mt-6 max-w-xl text-lg text-concrete">
        Practical writing on design decisions, budgeting, and what actually happens on a construction site.
      </p>

      <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-3">
        {posts.map((post, i) => (
          <RevealOnScroll key={post.slug} delay={i * 0.08}>
            <Link href={`/blog/${post.slug}`} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden bg-concrete-light">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-[1200ms] ease-luxury group-hover:scale-[1.06]"
                />
              </div>
              <div className="mt-5 flex items-center gap-3">
                <span className="eyebrow">{post.category}</span>
                <span className="coord-tag">{post.readTime}</span>
              </div>
              <h2 className="mt-3 font-display text-2xl text-ink transition-colors group-hover:text-gold dark:text-canvas">
                {post.title}
              </h2>
              <p className="mt-3 text-concrete">{post.excerpt}</p>
            </Link>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}

