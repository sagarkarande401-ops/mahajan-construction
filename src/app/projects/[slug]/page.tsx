import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Ruler, Layers, Calendar, User } from "lucide-react";
import { getProjectBySlug, getProjects, getRelatedProjects } from "@/lib/data/projects";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { Lightbox } from "@/components/shared/Lightbox";
import { BeforeAfterSlider } from "@/components/shared/BeforeAfterSlider";
import { EnquiryForm } from "@/components/shared/EnquiryForm";
import { formatEnumLabel, PLACEHOLDER_IMAGE } from "@/lib/utils";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.description.slice(0, 155),
    openGraph: { images: [{ url: project.coverImage || PLACEHOLDER_IMAGE }] },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const related = await getRelatedProjects(project.slug, project.category);
  const cover = project.coverImage || project.images[0]?.url || PLACEHOLDER_IMAGE;
  const galleryImages = [cover, ...project.images.map((i) => i.url)].filter((v, i, a) => a.indexOf(v) === i);

  const specs = [
    { icon: MapPin, label: "Location", value: project.location },
    { icon: Ruler, label: "Area", value: project.area },
    { icon: Layers, label: "Type", value: project.projectType },
    { icon: Calendar, label: "Timeline", value: project.timeline },
    ...(project.client ? [{ icon: User, label: "Client", value: project.client }] : []),
  ];

  return (
    <>
      <section className="relative flex min-h-[85vh] items-end bg-ink text-canvas">
        <div className="absolute inset-0">
          <Image src={cover} alt={project.name} fill priority className="object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/10" />
        </div>
        <div className="container-px relative mx-auto w-full pb-20 pt-40">
          <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-canvas/70 hover:text-gold">
            <ArrowLeft className="h-4 w-4" /> All Projects
          </Link>
          <div className="mt-6 flex items-center gap-4">
            <span className="eyebrow">{formatEnumLabel(project.category)}</span>
            <span className="coord-tag !text-canvas/40">{formatEnumLabel(project.status)}</span>
          </div>
          <h1 className="mt-4 max-w-3xl text-balance text-display-1 font-display font-normal">{project.name}</h1>
        </div>
      </section>

      <section className="border-b border-line py-10 dark:border-line-dark">
        <div className="container-px mx-auto grid grid-cols-2 gap-8 md:grid-cols-5">
          {specs.map((spec) => (
            <div key={spec.label}>
              <spec.icon className="h-4 w-4 text-gold" strokeWidth={1.5} />
              <p className="eyebrow mt-3 !text-concrete">{spec.label}</p>
              <p className="mt-1 font-display text-lg text-ink dark:text-canvas">{spec.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="container-px mx-auto grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1.4fr]">
          <RevealOnScroll>
            <span className="eyebrow">Project Brief</span>
            <p className="mt-6 text-lg leading-relaxed text-concrete">{project.description}</p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <span className="eyebrow">Highlights</span>
            <ul className="mt-6 space-y-4">
              {project.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 border-b border-line pb-4 text-ink dark:border-line-dark dark:text-canvas">
                  <span className="mt-2 h-1 w-1 shrink-0 bg-gold" />
                  {h}
                </li>
              ))}
            </ul>
          </RevealOnScroll>
        </div>
      </section>

      {(project.challenges || project.solutions) && (
        <section className="border-t border-line bg-beige-soft py-24 dark:border-line-dark dark:bg-ink-soft md:py-32">
          <div className="container-px mx-auto grid grid-cols-1 gap-16 md:grid-cols-2">
            {project.challenges && (
              <RevealOnScroll>
                <span className="eyebrow">Challenges</span>
                <p className="mt-6 text-lg leading-relaxed text-concrete">{project.challenges}</p>
              </RevealOnScroll>
            )}
            {project.solutions && (
              <RevealOnScroll delay={0.1}>
                <span className="eyebrow">Our Solutions</span>
                <p className="mt-6 text-lg leading-relaxed text-concrete">{project.solutions}</p>
              </RevealOnScroll>
            )}
          </div>
        </section>
      )}

      {project.materialsUsed.length > 0 && (
        <section className="py-24 md:py-32">
          <div className="container-px mx-auto">
            <span className="eyebrow">Materials Used</span>
            <div className="mt-8 flex flex-wrap gap-3">
              {project.materialsUsed.map((m) => (
                <span key={m} className="border border-line px-4 py-2 text-sm text-ink dark:border-line-dark dark:text-canvas">{m}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {project.timelineSteps.length > 0 && (
        <section className="border-t border-line py-24 dark:border-line-dark md:py-32">
          <div className="container-px mx-auto">
            <span className="eyebrow">Project Timeline</span>
            <div className="mt-10 space-y-0">
              {project.timelineSteps.map((step, i) => (
                <RevealOnScroll key={step.id} delay={i * 0.06} className="grid grid-cols-1 gap-4 border-t border-line py-8 dark:border-line-dark md:grid-cols-[100px_1fr_2fr]">
                  <span className="font-mono text-sm text-gold">{step.date || `Stage ${step.order}`}</span>
                  <h3 className="font-display text-xl text-ink dark:text-canvas">{step.label}</h3>
                  {step.description && <p className="text-concrete">{step.description}</p>}
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {project.beforeAfterPairs.length > 0 && (
        <section className="border-t border-line py-24 dark:border-line-dark md:py-32">
          <div className="container-px mx-auto">
            <span className="eyebrow">Before / After</span>
            <h2 className="mt-4 text-display-3 font-display text-ink dark:text-canvas">Drag to compare.</h2>
            <div className="mt-10 space-y-10">
              {project.beforeAfterPairs.map((pair) => (
                <BeforeAfterSlider key={pair.id} before={pair.beforeUrl} after={pair.afterUrl} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-line py-24 dark:border-line-dark md:py-32">
        <div className="container-px mx-auto">
          <span className="eyebrow">Gallery</span>
          <h2 className="mt-4 text-display-3 font-display text-ink dark:text-canvas">Full site gallery.</h2>
          <Lightbox images={galleryImages}>
            {(openAt) => (
              <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
                {galleryImages.map((img, i) => (
                  <button key={img + i} onClick={() => openAt(i)} className="group relative aspect-square overflow-hidden bg-concrete-light">
                    <Image src={img} alt={`${project.name} gallery image ${i + 1}`} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-110" />
                  </button>
                ))}
              </div>
            )}
          </Lightbox>
        </div>
      </section>

      {project.videos.length > 0 && (
        <section className="border-t border-line py-24 dark:border-line-dark md:py-32">
          <div className="container-px mx-auto">
            <span className="eyebrow">Videos</span>
            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
              {project.videos.map((video) => (
                <div key={video.id} className="aspect-video overflow-hidden bg-concrete-light">
                  <iframe src={video.url} title={video.title || project.name} className="h-full w-full" allowFullScreen loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-line py-24 dark:border-line-dark md:py-32">
        <div className="container-px mx-auto max-w-2xl">
          <span className="eyebrow">Enquire About This Project</span>
          <h2 className="mt-4 text-display-3 font-display text-ink dark:text-canvas">Interested in something similar?</h2>
          <p className="mt-4 text-concrete">Tell us about your plot and we&rsquo;ll get back to you within 24 hours.</p>
          <div className="mt-10">
            <EnquiryForm source="PROJECT_PAGE" projectSlug={project.slug} defaultMessage={`I'd like to enquire about a project similar to "${project.name}".`} />
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line bg-beige-soft py-24 dark:border-line-dark dark:bg-ink-soft md:py-32">
          <div className="container-px mx-auto">
            <span className="eyebrow">Related Work</span>
            <h2 className="mt-4 text-display-3 font-display text-ink dark:text-canvas">More {formatEnumLabel(project.category).toLowerCase()} projects.</h2>
            <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-3">
              {related.map((p, i) => <ProjectCard key={p.slug} project={p} index={i} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
