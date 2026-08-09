"use client";

import { useState, useTransition } from "react";
import { EnquiryStatus } from "@prisma/client";
import { updateEnquiryDetails } from "@/app/actions/admin-enquiries";
import { Label, Input, Textarea } from "@/components/ui/form-fields";
import { ArrowLeft, Mail, MessageCircle, Phone, Save } from "lucide-react";

const statusOptions: EnquiryStatus[] = ["PENDING", "CONTACTED", "QUOTATION_SENT", "WON", "LOST"];

type LeadDetailsEnquiry = {
  id: string;
  name: string;
  phone: string;
  email: string;
  projectType: string | null;
  budget: string | null;
  location: string | null;
  message: string;
  source: string;
  status: EnquiryStatus;
  createdAt: Date;
  updatedAt: Date;
  notes: string | null;
  followUpDate: Date | null;
  assignedTo: string | null;
};

export function LeadDetailsClient({ enquiry }: { enquiry: LeadDetailsEnquiry }) {
  const [status, setStatus] = useState<EnquiryStatus>(enquiry.status);
  const [notes, setNotes] = useState(enquiry.notes || "");
  const [followUpDate, setFollowUpDate] = useState(enquiry.followUpDate ? enquiry.followUpDate.toISOString().slice(0, 10) : "");
  const [assignedTo, setAssignedTo] = useState(enquiry.assignedTo || "");
  const [budget, setBudget] = useState(enquiry.budget || "");
  const [location, setLocation] = useState(enquiry.location || "");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const sanitizedPhone = enquiry.phone.replace(/[^+0-9]/g, "");
  const whatsappText = encodeURIComponent(`Hi ${enquiry.name}, I am following up on your enquiry with Mahajan Construction.`);
  const whatsappHref = `https://api.whatsapp.com/send?phone=${encodeURIComponent(sanitizedPhone)}&text=${whatsappText}`;
  const mailtoHref = `mailto:${encodeURIComponent(enquiry.email)}?subject=${encodeURIComponent("Follow up on your enquiry")}&body=${encodeURIComponent(`Hi ${enquiry.name},

I am following up on your enquiry submitted on ${new Date(enquiry.createdAt).toLocaleDateString("en-IN")}. Please let me know how we can assist you further.

Regards,
Mahajan Construction`)}`;

  const actualStatusOptions = statusOptions.includes(status) ? statusOptions : [status, ...statusOptions];

  const handleSave = () => {
    setMessage("");
    startTransition(async () => {
      try {
        await updateEnquiryDetails(enquiry.id, {
          status,
          notes: notes || null,
          followUpDate: followUpDate || null,
          assignedTo: assignedTo || null,
          budget: budget || null,
          location: location || null,
        });
        setMessage("Lead updated successfully.");
      } catch (error) {
        console.error(error);
        setMessage("Unable to save changes. Please try again.");
      }
    });
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[1.5fr_0.9fr]">
      <div className="space-y-6">
        <section className="rounded-3xl border border-line bg-canvas p-8 dark:border-line-dark">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-concrete">Project type</p>
              <p className="mt-2 text-base text-ink dark:text-canvas">{enquiry.projectType || "—"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-concrete">Budget</p>
              <p className="mt-2 text-base text-ink dark:text-canvas">{budget || "—"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-concrete">Location</p>
              <p className="mt-2 text-base text-ink dark:text-canvas">{location || "—"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-concrete">Lead source</p>
              <p className="mt-2 text-base text-ink dark:text-canvas">{enquiry.source.replace(/_/g, " ")}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs uppercase tracking-[0.2em] text-concrete">Created</p>
              <p className="mt-2 text-base text-ink dark:text-canvas">{new Date(enquiry.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-line bg-canvas p-8 dark:border-line-dark">
          <h2 className="font-display text-xl text-ink dark:text-canvas">Message</h2>
          <p className="mt-4 whitespace-pre-line text-sm text-concrete">{enquiry.message}</p>
        </section>

        <section className="rounded-3xl border border-line bg-canvas p-8 dark:border-line-dark">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl text-ink dark:text-canvas">Admin notes</h2>
              <p className="mt-2 text-sm text-concrete">Internal notes are stored only in the admin panel.</p>
            </div>
          </div>
          <Textarea
            rows={10}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Add internal notes for this lead"
          />
        </section>
      </div>

      <aside className="space-y-6">
        <section className="rounded-3xl border border-line bg-canvas p-8 dark:border-line-dark">
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={status}
                onChange={(event) => setStatus(event.target.value as EnquiryStatus)}
                className="w-full border-0 border-b border-line bg-transparent py-3 text-base text-ink focus:border-gold focus:outline-none focus:ring-0 dark:border-line-dark dark:text-canvas"
              >
                {actualStatusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="followUpDate">Next follow-up</Label>
              <Input
                id="followUpDate"
                type="date"
                value={followUpDate}
                onChange={(event) => setFollowUpDate(event.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="assignedTo">Assigned to</Label>
              <Input
                id="assignedTo"
                value={assignedTo}
                onChange={(event) => setAssignedTo(event.target.value)}
                placeholder="Team member"
              />
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="flex h-12 w-full items-center justify-center gap-2 rounded bg-ink px-4 text-sm text-canvas disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {isPending ? "Saving..." : "Save lead"}
            </button>
            {message ? <p className="text-sm text-ink dark:text-canvas">{message}</p> : null}
          </div>
        </section>

        <section className="rounded-3xl border border-line bg-canvas p-8 dark:border-line-dark">
          <h2 className="font-display text-xl text-ink dark:text-canvas">Quick actions</h2>
          <div className="mt-5 grid gap-3">
            <a
              href={`tel:${sanitizedPhone}`}
              className="inline-flex items-center justify-center gap-2 rounded border border-line px-4 py-3 text-sm text-ink transition-colors hover:bg-beige-soft dark:text-canvas dark:hover:bg-ink-soft"
            >
              <Phone className="h-4 w-4" />
              Call customer
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded border border-line px-4 py-3 text-sm text-ink transition-colors hover:bg-beige-soft dark:text-canvas dark:hover:bg-ink-soft"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp customer
            </a>
            <a
              href={mailtoHref}
              className="inline-flex items-center justify-center gap-2 rounded border border-line px-4 py-3 text-sm text-ink transition-colors hover:bg-beige-soft dark:text-canvas dark:hover:bg-ink-soft"
            >
              <Mail className="h-4 w-4" />
              Send email
            </a>
          </div>
        </section>
      </aside>
    </div>
  );
}
