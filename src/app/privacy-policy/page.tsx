import type { Metadata } from "next";
import { siteConfig } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${siteConfig.name} — how we collect, use, and protect your information.`,
};

const sections = [
  {
    title: "Information We Collect",
    body: "When you submit our contact form, book a consultation, or message us via WhatsApp, phone, or email, we collect the information you provide directly — including your name, phone number, email address, project details, and any files or images you choose to share.",
  },
  {
    title: "How We Use Your Information",
    body: "We use the information you provide solely to respond to your enquiry, prepare project estimates, schedule site visits, and communicate about your project. We do not sell, rent, or trade your personal information to third parties.",
  },
  {
    title: "Communication",
    body: "By submitting an enquiry, you consent to being contacted by Mahajan Construction via phone, WhatsApp, or email regarding your project. You may opt out of further communication at any time by informing us directly.",
  },
  {
    title: "Data Storage & Security",
    body: "Information submitted through this website is stored securely and accessed only by authorised members of the Mahajan Construction team for the purpose of responding to your enquiry.",
  },
  {
    title: "Cookies & Analytics",
    body: "This website may use standard analytics tools to understand aggregate visitor behaviour (such as which pages are visited) to improve site performance. This data is anonymised and not linked to your personal identity.",
  },
  {
    title: "Third-Party Links",
    body: "Our website may link to third-party services such as Google Maps or WhatsApp. We are not responsible for the privacy practices of these external platforms.",
  },
  {
    title: "Your Rights",
    body: "You may request access to, correction of, or deletion of your personal information held by us at any time by emailing us at " + siteConfig.email + ".",
  },
  {
    title: "Changes to This Policy",
    body: "We may update this Privacy Policy periodically. Continued use of this website after changes are posted constitutes acceptance of the revised policy.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <section className="container-px mx-auto pb-24 pt-40 md:pb-32">
      <span className="eyebrow">Legal</span>
      <h1 className="mt-6 text-balance text-display-2 font-display font-normal text-ink dark:text-canvas">Privacy Policy</h1>
      <p className="mt-4 coord-tag">Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>

      <div className="mt-14 max-w-2xl space-y-10">
        {sections.map((section, i) => (
          <div key={section.title} className="border-t border-line pt-6 dark:border-line-dark">
            <span className="font-mono text-xs text-gold">{String(i + 1).padStart(2, "0")}</span>
            <h2 className="mt-2 font-display text-xl text-ink dark:text-canvas">{section.title}</h2>
            <p className="mt-3 leading-relaxed text-concrete">{section.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
