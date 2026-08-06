import { prisma } from "@/lib/prisma";
import { GalleryMediaType } from "@prisma/client";

export async function getTestimonials() {
  return prisma.testimonial.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });
}

export async function getFaqs() {
  return prisma.faq.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });
}

export async function getGalleryItems(type?: GalleryMediaType) {
  return prisma.galleryItem.findMany({
    where: type ? { type } : undefined,
    orderBy: { order: "asc" },
  });
}

/** Home/About page stats */
export async function getSiteStats() {
  const stats = await prisma.siteStat.findMany();
  const byKey = Object.fromEntries(stats.map((s) => [s.key, s]));

  return {
    experience:
      byKey["experience_years"] ?? {
        label: "Years in Practice",
        value: 3,
        suffix: "+",
      },
    projectsDelivered:
      byKey["projects_delivered"] ?? {
        label: "Projects Delivered",
        value: 40,
        suffix: "+",
      },
    citiesServed:
      byKey["cities_served"] ?? {
        label: "Cities & Towns Served",
        value: 18,
        suffix: "",
      },
  };
}

export function getBlogPosts() {
  return [
    {
      slug: "planning-your-home",
      title: "Planning Your Dream Home",
      excerpt: "Important things to know before starting construction.",
      coverImage: "/images/blog/blog-1.jpg",
      category: "Planning",
      readTime: "5 min read",
      date: "2026-01-15",
      author: "Mahajan Construction",
      content:
        "Planning your dream home starts with understanding your budget, selecting the right plot, and working with experienced architects and engineers. Proper planning reduces delays and unexpected costs.",
    },
    {
      slug: "construction-cost",
      title: "Construction Cost Guide",
      excerpt: "How to estimate your house construction budget.",
      coverImage: "/images/blog/blog-2.jpg",
      category: "Budget",
      readTime: "6 min read",
      date: "2026-02-10",
      author: "Mahajan Construction",
      content:
        "Construction cost depends on location, materials, labour, and design complexity. Preparing a detailed estimate before starting the project helps avoid budget overruns.",
    },
    {
      slug: "interior-design",
      title: "Modern Interior Design Tips",
      excerpt: "Simple ideas to make your home look premium.",
      coverImage: "/images/blog/blog-3.jpg",
      category: "Interior",
      readTime: "4 min read",
      date: "2026-03-05",
      author: "Mahajan Construction",
      content:
        "A premium interior doesn't always require a huge budget. Good lighting, quality materials, smart storage, and balanced colours can completely transform your home.",
    },
  ];
}

export function getBlogPostBySlug(slug: string) {
  return getBlogPosts().find((post) => post.slug === slug);
}