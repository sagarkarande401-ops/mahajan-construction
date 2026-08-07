import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

export const metadata: Metadata = {
  title: "Team",
  description: "Meet the site supervisors, designers, and coordinators behind Mahajan Construction's projects.",
};

// NOTE: Replace with real team members, photos, and titles when available.
const team = [
  { name: "Saish Mahajan", role: ",", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop" },
  { name: "Site Team", role: "Construction & Supervision", img: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800&auto=format&fit=crop" },
  { name: "Design Team", role: "Architecture & Interiors", img: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?q=80&w=800&auto=format&fit=crop" },
];

export default function TeamPage() {
  return (
    <section className="container-px mx-auto pb-24 pt-40 md:pb-32">
      <SectionHeading eyebrow="About / Team" title="The people on your site." />
      <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-3">
        {team.map((member, i) => (
          <RevealOnScroll key={member.name} delay={i * 0.1}>
            <div className="relative aspect-[4/5] overflow-hidden bg-concrete-light">
              <Image src={member.img} alt={member.name} fill className="object-cover" />
            </div>
            <h3 className="mt-4 font-display text-xl text-ink dark:text-canvas">{member.name}</h3>
            <p className="coord-tag mt-1">{member.role}</p>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}

