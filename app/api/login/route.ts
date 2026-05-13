import { NextRequest, NextResponse } from "next/server";
import { makeSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { password, verifyOnly } = body as { password?: string; verifyOnly?: boolean };

  const dbPassword = await prisma.setting.findUnique({ where: { key: "app_password" } });
  const correctPassword = dbPassword?.value ?? process.env.APP_PASSWORD;

  if (!password || password !== correctPassword) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  if (verifyOnly) {
    return NextResponse.json({ ok: true });
  }

  const response = NextResponse.redirect(new URL("/", request.url));
  response.headers.set("Set-Cookie", await makeSessionCookie());
  return response;
}
