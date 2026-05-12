const COOKIE_NAME = "rnrpc_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function getKey(): Promise<CryptoKey> {
  const secret = process.env.AUTH_SECRET!;
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function sign(value: string): Promise<string> {
  const key = await getKey();
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return `${value}.${toHex(sig)}`;
}

async function verify(token: string): Promise<boolean> {
  const parts = token.split(".");
  if (parts.length < 2) return false;
  const sig = parts.pop()!;
  const value = parts.join(".");
  const key = await getKey();
  const expected = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return toHex(expected) === sig;
}

export async function makeSessionCookie(): Promise<string> {
  const value = await sign("authenticated");
  return `${COOKIE_NAME}=${encodeURIComponent(value)}; HttpOnly; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`;
}

export async function isValidSession(cookieHeader: string | null): Promise<boolean> {
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
