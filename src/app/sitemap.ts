import { MetadataRoute } from "next";
import { getProjects } from "@/lib/data/projects";
import { getBlogPosts } from "@/lib/data/content";
import { siteConfig } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();

  const staticRoutes = [
    "",
    "about",
    "services",
    "projects",
    "process",
    "gallery",
    "testimonials",
    "faq",
    "blog",
    "contact",
    "privacy-policy",
  ].map((route) => ({
    url: `${siteConfig.url}/${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const projectRoutes = projects.map((p) => ({
    url: `${siteConfig.url}/projects/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogRoutes = getBlogPosts().map((p) => ({
    url: `${siteConfig.url}/blog/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
