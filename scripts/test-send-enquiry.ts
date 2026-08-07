import 'dotenv/config';
import { sendEnquiryEmails } from '../src/lib/email';

async function run() {
  try {
    console.log('Running test sendEnquiryEmails...');
    const res = await sendEnquiryEmails({
      name: 'Test User',
      phone: '+917028187271',
      email: 'sagarkarande401@gmail.com',
      projectType: 'Test Project',
      budget: 'Test Budget',
      location: 'Test Location',
      message: 'This is a test enquiry sent by the automated tester.',
      source: 'CONTACT_PAGE',
    });
    console.log('sendEnquiryEmails result:', res);
  } catch (err) {
    console.error('Test send failed:', err);
    process.exit(1);
  }
}

run();
