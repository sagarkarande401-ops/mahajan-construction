import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EnquiryStatus } from "@prisma/client";
import { LeadDetailsClient } from "./LeadDetailsClient";

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

interface AdminEnquiryDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEnquiryDetailsPage({ params }: AdminEnquiryDetailsPageProps) {
  const { id } = await params;

  let enquiry: LeadDetailsEnquiry | null = null;

  try {
    enquiry = await prisma.enquiry.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        projectType: true,
        budget: true,
        location: true,
        message: true,
        source: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        notes: true,
        followUpDate: true,
        assignedTo: true,
      },
    }) as LeadDetailsEnquiry | null;
  } catch (err: any) {
    if (err && err.code === "P2022") {
      const fallback = await prisma.enquiry.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          projectType: true,
          budget: true,
          location: true,
          message: true,
          source: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (fallback) {
        enquiry = {
          ...fallback,
          notes: null,
          followUpDate: null,
          assignedTo: null,
        };
      }
    } else {
      throw err;
    }
  }

  if (!enquiry) {
    return notFound();
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="eyebrow">Lead details</span>
          <h1 className="mt-2 font-display text-3xl text-ink dark:text-canvas">{enquiry.name}</h1>
          <p className="mt-2 text-sm text-concrete">
            {enquiry.email} • {enquiry.phone}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/enquiries"
            className="inline-flex items-center rounded-full border border-line px-4 py-2 text-sm text-ink transition-colors hover:bg-beige-soft dark:text-canvas dark:hover:bg-ink-soft"
          >
            Back to leads
          </Link>
          <Link
            href={`/admin/quotations/new?enquiryId=${encodeURIComponent(enquiry.id)}&clientName=${encodeURIComponent(enquiry.name)}&projectType=${encodeURIComponent(enquiry.projectType||"")}&location=${encodeURIComponent(enquiry.location||"")}&phone=${encodeURIComponent(enquiry.phone)}`}
            className="inline-flex items-center rounded-full border border-line px-4 py-2 text-sm text-ink transition-colors hover:bg-beige-soft dark:text-canvas dark:hover:bg-ink-soft"
          >
            Create Quotation
          </Link>
        </div>
      </div>

      <LeadDetailsClient enquiry={enquiry} />
    </div>
  );
}
