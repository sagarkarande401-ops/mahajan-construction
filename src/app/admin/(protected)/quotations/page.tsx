import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";

export default async function AdminQuotationsPage() {
  let quotations = [] as any[];
  try {
    quotations = await prisma.quotation.findMany({ orderBy: { createdAt: "desc" }, include: { items: true } });
  } catch (err: any) {
    // If the Quotation table doesn't exist yet (P2021), gracefully fall back so the admin builds.
    // Log the error for diagnostics and continue with an empty list.
    console.error('Prisma error fetching quotations:', err?.code ?? err);
    quotations = [];
  }

  return (
    <div className="p-6 md:p-10">
      <span className="eyebrow">Manage</span>
      <h1 className="mt-2 font-display text-3xl text-ink dark:text-canvas">Quotations</h1>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <Link href="/admin/quotations/new" className="inline-flex items-center rounded bg-ink px-4 py-2 text-sm text-canvas">Create Quotation</Link>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line text-left text-concrete dark:border-line-dark">
                <th className="py-3 pr-4 font-normal">Quotation #</th>
                <th className="py-3 pr-4 font-normal">Client</th>
                <th className="py-3 pr-4 font-normal">Status</th>
                <th className="py-3 pr-4 font-normal">Amount</th>
                <th className="py-3 pr-4 font-normal">Created</th>
                <th className="py-3 pr-4 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotations.map((q) => (
                <tr key={q.id} className="border-b border-line align-top dark:border-line-dark">
                  <td className="py-4 pr-4 font-medium text-ink dark:text-canvas">{q.quotationNumber}</td>
                  <td className="py-4 pr-4 text-concrete">{q.clientName}</td>
                  <td className="py-4 pr-4 text-concrete">{q.status}</td>
                  <td className="py-4 pr-4 text-concrete">₹{q.total?.toFixed(2) ?? '0.00'}</td>
                  <td className="py-4 pr-4 text-concrete">{format(q.createdAt, 'dd MMM yyyy')}</td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/quotations/${q.id}`} className="text-concrete hover:text-ink">View</Link>
                      <Link href={`/admin/quotations/${q.id}/edit`} className="text-concrete hover:text-ink">Edit</Link>
                      <form action={async (formData: FormData) => { /* placeholder for delete if needed */ }}>
                        <button type="button" className="text-concrete">Delete</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
