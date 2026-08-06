import type { Metadata } from "next";
import { getProjectsByCategory } from "@/lib/data/projects";
import { CategoryProjectsPage } from "@/components/shared/CategoryProjectsPage";

export const metadata: Metadata = { title: "Interior Projects", description: "Interior design and fit-out projects by Mahajan Construction." };

export default async function Page() {
  const projects = await getProjectsByCategory("INTERIOR");
  return <CategoryProjectsPage eyebrow="Projects / Interior" title="Interiors that finish the architecture." description="Space planning, joinery, and finishes for homes and offices." projects={projects} />;
}
