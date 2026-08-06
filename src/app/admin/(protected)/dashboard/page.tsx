import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Inbox, Briefcase, Layers, Star } from "lucide-react";

export default async function AdminDashboardPage() {
  const [totalEnquiries, pendingEnquiries, totalProjects, totalServices, totalTestimonials, recentEnquiries] = await Promise.all([
    prisma.enquiry.count(),
    prisma.enquiry.count({ where: { status: "PENDING" } }),
    prisma.project.count(),
    prisma.service.count(),
    prisma.testimonial.count(),
    prisma.enquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const cards = [
    { label: "Total Enquiries", value: totalEnquiries, icon: Inbox, href: "/admin/enquiries" },
    { label: "Pending Follow-up", value: pendingEnquiries, icon: Inbox, href: "/admin/enquiries?status=PENDING" },
    { label: "Published Projects", value: totalProjects, icon: Briefcase, href: "/admin/projects" },
    { label: "Active Services", value: totalServices, icon: Layers, href: "/admin/services" },
    { label: "Testimonials", value: totalTestimonials, icon: Star, href: "/admin/testimonials" },
  ];

  return (
    <div className="p-6 md:p-10">
      <span className="eyebrow">Overview</span>
      <h1 className="mt-2 font-display text-3xl text-ink dark:text-canvas">Dashboard</h1>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="border border-line p-6 transition-colors hover:border-gold dark:border-line-dark">
            <card.icon className="h-5 w-5 text-gold" strokeWidth={1.5} />
            <p className="mt-4 font-display text-3xl text-ink dark:text-canvas">{card.value}</p>
            <p className="eyebrow mt-2 !text-concrete">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-ink dark:text-canvas">Recent Enquiries</h2>
          <Link href="/admin/enquiries" className="text-sm text-gold hover:underline">View all →</Link>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line text-left text-concrete dark:border-line-dark">
                <th className="py-3 pr-4 font-normal">Date</th>
                <th className="py-3 pr-4 font-normal">Name</th>
                <th className="py-3 pr-4 font-normal">Project</th>
                <th className="py-3 pr-4 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentEnquiries.map((e) => (
                <tr key={e.id} className="border-b border-line dark:border-line-dark">
                  <td className="py-3 pr-4 text-concrete">{new Date(e.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</td>
                  <td className="py-3 pr-4 text-ink dark:text-canvas">{e.name}</td>
                  <td className="py-3 pr-4 text-concrete">{e.projectType || "—"}</td>
                  <td className="py-3 pr-4 text-concrete">{e.status}</td>
                </tr>
              ))}
              {recentEnquiries.length === 0 && (
                <tr><td colSpan={4} className="py-6 text-concrete">No enquiries yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
