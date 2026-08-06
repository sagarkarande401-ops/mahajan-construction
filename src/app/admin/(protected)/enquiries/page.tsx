import { prisma } from "@/lib/prisma";
import { EnquiriesTable } from "./EnquiriesTable";

export default async function AdminEnquiriesPage() {
  const enquiries = await prisma.enquiry.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="p-6 md:p-10">
      <span className="eyebrow">Manage</span>
      <h1 className="mt-2 font-display text-3xl text-ink dark:text-canvas">Enquiries</h1>
      <div className="mt-8">
        <EnquiriesTable initialEnquiries={enquiries} />
      </div>
    </div>
  );
}
