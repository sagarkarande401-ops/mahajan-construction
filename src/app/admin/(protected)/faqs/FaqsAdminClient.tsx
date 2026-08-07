"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveFaq, deleteFaq } from "@/app/actions/admin-content";
import { Label, Input, Textarea } from "@/components/ui/form-fields";
import { Faq } from "@/types";

export function FaqsAdminClient({ faqs }: { faqs: Faq[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (formData: FormData) => {
    setError("");
    startTransition(async () => {
      const result = await saveFaq(formData);
      if (!result?.success) { setError(result?.error || "Failed to save."); return; }
      setShowForm(false);
      router.refresh();
    });
  };

  return (
    <div>
      <button onClick={() => setShowForm((s) => !s)} className="bg-ink px-5 py-2.5 text-sm text-canvas dark:bg-canvas dark:text-ink">
        {showForm ? "Cancel" : "+ Add FAQ"}
      </button>

      {showForm && (
        <form action={handleSubmit} className="mt-6 max-w-xl space-y-5 border border-line p-6 dark:border-line-dark">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div><Label htmlFor="category">Category</Label><Input id="category" name="category" placeholder="General / Process / Pricing / Quality" required /></div>
          <div><Label htmlFor="question">Question</Label><Input id="question" name="question" required /></div>
          <div><Label htmlFor="answer">Answer</Label><Textarea id="answer" name="answer" rows={3} required /></div>
          <label className="flex items-center gap-2 text-sm text-ink dark:text-canvas">
            <input type="checkbox" name="published" defaultChecked /> Published
          </label>
          <button type="submit" disabled={isPending} className="bg-ink px-5 py-2.5 text-sm text-canvas disabled:opacity-60 dark:bg-canvas dark:text-ink">
            {isPending ? "Saving..." : "Save"}
          </button>
        </form>
      )}

      <div className="mt-8 divide-y divide-line dark:divide-line-dark">
        {faqs.map((f) => (
          <div key={f.id} className="flex items-center justify-between py-4">
            <div>
              <p className="coord-tag">{f.category}</p>
              <p className="mt-1 font-medium text-ink dark:text-canvas">{f.question}</p>
            </div>
            <button
              onClick={() => { if (confirm("Delete this FAQ?")) startTransition(async () => { await deleteFaq(f.id); router.refresh(); }); }}
              className="shrink-0 text-sm text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
        {faqs.length === 0 && <p className="py-10 text-concrete">No FAQs yet.</p>}
      </div>
    </div>
  );
}

