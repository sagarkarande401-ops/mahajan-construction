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
    // Map BOOK_CONSULTATION to an existing DB enum value so Prisma type checks and the DB stay compatible.
    const dbSource: "CONTACT_PAGE" | "SERVICE_PAGE" | "PROJECT_PAGE" =
      data.source === "BOOK_CONSULTATION" ? "CONTACT_PAGE" : (data.source as "CONTACT_PAGE" | "SERVICE_PAGE" | "PROJECT_PAGE");

    await prisma.enquiry.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        projectType: data.projectType,
        budget: data.budget,
        location: data.location,
        message: data.message,
        source: dbSource,
        serviceSlug: data.serviceSlug,
        projectSlug: data.projectSlug,
      },
    });
  } catch (err) {
    console.error("Failed to save enquiry:", err);
    return { success: false, error: "Something went wrong saving your enquiry. Please try again or contact us directly." };
  }

  // Send emails (owner notification + customer confirmation) using Resend if configured.
  // Failures are logged but do not block the HTTP response.
  // Send emails in the background so the user doesn't wait for external API calls.
  // Use fire-and-forget with a catch to log errors but not block the response.
  sendEnquiryEmails({
    name: data.name,
    phone: data.phone,
    email: data.email,
    projectType: data.projectType,
    budget: data.budget,
    location: data.location,
    message: data.message,
    source: data.source,
  }).catch((err) => {
    console.error('Failed to send enquiry emails (background):', err);
  });

  const whatsappMessage = `Hi Mahajan Construction, I just submitted an enquiry.\n\nName: ${data.name}\nProject Type: ${data.projectType || "-"}\nLocation: ${data.location || "-"}\nMessage: ${data.message}`;

  return { success: true, whatsappMessage };
}

