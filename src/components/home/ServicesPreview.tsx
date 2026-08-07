import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { getServices } from "@/lib/data/services";

export async function ServicesPreview() {
  const allServices = await getServices();
  const services = allServices.slice(0, 6);

  return (
    <section className="bg-beige-soft py-24 dark:bg-ink-soft md:py-32">
      <div className="container-px mx-auto">
        <SectionHeading
          eyebrow="What We Do"
          title="Ten disciplines, one coordinated scope."
          description="From the first structural sketch to the last light fixture, every service is designed to hand off seamlessly into the next."
          index="03 / 08"
        />

        <div className="mt-14">
          {services.map((service, i) => (
            <ServiceCard key={service.slug} service={service} index={i} />
          ))}
        </div>

        <Link
          href="/services"
          className="group mt-10 inline-flex items-center gap-2 border-b border-ink pb-1 text-sm tracking-wide text-ink transition-colors hover:border-gold hover:text-gold dark:border-canvas dark:text-canvas"
        >
          View all services
          <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}

