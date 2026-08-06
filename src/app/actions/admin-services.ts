"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { serviceSchema } from "@/lib/validation";
import { uploadMedia, deleteMedia } from "@/lib/blob";

export interface ServiceFormResult { success: boolean; error?: string; serviceId?: string; }

export async function saveService(formData: FormData, existingId?: string): Promise<ServiceFormResult> {
  const raw = {
    slug: String(formData.get("slug") || ""),
    name: String(formData.get("name") || ""),
    shortDescription: String(formData.get("shortDescription") || ""),
    description: String(formData.get("description") || ""),
    icon: String(formData.get("icon") || "compass"),
    features: String(formData.get("features") || "").split("\n").map((s) => s.trim()).filter(Boolean),
    published: formData.get("published") === "on",
  };

  const parsed = serviceSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message || "Invalid data." };

  const imageFiles = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  const uploadedUrls: string[] = [];
  for (const file of imageFiles) {
    try { uploadedUrls.push(await uploadMedia(file, "services")); } catch (err) { console.error(err); }
  }

  try {
    if (existingId) {
      const service = await prisma.service.update({
        where: { id: existingId },
        data: {
          ...parsed.data,
          ...(uploadedUrls[0] ? { coverImage: uploadedUrls[0] } : {}),
          images: uploadedUrls.length ? { create: uploadedUrls.map((url, i) => ({ url, order: i })) } : undefined,
        },
      });
      revalidatePath("/admin/services"); revalidatePath(`/services/${service.slug}`); revalidatePath("/services");
      return { success: true, serviceId: service.id };
    } else {
      const service = await prisma.service.create({
        data: { ...parsed.data, coverImage: uploadedUrls[0], images: { create: uploadedUrls.map((url, i) => ({ url, order: i })) } },
      });
      revalidatePath("/admin/services"); revalidatePath("/services");
      return { success: true, serviceId: service.id };
    }
  } catch (err: unknown) {
    const message = err instanceof Error && err.message.includes("Unique constraint") ? "A service with this slug already exists." : "Failed to save service.";
    return { success: false, error: message };
  }
}

export async function deleteService(id: string) {
  const service = await prisma.service.findUnique({ where: { id }, include: { images: true } });
  if (service) {
    for (const img of service.images) await deleteMedia(img.url);
    if (service.coverImage) await deleteMedia(service.coverImage);
  }
  await prisma.service.delete({ where: { id } });
  revalidatePath("/admin/services"); revalidatePath("/services");
}

export async function addProcessStep(serviceId: string, title: string, description: string) {
  const count = await prisma.serviceProcessStep.count({ where: { serviceId } });
  await prisma.serviceProcessStep.create({ data: { serviceId, title, description, order: count + 1 } });
  revalidatePath("/admin/services");
}
export async function deleteProcessStep(id: string) {
  await prisma.serviceProcessStep.delete({ where: { id } });
  revalidatePath("/admin/services");
}
export async function addServiceFaq(serviceId: string, question: string, answer: string) {
  await prisma.serviceFaq.create({ data: { serviceId, question, answer } });
  revalidatePath("/admin/services");
}
export async function deleteServiceFaq(id: string) {
  await prisma.serviceFaq.delete({ where: { id } });
  revalidatePath("/admin/services");
}
