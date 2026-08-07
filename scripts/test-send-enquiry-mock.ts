import 'dotenv/config';
import { sendEnquiryEmails } from '../src/lib/email';

async function run() {
  const mockResend = {
    emails: {
      send: async (opts: any) => {
        console.log('[mock] resend.emails.send called with:');
        console.log('  to:', opts.to);
        console.log('  subject:', opts.subject);
        console.log('  from:', opts.from);
        console.log('  text (first 200 chars):', (opts.text || '').toString().slice(0, 200));
        // return shape similar to Resend SDK (some endpoints return { data: { id: '...' } })
        return { data: { id: 'mock-id-123', status: 'queued' } };
      }
    }
  };

  const sample = {
    name: 'Test User',
    phone: '+919876543210',
    email: 'test@example.com',
    projectType: 'Residential',
    budget: '₹20L - ₹50L',
    location: 'Pune',
    message: 'This is a mock enquiry for testing Resend flow.',
    source: 'MOCK_TEST',
  };

  try {
    const res = await sendEnquiryEmails(sample as any, mockResend as any);
    console.log('sendEnquiryEmails (mock) result:', res);
  } catch (err) {
    console.error('Mock test failed:', err);
    process.exitCode = 1;
  }
}

run();
