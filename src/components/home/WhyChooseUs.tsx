import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { ShieldCheck, Clock, FileSpreadsheet, Users } from "lucide-react";

const reasons = [
  {
    icon: ShieldCheck,
    title: "Single Point of Accountability",
    description: "Design, construction, and interiors run under one team — no finger-pointing between separate contractors.",
  },
  {
    icon: Clock,
    title: "Timelines We Publish, Not Just Promise",
    description: "Every project ships with a stage-wise schedule shared upfront, and weekly reporting against it.",
  },
  {
    icon: FileSpreadsheet,
    title: "Transparent, Line-Item Estimates",
    description: "Material specifications are documented brand, grade, and quantity — so the final bill matches the quote.",
  },
  {
    icon: Users,
    title: "Direct Access to the Owner",
    description: "Saish Mahajan is personally involved in every project, from first site visit to final handover.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-24 md:py-32">
      <div className="container-px mx-auto">
        <SectionHeading eyebrow="Why Choose Us" title="Built on discipline, not just design." index="02 / 08" />

        <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-2">
          {reasons.map((reason, i) => (
            <RevealOnScroll key={reason.title} delay={i * 0.1}>
              <reason.icon className="h-6 w-6 text-gold" strokeWidth={1.5} />
              <h3 className="mt-5 font-display text-2xl text-ink dark:text-canvas">{reason.title}</h3>
              <p className="mt-3 max-w-md text-concrete">{reason.description}</p>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

