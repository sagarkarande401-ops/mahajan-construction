"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X } from "lucide-react";
import { addGalleryPhoto, addGalleryVideo, deleteGalleryItem } from "@/app/actions/admin-content";
import { Label, Input } from "@/components/ui/form-fields";
import { GalleryItem } from "@/types";

export function GalleryAdminClient({ items }: { items: GalleryItem[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [photoError, setPhotoError] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoCategory, setVideoCategory] = useState("");

  const handlePhotoUpload = (formData: FormData) => {
    setPhotoError("");
    startTransition(async () => {
      const result = await addGalleryPhoto(formData);
      if (!result.success) { setPhotoError(result.error || "Upload failed."); return; }
      router.refresh();
    });
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="border border-line p-6 dark:border-line-dark">
          <h2 className="font-display text-lg text-ink dark:text-canvas">Upload Photo</h2>
          <form action={handlePhotoUpload} className="mt-4 space-y-4">
            <input type="file" name="file" accept="image/*" required className="block w-full text-sm text-concrete file:mr-4 file:border file:border-line file:bg-transparent file:px-4 file:py-2 file:text-ink dark:file:border-line-dark dark:file:text-canvas" />
            <Input name="title" placeholder="Title (optional)" />
            <Input name="category" placeholder="Category (e.g. Residential)" />
            {photoError && <p className="text-xs text-red-600">{photoError}</p>}
            <button type="submit" disabled={isPending} className="bg-ink px-5 py-2.5 text-sm text-canvas disabled:opacity-60 dark:bg-canvas dark:text-ink">
              {isPending ? "Uploading..." : "Upload"}
            </button>
          </form>
        </div>

        <div className="border border-line p-6 dark:border-line-dark">
          <h2 className="font-display text-lg text-ink dark:text-canvas">Add Video (YouTube/Vimeo embed URL)</h2>
          <div className="mt-4 space-y-4">
            <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/embed/..." />
            <Input value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} placeholder="Title" />
            <Input value={videoCategory} onChange={(e) => setVideoCategory(e.target.value)} placeholder="Category" />
            <button
              onClick={() => { if (videoUrl) startTransition(async () => { await addGalleryVideo(videoUrl, videoTitle, videoCategory); setVideoUrl(""); setVideoTitle(""); setVideoCategory(""); router.refresh(); }); }}
              disabled={isPending}
              className="bg-ink px-5 py-2.5 text-sm text-canvas disabled:opacity-60 dark:bg-canvas dark:text-ink"
            >
              Add Video
            </button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-display text-lg text-ink dark:text-canvas">All Gallery Items ({items.length})</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {items.map((item) => (
            <div key={item.id} className="group relative aspect-square overflow-hidden bg-concrete-light">
              {item.type === "PHOTO" ? (
                <Image src={item.url} alt={item.title || ""} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-ink text-xs text-canvas">VIDEO</div>
              )}
              <button
                onClick={() => startTransition(async () => { await deleteGalleryItem(item.id); router.refresh(); })}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center bg-ink/80 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {items.length === 0 && <p className="text-concrete">No items yet.</p>}
        </div>
      </div>
    </div>
  );
}
