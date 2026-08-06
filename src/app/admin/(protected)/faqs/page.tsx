import { prisma } from "@/lib/prisma";
import { FaqsAdminClient } from "./FaqsAdminClient";

export default async function AdminFaqsPage() {
  const faqs = await prisma.faq.findMany({ orderBy: { order: "asc" } });
  return (
    <div className="p-6 md:p-10">
      <span className="eyebrow">Manage</span>
      <h1 className="mt-2 font-display text-3xl text-ink dark:text-canvas">FAQs</h1>
      <div className="mt-8"><FaqsAdminClient faqs={faqs} /></div>
    </div>
  );
}
