import { prisma } from "@/lib/prisma";
import { GalleryMediaType } from "@prisma/client";

export async function getTestimonials() {
  return prisma.testimonial.findMany({ where: { published: true }, orderBy: { order: "asc" } });
}

export async function getFaqs() {
  return prisma.faq.findMany({ where: { published: true }, orderBy: { order: "asc" } });
}

export async function getGalleryItems(type?: GalleryMediaType) {
  return prisma.galleryItem.findMany({
    where: type ? { type } : undefined,
    orderBy: { order: "asc" },
  });
}

/** Home/About page stats — Experience, Projects Delivered, Cities & Towns Served.
 *  "On-Time Handover Rate" has been intentionally removed per request; do not re-add it. */
export async function getSiteStats() {
  const stats = await prisma.siteStat.findMany();
  const byKey = Object.fromEntries(stats.map((s) => [s.key, s]));
  return {
    experience: byKey["experience_years"] ?? { label: "Years in Practice", value: 3, suffix: "+" },
    projectsDelivered: byKey["projects_delivered"] ?? { label: "Projects Delivered", value: 40, suffix: "+" },
    citiesServed: byKey["cities_served"] ?? { label: "Cities & Towns Served", value: 18, suffix: "" },
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
    },
    {
      slug: "construction-cost",
      title: "Construction Cost Guide",
      excerpt: "How to estimate your house construction budget.",
      coverImage: "/images/blog/blog-2.jpg",
      category: "Budget",
      readTime: "6 min read",
    },
    {
      slug: "interior-design",
      title: "Modern Interior Design Tips",
      excerpt: "Simple ideas to make your home look premium.",
      coverImage: "/images/blog/blog-3.jpg",
      category: "Interior",
      readTime: "4 min read",
    },
  ];
}