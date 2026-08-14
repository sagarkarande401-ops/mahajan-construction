import { ProjectCard } from "@/components/shared/ProjectCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ProjectWithRelations } from "@/types";

export function CategoryProjectsPage({
  eyebrow,
  title,
  description,
  projects,
}: {
  eyebrow: string;
  title: string;
  description: string;
  projects: ProjectWithRelations[];
}) {
  return (
    <section className="container-px mx-auto pb-24 pt-14 md:pb-32 md:pt-18">
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
      />

      {projects.length > 0 ? (
        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-3">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-concrete">
          No projects published in this category yet — check back soon, or ask
          us directly.
        </p>
      )}
    </section>
  );
}