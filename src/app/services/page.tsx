import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Compass,
  HardHat,
  Sofa,
  Ruler,
  Key,
  Hammer,
  ClipboardCheck,
  Box,
  Building2,
  Home,
} from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { getServices } from "@/lib/data/services";
import { siteConfig } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Architecture, construction, interior design, planning, turnkey projects, and renovation services from Mahajan Construction.",
};

const icons: Record<string, React.ElementType> = {
  compass: Compass,
  "hard-hat": HardHat,
  sofa: Sofa,
  ruler: Ruler,
  key: Key,
  hammer: Hammer,
  "clipboard-check": ClipboardCheck,
  box: Box,
  "building-2": Building2,
  home: Home,
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <section className="container-px mx-auto pb-16 pt-8 md:pb-24 md:pt-12">
        <span className="eyebrow">Services</span>

        <h1 className="mt-6 max-w-3xl text-balance text-display-1 font-display font-normal text-ink dark:text-canvas">
          Every discipline, delivered as one scope.
        </h1>

        <p className="mt-6 max-w-xl text-lg text-concrete">
          Each service below can stand alone or combine into a full turnkey
          delivery. Click through for process, FAQs, and to enquire directly.
        </p>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="container-px mx-auto">
          {services.length === 0 && (
            <p className="text-concrete">
              No services published yet — add some from the admin panel.
            </p>
          )}

          {services.map((service, i) => {
            const Icon = icons[service.icon] ?? Compass;

            return (
              <RevealOnScroll key={service.slug} delay={i * 0.04}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group grid grid-cols-1 items-center gap-6 border-t border-line py-10 dark:border-line-dark lg:grid-cols-[80px_1fr_auto]"
                >
                  <span className="font-mono text-sm text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <Icon
                      className="h-6 w-6 text-gold"
                      strokeWidth={1.5}
                    />

                    <h2 className="mt-4 font-display text-2xl text-ink transition-colors group-hover:text-gold dark:text-canvas">
                      {service.name}
                    </h2>

                    <p className="mt-3 max-w-md text-concrete">
                      {service.shortDescription}
                    </p>
                  </div>

                  <ArrowRight className="h-5 w-5 text-ink transition-transform duration-500 ease-luxury group-hover:translate-x-2 group-hover:text-gold dark:text-canvas" />
                </Link>
              </RevealOnScroll>
            );
          })}
        </div>
      </section>

      <section className="border-t border-line bg-beige-soft py-24 dark:border-line-dark dark:bg-ink-soft md:py-32">
        <div className="container-px mx-auto">
          <SectionHeading
            eyebrow="Start a Project"
            title="Not sure which service fits your project?"
            description={`Call or WhatsApp us at ${siteConfig.phoneDisplay} — we'll help you scope it in one conversation.`}
          />
        </div>
      </section>
    </>
  );
}