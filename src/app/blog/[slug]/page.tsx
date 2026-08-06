import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/data/content";
import { siteConfig } from "@/lib/utils";

export function generateStaticParams() {
  return getBlogPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { images: [{ url: post.coverImage }] },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <article>
      <section className="container-px mx-auto pb-12 pt-40">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-concrete hover:text-gold">
          <ArrowLeft className="h-4 w-4" /> Journal
        </Link>
        <div className="mt-6 flex items-center gap-4">
          <span className="eyebrow">{post.category}</span>
          <span className="coord-tag">{new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
          <span className="coord-tag">{post.readTime}</span>
        </div>
        <h1 className="mt-6 max-w-3xl text-balance text-display-2 font-display font-normal text-ink dark:text-canvas">
          {post.title}
        </h1>
        <p className="mt-4 text-concrete">By {post.author}, {siteConfig.name}</p>
      </section>

      <div className="container-px mx-auto">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-concrete-light">
          <Image src={post.coverImage} alt={post.title} fill priority className="object-cover" />
        </div>
      </div>

      <section className="container-px mx-auto py-16 md:py-24">
        <div className="mx-auto max-w-2xl">
          <p className="text-lg leading-loose text-ink dark:text-canvas">{post.content}</p>
        </div>
      </section>
    </article>
  );
}
