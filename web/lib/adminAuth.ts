import { getSupabaseServer } from "@/lib/supabase";
import { getMagicCookieFromRequest, verifyMagicCookie } from "@/lib/magicSession";
import { verifySupabaseUserAccessToken } from "@/lib/verifySupabaseUser";

const ADMIN_EMAILS_KEY = "ADMIN_EMAILS";

export function getAdminEmails(): Set<string> {
  const raw = process.env[ADMIN_EMAILS_KEY] ?? "";
  return new Set(
    raw
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e.includes("@"))
  );
}

async function verifySupabaseAdmin(accessToken: string): Promise<{ userId: string; email: string } | null> {
  const verified = await verifySupabaseUserAccessToken(accessToken);
  if (!verified) return null;
  const emailLower = verified.email.toLowerCase();
  const adminEmails = getAdminEmails();

  if (adminEmails.has(emailLower)) {
    return { userId: verified.userId, email: emailLower };
  }

  const supabase = getSupabaseServer();
  const { data } = await supabase.from("profiles").select("is_admin").eq("user_id", verified.userId).limit(1).maybeSingle();
  if (!(data as { is_admin?: boolean } | null)?.is_admin) return null;
  return { userId: verified.userId, email: emailLower };
}

/**
 * Returns admin identity if request is allowed (Supabase is_admin OR magic cookie email in ADMIN_EMAILS).
 */
export async function getAdminFromRequest(request: Request): Promise<{ userId: string | null; email: string } | null> {
  const authHeader = request.headers.get("authorization") ?? "";
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : "";
  const adminEmails = getAdminEmails();

  if (bearer) {
    const sup = await verifySupabaseAdmin(bearer);
    if (sup) return { userId: sup.userId, email: sup.email };
  }

  const cookie = getMagicCookieFromRequest(request);
  const magic = verifyMagicCookie(cookie);
  if (magic && adminEmails.has(magic.email.toLowerCase())) {
    return { userId: null, email: magic.email };
  }

  return null;
}
