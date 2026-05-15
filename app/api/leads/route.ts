import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(leads);
}

export async function POST(req: NextRequest) {
  const { customerName, phone, device, issue, turns } = await req.json();

  if (!turns) {
    return NextResponse.json({ error: "No conversation data" }, { status: 400 });
  }

  const lead = await prisma.lead.create({
    data: {
      customerName: customerName?.trim() || null,
      phone: phone?.trim() || null,
      device: device?.trim() || null,
      issue: issue?.trim() || null,
      turns: JSON.stringify(turns),
    },
  });

  return NextResponse.json(lead);
}
