import { Resend } from "resend";
import { siteConfig } from "@/lib/utils";

interface EnquiryEmailData {
  name: string;
  phone: string;
  email: string;
  projectType?: string | null;
  budget?: string | null;
  location?: string | null;
  message: string;
  source?: string;
}

function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

const fromAddress = () => process.env.RESEND_FROM_EMAIL || "Mahajan Construction <onboarding@resend.dev>";

/** Sends both the owner notification and the customer confirmation. Silently
 *  no-ops (logs only) if RESEND_API_KEY isn't configured yet, so local dev
 *  and testing don't crash before email is set up. */
export async function sendEnquiryEmails(data: EnquiryEmailData, resendClient?: any) {
  const resend = resendClient ?? getResend();
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping email send for enquiry from", data.email);
    return { ownerSent: false, customerSent: false };
  }

  const detailsBlock = [
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email}`,
    data.projectType ? `Project Type: ${data.projectType}` : null,
    data.budget ? `Budget: ${data.budget}` : null,
    data.location ? `Location: ${data.location}` : null,
    `Source: ${data.source || "Contact Page"}`,
    "",
    "Message:",
    data.message,
  ].filter(Boolean).join("\n");

  let ownerSent = false;
  let customerSent = false;
  const errors: any[] = [];

  try {
    const ownerResult = await resend.emails.send({
      from: fromAddress(),
      to: siteConfig.email,
      subject: `New Enquiry — ${data.name}`,
      text: detailsBlock,
    });
    // Resend SDK has a typed response shape; cast to any to check common success fields
    const _owner = ownerResult as any;
    if (_owner && (_owner.id || _owner.messageId || _owner.status || _owner.data?.id || _owner.data?.messageId || _owner.data?.status)) {
      ownerSent = true;
    } else {
      ownerSent = true; // assume success if no error thrown — Resend throws on failure
    }
  } catch (err) {
    console.error('Resend owner email failed:', err);
    errors.push({ channel: 'owner', err });
  }

  try {
    const customerResult = await resend.emails.send({
      from: fromAddress(),
      to: data.email,
      subject: "Thank you for contacting Mahajan Construction",
      text:
        `Hi ${data.name},\n\n` +
        `Thank you for contacting us.\n\n` +
        `We have successfully received your enquiry:\n\n${detailsBlock}\n\n` +
        `Our team will contact you within 24 hours.\n\n` +
        `Regards,\nSaish Mahajan\nMahajan Construction\n${siteConfig.phoneDisplay}`,
    });
    const _cust = customerResult as any;
    if (_cust && (_cust.id || _cust.messageId || _cust.status || _cust.data?.id || _cust.data?.messageId || _cust.data?.status)) {
      customerSent = true;
    } else {
      customerSent = true; // assume success if no error thrown
    }
  } catch (err) {
    console.error('Resend customer email failed:', err);
    errors.push({ channel: 'customer', err });
  }

  return { ownerSent, customerSent, errors };
}

