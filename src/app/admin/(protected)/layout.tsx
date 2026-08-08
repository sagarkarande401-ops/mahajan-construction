import Link from "next/link";
import { LayoutDashboard, Inbox, Briefcase, Layers, Image as ImageIcon, Star, HelpCircle } from "lucide-react";
import { LogoutButton } from "./LogoutButton";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/projects", label: "Projects", icon: Briefcase },
  { href: "/admin/services", label: "Services", icon: Layers },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-canvas dark:bg-canvas-dark">
      <aside className="hidden w-64 shrink-0 border-r border-line dark:border-line-dark md:block">
        <div className="p-6">
          <Link href="/" className="font-display text-lg text-ink dark:text-canvas">Mahajan</Link>
          <p className="eyebrow mt-1 !text-[9px]">Admin Panel</p>
        </div>
        <nav className="px-3">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="flex items-center gap-3 rounded px-3 py-2.5 text-sm text-ink transition-colors hover:bg-beige-soft hover:text-gold dark:text-canvas dark:hover:bg-ink-soft">
              <link.icon className="h-4 w-4" /> {link.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-6 w-full px-6">
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden -mt-20">
        {/* Mobile admin header: shows logout on small screens and removes empty top space caused by global layout pt-20 */}
        <div className="md:hidden flex items-center justify-end p-4 border-b border-line dark:border-line-dark">
          <LogoutButton />
        </div>
        {children}
      </main>
    </div>
  );
}

