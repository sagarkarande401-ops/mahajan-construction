"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { QuotationStatus } from "@prisma/client";

export async function createQuotation(payload: {
  enquiryId: string;
  quotationNumber: string;
  clientName: string;
  projectType?: string | null;
  location?: string | null;
  validUntil?: string | null;
  subtotal?: number;
  discount?: number;
  gst?: number;
  total?: number;
  notes?: string | null;
  items?: { description: string; quantity: number; unit?: string | null; rate: number; amount?: number }[];
}) {
  const q = await prisma.quotation.create({
    data: {
      enquiryId: payload.enquiryId,
      quotationNumber: payload.quotationNumber,
      clientName: payload.clientName,
      projectType: payload.projectType,
      location: payload.location,
      validUntil: payload.validUntil ? new Date(payload.validUntil) : null,
      subtotal: payload.subtotal ?? 0,
      discount: payload.discount ?? 0,
      gst: payload.gst ?? 0,
      total: payload.total ?? 0,
      notes: payload.notes ?? null,
      items: {
        create: (payload.items || []).map((it) => ({ description: it.description, quantity: it.quantity, unit: it.unit, rate: it.rate, amount: it.amount ?? (it.quantity * it.rate) })),
      },
    },
    include: { items: true },
  });

  revalidatePath("/admin/quotations");
  revalidatePath(`/admin/enquiries/${payload.enquiryId}`);
  return { success: true, id: q.id };
}

export async function updateQuotation(id: string, payload: Partial<{
  clientName: string;
  projectType: string | null;
  location: string | null;
  validUntil: string | null;
  subtotal: number;
  discount: number;
  gst: number;
  total: number;
  notes: string | null;
  status: QuotationStatus;
  items: { id?: string; description: string; quantity: number; unit?: string | null; rate: number; amount?: number }[];
}>) {
  const data: any = {};
  if (typeof payload.clientName !== 'undefined') data.clientName = payload.clientName;
  if (typeof payload.projectType !== 'undefined') data.projectType = payload.projectType;
  if (typeof payload.location !== 'undefined') data.location = payload.location;
  if (typeof payload.validUntil !== 'undefined') data.validUntil = payload.validUntil ? new Date(payload.validUntil) : null;
  if (typeof payload.subtotal !== 'undefined') data.subtotal = payload.subtotal;
  if (typeof payload.discount !== 'undefined') data.discount = payload.discount;
  if (typeof payload.gst !== 'undefined') data.gst = payload.gst;
  if (typeof payload.total !== 'undefined') data.total = payload.total;
  if (typeof payload.notes !== 'undefined') data.notes = payload.notes;
  if (typeof payload.status !== 'undefined') data.status = payload.status;

  // Update items: simple approach - delete existing items and recreate (keeps logic simple)
  if (payload.items) {
    await prisma.quotationItem.deleteMany({ where: { quotationId: id } });
    data.items = { create: payload.items.map((it) => ({ description: it.description, quantity: it.quantity, unit: it.unit, rate: it.rate, amount: it.amount ?? (it.quantity * it.rate) })) };
  }

  await prisma.quotation.update({ where: { id }, data, include: { items: true } });
  revalidatePath("/admin/quotations");
  return { success: true };
}

export async function deleteQuotation(id: string) {
  await prisma.quotation.delete({ where: { id } });
  revalidatePath("/admin/quotations");
  return { success: true };
}

export async function duplicateQuotation(id: string) {
  const q = await prisma.quotation.findUnique({ where: { id }, include: { items: true } });
  if (!q) return { success: false, error: 'Not found' };
  const newNumber = `${q.quotationNumber}-COPY`;
  const copy = await prisma.quotation.create({
    data: {
      enquiryId: q.enquiryId,
      quotationNumber: newNumber,
      clientName: q.clientName,
      projectType: q.projectType,
      location: q.location,
      validUntil: q.validUntil,
      subtotal: q.subtotal,
      discount: q.discount,
      gst: q.gst,
      total: q.total,
      notes: q.notes,
      items: { create: q.items.map((it) => ({ description: it.description, quantity: it.quantity, unit: it.unit, rate: it.rate, amount: it.amount })) },
    },
  });
  revalidatePath("/admin/quotations");
  return { success: true, id: copy.id };
}
