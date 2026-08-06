"use server";

import { prisma } from "@/lib/prisma";
import { enquirySchema, EnquiryInput } from "@/lib/validation";
import { sendEnquiryEmails } from "@/lib/email";

export interface SubmitEnquiryResult {
  success: boolean;
  error?: string;
  fieldErrors?: Partial<Record<keyof EnquiryInput, string>>;
  whatsappMessage?: string;
}

export async function submitEnquiry(raw: unknown): Promise<SubmitEnquiryResult> {
  const parsed = enquirySchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof EnquiryInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof EnquiryInput;
      fieldErrors[key] = issue.message;
    }
    return { success: false, error: "Please check the form for errors.", fieldErrors };
  }

  const data = parsed.data;

  try {
    await prisma.enquiry.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        projectType: data.projectType,
        budget: data.budget,
        location: data.location,
        message: data.message,
        source: data.source,
        serviceSlug: data.serviceSlug,
        projectSlug: data.projectSlug,
      },
    });
  } catch (err) {
    console.error("Failed to save enquiry:", err);
    return { success: false, error: "Something went wrong saving your enquiry. Please try again or contact us directly." };
  }

  // Email failures shouldn't block the success response — the enquiry is
  // already saved and visible in the admin dashboard either way.
  try {
    await sendEnquiryEmails({
      name: data.name, phone: data.phone, email: data.email,
      projectType: data.projectType, budget: data.budget, location: data.location,
      message: data.message, source: data.source,
    });
  } catch (err) {
    console.error("Failed to send enquiry emails:", err);
  }

  const whatsappMessage = `Hi Mahajan Construction, I just submitted an enquiry.\n\nName: ${data.name}\nProject Type: ${data.projectType || "-"}\nLocation: ${data.location || "-"}\nMessage: ${data.message}`;

  return { success: true, whatsappMessage };
}
