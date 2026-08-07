import { EnquiryForm } from "@/components/shared/EnquiryForm";

export default function BookConsultationPage() {
  return (
    <section className="container-px mx-auto py-24">
      <h1 className="mb-8 text-4xl font-display">
        Book Consultation
      </h1>

      <EnquiryForm source="BOOK_CONSULTATION" />
    </section>
  );
}