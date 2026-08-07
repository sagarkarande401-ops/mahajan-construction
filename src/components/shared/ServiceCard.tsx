"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Compass, HardHat, Sofa, Ruler, Key, Hammer, ClipboardCheck, Box, Building2, Home } from "lucide-react";
import { Service } from "@/types";

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

export function ServiceCard({ service, index = 0 }: { service: Service; index?: number }) {
  const Icon = icons[service.icon] ?? Compass;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group border-t border-line py-8 dark:border-line-dark"
    >
      <Link href={`/services/${service.slug}`} className="flex items-start justify-between gap-6">
        <div className="flex gap-6">
          <span className="font-mono text-xs text-concrete pt-1">{String(index + 1).padStart(2, "0")}</span>
          <div>
            <div className="mb-3 flex items-center gap-3">
              <Icon className="h-5 w-5 text-gold" strokeWidth={1.5} />
              <h3 className="font-display text-2xl text-ink dark:text-canvas">{service.name}</h3>
            </div>
            <p className="max-w-md text-concrete">{service.shortDescription}</p>
          </div>
        </div>
        <ArrowRight className="mt-2 h-5 w-5 shrink-0 text-ink transition-transform duration-500 ease-luxury group-hover:translate-x-2 group-hover:text-gold dark:text-canvas" />
      </Link>
    </motion.div>
  );
}

