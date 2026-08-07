import { prisma } from "@/lib/prisma";

export async function getServices() {
  return prisma.service.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: { processSteps: { orderBy: { order: "asc" } }, faqs: { orderBy: { order: "asc" } }, images: { orderBy: { order: "asc" } } },
  });
}

export async function getServiceBySlug(slug: string) {
  return prisma.service.findUnique({
    where: { slug },
    include: { processSteps: { orderBy: { order: "asc" } }, faqs: { orderBy: { order: "asc" } }, images: { orderBy: { order: "asc" } } },
  });
}

