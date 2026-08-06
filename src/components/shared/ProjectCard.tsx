"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ProjectWithRelations } from "@/types";
import { formatEnumLabel, PLACEHOLDER_IMAGE } from "@/lib/utils";

export function ProjectCard({ project, index = 0 }: { project: ProjectWithRelations; index?: number }) {
  const cover = project.coverImage || project.images[0]?.url || PLACEHOLDER_IMAGE;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/projects/${project.slug}`} className="group block">
        <div className="relative aspect-[4/5] overflow-hidden bg-concrete-light">
          <Image
            src={cover}
            alt={project.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-[1400ms] ease-luxury group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="absolute left-4 top-4 flex items-center gap-2 bg-canvas/90 px-3 py-1.5 backdrop-blur-sm">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink">{formatEnumLabel(project.category)}</span>
          </div>
          <div className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-2 items-center justify-center border border-canvas/40 bg-canvas/10 opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4 text-canvas" />
          </div>
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-xl text-ink transition-colors group-hover:text-gold dark:text-canvas">
              {project.name}
            </h3>
            <p className="coord-tag mt-1">{project.location} · {project.year}</p>
          </div>
          <span className="font-mono text-xs text-concrete whitespace-nowrap">{project.area}</span>
        </div>
      </Link>
    </motion.div>
  );
}
