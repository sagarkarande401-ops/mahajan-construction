import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

export const metadata: Metadata = {
  title: "Our Story",
  description: "How Mahajan Construction started in Ashta, Maharashtra and grew into a full-scope architecture, construction, and interiors studio.",
};

export default function OurStoryPage() {
  return (
    <section className="container-px mx-auto pb-24 pt-40 md:pb-32">
      <SectionHeading eyebrow="About / Our Story" title="How it started." />
      <RevealOnScroll className="mt-10 max-w-2xl space-y-5 text-lg leading-relaxed text-concrete">
        <p>
          Mahajan Construction began in Ashta with a single, small residential project and a founder who insisted on
          being on-site every day it was under construction. That habit never went away.
        </p>
        <p>
          What started as one person managing design, site work, and vendor coordination personally has grown into a
          small studio — but the discipline of daily site presence and direct client access stayed the same by design,
          not by accident.
        </p>
        <p>
          Today the studio works across Ashta, Sangli, and Miraj on residential, commercial, and renovation projects,
          still run on the same principle it started with: one accountable team, from first sketch to final handover.
        </p>
      </RevealOnScroll>
    </section>
  );
}
