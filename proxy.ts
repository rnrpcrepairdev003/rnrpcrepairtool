import { NextRequest, NextResponse } from "next/server";
import { isValidSession } from "@/lib/auth";

const PUBLIC_PATHS = ["/login", "/api/login"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieHeader = request.headers.get("cookie");
  const authenticated = isValidSession(cookieHeader);

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  // Unauthenticated user trying to access a protected route → login
  if (!isPublic && !authenticated) {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  // Authenticated user hitting /login → send to board
  if (pathname === "/login" && authenticated) {
    const res = NextResponse.redirect(new URL("/", request.url));
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  // Board responses must not be cached so logout + back never shows a stale page
  const res = NextResponse.next();
  if (!isPublic) {
    res.headers.set("Cache-Control", "no-store");
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
