import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = Promise<{ leadId: string }>;

export async function DELETE(_req: NextRequest, { params }: { params: Params }) {
  const { leadId } = await params;
  await prisma.lead.delete({ where: { id: leadId } });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  const { leadId } = await params;
  const { status } = await req.json();
  const lead = await prisma.lead.update({
    where: { id: leadId },
    data: { status },
  });
  return NextResponse.json(lead);
}
