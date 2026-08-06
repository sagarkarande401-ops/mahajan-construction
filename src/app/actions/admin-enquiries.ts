"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { EnquiryStatus } from "@prisma/client";

export async function updateEnquiryStatus(id: string, status: EnquiryStatus) {
  await prisma.enquiry.update({ where: { id }, data: { status } });
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin/dashboard");
}

export async function deleteEnquiry(id: string) {
  await prisma.enquiry.delete({ where: { id } });
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin/dashboard");
}
