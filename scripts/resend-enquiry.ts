import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { sendEnquiryEmails } from '../src/lib/email';

const prisma = new PrismaClient();

async function run() {
  const id = process.argv[2] || process.env.ENQUIRY_ID;
  if (!id) {
    console.error('Usage: tsx scripts/resend-enquiry.ts <enquiryId>  OR set ENQUIRY_ID env var');
    process.exit(1);
  }

  try {
    const enquiry = await prisma.enquiry.findUnique({ where: { id } });
    if (!enquiry) {
      console.error('Enquiry not found:', id);
      process.exit(1);
    }

    const res = await sendEnquiryEmails({
      name: enquiry.name,
      phone: enquiry.phone,
      email: enquiry.email,
      projectType: enquiry.projectType || undefined,
      budget: enquiry.budget || undefined,
      location: enquiry.location || undefined,
      message: enquiry.message,
      source: enquiry.source as string,
    });

    console.log('Resend result:', res);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

run();
