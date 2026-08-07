import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

export const metadata: Metadata = {
  title: "Vision",
  description: "The vision behind Mahajan Construction — building premium, accountable architecture across Maharashtra.",
};

const pillars = [
  { title: "One Accountable Team", body: "No gaps between architect, contractor, and interior designer — a single team owns the outcome." },
  { title: "Regional Excellence", body: "Bring big-city design and project discipline to Ashta, Sangli, and the towns around them." },
  { title: "Radical Transparency", body: "Clients see real costs, real timelines, and real progress — not polished updates." },
];

export default function VisionPage() {
  return (
    <section className="container-px mx-auto pb-24 pt-40 md:pb-32">
      <SectionHeading eyebrow="About / Vision" title="Where we're building toward." />
      <RevealOnScroll className="mt-8 max-w-2xl text-lg leading-relaxed text-concrete">
        Our vision is simple: make Ashta and the towns around it a place where premium, design-led construction
        doesn&rsquo;t require going to a bigger city to find it.
      </RevealOnScroll>
      <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-3">
        {pillars.map((p, i) => (
          <RevealOnScroll key={p.title} delay={i * 0.1} className="border-t border-line pt-6 dark:border-line-dark">
            <span className="font-mono text-xs text-gold">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-3 font-display text-2xl text-ink dark:text-canvas">{p.title}</h3>
            <p className="mt-3 text-concrete">{p.body}</p>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}

