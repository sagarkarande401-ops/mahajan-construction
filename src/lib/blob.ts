import { put, del } from "@vercel/blob";

/** Uploads a File (from an admin form) to Vercel Blob storage and returns its
 * public URL.
 */
export async function uploadMedia(
  file: File,
  folder: "projects" | "services" | "gallery"
) {

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
  throw new Error(
    `TOKEN VALUE = ${process.env.BLOB_READ_WRITE_TOKEN}`
  );
}

  const filename = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

  const blob = await put(filename, file, {
    access: "public",
  });

  return blob.url;
}

export async function deleteMedia(url: string) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;

  try {
    await del(url);
  } catch (err) {
    console.error("Failed to delete blob:", err);
  }
}