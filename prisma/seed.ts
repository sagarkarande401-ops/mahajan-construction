import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ---------- Admin user ----------
  // Change this password immediately after first login — see README.
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "saismahajan5555@gmail.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash, name: "Saish Mahajan" },
  });
  console.log(`Admin user ready: ${adminEmail} (password: ${adminPassword} — change this after first login)`);

  // ---------- Site stats ----------
  await prisma.siteStat.upsert({ where: { key: "experience_years" }, update: {}, create: { key: "experience_years", label: "Years in Practice", value: 3, suffix: "+" } });
  await prisma.siteStat.upsert({ where: { key: "projects_delivered" }, update: {}, create: { key: "projects_delivered", label: "Projects Delivered", value: 40, suffix: "+" } });
  await prisma.siteStat.upsert({ where: { key: "cities_served" }, update: {}, create: { key: "cities_served", label: "Cities & Towns Served", value: 18, suffix: "" } });

  // ---------- Services ----------
  const services = [
    { slug: "architecture-design", name: "Architecture Design", icon: "compass", order: 1,
      shortDescription: "Site-specific design rooted in light, climate, and how you actually live.",
      description: "Every drawing starts with the plot — its orientation, its neighbours, the way the sun moves across it. We design homes and commercial spaces that respond to the site rather than sit on top of it.",
      features: ["Concept & schematic design", "Structural coordination", "Facade & material planning", "Statutory drawing sets"] },
    { slug: "construction", name: "Construction", icon: "hard-hat", order: 2,
      shortDescription: "Execution with the same discipline as the drawing set.",
      description: "We run construction the way we run design — measured, sequenced, and accountable. Our site teams work off approved drawings with weekly quality checkpoints.",
      features: ["RCC & structural work", "Quality-checked material sourcing", "Skilled labour management", "Weekly progress reporting"] },
    { slug: "interior-design", name: "Interior Design", icon: "sofa", order: 3,
      shortDescription: "Interiors that finish the architecture, not decorate over it.",
      description: "Interior design begins on the same drawing board as the architecture — not after handover. We design joinery, lighting, and material palettes that continue the building's logic.",
      features: ["Space planning", "Custom joinery & furniture", "Lighting design", "Material & finish curation"] },
    { slug: "planning", name: "Planning", icon: "ruler", order: 4,
      shortDescription: "Approvals, layouts, and land-use strategy sorted before ground breaks.",
      description: "From plot layout and FSI calculations to municipal approvals, we handle the planning groundwork so your project starts on solid, compliant footing.",
      features: ["Layout & zoning strategy", "FSI & setback optimisation", "Municipal approvals", "Feasibility studies"] },
    { slug: "turnkey-projects", name: "Turnkey Projects", icon: "key", order: 5,
      shortDescription: "One contract, one team, one number — from plot to move-in.",
      description: "Design, construction, interiors, and handover managed under a single scope and a single point of contact.",
      features: ["Single-point accountability", "Fixed-scope contracting", "Design-to-handover timeline", "Post-handover support"] },
    { slug: "renovation", name: "Renovation", icon: "hammer", order: 6,
      shortDescription: "Structural and cosmetic renewal without losing what already works.",
      description: "We assess existing structures honestly, then execute renovations that upgrade a property without the waste of a full rebuild.",
      features: ["Structural assessment", "Facade & interior upgrades", "Retrofitting & waterproofing", "Phase-wise execution for occupied sites"] },
  ];

  for (const s of services) {
    const service = await prisma.service.upsert({ where: { slug: s.slug }, update: {}, create: s });
    await prisma.serviceProcessStep.createMany({
      data: [
        { serviceId: service.id, order: 1, title: "Consultation", description: "Understand your brief and site." },
        { serviceId: service.id, order: 2, title: "Proposal", description: "Scope, timeline, and cost estimate." },
        { serviceId: service.id, order: 3, title: "Delivery", description: "Execution with weekly reporting." },
      ],
      skipDuplicates: true,
    });
  }

  // ---------- Sample project (so pages aren't empty before real photos arrive) ----------
  await prisma.project.upsert({
    where: { slug: "sample-ashta-residence" },
    update: {},
    create: {
      slug: "sample-ashta-residence",
      name: "Sample Project — Replace With Your Real Project",
      category: "RESIDENTIAL",
      projectType: "Private Bungalow",
      location: "Ashta, Maharashtra",
      area: "4,200 sq.ft",
      timeline: "11 months",
      year: "2025",
      status: "COMPLETED",
      description: "This is placeholder content — edit or delete this project from the admin panel once your real projects are uploaded.",
      highlights: ["Replace this with real project highlights"],
      featured: true,
      published: true,
    },
  });

  // ---------- FAQs ----------
  const faqs = [
    { category: "General", question: "What areas does Mahajan Construction serve?", answer: "We're based in Ashta, Maharashtra and serve Ashta, Sangli, Miraj, Kirloskarwadi, and surrounding districts.", order: 1 },
    { category: "Process", question: "How long does a typical residential project take?", answer: "A custom bungalow typically takes 10–14 months from foundation to handover, depending on complexity.", order: 2 },
    { category: "Pricing", question: "Is a consultation or site visit chargeable?", answer: "The first consultation and site visit are complimentary.", order: 3 },
  ];
  for (const f of faqs) await prisma.faq.create({ data: f }).catch(() => {});

  console.log("Seed complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
