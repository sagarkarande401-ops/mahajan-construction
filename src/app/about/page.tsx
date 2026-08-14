import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { siteConfig } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description: `Meet ${siteConfig.owner} and the Mahajan Construction studio — designing and building premium residential and commercial projects in Ashta, Maharashtra.`,
};

const values = [
  {
    title: "Precision",
    description:
      "Drawings are followed to the millimetre, not treated as suggestions.",
  },
  {
    title: "Transparency",
    description:
      "Clients see cost, timeline, and progress in writing — every week.",
  },
  {
    title: "Craft",
    description:
      "Materials and detailing chosen for how they age, not just how they photograph.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative flex min-h-[70vh] items-end bg-ink text-canvas">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2400&auto=format&fit=crop"
            alt="Mahajan Construction studio at work"
            fill
            priority
            className="object-cover opacity-40"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/20" />
        </div>

        <div className="container-px relative mx-auto pb-24 pt-8 md:pt-12">
          <span className="eyebrow">About the Studio</span>

          <h1 className="mt-6 max-w-3xl text-balance text-display-1 font-display font-normal">
            A small studio, run with the discipline of a much larger one.
          </h1>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="container-px mx-auto grid grid-cols-1 gap-16 lg:grid-cols-2">
          <SectionHeading
            eyebrow="The Founder"
            title="Saish Mahajan"
            description="Mahajan Construction"
          />

          <RevealOnScroll className="space-y-5 text-concrete">
            <p>
              Saish Mahajan founded Mahajan Construction in Ashta with a simple
              premise: a client shouldn&rsquo;t need to hire a separate
              architect, contractor, and interior designer — and then manage
              the gaps between them.
            </p>

            <p>
              Over the years, the studio has taken on residential bungalows,
              farmhouses, commercial plazas, and full home renovations across
              Ashta, Sangli, and Miraj — each run under the same principle: one
              accountable team, from the first sketch to the final key
              handover.
            </p>

            <p>
              Saish remains personally involved on every project the studio
              takes on, from the first site walk to the final snag-list
              closure.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <section className="border-y border-line bg-beige-soft py-16 dark:border-line-dark dark:bg-ink-soft">
        <div className="container-px mx-auto grid grid-cols-1 gap-10 sm:grid-cols-2">
          <AnimatedCounter
            to={40}
            suffix="+"
            label="Projects Delivered"
          />
          <AnimatedCounter
            to={18}
            label="Cities & Towns Served"
          />
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="container-px mx-auto">
          <SectionHeading
            eyebrow="Studio Values"
            title="What we won't compromise on."
          />

          <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3">
            {values.map((value, i) => (
              <RevealOnScroll
                key={value.title}
                delay={i * 0.1}
                className="border-t border-line pt-6 dark:border-line-dark"
              >
                <span className="font-mono text-xs text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <h3 className="mt-3 font-display text-2xl text-ink dark:text-canvas">
                  {value.title}
                </h3>

                <p className="mt-3 text-concrete">
                  {value.description}
                </p>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}