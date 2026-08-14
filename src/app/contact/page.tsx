import type { Metadata } from "next";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { siteConfig, formatCoordinates } from "@/lib/utils";
// import { EnquiryForm } from "@/components/shared/EnquiryForm";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

export const metadata: Metadata = {
  title: "Contact",
  description: `Book a free consultation with Mahajan Construction in Ashta, Maharashtra. Call, WhatsApp, or email ${siteConfig.email} to start your project.`,
};

const contactMethods = [
  { icon: Phone, label: "Call", value: siteConfig.phoneDisplay, href: `tel:${siteConfig.phone}` },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: siteConfig.phoneDisplay,
    href: `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent("Hi Mahajan Construction, I'd like to discuss a project.")}`,
  },
  { icon: Mail, label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
  { icon: MapPin, label: "Office", value: siteConfig.address, href: undefined },
];

export default function ContactPage() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent("Ashta, Sangli, Maharashtra")}&output=embed`;

  return (
    <>
      <section className="container-px mx-auto pb-24 pt-16 md:pb-32 md:pt-20">
        <span className="eyebrow">Contact</span>
        <h1 className="mt-6 max-w-3xl text-balance text-display-1 font-display font-normal text-ink dark:text-canvas">
          Let&rsquo;s talk about your plot.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-concrete">
          The first consultation is free — call, message on WhatsApp, or fill the form and we&rsquo;ll respond within one business day.
        </p>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="container-px mx-auto grid grid-cols-1 gap-16 lg:grid-cols-2">
          <RevealOnScroll>
            <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {contactMethods.map((method) => {
                const Content = (
                  <div className="border border-line p-6 transition-colors duration-300 hover:border-gold dark:border-line-dark">
                    <method.icon className="h-5 w-5 text-gold" strokeWidth={1.5} />
                    <p className="eyebrow mt-4">{method.label}</p>
                    <p className="mt-1 text-sm text-ink dark:text-canvas">{method.value}</p>
                  </div>
                );
                return method.href ? (
                  <a key={method.label} href={method.href} target={method.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                    {Content}
                  </a>
                ) : (
                  <div key={method.label}>{Content}</div>
                );
              })}
            </div>
            {/* <EnquiryForm source="CONTACT_PAGE" /> */}
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <div className="sticky top-28">
              <p className="coord-tag mb-3">{formatCoordinates(siteConfig.coordinates.lat, siteConfig.coordinates.lng)}</p>
              <div className="aspect-[4/5] w-full overflow-hidden border border-line grayscale transition-all duration-700 hover:grayscale-0 dark:border-line-dark">
                <iframe
                  src={mapSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mahajan Construction office location — Ashta, Maharashtra"
                />
              </div>
              <p className="mt-4 text-sm text-concrete">
                {siteConfig.address} — site visits by appointment, Monday to Saturday, 10 AM – 7 PM.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}

