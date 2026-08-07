export function normalizePhoneToE164(raw: string) {
  if (!raw) return null;
  const digits = raw.replace(/[^0-9+]/g, "");
  if (digits.startsWith("+")) return digits;
  // If it looks like a 10-digit Indian number, prefix +91
  if (/^\d{10}$/.test(digits)) return `+91${digits}`;
  // If it starts with 0 followed by 10 digits, strip leading 0 and prefix +91
  if (/^0\d{10}$/.test(digits)) return `+91${digits.slice(1)}`;
  // Fallback: return as-is (not E.164)
  return digits;
}

export async function sendWhatsAppText(toRaw: string, message: string) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) {
    console.warn('WHATSAPP_TOKEN or WHATSAPP_PHONE_NUMBER_ID not set — skipping WhatsApp send to', toRaw);
    return { success: false, reason: 'not_configured' };
  }

  const to = normalizePhoneToE164(toRaw);
  if (!to) return { success: false, reason: 'invalid_number' };

  const url = `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to.replace(/^\+/, ''), // WhatsApp Cloud API expects phone without '+'
        type: 'text',
        text: { body: message },
      }),
    });

    const json = await res.json();
    if (!res.ok) {
      console.error('WhatsApp API error:', json);
      return { success: false, reason: 'api_error', detail: json };
    }
    return { success: true, detail: json };
  } catch (err) {
    console.error('Failed to send WhatsApp message:', err);
    return { success: false, reason: 'request_failed', detail: String(err) };
  }
}
