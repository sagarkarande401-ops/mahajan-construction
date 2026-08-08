import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Inbox, Briefcase, Layers, Star } from "lucide-react";

export default async function AdminDashboardPage() {
  const now = new Date();
  const totalLeadsPromise = prisma.enquiry.count();
  const newLeadsPromise = (async () => {
    try {
      return await prisma.enquiry.count({ where: { OR: [{ status: 'NEW' }, { status: 'PENDING' }] } });
    } catch (err: any) {
      // If DB enum doesn't include NEW yet, fall back to counting PENDING only
      if (err && (err.code === 'P2022' || err.message?.includes('invalid input value for enum'))) {
        return await prisma.enquiry.count({ where: { status: 'PENDING' } });
      }
      throw err;
    }
  })();
  // followUpDate may not exist in the DB yet (migration not applied). Attempt count and fallback to 0 on known Prisma error.
  const pendingFollowUpsPromise = (async () => {
    try {
      return await prisma.enquiry.count({ where: { followUpDate: { not: null, lte: now } } });
    } catch (err: any) {
      // If the column doesn't exist yet, return 0 so build doesn't fail.
      if (err && err.code === 'P2022') return 0;
      throw err;
    }
  })();
  const totalProjectsPromise = prisma.project.count();
  const totalServicesPromise = prisma.service.count();
  const totalTestimonialsPromise = prisma.testimonial.count();
  const recentLeadsPromise = (async () => {
    try {
      return await prisma.enquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5 });
    } catch (err: any) {
      if (err && err.code === 'P2022') {
        return await prisma.enquiry.findMany({ select: { id: true, name: true, createdAt: true, projectType: true, status: true }, orderBy: { createdAt: 'desc' }, take: 5 });
      }
      throw err;
    }
  })();

  const [totalLeads, newLeads, pendingFollowUps, totalProjects, totalServices, totalTestimonials, recentLeads] = await Promise.all([
    totalLeadsPromise,
    newLeadsPromise,
    pendingFollowUpsPromise,
    totalProjectsPromise,
    totalServicesPromise,
    totalTestimonialsPromise,
    recentLeadsPromise,
  ]);

  const cards = [
    { label: "Total Leads", value: totalLeads, icon: Inbox, href: "/admin/enquiries" },
    { label: "New Leads", value: newLeads, icon: Inbox, href: "/admin/enquiries?status=NEW" },
    { label: "Pending Follow-ups", value: pendingFollowUps, icon: Inbox, href: "/admin/enquiries?filter=followups" },
    { label: "Published Projects", value: totalProjects, icon: Briefcase, href: "/admin/projects" },
    { label: "Active Services", value: totalServices, icon: Layers, href: "/admin/services" },
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
              {recentLeads.map((e) => (
                <tr key={e.id} className="border-b border-line dark:border-line-dark">
                  <td className="py-3 pr-4 text-concrete">{new Date(e.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</td>
                  <td className="py-3 pr-4 text-ink dark:text-canvas">{e.name}</td>
                  <td className="py-3 pr-4 text-concrete">{e.projectType || "—"}</td>
                  <td className="py-3 pr-4 text-concrete">{e.status}</td>
                </tr>
              ))}
              {recentLeads.length === 0 && (
                <tr><td colSpan={4} className="py-6 text-concrete">No enquiries yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

