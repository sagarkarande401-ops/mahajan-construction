"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X } from "lucide-react";
import { saveProject } from "@/app/actions/admin-projects";
import { deleteProjectImage, addProjectVideo, deleteProjectVideo } from "@/app/actions/admin-projects";
import { Label, Input, Textarea } from "@/components/ui/form-fields";
import { ProjectWithRelations } from "@/types";

const categories = ["RESIDENTIAL", "COMMERCIAL", "INTERIOR", "RENOVATION"];
const statuses = ["COMPLETED", "ONGOING"];

export function ProjectForm({ project }: { project?: ProjectWithRelations }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");

  const handleSubmit = (formData: FormData) => {
    setError("");
    startTransition(async () => {
      const result = await saveProject(formData, project?.id);
      if (!result.success) { setError(result.error || "Failed to save."); return; }
      router.push("/admin/projects");
      router.refresh();
    });
  };

  return (
    <form action={handleSubmit} className="space-y-10">
      {error && <div className="border border-red-300 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Project Name</Label>
          <Input id="name" name="name" defaultValue={project?.name} required />
        </div>
        <div>
          <Label htmlFor="slug">URL Slug (e.g. ashta-residence)</Label>
          <Input id="slug" name="slug" defaultValue={project?.slug} placeholder="lowercase-with-hyphens" required />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <select id="category" name="category" defaultValue={project?.category || "RESIDENTIAL"} className="w-full border-0 border-b border-line bg-transparent py-3 dark:border-line-dark dark:[&>option]:bg-canvas-dark">
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <select id="status" name="status" defaultValue={project?.status || "COMPLETED"} className="w-full border-0 border-b border-line bg-transparent py-3 dark:border-line-dark dark:[&>option]:bg-canvas-dark">
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor="year">Year</Label>
          <Input id="year" name="year" defaultValue={project?.year} placeholder="2026" required />
        </div>
        <div>
          <Label htmlFor="projectType">Project Type</Label>
          <Input id="projectType" name="projectType" defaultValue={project?.projectType} placeholder="Private Bungalow" required />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" defaultValue={project?.location} required />
        </div>
        <div>
          <Label htmlFor="area">Area</Label>
          <Input id="area" name="area" defaultValue={project?.area} placeholder="4,200 sq.ft" required />
        </div>
        <div>
          <Label htmlFor="timeline">Timeline</Label>
          <Input id="timeline" name="timeline" defaultValue={project?.timeline} placeholder="11 months" required />
        </div>
        <div>
          <Label htmlFor="client">Client (optional)</Label>
          <Input id="client" name="client" defaultValue={project?.client || ""} placeholder="Or leave blank" />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={5} defaultValue={project?.description} required />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="challenges">Challenges</Label>
          <Textarea id="challenges" name="challenges" rows={4} defaultValue={project?.challenges || ""} />
        </div>
        <div>
          <Label htmlFor="solutions">Solutions</Label>
          <Textarea id="solutions" name="solutions" rows={4} defaultValue={project?.solutions || ""} />
        </div>
      </div>

      <div>
        <Label htmlFor="materialsUsed">Materials Used (comma-separated)</Label>
        <Input id="materialsUsed" name="materialsUsed" defaultValue={project?.materialsUsed.join(", ")} placeholder="Exposed Concrete, Kadappa Stone, Teak" />
      </div>

      <div>
        <Label htmlFor="highlights">Highlights (one per line)</Label>
        <Textarea id="highlights" name="highlights" rows={4} defaultValue={project?.highlights.join("\n")} placeholder={"Central courtyard\nPassive cross-ventilation"} />
      </div>

      <div className="flex items-center gap-8">
        <label className="flex items-center gap-2 text-sm text-ink dark:text-canvas">
          <input type="checkbox" name="featured" defaultChecked={project?.featured} /> Featured on homepage
        </label>
        <label className="flex items-center gap-2 text-sm text-ink dark:text-canvas">
          <input type="checkbox" name="published" defaultChecked={project?.published ?? true} /> Published (visible on site)
        </label>
      </div>

      <div>
        <Label htmlFor="images">Upload Images (select multiple)</Label>
        <input id="images" name="images" type="file" accept="image/*" multiple className="block w-full text-sm text-concrete file:mr-4 file:border file:border-line file:bg-transparent file:px-4 file:py-2 file:text-ink dark:file:border-line-dark dark:file:text-canvas" />
        {project && project.images.length > 0 && (
          <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6">
            {project.images.map((img) => (
              <div key={img.id} className="group relative aspect-square overflow-hidden bg-concrete-light">
                <Image src={img.url} alt="" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => startTransition(async () => { await deleteProjectImage(img.id); router.refresh(); })}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center bg-ink/80 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <p className="mt-2 text-xs text-concrete">Uploads require Vercel Blob storage to be configured — see README.</p>
      </div>

      {project && (
        <div>
          <Label>Videos (YouTube/Vimeo embed URL)</Label>
          <div className="flex gap-3">
            <Input value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} placeholder="https://www.youtube.com/embed/..." />
            <button
              type="button"
              onClick={() => { if (newVideoUrl) { startTransition(async () => { await addProjectVideo(project.id, newVideoUrl); setNewVideoUrl(""); router.refresh(); }); } }}
              className="shrink-0 border border-line px-4 text-sm dark:border-line-dark"
            >
              Add
            </button>
          </div>
          {project.videos.length > 0 && (
            <ul className="mt-3 space-y-2">
              {project.videos.map((v) => (
                <li key={v.id} className="flex items-center justify-between border-b border-line py-2 text-sm dark:border-line-dark">
                  <span className="truncate text-concrete">{v.url}</span>
                  <button type="button" onClick={() => startTransition(async () => { await deleteProjectVideo(v.id); router.refresh(); })} className="text-red-600">Remove</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <button type="submit" disabled={isPending} className="flex h-12 items-center bg-ink px-8 text-sm text-canvas disabled:opacity-60 dark:bg-canvas dark:text-ink">
        {isPending ? "Saving..." : project ? "Save Changes" : "Create Project"}
      </button>
    </form>
  );
}
