import type { Metadata } from "next";
import { getGalleryItems } from "@/lib/data/content";
import { SectionHeading } from "@/components/shared/SectionHeading";

export const metadata: Metadata = { title: "Video Gallery", description: "Site walkthrough and project videos from Mahajan Construction." };

export default async function Page() {
  const videos = await getGalleryItems("VIDEO");
  return (
    <section className="container-px mx-auto pb-24 pt-40 md:pb-32">
      <SectionHeading eyebrow="Gallery / Videos" title="Site walkthroughs & timelapses." description="Uploaded directly from the admin panel as projects are filmed." />
      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
        {videos.map((v) => (
          <div key={v.id}>
            <div className="aspect-video overflow-hidden bg-concrete-light">
              <iframe src={v.url} title={v.title || "Project video"} className="h-full w-full" allowFullScreen loading="lazy" />
            </div>
            {v.title && <p className="mt-3 font-display text-lg text-ink dark:text-canvas">{v.title}</p>}
          </div>
        ))}
        {videos.length === 0 && (
          <p className="text-concrete">No videos uploaded yet — add some from the admin panel.</p>
        )}
      </div>
    </section>
  );
}
