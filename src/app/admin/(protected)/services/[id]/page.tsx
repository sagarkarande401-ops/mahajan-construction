import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ServiceForm } from "../ServiceForm";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await prisma.service.findUnique({
    where: { id },
    include: { processSteps: { orderBy: { order: "asc" } }, faqs: true, images: true }
  });
  if (!service) notFound();

  return (
    <div className="p-6 md:p-10">
      <span className="eyebrow">Edit</span>
      <h1 className="mt-2 font-display text-3xl text-ink dark:text-canvas">{service.name}</h1>
      <div className="mt-8 max-w-3xl"><ServiceForm service={service} /></div>
    </div>
  );
}
