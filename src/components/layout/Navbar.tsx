"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Moon, Sun, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/layout/ThemeProvider";

interface NavLink { href: string; label: string; children?: { href: string; label: string }[]; }

const navLinks: NavLink[] = [
  {
    href: "/about", label: "About",
    children: [
      { href: "/about/our-story", label: "Our Story" },
      { href: "/about/founder", label: "Founder" },
      { href: "/about/vision", label: "Vision" },
      { href: "/about/team", label: "Team" },
    ],
  },
  {
    href: "/services", label: "Services",
    children: [
      { href: "/services/architecture-design", label: "Architecture" },
      { href: "/services/construction", label: "Construction" },
      { href: "/services/interior-design", label: "Interior" },
      { href: "/services/planning", label: "Planning" },
      { href: "/services/turnkey-projects", label: "Turnkey" },
      { href: "/services/renovation", label: "Renovation" },
    ],
  },
  {
    href: "/projects", label: "Projects",
    children: [
      { href: "/projects/residential", label: "Residential" },
      { href: "/projects/commercial", label: "Commercial" },
      { href: "/projects/interior", label: "Interior" },
      { href: "/projects/farm-house", label: "Farm House" },
      { href: "/projects/villa", label: "Villa" },
    ],
  },
  {
    href: "/gallery", label: "Gallery",
    children: [
      { href: "/gallery/photos", label: "Photos" },
      { href: "/gallery/videos", label: "Videos" },
      { href: "/gallery/before-after", label: "Before / After" },
    ],
  },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileSubOpen, setMobileSubOpen] = useState<string | null>(null);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); setMobileSubOpen(null); }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-luxury",
          scrolled ? "border-b border-line bg-canvas/80 backdrop-blur-md dark:border-line-dark dark:bg-canvas-dark/80" : "bg-transparent"
        )}
      >
        <div className="container-px mx-auto flex h-20 items-center justify-between">
          <Link href="/" className="flex flex-col leading-none">
            <span className="font-display text-lg tracking-tight text-ink dark:text-canvas">Mahajan</span>
            <span className="eyebrow !text-[9px] text-concrete">Construction</span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <div key={link.href} className="group relative">
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1 text-sm tracking-wide text-ink/80 transition-colors hover:text-gold dark:text-canvas/80",
                    pathname.startsWith(link.href) && "text-gold"
                  )}
                >
                  {link.label}
                  {link.children && <ChevronDown className="h-3 w-3 transition-transform duration-300 group-hover:rotate-180" />}
                </Link>
                {link.children && (
                  <div className="invisible absolute left-0 top-full min-w-[200px] translate-y-2 border border-line bg-canvas opacity-0 shadow-xl transition-all duration-300 ease-luxury group-hover:visible group-hover:translate-y-1 group-hover:opacity-100 dark:border-line-dark dark:bg-canvas-dark">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block border-b border-line px-5 py-3 text-sm text-ink/80 last:border-0 hover:bg-beige-soft hover:text-gold dark:border-line-dark dark:text-canvas/80 dark:hover:bg-ink-soft"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              aria-label="Toggle dark mode"
              onClick={toggleTheme}
              className="hidden h-10 w-10 items-center justify-center border border-ink/15 text-ink transition-colors hover:border-gold hover:text-gold dark:border-canvas/20 dark:text-canvas sm:flex"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link
              href="/contact"
              className="hidden h-11 items-center border border-ink px-6 text-sm tracking-wide text-ink transition-all duration-500 hover:bg-ink hover:text-canvas dark:border-canvas dark:text-canvas dark:hover:bg-canvas dark:hover:text-ink lg:flex"
            >
              Book Consultation
            </Link>
            <button
              aria-label="Toggle menu"
              onClick={() => setOpen((o) => !o)}
              className="flex h-10 w-10 items-center justify-center text-ink dark:text-canvas lg:hidden"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-20 z-40 max-h-[calc(100vh-80px)] overflow-y-auto border-b border-line bg-canvas dark:border-line-dark dark:bg-canvas-dark lg:hidden"
          >
            <nav className="container-px mx-auto flex flex-col gap-1 py-6">
              {navLinks.map((link) => (
                <div key={link.href} className="border-b border-line dark:border-line-dark">
                  <div className="flex items-center justify-between py-4">
                    <Link href={link.href} className="font-display text-2xl text-ink dark:text-canvas">
                      {link.label}
                    </Link>
                    {link.children && (
                      <button
                        onClick={() => setMobileSubOpen(mobileSubOpen === link.href ? null : link.href)}
                        aria-label={`Toggle ${link.label} submenu`}
                        className="p-2 text-ink dark:text-canvas"
                      >
                        <ChevronDown className={cn("h-5 w-5 transition-transform duration-300", mobileSubOpen === link.href && "rotate-180")} />
                      </button>
                    )}
                  </div>
                  <AnimatePresence initial={false}>
                    {link.children && mobileSubOpen === link.href && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden pl-4"
                      >
                        {link.children.map((child) => (
                          <Link key={child.href} href={child.href} className="block py-3 text-concrete">
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              <Link
                href="/contact"
                className="mt-6 flex h-12 items-center justify-center bg-ink text-canvas dark:bg-canvas dark:text-ink"
              >
                Book Consultation
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
