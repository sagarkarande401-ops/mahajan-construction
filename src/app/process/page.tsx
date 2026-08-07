import type { Metadata } from "next";
import { getProcessSteps } from "@/lib/data/process";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

export const metadata: Metadata = {
  title: "Process",
  description: "The six-stage process Mahajan Construction follows on every project, from first consultation to handover.",
};

export default function ProcessPage() {
  const steps = getProcessSteps();

  return (
    <>
      <section className="container-px mx-auto pb-16 pt-40 md:pb-24">
        <span className="eyebrow">Our Process</span>
        <h1 className="mt-6 max-w-3xl text-balance text-display-1 font-display font-normal text-ink dark:text-canvas">
          Six stages. No skipped steps.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-concrete">
          The same sequence runs on a two-room renovation and an eighteen-thousand-square-foot plaza — only the scale changes.
        </p>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="container-px mx-auto">
          {steps.map((step, i) => (
            <RevealOnScroll key={step.number} delay={i * 0.06}>
              <div className="grid grid-cols-1 gap-6 border-t border-line py-12 dark:border-line-dark md:grid-cols-[120px_1fr_1.4fr] md:items-start">
                <span className="font-display text-5xl text-gold/80">{step.number}</span>
                <h2 className="font-display text-2xl text-ink dark:text-canvas md:text-3xl">{step.title}</h2>
                <p className="max-w-lg text-lg leading-relaxed text-concrete">{step.description}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>
    </>
  );
}

