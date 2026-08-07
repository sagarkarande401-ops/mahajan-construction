import { put, del } from "@vercel/blob";

export async function uploadMedia(
  file: File,
  folder: "projects" | "services" | "gallery"
) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is missing.");
  }

  const filename = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

  const blob = await put(filename, file, {
    access: "public",
    token,
  });

  return blob.url;
}

export async function deleteMedia(url: string) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) return;

  try {
    await del(url, { token });
  } catch (err) {
    console.error("Failed to delete blob:", err);
  }
}
