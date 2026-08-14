import type { Metadata } from "next";
import { getGalleryItems } from "@/lib/data/content";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { GalleryGrid } from "@/app/gallery/GalleryGrid";

export const metadata: Metadata = {
  title: "Photo Gallery",
  description: "Photo archive of Mahajan Construction's projects.",
};

export default async function Page() {
  const items = await getGalleryItems("PHOTO");

  return (
    <section className="container-px mx-auto pb-24 pt-16 md:pb-32 md:pt-20">
      <SectionHeading
        eyebrow="Gallery / Photos"
        title="The full photo archive."
      />

      <div className="mt-16">
        <GalleryGrid items={items} />
      </div>
    </section>
  );
}