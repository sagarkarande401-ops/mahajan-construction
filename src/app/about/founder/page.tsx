import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { siteConfig } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Founder",
  description: `Saish Mahajan, Founder of Mahajan Construction, Ashta, Maharashtra.`,
};

export default function FounderPage() {
  return (
    <section className="container-px mx-auto grid grid-cols-1 gap-12 pb-24 pt-12 md:gap-16 md:pb-32 md:pt-16 lg:grid-cols-2">
      <RevealOnScroll className="relative aspect-[4/5] overflow-hidden bg-concrete-light">
        <Image
          src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1200&auto=format&fit=crop"
          alt="Saish Mahajan, Founder of Mahajan Construction"
          fill
          className="object-cover"
        />
      </RevealOnScroll>

      <div>
        <SectionHeading eyebrow="About / Founder" title="Saish Mahajan" />

        <RevealOnScroll
          delay={0.1}
          className="mt-6 max-w-xl space-y-5 text-lg leading-relaxed text-concrete"
        >
          <p>Founder Mahajan Construction.</p>

          <p>
            Saish leads every project the studio takes on personally, from the
            first site walk to the final snag-list closure. He believes a
            client shouldn&rsquo;t have to manage the gap between an architect,
            a contractor, and an interior designer — so Mahajan Construction
            was built to remove that gap entirely.
          </p>

          <p>
            Direct line:{" "}
            <a
              href={`tel:${siteConfig.phone}`}
              className="text-ink underline dark:text-canvas"
            >
              {siteConfig.phoneDisplay}
            </a>{" "}
            ·{" "}
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-ink underline dark:text-canvas"
            >
              {siteConfig.email}
            </a>
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}