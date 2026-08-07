import type { Metadata } from "next";
import { getProjectsByCategory } from "@/lib/data/projects";
import { CategoryProjectsPage } from "@/components/shared/CategoryProjectsPage";

export const metadata: Metadata = { title: "Commercial Projects", description: "Offices, retail, and mixed-use commercial projects delivered by Mahajan Construction in Maharashtra." };

export default async function Page() {
  const projects = await getProjectsByCategory("COMMERCIAL");
  return <CategoryProjectsPage eyebrow="Projects / Commercial" title="Built for daily performance." description="Retail, office, and mixed-use spaces judged by footfall and function, not just looks." projects={projects} />;
}

