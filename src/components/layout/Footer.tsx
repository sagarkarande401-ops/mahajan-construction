import Link from "next/link";
import { Instagram, Facebook, Linkedin, ArrowUpRight } from "lucide-react";
import { siteConfig, formatCoordinates } from "@/lib/utils";

const columns = [
  {
    title: "Studio",
    links: [
      { href: "/about", label: "About" },
      { href: "/process", label: "Process" },
      { href: "/gallery", label: "Gallery" },
      { href: "/testimonials", label: "Testimonials" },
    ],
  },
  {
    title: "Work",
    links: [
      { href: "/projects", label: "Projects" },
      { href: "/services", label: "Services" },
      { href: "/blog", label: "Journal" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-canvas dark:border-line-dark">
      <div className="container-px mx-auto py-20">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <h3 className="font-display text-3xl">Mahajan Construction</h3>
            <p className="coord-tag mt-2 !text-canvas/40">{formatCoordinates(siteConfig.coordinates.lat, siteConfig.coordinates.lng)} — Ashta, Maharashtra</p>
            <p className="mt-6 max-w-xs text-canvas/60">
              Architecture, construction, and interiors delivered as one accountable scope — {siteConfig.experience} building premium spaces across Maharashtra.
            </p>
            <div className="mt-8 flex gap-4">
              {[Instagram, Facebook, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href={Object.values(siteConfig.social)[i]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center border border-canvas/20 transition-colors hover:border-gold hover:text-gold"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <span className="eyebrow">{col.title}</span>
              <ul className="mt-6 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-canvas/70 transition-colors hover:text-gold">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-canvas/10 pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1 text-sm text-canvas/60 md:flex-row md:gap-6">
            <a href={`mailto:${siteConfig.email}`} className="hover:text-gold">{siteConfig.email}</a>
            <a href={`tel:${siteConfig.phone}`} className="hover:text-gold">{siteConfig.phoneDisplay}</a>
            <span>{siteConfig.address}</span>
          </div>
          <p className="text-xs text-canvas/40">© {new Date().getFullYear()} Mahajan Construction. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
