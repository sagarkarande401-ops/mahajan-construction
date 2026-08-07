import type { Metadata } from "next";
import { getProjectsByCategory } from "@/lib/data/projects";
import { CategoryProjectsPage } from "@/components/shared/CategoryProjectsPage";

export const metadata: Metadata = { title: "Residential Projects", description: "Custom bungalows, villas, and farmhouses designed and built by Mahajan Construction across Maharashtra." };

export default async function Page() {
  const projects = await getProjectsByCategory("RESIDENTIAL");
  return <CategoryProjectsPage eyebrow="Projects / Residential" title="Homes, built to be lived in." description="Bungalows, farmhouses, and villa communities across Ashta and Sangli." projects={projects} />;
}

