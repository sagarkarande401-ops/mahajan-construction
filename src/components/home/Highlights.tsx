import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { getSiteStats } from "@/lib/data/content";

// NOTE: "On-Time Handover Rate" was intentionally removed per request.
// Only these three stats are shown, anywhere on the site: Experience,
// Projects Delivered, Cities & Towns Served. Do not re-add a 4th stat here.
export async function Highlights() {
  const stats = await getSiteStats();
  const items = [stats.experience, stats.projectsDelivered, stats.citiesServed];

  return (
    <section className="border-y border-line bg-beige-soft dark:border-line-dark dark:bg-ink-soft">
      <div className="container-px mx-auto grid grid-cols-1 gap-10 py-16 sm:grid-cols-3 md:py-20">
        {items.map((stat, i) => (
          <RevealOnScroll key={stat.label} delay={i * 0.1}>
            <AnimatedCounter to={stat.value} suffix={stat.suffix} label={stat.label} />
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
