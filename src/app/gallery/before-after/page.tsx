import type { Metadata } from "next";
import { getProjects } from "@/lib/data/projects";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { BeforeAfterSlider } from "@/components/shared/BeforeAfterSlider";

export const metadata: Metadata = { title: "Before / After", description: "Renovation before-and-after comparisons from Mahajan Construction." };

export default async function Page() {
  const all = await getProjects();
  const withBeforeAfter = all.filter((p) => p.beforeAfterPairs.length > 0);
  return (
    <section className="container-px mx-auto pb-24 pt-40 md:pb-32">
      <SectionHeading eyebrow="Gallery / Before-After" title="Drag to compare." description="Renovation projects, shown side by side." />
      <div className="mt-16 space-y-16">
        {withBeforeAfter.map((p) => (
          <div key={p.slug}>
            <h3 className="mb-4 font-display text-2xl text-ink dark:text-canvas">{p.name}</h3>
            {p.beforeAfterPairs.map((pair) => <BeforeAfterSlider key={pair.id} before={pair.beforeUrl} after={pair.afterUrl} />)}
          </div>
        ))}
        {withBeforeAfter.length === 0 && <p className="text-concrete">No before/after sets published yet.</p>}
      </div>
    </section>
  );
}

