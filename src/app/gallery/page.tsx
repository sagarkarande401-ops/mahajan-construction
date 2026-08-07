import type { Metadata } from "next";
import { getGalleryItems } from "@/lib/data/content";
import { GalleryGrid } from "./GalleryGrid";

export const metadata: Metadata = {
  title: "Gallery",
  description: "A visual archive of Mahajan Construction's residential, commercial, and interior projects across Maharashtra.",
};

export default async function GalleryPage() {
  const items = await getGalleryItems("PHOTO");

  return (
    <section className="container-px mx-auto pb-24 pt-40 md:pb-32">
      <span className="eyebrow">Gallery</span>
      <h1 className="mt-6 max-w-3xl text-balance text-display-1 font-display font-normal text-ink dark:text-canvas">
        The full site archive.
      </h1>
      <p className="mt-6 max-w-xl text-lg text-concrete">
        Every image here is uploaded directly by the studio — nothing stock, nothing staged. Photos are added regularly as projects progress.
      </p>

      <div className="mt-16">
        <GalleryGrid items={items} />
      </div>
    </section>
  );
}

