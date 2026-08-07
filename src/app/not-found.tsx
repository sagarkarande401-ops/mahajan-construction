import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink text-canvas">
      <div className="absolute inset-0 blueprint-grid opacity-20" />
      <div className="container-px relative mx-auto text-center">
        <span className="eyebrow">Error 404</span>
        <h1 className="mt-6 font-display text-display-1 font-normal">Off the drawing sheet.</h1>
        <p className="mx-auto mt-6 max-w-md text-lg text-canvas/70">
          This page doesn&rsquo;t exist — the plot may have been reworked, or the link may be outdated.
        </p>
        <Link
          href="/"
          className="group mt-10 inline-flex h-14 items-center gap-3 bg-canvas px-8 text-sm font-medium tracking-wide text-ink transition-all duration-500 ease-luxury hover:bg-gold"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-1" />
          Back to Home
        </Link>
      </div>
    </section>
  );
}

