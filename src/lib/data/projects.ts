import { prisma } from "@/lib/prisma";
import { ProjectCategory } from "@prisma/client";

const projectInclude = {
  images: { orderBy: { order: "asc" as const } },
  videos: { orderBy: { order: "asc" as const } },
  timelineSteps: { orderBy: { order: "asc" as const } },
  beforeAfterPairs: { orderBy: { order: "asc" as const } },
};

export async function getProjects() {
  return prisma.project.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    include: projectInclude,
  });
}

export async function getFeaturedProjects() {
  return prisma.project.findMany({
    where: { published: true, featured: true },
    orderBy: { order: "asc" },
    include: projectInclude,
  });
}

export async function getProjectsByCategory(category: ProjectCategory) {
  return prisma.project.findMany({
    where: { published: true, category },
    orderBy: { order: "asc" },
    include: projectInclude,
  });
}

export async function getProjectBySlug(slug: string) {
  return prisma.project.findUnique({ where: { slug }, include: projectInclude });
}

export async function getRelatedProjects(slug: string, category: ProjectCategory, limit = 3) {
  return prisma.project.findMany({
    where: { published: true, category, slug: { not: slug } },
    take: limit,
    include: projectInclude,
  });
}
