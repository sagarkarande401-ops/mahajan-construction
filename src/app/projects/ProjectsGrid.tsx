"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { ProjectWithRelations } from "@/types";
import { cn } from "@/lib/utils";

const categories = [
  { label: "All", value: "All" },
  { label: "Residential", value: "RESIDENTIAL" },
  { label: "Commercial", value: "COMMERCIAL" },
  { label: "Interior", value: "INTERIOR" },
  { label: "Renovation", value: "RENOVATION" },
] as const;

export function ProjectsGrid({ projects }: { projects: ProjectWithRelations[] }) {
  const [active, setActive] = useState<(typeof categories)[number]["value"]>("All");
  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActive(cat.value)}
            className={cn(
              "relative px-5 py-2.5 text-sm tracking-wide transition-colors duration-300",
              active === cat.value ? "text-canvas" : "text-ink hover:text-gold dark:text-canvas"
            )}
          >
            {active === cat.value && (
              <motion.span layoutId="active-filter" className="absolute inset-0 bg-ink dark:bg-canvas dark:text-ink" transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} />
            )}
            <span className={cn("relative z-10", active === cat.value && "dark:text-ink")}>{cat.label}</span>
          </button>
        ))}
      </div>

      <motion.div layout className="mt-14 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-3">
        {filtered.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <p className="mt-14 text-concrete">No projects in this category yet — check back soon.</p>
      )}
    </div>
  );
}
