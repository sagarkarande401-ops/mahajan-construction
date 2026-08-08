import { prisma } from "@/lib/prisma";
import { EnquiriesTable } from "./EnquiriesTable";

export default async function AdminEnquiriesPage() {
  let enquiries;
  try {
    enquiries = await prisma.enquiry.findMany({ orderBy: { createdAt: "desc" } });
  } catch (err: any) {
    // If DB schema not migrated yet (notes/followUpDate/assignedTo missing), fall back to a safe select
    if (err && err.code === 'P2022') {
      enquiries = await prisma.enquiry.findMany({ select: { id: true, name: true, phone: true, email: true, projectType: true, budget: true, location: true, message: true, source: true, status: true, createdAt: true, updatedAt: true }, orderBy: { createdAt: 'desc' } });
    } else {
      throw err;
    }
  }

  return (
    <div className="p-6 md:p-10">
      <span className="eyebrow">Manage</span>
      <h1 className="mt-2 font-display text-3xl text-ink dark:text-canvas">Enquiries</h1>
      <div className="mt-8">
        <EnquiriesTable initialEnquiries={enquiries as any} />
      </div>
    </div>
  );
}
