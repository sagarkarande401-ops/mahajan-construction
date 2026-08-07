"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";
import { createAdminSession, destroyAdminSession } from "@/lib/auth";

export async function loginAdmin(raw: unknown): Promise<{ success: boolean; error?: string }> {
  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: "Please enter a valid email and password." };

  const { email, password } = parsed.data;
  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin) return { success: false, error: "Invalid email or password." };

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) return { success: false, error: "Invalid email or password." };

  await createAdminSession({ adminId: admin.id, email: admin.email, name: admin.name });
  return { success: true };
}

export async function logoutAdmin() {
  await destroyAdminSession();
}

