"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "@/lib/validation";
import { uploadMedia, deleteMedia } from "@/lib/blob";
import { ProjectCategory, ProjectStatus } from "@prisma/client";

export interface ProjectFormResult { success: boolean; error?: string; projectId?: string; }

export async function saveProject(formData: FormData, existingId?: string): Promise<ProjectFormResult> {
  const raw = {
    slug: String(formData.get("slug") || ""),
    name: String(formData.get("name") || ""),
    category: String(formData.get("category") || "RESIDENTIAL") as ProjectCategory,
    projectType: String(formData.get("projectType") || ""),
    client: String(formData.get("client") || "") || undefined,
    location: String(formData.get("location") || ""),
    area: String(formData.get("area") || ""),
    timeline: String(formData.get("timeline") || ""),
    year: String(formData.get("year") || ""),
    status: String(formData.get("status") || "COMPLETED") as ProjectStatus,
    description: String(formData.get("description") || ""),
    challenges: String(formData.get("challenges") || "") || undefined,
    solutions: String(formData.get("solutions") || "") || undefined,
    materialsUsed: String(formData.get("materialsUsed") || "").split(",").map((s) => s.trim()).filter(Boolean),
    highlights: String(formData.get("highlights") || "").split("\n").map((s) => s.trim()).filter(Boolean),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
  };

  const parsed = projectSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Invalid project data." };
  }

  // Handle new image uploads (multiple files under "images")
  const imageFiles = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  const uploadedImageUrls: string[] = [];
  for (const file of imageFiles) {
    try {
      uploadedImageUrls.push(await uploadMedia(file, "projects"));
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  }
  const coverImage = uploadedImageUrls[0]; // first newly uploaded image becomes cover if none set

  try {
    if (existingId) {
      const project = await prisma.project.update({
        where: { id: existingId },
        data: {
          ...parsed.data,
          ...(coverImage ? { coverImage } : {}),
          images: uploadedImageUrls.length ? { create: uploadedImageUrls.map((url, i) => ({ url, order: i })) } : undefined,
        },
      });
      revalidatePath("/admin/projects");
      revalidatePath(`/projects/${project.slug}`);
      revalidatePath("/projects");
      return { success: true, projectId: project.id };
    } else {
      const project = await prisma.project.create({
        data: {
          ...parsed.data,
          coverImage,
          images: { create: uploadedImageUrls.map((url, i) => ({ url, order: i })) },
        },
      });
      revalidatePath("/admin/projects");
      revalidatePath("/projects");
      return { success: true, projectId: project.id };
    }
  } catch (err: unknown) {
    console.error("Save project error:", err);
    const message = err instanceof Error && err.message.includes("Unique constraint") ? "A project with this slug already exists." : "Failed to save project.";
    return { success: false, error: message };
  }
}

export async function deleteProject(id: string) {
  const project = await prisma.project.findUnique({ where: { id }, include: { images: true } });
  if (project) {
    for (const img of project.images) await deleteMedia(img.url);
    if (project.coverImage) await deleteMedia(project.coverImage);
  }
  await prisma.project.delete({ where: { id } });
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
}

export async function deleteProjectImage(imageId: string) {
  const image = await prisma.projectImage.findUnique({ where: { id: imageId } });
  if (image) await deleteMedia(image.url);
  await prisma.projectImage.delete({ where: { id: imageId } });
  revalidatePath("/admin/projects");
}

export async function addProjectVideo(projectId: string, url: string, title?: string) {
  await prisma.projectVideo.create({ data: { projectId, url, title } });
  revalidatePath("/admin/projects");
}

export async function deleteProjectVideo(videoId: string) {
  await prisma.projectVideo.delete({ where: { id: videoId } });
  revalidatePath("/admin/projects");
}

