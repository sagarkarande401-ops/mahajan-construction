"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveService, addProcessStep, deleteProcessStep, addServiceFaq, deleteServiceFaq } from "@/app/actions/admin-services";
import { Label, Input, Textarea } from "@/components/ui/form-fields";
import { ServiceWithRelations } from "@/types";

const icons = ["compass", "hard-hat", "sofa", "ruler", "key", "hammer", "clipboard-check", "box", "building-2", "home"];

export function ServiceForm({ service }: { service?: ServiceWithRelations }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [stepTitle, setStepTitle] = useState("");
  const [stepDesc, setStepDesc] = useState("");
  const [faqQ, setFaqQ] = useState("");
  const [faqA, setFaqA] = useState("");

  const handleSubmit = (formData: FormData) => {
    setError("");
    startTransition(async () => {
      const result = await saveService(formData, service?.id);
      if (!result.success) { setError(result.error || "Failed to save."); return; }
      router.push("/admin/services");
      router.refresh();
    });
  };

  return (
    <div className="space-y-14">
      <form action={handleSubmit} className="space-y-8">
        {error && <div className="border border-red-300 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Label htmlFor="name">Service Name</Label>
            <Input id="name" name="name" defaultValue={service?.name} required />
          </div>
          <div>
            <Label htmlFor="slug">URL Slug</Label>
            <Input id="slug" name="slug" defaultValue={service?.slug} placeholder="architecture-design" required />
          </div>
        </div>

        <div>
          <Label htmlFor="icon">Icon</Label>
          <select id="icon" name="icon" defaultValue={service?.icon || "compass"} className="w-full border-0 border-b border-line bg-transparent py-3 dark:border-line-dark dark:[&>option]:bg-canvas-dark">
            {icons.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>

        <div>
          <Label htmlFor="shortDescription">Short Description (used on cards)</Label>
          <Input id="shortDescription" name="shortDescription" defaultValue={service?.shortDescription} required />
        </div>

        <div>
          <Label htmlFor="description">Full Description</Label>
          <Textarea id="description" name="description" rows={5} defaultValue={service?.description} required />
        </div>

        <div>
          <Label htmlFor="features">Scope Includes (one per line)</Label>
          <Textarea id="features" name="features" rows={4} defaultValue={service?.features.join("\n")} />
        </div>

        <label className="flex items-center gap-2 text-sm text-ink dark:text-canvas">
          <input type="checkbox" name="published" defaultChecked={service?.published ?? true} /> Published
        </label>

        <div>
          <Label htmlFor="images">Upload Images</Label>
          <input id="images" name="images" type="file" accept="image/*" multiple className="block w-full text-sm text-concrete file:mr-4 file:border file:border-line file:bg-transparent file:px-4 file:py-2 file:text-ink dark:file:border-line-dark dark:file:text-canvas" />
        </div>

        <button type="submit" disabled={isPending} className="flex h-12 items-center bg-ink px-8 text-sm text-canvas disabled:opacity-60 dark:bg-canvas dark:text-ink">
          {isPending ? "Saving..." : service ? "Save Changes" : "Create Service"}
        </button>
      </form>

      {service && (
        <>
          <div>
            <h2 className="font-display text-xl text-ink dark:text-canvas">Process Steps</h2>
            <ul className="mt-4 space-y-2">
              {service.processSteps.map((step) => (
                <li key={step.id} className="flex items-center justify-between border-b border-line py-3 dark:border-line-dark">
                  <span className="text-sm text-ink dark:text-canvas">{step.order}. {step.title}</span>
                  <button onClick={() => startTransition(async () => { await deleteProcessStep(step.id); router.refresh(); })} className="text-xs text-red-600">Remove</button>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Input value={stepTitle} onChange={(e) => setStepTitle(e.target.value)} placeholder="Step title" />
              <Input value={stepDesc} onChange={(e) => setStepDesc(e.target.value)} placeholder="Step description" />
              <button
                type="button"
                onClick={() => { if (stepTitle && stepDesc) startTransition(async () => { await addProcessStep(service.id, stepTitle, stepDesc); setStepTitle(""); setStepDesc(""); router.refresh(); }); }}
                className="shrink-0 border border-line px-4 text-sm dark:border-line-dark"
              >
                Add Step
              </button>
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl text-ink dark:text-canvas">FAQs</h2>
            <ul className="mt-4 space-y-2">
              {service.faqs.map((f) => (
                <li key={f.id} className="flex items-center justify-between border-b border-line py-3 dark:border-line-dark">
                  <span className="text-sm text-ink dark:text-canvas">{f.question}</span>
                  <button onClick={() => startTransition(async () => { await deleteServiceFaq(f.id); router.refresh(); })} className="text-xs text-red-600">Remove</button>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-3">
              <Input value={faqQ} onChange={(e) => setFaqQ(e.target.value)} placeholder="Question" />
              <Textarea value={faqA} onChange={(e) => setFaqA(e.target.value)} placeholder="Answer" rows={2} />
              <button
                type="button"
                onClick={() => { if (faqQ && faqA) startTransition(async () => { await addServiceFaq(service.id, faqQ, faqA); setFaqQ(""); setFaqA(""); router.refresh(); }); }}
                className="border border-line px-4 py-2 text-sm dark:border-line-dark"
              >
                Add FAQ
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
