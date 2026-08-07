"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import { siteConfig, formatCoordinates } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-end overflow-hidden bg-ink text-canvas">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2400&auto=format&fit=crop"
          alt="Contemporary residential architecture by Mahajan Construction"
          fill
          priority
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/30" />
        <div className="absolute inset-0 blueprint-grid opacity-30" />
      </div>

      {/* Blueprint coordinate annotations — signature architectural-drawing motif */}
      <div className="absolute left-6 top-24 hidden flex-col gap-1 md:flex">
        <span className="coord-tag !text-canvas/50">SITE — ASHTA, MAHARASHTRA</span>
        <span className="coord-tag !text-canvas/50">{formatCoordinates(siteConfig.coordinates.lat, siteConfig.coordinates.lng)}</span>
      </div>

      {/* Drawn corner brackets — architectural drawing-sheet framing */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="pointer-events-none absolute inset-6 hidden md:block"
      >
        <span className="absolute left-0 top-0 h-9 w-9 border-l border-t border-gold/60" />
        <span className="absolute bottom-0 left-0 h-9 w-9 border-b border-l border-gold/60" />
        <span className="absolute right-0 top-0 h-9 w-9 border-r border-t border-gold/60" />
        <span className="absolute bottom-0 right-0 h-9 w-9 border-b border-r border-gold/60" />
      </motion.div>

      <div className="container-px relative z-10 mx-auto w-full pb-20 pt-40">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="eyebrow mb-6"
        >
          Architecture · Construction · Interiors in Maharashtra
        </motion.p>

        <h1 className="max-w-4xl text-display-1 font-display font-normal text-balance">
          {["Architecture,", "built with intent."].map((line, i) => (
            <motion.span
              key={line}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              {i === 1 ? <em className="font-normal italic text-gold-light">{line}</em> : line}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 max-w-lg text-lg text-canvas/70"
        >
          We design and build premium residential and commercial spaces across Ashta and Maharashtra — from first sketch to final handover, under one accountable team.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-wrap items-center gap-4"
        >
          <Link
            href="/contact"
            className="group flex h-14 items-center gap-3 bg-canvas px-8 text-sm font-medium tracking-wide text-ink transition-all duration-500 ease-luxury hover:bg-gold"
          >
            Book Consultation
            <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/projects"
            className="flex h-14 items-center gap-3 border border-canvas/40 px-8 text-sm font-medium tracking-wide text-canvas transition-all duration-500 ease-luxury hover:border-canvas hover:bg-canvas/10"
          >
            Explore Projects
          </Link>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 right-6 z-10 hidden items-center gap-2 text-canvas/50 md:flex"
      >
        <span className="coord-tag !text-canvas/50">Scroll</span>
        <ArrowDown className="h-3.5 w-3.5" />
      </motion.div>
    </section>
  );
}

