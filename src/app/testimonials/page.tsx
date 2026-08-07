import type { Metadata } from "next";
import { Star } from "lucide-react";
import { getTestimonials } from "@/lib/data/content";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "What clients say about working with Mahajan Construction on residential and commercial projects across Maharashtra.",
};

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <section className="container-px mx-auto pb-24 pt-40 md:pb-32">
      <span className="eyebrow">Testimonials</span>
      <h1 className="mt-6 max-w-3xl text-balance text-display-1 font-display font-normal text-ink dark:text-canvas">
        Said after the keys changed hands.
      </h1>

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
        {testimonials.map((t, i) => (
          <RevealOnScroll key={t.id} delay={i * 0.08} className="border border-line p-8 dark:border-line-dark">
            <div className="flex gap-1">
              {Array.from({ length: t.rating }).map((_, idx) => (
                <Star key={idx} className="h-3.5 w-3.5 fill-gold text-gold" />
              ))}
            </div>
            <p className="mt-6 font-display text-xl leading-relaxed text-ink dark:text-canvas">&ldquo;{t.quote}&rdquo;</p>
            <div className="mt-8 border-t border-line pt-4 dark:border-line-dark">
              <p className="text-sm font-medium text-ink dark:text-canvas">{t.name}</p>
              <p className="coord-tag mt-1">{t.role} · {t.location}</p>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}

