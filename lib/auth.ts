import { createHmac } from "crypto";

const COOKIE_NAME = "rnrpc_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function sign(value: string): string {
  const secret = process.env.AUTH_SECRET!;
  const hmac = createHmac("sha256", secret);
  hmac.update(value);
  return `${value}.${hmac.digest("hex")}`;
}

function verify(token: string): boolean {
  const parts = token.split(".");
  if (parts.length < 2) return false;
  const sig = parts.pop()!;
  const value = parts.join(".");
  const secret = process.env.AUTH_SECRET!;
  const hmac = createHmac("sha256", secret);
  hmac.update(value);
  return hmac.digest("hex") === sig;
}

export function makeSessionCookie(): string {
  const value = sign("authenticated");
  return `${COOKIE_NAME}=${encodeURIComponent(value)}; HttpOnly; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`;
}

export function isValidSession(cookieHeader: string | null): boolean {
  if (!cookieHeader) return false;
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [k, ...v] = c.trim().split("=");
      return [k, decodeURIComponent(v.join("="))];
    })
  );
  const token = cookies[COOKIE_NAME];
  if (!token) return false;
  return verify(token);
}
