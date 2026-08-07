import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
 // ---------- Admin user ----------
 // Change this password immediately after first login — see README.
 const adminEmail = process.env.SEED_ADMIN_EMAIL || "saishmahajan5555@gmail.com";
 const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Saish@123";
 const passwordHash = await bcrypt.hash(adminPassword, 10);

 await prisma.adminUser.upsert({
   where: { email: adminEmail },
   update: { passwordHash },
   create: { email: adminEmail, passwordHash, name: "Saish Mahajan" },
 });

 console.log(`Admin user ready: ${adminEmail} (password: ${adminPassword} — change this after first login)`);

 // ---------- Site stats ----------
 await prisma.siteStat.upsert({
   where: { key: "projects_delivered" },
   update: {},
   create: { key: "projects_delivered", label: "Projects Delivered", value: 40, suffix: "+" },
 });
 await prisma.siteStat.upsert({
   where: { key: "cities_served" },
   update: {},
   create: { key: "cities_served", label: "Cities & Towns Served", value: 18, suffix: "" },
 });

 console.log("Seed complete.");
}

main()
 .catch((e) => { console.error(e); process.exit(1); })
 .finally(async () => { await prisma.$disconnect(); });
