import type { Metadata } from "next";
import { getProjects } from "@/lib/data/projects";
import { CategoryProjectsPage } from "@/components/shared/CategoryProjectsPage";

export const metadata: Metadata = { title: "Villa Projects", description: "Villa and gated-community projects by Mahajan Construction." };

export default async function Page() {
  const all = await getProjects();
  const projects = all.filter((p) => p.projectType.toLowerCase().includes("villa"));
  return <CategoryProjectsPage eyebrow="Projects / Villa" title="Individually oriented, collectively planned." description="Villa communities designed plot-by-plot, not copy-pasted." projects={projects} />;
}
