"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function DeleteButton({ id, name, action }: { id: string; name: string; action: (id: string) => Promise<void> }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  if (done) return null;

  return (
    <button
      onClick={() => {
        if (!confirm(`Delete "${name}" permanently?`)) return;
        startTransition(async () => {
          await action(id);
          setDone(true);
          router.refresh();
        });
      }}
      disabled={isPending}
      className="text-red-600 hover:underline disabled:opacity-50"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
