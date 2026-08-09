"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { EnquiryStatus } from "@prisma/client";

export async function updateEnquiryStatus(id: string, status: EnquiryStatus) {
  await prisma.enquiry.update({ where: { id }, data: { status } });
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin/dashboard");
}

export async function updateEnquiryDetails(id: string, payload: {
  status?: EnquiryStatus;
  notes?: string | null;
  followUpDate?: string | null; // ISO date string
  assignedTo?: string | null;
  budget?: string | null;
  location?: string | null;
}) {
  const data: any = {};
  if (payload.status) data.status = payload.status;
  if (typeof payload.notes !== 'undefined') data.notes = payload.notes;
  if (typeof payload.followUpDate !== 'undefined') data.followUpDate = payload.followUpDate ? new Date(payload.followUpDate) : null;
  if (typeof payload.assignedTo !== 'undefined') data.assignedTo = payload.assignedTo;
  if (typeof payload.budget !== 'undefined') data.budget = payload.budget;
  if (typeof payload.location !== 'undefined') data.location = payload.location;

  await prisma.enquiry.update({ where: { id }, data });
  revalidatePath("/admin/enquiries");
  revalidatePath(`/admin/enquiries/${id}`);
  revalidatePath("/admin/dashboard");
}

export async function deleteEnquiry(id: string) {
  await prisma.enquiry.delete({ where: { id } });
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin/dashboard");
}

