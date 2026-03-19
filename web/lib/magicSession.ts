import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "cmk_magic";
const MAX_AGE_DAYS = 7;

function getSecret(): string {
  const secret = process.env.MAGIC_SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("MAGIC_SESSION_SECRET must be set and at least 16 characters");
  }
  return secret;
}

export function createMagicCookie(email: string): string {
  const secret = getSecret();
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_DAYS * 24 * 60 * 60;
  const payload = JSON.stringify({ email, exp });
  const payloadB64 = Buffer.from(payload, "utf8").toString("base64url");
  const sig = createHmac("sha256", secret).update(payloadB64).digest("base64url");
  return `${payloadB64}.${sig}`;
}

export function verifyMagicCookie(cookieValue: string | null): { email: string } | null {
  if (!cookieValue || !cookieValue.includes(".")) return null;
  const [payloadB64, sig] = cookieValue.split(".");
  if (!payloadB64 || !sig) return null;
  try {
    const secret = getSecret();
    const expectedSig = createHmac("sha256", secret).update(payloadB64).digest("base64url");
    if (!timingSafeEqual(Buffer.from(sig, "base64url"), Buffer.from(expectedSig, "base64url"))) return null;
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8")) as { email?: string; exp?: number };
    if (!payload.email || typeof payload.email !== "string" || !payload.email.includes("@")) return null;
    if (typeof payload.exp !== "number" || payload.exp < Date.now() / 1000) return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}

export function getMagicCookieFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return match ? decodeURIComponent(match[1].trim()) : null;
}

export { COOKIE_NAME, MAX_AGE_DAYS };
