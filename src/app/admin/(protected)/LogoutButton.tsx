"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { logoutAdmin } from "@/app/actions/auth";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => { await logoutAdmin(); router.push("/admin/login"); router.refresh(); }}
      className="flex items-center gap-2 text-sm text-concrete hover:text-gold"
    >
      <LogOut className="h-4 w-4" /> Log Out
    </button>
  );
}
