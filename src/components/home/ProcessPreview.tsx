import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { getProcessSteps } from "@/lib/data/process";

export function ProcessPreview() {
  const steps = getProcessSteps();

  return (
    <section className="py-24 md:py-32">
      <div className="container-px mx-auto">
        <SectionHeading eyebrow="How We Work" title="A six-stage sequence, followed on every project." index="04 / 08" />

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden bg-line dark:bg-line-dark md:grid-cols-3">
          {steps.map((step, i) => (
            <RevealOnScroll key={step.number} delay={i * 0.08} className="bg-canvas p-8 dark:bg-canvas-dark">
              <span className="font-mono text-sm text-gold">{step.number}</span>
              <h3 className="mt-4 font-display text-xl text-ink dark:text-canvas">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-concrete">{step.description}</p>
            </RevealOnScroll>
          ))}
        </div>

        <Link
          href="/process"
          className="group mt-10 inline-flex items-center gap-2 border-b border-ink pb-1 text-sm tracking-wide text-ink transition-colors hover:border-gold hover:text-gold dark:border-canvas dark:text-canvas"
        >
          See the full process
          <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}

