import type { Metadata } from "next";
import { getFaqs } from "@/lib/data/content";
import { FaqAccordion } from "./FaqAccordion";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about pricing, timelines, approvals, and process at Mahajan Construction.",
};

export default async function FaqPage() {
  const faqs = await getFaqs();

  return (
    <section className="container-px mx-auto pb-24 pt-40 md:pb-32">
      <span className="eyebrow">FAQ</span>
      <h1 className="mt-6 max-w-3xl text-balance text-display-1 font-display font-normal text-ink dark:text-canvas">
        Questions, answered plainly.
      </h1>
      <p className="mt-6 max-w-xl text-lg text-concrete">
        Don&apos;t see your question here? Reach out directly — we respond to every enquiry personally.
      </p>

      <div className="mt-16 max-w-3xl">
        <FaqAccordion faqs={faqs} />
      </div>
    </section>
  );
}

