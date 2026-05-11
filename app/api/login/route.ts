import { NextRequest, NextResponse } from "next/server";
import { makeSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { password } = body as { password?: string };

  if (!password || password !== process.env.APP_PASSWORD) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const response = NextResponse.redirect(new URL("/", request.url));
  response.headers.set("Set-Cookie", makeSessionCookie());
  return response;
}
