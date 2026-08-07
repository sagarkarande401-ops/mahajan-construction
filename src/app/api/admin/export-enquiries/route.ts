import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  // Extra defense-in-depth check even though middleware already protects /admin/*
  // (this route lives under /api, which middleware's matcher doesn't cover).
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const enquiries = await prisma.enquiry.findMany({ orderBy: { createdAt: "desc" } });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Enquiries");

  sheet.columns = [
    { header: "Date", key: "date", width: 14 },
    { header: "Name", key: "name", width: 22 },
    { header: "Phone", key: "phone", width: 16 },
    { header: "Email", key: "email", width: 26 },
    { header: "Project Type", key: "projectType", width: 18 },
    { header: "Budget", key: "budget", width: 16 },
    { header: "Location", key: "location", width: 20 },
    { header: "Message", key: "message", width: 40 },
    { header: "Status", key: "status", width: 16 },
    { header: "Source", key: "source", width: 16 },
  ];
  sheet.getRow(1).font = { bold: true };

  enquiries.forEach((e) => {
    sheet.addRow({
      date: e.createdAt.toLocaleDateString("en-IN"),
      name: e.name, phone: e.phone, email: e.email,
      projectType: e.projectType || "", budget: e.budget || "", location: e.location || "",
      message: e.message, status: e.status, source: e.source,
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="enquiries-${new Date().toISOString().split("T")[0]}.xlsx"`,
    },
  });
}

