import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { siteConfig } from "@/lib/utils";

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-28 md:py-36">
      <div className="absolute inset-0 blueprint-grid opacity-40" />
      <div className="container-px relative mx-auto text-center">
        <RevealOnScroll>
          <span className="eyebrow">Start a Project</span>
          <h2 className="mx-auto mt-6 max-w-3xl text-balance text-display-2 font-display font-normal text-ink dark:text-canvas">
            Have a plot, a brief, or just an idea?
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-lg text-concrete">
            The first consultation is free. Bring your plot, your budget range, and your questions — we&apos;ll give you an honest read before anything is signed.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="group flex h-14 items-center gap-3 bg-ink px-8 text-sm font-medium tracking-wide text-canvas transition-all duration-500 ease-luxury hover:bg-gold hover:text-ink dark:bg-canvas dark:text-ink"
            >
              Book Free Consultation
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
            <a
              href={`tel:${siteConfig.phone}`}
              className="flex h-14 items-center gap-3 border border-ink/30 px-8 text-sm font-medium tracking-wide text-ink transition-all duration-500 ease-luxury hover:border-ink dark:border-canvas/30 dark:text-canvas"
            >
              <Phone className="h-4 w-4" />
              {siteConfig.phoneDisplay}
            </a>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
