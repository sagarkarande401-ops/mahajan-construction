import { prisma } from "@/lib/prisma";
import { TestimonialsAdminClient } from "./TestimonialsAdminClient";

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
  return (
    <div className="p-6 md:p-10">
      <span className="eyebrow">Manage</span>
      <h1 className="mt-2 font-display text-3xl text-ink dark:text-canvas">Testimonials</h1>
      <div className="mt-8"><TestimonialsAdminClient testimonials={testimonials} /></div>
    </div>
  );
}
