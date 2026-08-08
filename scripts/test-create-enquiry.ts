import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  try {
    try {
      const e = await prisma.enquiry.create({
        data: {
          name: 'Test Submit',
          phone: '+919876543210',
          email: 'testsubmit@example.com',
          projectType: 'Residential',
          budget: '20 Lakh',
          location: 'Pune',
          message: 'This is a test message for submission.',
          source: 'CONTACT_PAGE',
          status: 'PENDING',
        },
      });
      console.log('Created enquiry via prisma.create', e.id);
      return;
    } catch (err: any) {
      console.error('prisma.create failed, attempting raw fallback:', err.code || err.message);
      // fallback
      const id = (globalThis as any).crypto?.randomUUID ? (globalThis as any).crypto.randomUUID() : `${Date.now()}-${Math.floor(Math.random()*100000)}`;
      await prisma.$executeRaw`
        INSERT INTO "Enquiry" ("id","name","phone","email","projectType","budget","location","message","source","serviceSlug","projectSlug","status","createdAt","updatedAt")
        VALUES (${id}, ${'Test Submit'}, ${'+919876543210'}, ${'testsubmit@example.com'}, ${'Residential'}, ${'20 Lakh'}, ${'Pune'}, ${'This is a test message for submission.'}, ${'CONTACT_PAGE'}::"EnquirySource", ${null}, ${null}, ${'PENDING'}::"EnquiryStatus", now(), now())`;
      console.log('Created enquiry via raw fallback', id);
    }
  } catch (err) {
    console.error('Error creating enquiry:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

run();
