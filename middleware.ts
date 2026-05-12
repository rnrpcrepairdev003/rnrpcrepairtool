import { NextRequest, NextResponse } from "next/server";
import { isValidSession } from "@/lib/auth";

const PUBLIC_PATHS = ["/login", "/api/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieHeader = request.headers.get("cookie");
  const authenticated = await isValidSession(cookieHeader);

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  if (!isPublic && !authenticated) {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  if (pathname === "/login" && authenticated) {
    const res = NextResponse.redirect(new URL("/", request.url));
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  const res = NextResponse.next();
  if (!isPublic) {
    res.headers.set("Cache-Control", "no-store");
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
