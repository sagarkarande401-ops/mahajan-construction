"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveTestimonial, deleteTestimonial } from "@/app/actions/admin-content";
import { Label, Input, Textarea } from "@/components/ui/form-fields";
import { Testimonial } from "@/types";

export function TestimonialsAdminClient({ testimonials }: { testimonials: Testimonial[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (formData: FormData) => {
    setError("");
    startTransition(async () => {
      const result = await saveTestimonial(formData);
      if (!result?.success) { setError(result?.error || "Failed to save."); return; }
      setShowForm(false);
      router.refresh();
    });
  };

  return (
    <div>
      <button onClick={() => setShowForm((s) => !s)} className="bg-ink px-5 py-2.5 text-sm text-canvas dark:bg-canvas dark:text-ink">
        {showForm ? "Cancel" : "+ Add Testimonial"}
      </button>

      {showForm && (
        <form action={handleSubmit} className="mt-6 max-w-xl space-y-5 border border-line p-6 dark:border-line-dark">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="grid grid-cols-2 gap-4">
            <div><Label htmlFor="name">Name</Label><Input id="name" name="name" required /></div>
            <div><Label htmlFor="role">Role</Label><Input id="role" name="role" required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label htmlFor="location">Location</Label><Input id="location" name="location" required /></div>
            <div><Label htmlFor="rating">Rating (1-5)</Label><Input id="rating" name="rating" type="number" min={1} max={5} defaultValue={5} /></div>
          </div>
          <div><Label htmlFor="quote">Quote</Label><Textarea id="quote" name="quote" rows={3} required /></div>
          <label className="flex items-center gap-2 text-sm text-ink dark:text-canvas">
            <input type="checkbox" name="published" defaultChecked /> Published
          </label>
          <button type="submit" disabled={isPending} className="bg-ink px-5 py-2.5 text-sm text-canvas disabled:opacity-60 dark:bg-canvas dark:text-ink">
            {isPending ? "Saving..." : "Save"}
          </button>
        </form>
      )}

      <div className="mt-8 divide-y divide-line dark:divide-line-dark">
        {testimonials.map((t) => (
          <div key={t.id} className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium text-ink dark:text-canvas">{t.name} — {t.role}</p>
              <p className="max-w-lg text-sm text-concrete">{t.quote}</p>
            </div>
            <button
              onClick={() => { if (confirm(`Delete testimonial from ${t.name}?`)) startTransition(async () => { await deleteTestimonial(t.id); router.refresh(); }); }}
              className="shrink-0 text-sm text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
        {testimonials.length === 0 && <p className="py-10 text-concrete">No testimonials yet.</p>}
      </div>
    </div>
  );
}

