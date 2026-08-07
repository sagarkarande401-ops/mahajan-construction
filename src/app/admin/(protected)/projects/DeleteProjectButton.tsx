"use client";

import { useState, useTransition } from "react";
import { deleteProject } from "@/app/actions/admin-projects";

export function DeleteProjectButton({ id, name }: { id: string; name: string }) {
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  if (done) return null;

  return (
    <button
      onClick={() => {
        if (!confirm(`Delete "${name}" permanently? This removes all its images too.`)) return;
        startTransition(async () => {
          await deleteProject(id);
          setDone(true);
        });
      }}
      disabled={isPending}
      className="text-red-600 hover:underline disabled:opacity-50"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}

