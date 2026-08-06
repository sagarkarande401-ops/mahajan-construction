"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, AlertCircle, MessageCircle } from "lucide-react";
import { Label, Input, Textarea } from "@/components/ui/form-fields";
import { submitEnquiry } from "@/app/actions/enquiries";
import { siteConfig } from "@/lib/utils";

const projectTypes = ["Residential", "Commercial", "Interior Design", "Renovation", "Turnkey Project", "Other"];

interface EnquiryFormProps {
  source?: "CONTACT_PAGE" | "SERVICE_PAGE" | "PROJECT_PAGE";
  serviceSlug?: string;
  projectSlug?: string;
  /** Pre-fills the message field, e.g. "I'd like to enquire about Architecture Design." */
  defaultMessage?: string;
  compact?: boolean;
}

export function EnquiryForm({ source = "CONTACT_PAGE", serviceSlug, projectSlug, defaultMessage, compact }: EnquiryFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [whatsappMessage, setWhatsappMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      projectType: String(formData.get("projectType") || ""),
      budget: String(formData.get("budget") || "").trim(),
      location: String(formData.get("location") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      source,
      serviceSlug,
      projectSlug,
    };

    setStatus("loading");
    setErrors({});
    const result = await submitEnquiry(payload);

    if (!result.success) {
      setErrors(result.fieldErrors as Record<string, string> || {});
      setStatus("error");
      return;
    }

    setWhatsappMessage(result.whatsappMessage || "");
    setStatus("success");
    form.reset();
  };

  if (status === "success") {
    const waHref = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-start gap-4 border border-line p-10 dark:border-line-dark"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold">
          <Check className="h-6 w-6" />
        </span>
        <h3 className="font-display text-2xl text-ink dark:text-canvas">Message received.</h3>
        <p className="text-concrete">
          Thank you for reaching out. A confirmation has been sent to your email, and our team will contact you within 24 hours.
        </p>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex h-12 items-center gap-2 bg-[#25D366] px-6 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <MessageCircle className="h-4 w-4" /> Also Send on WhatsApp
        </a>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-7">
      {status === "error" && errors && Object.keys(errors).length === 0 && (
        <div className="flex items-center gap-3 border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Something went wrong. Please try again, or reach us directly on WhatsApp / phone.
        </div>
      )}
      <div className={compact ? "space-y-7" : "grid grid-cols-1 gap-7 md:grid-cols-2"}>
        <div>
          <Label htmlFor={`name-${source}`}>Full Name</Label>
          <Input id={`name-${source}`} name="name" placeholder="Your name" />
          {errors.name && <p className="mt-2 text-xs text-red-600">{errors.name}</p>}
        </div>
        <div>
          <Label htmlFor={`phone-${source}`}>Phone Number</Label>
          <Input id={`phone-${source}`} name="phone" type="tel" placeholder="+91 00000 00000" />
          {errors.phone && <p className="mt-2 text-xs text-red-600">{errors.phone}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor={`email-${source}`}>Email Address</Label>
        <Input id={`email-${source}`} name="email" type="email" placeholder="you@example.com" />
        {errors.email && <p className="mt-2 text-xs text-red-600">{errors.email}</p>}
      </div>

      <div className={compact ? "space-y-7" : "grid grid-cols-1 gap-7 md:grid-cols-2"}>
        <div>
          <Label htmlFor={`projectType-${source}`}>Project Type</Label>
          <select
            id={`projectType-${source}`} name="projectType" defaultValue={serviceSlug ? undefined : "Residential"}
            className="w-full border-0 border-b border-line bg-transparent py-3 text-base text-ink focus:border-gold focus:outline-none dark:border-line-dark dark:text-canvas dark:[&>option]:bg-canvas-dark"
          >
            {projectTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor={`budget-${source}`}>Approximate Budget</Label>
          <Input id={`budget-${source}`} name="budget" placeholder="e.g. ₹40–60 Lakh" />
        </div>
      </div>

      <div>
        <Label htmlFor={`location-${source}`}>Project Location</Label>
        <Input id={`location-${source}`} name="location" placeholder="e.g. Ashta, Sangli" />
      </div>

      <div>
        <Label htmlFor={`message-${source}`}>Message</Label>
        <Textarea id={`message-${source}`} name="message" rows={4} defaultValue={defaultMessage} placeholder="Tell us about your project..." />
        {errors.message && <p className="mt-2 text-xs text-red-600">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="group flex h-14 items-center gap-3 bg-ink px-8 text-sm font-medium tracking-wide text-canvas transition-all duration-500 ease-luxury hover:bg-gold hover:text-ink disabled:opacity-60 dark:bg-canvas dark:text-ink"
      >
        {status === "loading" ? "Sending..." : "Send Enquiry"}
        {status !== "loading" && <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />}
      </button>
    </form>
  );
}
