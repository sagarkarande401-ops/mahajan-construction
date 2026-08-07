"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { testimonialSchema, faqSchema } from "@/lib/validation";
import { uploadMedia, deleteMedia } from "@/lib/blob";
import { GalleryMediaType } from "@prisma/client";

// ---------- Gallery ----------
export async function addGalleryPhoto(formData: FormData) {
  const file = formData.get("file");
  const title = String(formData.get("title") || "");
  const category = String(formData.get("category") || "");
  if (!(file instanceof File) || file.size === 0) return { success: false, error: "Please choose a file." };
  const url = await uploadMedia(file, "gallery");
  await prisma.galleryItem.create({ data: { type: "PHOTO", url, title: title || null, category: category || null } });
  revalidatePath("/admin/gallery"); revalidatePath("/gallery"); revalidatePath("/gallery/photos");
  return { success: true };
}

export async function addGalleryVideo(url: string, title: string, category: string) {
  await prisma.galleryItem.create({ data: { type: "VIDEO", url, title: title || null, category: category || null } });
  revalidatePath("/admin/gallery"); revalidatePath("/gallery/videos");
}

export async function deleteGalleryItem(id: string) {
  const item = await prisma.galleryItem.findUnique({ where: { id } });
  if (item?.type === ("PHOTO" as GalleryMediaType)) await deleteMedia(item.url);
  await prisma.galleryItem.delete({ where: { id } });
  revalidatePath("/admin/gallery"); revalidatePath("/gallery"); revalidatePath("/gallery/photos"); revalidatePath("/gallery/videos");
}

// ---------- Testimonials ----------
export async function saveTestimonial(formData: FormData, existingId?: string) {
  const raw = {
    name: String(formData.get("name") || ""),
    role: String(formData.get("role") || ""),
    location: String(formData.get("location") || ""),
    quote: String(formData.get("quote") || ""),
    rating: Number(formData.get("rating") || 5),
    published: formData.get("published") === "on",
  };
  const parsed = testimonialSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  if (existingId) await prisma.testimonial.update({ where: { id: existingId }, data: parsed.data });
  else await prisma.testimonial.create({ data: parsed.data });

  revalidatePath("/admin/testimonials"); revalidatePath("/testimonials");
  return { success: true };
}

export async function deleteTestimonial(id: string) {
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/admin/testimonials"); revalidatePath("/testimonials");
}

// ---------- FAQs ----------
export async function saveFaq(formData: FormData, existingId?: string) {
  const raw = {
    category: String(formData.get("category") || "General"),
    question: String(formData.get("question") || ""),
    answer: String(formData.get("answer") || ""),
    published: formData.get("published") === "on",
  };
  const parsed = faqSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  if (existingId) await prisma.faq.update({ where: { id: existingId }, data: parsed.data });
  else await prisma.faq.create({ data: parsed.data });

  revalidatePath("/admin/faqs"); revalidatePath("/faq");
  return { success: true };
}

export async function deleteFaq(id: string) {
  await prisma.faq.delete({ where: { id } });
  revalidatePath("/admin/faqs"); revalidatePath("/faq");
}

