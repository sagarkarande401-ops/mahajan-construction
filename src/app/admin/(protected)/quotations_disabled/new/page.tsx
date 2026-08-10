import { QuotationForm } from "../QuotationForm";

type PageProps = {
  searchParams?: Promise<{
    enquiryId?: string;
    clientName?: string;
    projectType?: string;
    location?: string;
    phone?: string;
  }>;
};

export default async function NewQuotationPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  const prefill = {
    enquiryId: params?.enquiryId,
    clientName: params?.clientName,
    projectType: params?.projectType,
    location: params?.location,
    phone: params?.phone,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Create New Quotation</h1>
      </div>

      <div className="mt-8">
        <QuotationForm prefill={prefill} />
      </div>
    </div>
  );
}