import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { getFeaturedProjects } from "@/lib/data/projects";

export async function FeaturedProjects() {
  const projects = await getFeaturedProjects();
  const featured = projects.slice(0, 3);

  return (
    <section className="py-24 md:py-32">
      <div className="container-px mx-auto">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Selected Work"
            title="Projects that hold up on site, not just on paper."
            index="01 / 08"
          />
          <Link
            href="/projects"
            className="group flex shrink-0 items-center gap-2 border-b border-ink pb-1 text-sm tracking-wide text-ink transition-colors hover:border-gold hover:text-gold dark:border-canvas dark:text-canvas"
          >
            View all projects
            <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-3">
          {featured.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
