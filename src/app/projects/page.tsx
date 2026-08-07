import type { Metadata } from "next";
import { getProjects } from "@/lib/data/projects";
import { ProjectsGrid } from "./ProjectsGrid";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Browse residential, commercial, interior, and renovation projects delivered by Mahajan Construction across Ashta, Sangli, and Maharashtra.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <section className="container-px mx-auto pb-24 pt-40 md:pb-32">
      <span className="eyebrow">Projects</span>
      <h1 className="mt-6 max-w-3xl text-balance text-display-1 font-display font-normal text-ink dark:text-canvas">
        Work, filed by drawing sheet.
      </h1>
      <p className="mt-6 max-w-xl text-lg text-concrete">
        Every project listed here was built to the drawing, on the timeline agreed at signing.
      </p>

      <div className="mt-16">
        <ProjectsGrid projects={projects} />
      </div>
    </section>
  );
}

