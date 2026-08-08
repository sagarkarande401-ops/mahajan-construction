"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { logoutAdmin } from "@/app/actions/auth";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => { await logoutAdmin(); router.push("/admin/login"); router.refresh(); }}
      className="w-full flex items-center gap-2 text-sm text-concrete hover:text-gold"
      aria-label="Log out"
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden sm:inline">Log Out</span>
    </button>
  );
}
