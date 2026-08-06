import { prisma } from "@/lib/prisma";
import { GalleryAdminClient } from "./GalleryAdminClient";

export default async function AdminGalleryPage() {
  const items = await prisma.galleryItem.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="p-6 md:p-10">
      <span className="eyebrow">Manage</span>
      <h1 className="mt-2 font-display text-3xl text-ink dark:text-canvas">Gallery</h1>
      <p className="mt-2 max-w-xl text-sm text-concrete">
        Photos and videos uploaded here appear on the public Gallery page. Upload requires Vercel Blob storage configured — see README.
      </p>
      <div className="mt-8">
        <GalleryAdminClient items={items} />
      </div>
    </div>
  );
}
