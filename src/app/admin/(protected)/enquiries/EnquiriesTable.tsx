"use client";

import { useState, useMemo } from "react";
import { Search, Download, Trash2 } from "lucide-react";
import { Enquiry, EnquiryStatus } from "@prisma/client";
import { updateEnquiryStatus, deleteEnquiry, updateEnquiryDetails } from "@/app/actions/admin-enquiries";
import { cn } from "@/lib/utils";

const statuses: EnquiryStatus[] = ["PENDING", "NEW", "CONTACTED", "SITE_VISIT_SCHEDULED", "QUOTATION_SENT", "WON", "LOST"];
const statusColor: Record<EnquiryStatus, string> = {
  PENDING: "bg-concrete-light text-ink",
  NEW: "bg-concrete-light text-ink",
  CONTACTED: "bg-blue-100 text-blue-700",
  SITE_VISIT_SCHEDULED: "bg-purple-100 text-purple-700",
  QUOTATION_SENT: "bg-amber-100 text-amber-700",
  WON: "bg-green-100 text-green-700",
  LOST: "bg-red-100 text-red-700",
};

export function EnquiriesTable({ initialEnquiries }: { initialEnquiries: Enquiry[] }) {
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | EnquiryStatus>("ALL");
  const [serviceFilter, setServiceFilter] = useState<string>("ALL");
  const [sortOrder, setSortOrder] = useState<'NEWEST'|'OLDEST'>('NEWEST');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Enquiry | null>(null);

  const services = useMemo(() => {
    const set = new Set<string>();
    initialEnquiries.forEach((e) => { if (e.serviceSlug) set.add(e.serviceSlug); });
    return Array.from(set);
  }, [initialEnquiries]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = enquiries.filter((e) => {
      const matchesStatus = statusFilter === "ALL" || e.status === statusFilter;
      const matchesService = serviceFilter === 'ALL' || (e.serviceSlug === serviceFilter);
      const matchesSearch = !q || [e.name, e.phone, e.email, e.location || "", e.projectType || ""].some((f) => f.toLowerCase().includes(q));
      return matchesStatus && matchesService && matchesSearch;
    });
    list.sort((a,b) => sortOrder === 'NEWEST' ? (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
    return list;
  }, [enquiries, search, statusFilter, serviceFilter, sortOrder]);

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

          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="border border-line bg-transparent px-3 py-2.5 text-sm text-ink focus:border-gold focus:outline-none dark:border-line-dark dark:text-canvas dark:[&>option]:bg-canvas-dark"
          >
            <option value="ALL">All Services</option>
            {services.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="border border-line bg-transparent px-3 py-2.5 text-sm text-ink focus:border-gold focus:outline-none dark:border-line-dark dark:text-canvas"
          >
            <option value="NEWEST">Newest First</option>
            <option value="OLDEST">Oldest First</option>
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
                <td className="py-4 pr-4 font-medium text-ink dark:text-canvas"><button onClick={() => setSelected(e)} className="text-left">{e.name}</button></td>
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
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelected(e)}
                      aria-label="View details"
                      className="text-concrete hover:text-ink"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(e.id)}
                      disabled={deletingId === e.id}
                      aria-label="Delete enquiry"
                      className="text-concrete hover:text-red-600 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="mt-10 text-concrete">No enquiries match your search/filter.</p>}
      </div>

      {/* Slide-over details panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/30">
          <div className="w-full max-w-3xl bg-canvas p-6 dark:bg-canvas-dark">
            <div className="flex items-start justify-between">
              <h2 className="font-display text-2xl">Lead Details</h2>
              <button onClick={() => setSelected(null)} className="text-concrete">Close</button>
            </div>

            <div className="mt-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="font-display text-lg">Customer Information</h3>
                  <p className="mt-2 text-sm text-concrete">{selected.name}</p>
                  <p className="mt-1 text-sm text-concrete">{selected.phone}</p>
                  <p className="mt-1 text-sm text-concrete">{selected.email}</p>
                </div>
                <div>
                  <h3 className="font-display text-lg">Service Required</h3>
                  <p className="mt-2 text-sm text-concrete">{selected.projectType || selected.serviceSlug || '—'}</p>
                  <h3 className="mt-4 font-display text-lg">Message</h3>
                  <p className="mt-2 text-sm text-concrete whitespace-pre-line">{selected.message}</p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink">Status</label>
                  <select value={selected.status} onChange={(e) => { const s = e.target.value as EnquiryStatus; setEnquiries(prev => prev.map(en => en.id === selected.id ? { ...en, status: s } : en)); updateEnquiryStatus(selected.id, s); setSelected({...selected, status: s} as Enquiry);} } className="mt-2 w-full border border-line bg-transparent px-3 py-2 text-sm">
                    <option value="PENDING">New</option>
                    <option value="NEW">New (explicit)</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="SITE_VISIT_SCHEDULED">Site Visit Scheduled</option>
                    <option value="QUOTATION_SENT">Quotation Sent</option>
                    <option value="WON">Won</option>
                    <option value="LOST">Lost</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink">Notes</label>
                  <textarea value={selected.notes || ''} onChange={(e) => setSelected({...selected, notes: e.target.value} as Enquiry)} className="mt-2 w-full border border-line bg-transparent px-3 py-2 text-sm" rows={6} />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-ink">Follow-up Date</label>
                    <input type="date" value={selected.followUpDate ? new Date(selected.followUpDate).toISOString().slice(0,10) : ''} onChange={(e) => setSelected({...selected, followUpDate: e.target.value ? new Date(e.target.value).toISOString() : null} as Enquiry)} className="mt-2 w-full border border-line bg-transparent px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink">Assigned To</label>
                    <input value={selected.assignedTo || ''} onChange={(e) => setSelected({...selected, assignedTo: e.target.value} as Enquiry)} className="mt-2 w-full border border-line bg-transparent px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink">Budget</label>
                    <input value={selected.budget || ''} onChange={(e) => setSelected({...selected, budget: e.target.value} as Enquiry)} className="mt-2 w-full border border-line bg-transparent px-3 py-2 text-sm" />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={async () => {
                    // Save changes
                    const payload = {
                      status: selected.status as EnquiryStatus,
                      notes: selected.notes || null,
                      followUpDate: selected.followUpDate ? (typeof selected.followUpDate === 'string' ? selected.followUpDate : new Date(selected.followUpDate).toISOString()) : null,
                      assignedTo: selected.assignedTo || null,
                      budget: selected.budget || null,
                      location: selected.location || null,
                    };
                    try {
                      await updateEnquiryDetails(selected.id, payload as any);
                      // update list
                      setEnquiries(prev => prev.map(en => en.id === selected.id ? { ...en, ...payload } as Enquiry : en));
                      setSelected(prev => prev ? ({ ...prev, ...payload } as Enquiry) : prev);
                      alert('Saved');
                    } catch (err) {
                      console.error(err);
                      alert('Failed to save');
                    }
                  }} className="h-10 rounded bg-ink px-4 text-sm text-canvas">Save</button>

                  <button onClick={() => setSelected(null)} className="h-10 rounded border px-4 text-sm">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

