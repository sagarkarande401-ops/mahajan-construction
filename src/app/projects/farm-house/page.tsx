import type { Metadata } from "next";
import { getProjects } from "@/lib/data/projects";
import { CategoryProjectsPage } from "@/components/shared/CategoryProjectsPage";

export const metadata: Metadata = { title: "Farm House Projects", description: "Weekend farmhouses designed by Mahajan Construction across Maharashtra." };

export default async function Page() {
  const all = await getProjects();
  const projects = all.filter((p) => p.projectType.toLowerCase().includes("farmhouse") || p.projectType.toLowerCase().includes("farm house"));
  return <CategoryProjectsPage eyebrow="Projects / Farm House" title="Retreats that sit into the land." description="Low-key, landscape-first weekend homes." projects={projects} />;
}
