import { Resend } from "resend";
import { siteConfig } from "@/lib/utils";
import { sendWhatsAppText } from "@/lib/whatsapp";

const fromAddress = () => process.env.RESEND_FROM_EMAIL || "Mahajan Construction <onboarding@resend.dev>";

interface RewardOptions {
  couponCode: string;
  message?: string; // short message to include
}

function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

/** Sends a coupon to customer by email and WhatsApp. Best-effort; logs and returns status. */
export async function sendRewardToCustomer(email: string, phone: string, name: string, opts: RewardOptions) {
  const resend = getResend();
  const results: { emailSent?: boolean; whatsappSent?: boolean; errors?: any[] } = { errors: [] };

  const couponText = opts.couponCode;
  const note = opts.message || `Use code ${couponText} on your first service. Exclusions may apply.`;

  if (resend) {
    try {
      await resend.emails.send({
        from: fromAddress(),
        to: email,
        subject: `Your reward from ${siteConfig.name}`,
        text:
          `Hi ${name},\n\n` +
          `Thank you for booking a consultation with ${siteConfig.name}. As a small token of appreciation, please accept this coupon:\n\n` +
          `${couponText}\n\n` +
          `${note}\n\n` +
          `We look forward to speaking with you soon.\n\nRegards,\n${siteConfig.owner}`,
      });
      results.emailSent = true;
    } catch (err) {
      results.errors!.push({ channel: 'email', err });
      console.error('Failed to send reward email:', err);
    }
  } else {
    console.warn('RESEND_API_KEY not set — skipping reward email to', email);
  }

  try {
    const waRes = await sendWhatsAppText(phone, `Hi ${name}, thanks for booking a consultation with ${siteConfig.name}. Your coupon: ${couponText}. ${note}`);
    results.whatsappSent = !!waRes.success;
    if (!waRes.success) results.errors!.push({ channel: 'whatsapp', detail: waRes });
  } catch (err) {
    results.errors!.push({ channel: 'whatsapp', err });
    console.error('Failed to send reward WhatsApp:', err);
  }

  return results;
}
