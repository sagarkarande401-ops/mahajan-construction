"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/app/actions/auth";
import { Label, Input } from "@/components/ui/form-fields";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await loginAdmin({
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
    });
    setLoading(false);
    if (!result.success) { setError(result.error || "Login failed."); return; }
    router.push("/admin/dashboard");
    router.refresh();
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-canvas px-6 dark:bg-canvas-dark">
      <div className="w-full max-w-sm">
        <span className="eyebrow">Admin</span>
        <h1 className="mt-3 font-display text-3xl text-ink dark:text-canvas">Studio Login</h1>
        <p className="mt-2 text-sm text-concrete">Sign in to manage enquiries, projects, and content.</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center bg-ink text-sm text-canvas transition-colors hover:bg-gold hover:text-ink disabled:opacity-60 dark:bg-canvas dark:text-ink"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="mt-6 text-xs text-concrete">
          No account yet? Create one by running <code className="font-mono">npm run db:seed</code> — see README.
        </p>
      </div>
    </section>
  );
}

