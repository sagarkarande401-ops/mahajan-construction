import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DeleteButton } from "../DeleteButton";
import { deleteService } from "@/app/actions/admin-services";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between">
        <div>
          <span className="eyebrow">Manage</span>
          <h1 className="mt-2 font-display text-3xl text-ink dark:text-canvas">Services</h1>
        </div>
        <Link href="/admin/services/new" className="flex items-center gap-2 bg-ink px-5 py-3 text-sm text-canvas dark:bg-canvas dark:text-ink">
          <Plus className="h-4 w-4" /> Add Service
        </Link>
      </div>

      <div className="mt-8 divide-y divide-line dark:divide-line-dark">
        {services.map((s) => (
          <div key={s.id} className="flex items-center justify-between py-4">
            <div>
              <h3 className="font-display text-lg text-ink dark:text-canvas">{s.name}</h3>
              <p className="text-sm text-concrete">{s.shortDescription}</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              {!s.published && <span className="text-xs uppercase text-red-600">Draft</span>}
              <Link href={`/admin/services/${s.id}`} className="text-gold hover:underline">Edit</Link>
              <DeleteButton id={s.id} name={s.name} action={deleteService} />
            </div>
          </div>
        ))}
        {services.length === 0 && <p className="py-10 text-concrete">No services yet — add your first one.</p>}
      </div>
    </div>
  );
}
