"use client";

import { useState, useMemo } from "react";
import { Search, Download, Trash2 } from "lucide-react";
import { Enquiry, EnquiryStatus } from "@prisma/client";
import { updateEnquiryStatus, deleteEnquiry } from "@/app/actions/admin-enquiries";
import { cn } from "@/lib/utils";

const statuses: EnquiryStatus[] = ["PENDING", "CONTACTED", "QUOTATION_SENT", "WON", "LOST"];
const statusColor: Record<EnquiryStatus, string> = {
  PENDING: "bg-concrete-light text-ink",
  CONTACTED: "bg-blue-100 text-blue-700",
  QUOTATION_SENT: "bg-amber-100 text-amber-700",
  WON: "bg-green-100 text-green-700",
  LOST: "bg-red-100 text-red-700",
};

export function EnquiriesTable({ initialEnquiries }: { initialEnquiries: Enquiry[] }) {
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | EnquiryStatus>("ALL");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return enquiries.filter((e) => {
      const matchesStatus = statusFilter === "ALL" || e.status === statusFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch = !q || [e.name, e.phone, e.email, e.location || "", e.projectType || ""].some((f) => f.toLowerCase().includes(q));
      return matchesStatus && matchesSearch;
    });
  }, [enquiries, search, statusFilter]);

  const handleStatusChange = async (id: string, status: EnquiryStatus) => {
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    await updateEnquiryStatus(id, status);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this enquiry permanently? This can't be undone.")) return;
    setDeletingId(id);
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
    await deleteEnquiry(id);
    setDeletingId(null);
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-concrete" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, phone, email, location..."
              className="w-full border border-line bg-transparent py-2.5 pl-10 pr-3 text-sm text-ink focus:border-gold focus:outline-none dark:border-line-dark dark:text-canvas"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="border border-line bg-transparent px-3 py-2.5 text-sm text-ink focus:border-gold focus:outline-none dark:border-line-dark dark:text-canvas dark:[&>option]:bg-canvas-dark"
          >
            <option value="ALL">All Statuses</option>
            {statuses.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
          </select>
        </div>
        <a
          href="/api/admin/export-enquiries"
          className="flex items-center justify-center gap-2 border border-line px-4 py-2.5 text-sm text-ink dark:border-line-dark dark:text-canvas"
        >
          <Download className="h-4 w-4" /> Export to Excel
        </a>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-concrete dark:border-line-dark">
              <th className="py-3 pr-4 font-normal">Date</th>
              <th className="py-3 pr-4 font-normal">Name</th>
              <th className="py-3 pr-4 font-normal">Contact</th>
              <th className="py-3 pr-4 font-normal">Project</th>
              <th className="py-3 pr-4 font-normal">Budget</th>
              <th className="py-3 pr-4 font-normal">Location</th>
              <th className="py-3 pr-4 font-normal">Status</th>
              <th className="py-3 pr-4 font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id} className="border-b border-line align-top dark:border-line-dark">
                <td className="py-4 pr-4 text-concrete">{new Date(e.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</td>
                <td className="py-4 pr-4 font-medium text-ink dark:text-canvas">{e.name}</td>
                <td className="py-4 pr-4 text-concrete">
                  <div>{e.phone}</div>
                  <div className="text-xs">{e.email}</div>
                </td>
                <td className="py-4 pr-4 text-concrete">{e.projectType || "—"}</td>
                <td className="py-4 pr-4 text-concrete">{e.budget || "—"}</td>
                <td className="py-4 pr-4 text-concrete">{e.location || "—"}</td>
                <td className="py-4 pr-4">
                  <select
                    value={e.status}
                    onChange={(ev) => handleStatusChange(e.id, ev.target.value as EnquiryStatus)}
                    className={cn("border-0 px-2 py-1 text-xs font-medium", statusColor[e.status])}
                  >
                    {statuses.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                  </select>
                </td>
                <td className="py-4 pr-4">
                  <button
                    onClick={() => handleDelete(e.id)}
                    disabled={deletingId === e.id}
                    aria-label="Delete enquiry"
                    className="text-concrete hover:text-red-600 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="mt-10 text-concrete">No enquiries match your search/filter.</p>}
      </div>
    </div>
  );
}
