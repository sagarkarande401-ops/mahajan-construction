import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PLACEHOLDER_IMAGE, formatEnumLabel } from "@/lib/utils";
import { DeleteProjectButton } from "./DeleteProjectButton";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" }, include: { images: true } });

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between">
        <div>
          <span className="eyebrow">Manage</span>
          <h1 className="mt-2 font-display text-3xl text-ink dark:text-canvas">Projects</h1>
        </div>
        <Link href="/admin/projects/new" className="flex items-center gap-2 bg-ink px-5 py-3 text-sm text-canvas dark:bg-canvas dark:text-ink">
          <Plus className="h-4 w-4" /> Add Project
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <div key={p.id} className="border border-line dark:border-line-dark">
            <div className="relative aspect-video bg-concrete-light">
              <Image src={p.coverImage || p.images[0]?.url || PLACEHOLDER_IMAGE} alt={p.name} fill className="object-cover" />
              {!p.published && <span className="absolute left-2 top-2 bg-red-600 px-2 py-1 text-[10px] uppercase text-white">Draft</span>}
            </div>
            <div className="p-4">
              <p className="coord-tag">{formatEnumLabel(p.category)}</p>
              <h3 className="mt-1 font-display text-lg text-ink dark:text-canvas">{p.name}</h3>
              <p className="mt-1 text-xs text-concrete">{p.location}</p>
              <div className="mt-4 flex items-center gap-4 text-sm">
                <Link href={`/admin/projects/${p.id}`} className="text-gold hover:underline">Edit</Link>
                <DeleteProjectButton id={p.id} name={p.name} />
              </div>
            </div>
          </div>
        ))}
      </div>
      {projects.length === 0 && <p className="mt-10 text-concrete">No projects yet — add your first one.</p>}
    </div>
  );
}
