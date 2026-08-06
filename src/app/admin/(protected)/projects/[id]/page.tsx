import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "../ProjectForm";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: { images: true, videos: true, timelineSteps: true, beforeAfterPairs: true },
  });
  if (!project) notFound();

  return (
    <div className="p-6 md:p-10">
      <span className="eyebrow">Edit</span>
      <h1 className="mt-2 font-display text-3xl text-ink dark:text-canvas">{project.name}</h1>
      <div className="mt-8 max-w-3xl">
        <ProjectForm project={project} />
      </div>
    </div>
  );
}
