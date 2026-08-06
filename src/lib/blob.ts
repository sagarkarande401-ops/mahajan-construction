import { put, del } from "@vercel/blob";

/** Uploads a File (from an admin form) to Vercel Blob storage and returns its
 *  public URL. Requires BLOB_READ_WRITE_TOKEN — see README "Media Uploads". */
export async function uploadMedia(file: File, folder: "projects" | "services" | "gallery") {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      "Media upload isn't configured yet. Enable Vercel Blob storage for this project and add BLOB_READ_WRITE_TOKEN — see README."
    );
  }
  const filename = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const blob = await put(filename, file, { access: "public" });
  return blob.url;
}

export async function uploadMedia(file: File, folder: "projects" | "services" | "gallery") {

  console.log("TOKEN:", process.env.BLOB_READ_WRITE_TOKEN);

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      "Media upload isn't configured yet. Enable Vercel Blob storage for this project and add BLOB_READ_WRITE_TOKEN — see README."
    );
  }

  const filename = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const blob = await put(filename, file, { access: "public" });
  return blob.url;
}