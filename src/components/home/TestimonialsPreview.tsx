import { Star } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { getTestimonials } from "@/lib/data/content";

export async function TestimonialsPreview() {
  const all = await getTestimonials();
  const testimonials = all.slice(0, 3);

  return (
    <section className="bg-ink py-24 text-canvas md:py-32">
      <div className="container-px mx-auto">
        <SectionHeading eyebrow="Client Word" title="What clients say after we've handed over the keys." index="05 / 08" />

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <RevealOnScroll key={t.id} delay={i * 0.1} className="border border-canvas/15 p-8">
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star key={idx} className="h-3.5 w-3.5 fill-gold text-gold" />
                ))}
              </div>
              <p className="mt-6 font-display text-lg leading-relaxed text-canvas/90">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-8 border-t border-canvas/10 pt-4">
                <p className="text-sm font-medium">{t.name}</p>
                <p className="coord-tag mt-1 !text-canvas/40">{t.role} · {t.location}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

