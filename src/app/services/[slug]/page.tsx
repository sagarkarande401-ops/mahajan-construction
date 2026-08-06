import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Compass, HardHat, Sofa, Ruler, Key, Hammer, ClipboardCheck, Box, Building2, Home } from "lucide-react";
import { getServiceBySlug, getServices } from "@/lib/data/services";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { EnquiryForm } from "@/components/shared/EnquiryForm";
import { ServiceFaqAccordion } from "./ServiceFaqAccordion";
import { PLACEHOLDER_IMAGE } from "@/lib/utils";

const icons: Record<string, React.ElementType> = {
  compass: Compass, "hard-hat": HardHat, sofa: Sofa, ruler: Ruler, key: Key,
  hammer: Hammer, "clipboard-check": ClipboardCheck, box: Box, "building-2": Building2, home: Home,
};

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return { title: service.name, description: service.shortDescription };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const Icon = icons[service.icon] ?? Compass;
  const cover = service.coverImage || service.images[0]?.url || PLACEHOLDER_IMAGE;

  return (
    <>
      <section className="relative flex min-h-[70vh] items-end bg-ink text-canvas">
        <div className="absolute inset-0">
          <Image src={cover} alt={service.name} fill priority className="object-cover opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/20" />
        </div>
        <div className="container-px relative mx-auto w-full pb-20 pt-40">
          <Link href="/services" className="inline-flex items-center gap-2 text-sm text-canvas/70 hover:text-gold">
            <ArrowLeft className="h-4 w-4" /> All Services
          </Link>
          <Icon className="mt-8 h-8 w-8 text-gold" strokeWidth={1.5} />
          <h1 className="mt-4 max-w-3xl text-balance text-display-1 font-display font-normal">{service.name}</h1>
          <p className="mt-6 max-w-lg text-lg text-canvas/70">{service.shortDescription}</p>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="container-px mx-auto grid grid-cols-1 gap-16 lg:grid-cols-[1.2fr_1fr]">
          <RevealOnScroll>
            <span className="eyebrow">Overview</span>
            <p className="mt-6 text-lg leading-relaxed text-concrete">{service.description}</p>
          </RevealOnScroll>
          {service.features.length > 0 && (
            <RevealOnScroll delay={0.1}>
              <span className="eyebrow">Scope Includes</span>
              <ul className="mt-6 space-y-4">
                {service.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 border-b border-line pb-4 text-ink dark:border-line-dark dark:text-canvas">
                    <span className="mt-2 h-1 w-1 shrink-0 bg-gold" />
                    {f}
                  </li>
                ))}
              </ul>
            </RevealOnScroll>
          )}
        </div>
      </section>

      {service.images.length > 0 && (
        <section className="border-t border-line py-24 dark:border-line-dark md:py-32">
          <div className="container-px mx-auto">
            <span className="eyebrow">Gallery</span>
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
              {service.images.map((img) => (
                <div key={img.id} className="relative aspect-square overflow-hidden bg-concrete-light">
                  <Image src={img.url} alt={service.name} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {service.processSteps.length > 0 && (
        <section className="border-t border-line bg-beige-soft py-24 dark:border-line-dark dark:bg-ink-soft md:py-32">
          <div className="container-px mx-auto">
            <span className="eyebrow">Our Process</span>
            <h2 className="mt-4 text-display-3 font-display text-ink dark:text-canvas">How we deliver this.</h2>
            <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden bg-line dark:bg-line-dark md:grid-cols-3">
              {service.processSteps.map((step, i) => (
                <RevealOnScroll key={step.id} delay={i * 0.08} className="bg-canvas p-8 dark:bg-canvas-dark">
                  <span className="font-mono text-sm text-gold">{String(step.order).padStart(2, "0")}</span>
                  <h3 className="mt-4 font-display text-xl text-ink dark:text-canvas">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-concrete">{step.description}</p>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {service.faqs.length > 0 && (
        <section className="py-24 md:py-32">
          <div className="container-px mx-auto max-w-2xl">
            <span className="eyebrow">Frequently Asked</span>
            <h2 className="mt-4 text-display-3 font-display text-ink dark:text-canvas">Questions about {service.name.toLowerCase()}.</h2>
            <div className="mt-10">
              <ServiceFaqAccordion faqs={service.faqs} />
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-line bg-ink py-24 text-canvas dark:border-line-dark md:py-32">
        <div className="container-px mx-auto max-w-2xl">
          <span className="eyebrow">Enquire</span>
          <h2 className="mt-4 text-display-3 font-display">Ready to talk about {service.name.toLowerCase()}?</h2>
          <p className="mt-4 text-canvas/70">Tell us about your project and we&rsquo;ll respond within 24 hours.</p>
          <div className="dark mt-10">
            <EnquiryForm source="SERVICE_PAGE" serviceSlug={service.slug} defaultMessage={`I'd like to enquire about ${service.name}.`} />
          </div>
        </div>
      </section>
    </>
  );
}
