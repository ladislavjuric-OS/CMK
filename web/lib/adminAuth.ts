import { getSupabaseServer } from "@/lib/supabase";
import { getMagicCookieFromRequest, verifyMagicCookie } from "@/lib/magicSession";

const ADMIN_EMAILS_KEY = "ADMIN_EMAILS";

function getAdminEmails(): Set<string> {
  const raw = process.env[ADMIN_EMAILS_KEY] ?? "";
  return new Set(
    raw
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e.includes("@"))
  );
}

async function verifySupabaseAdmin(accessToken: string): Promise<{ userId: string; email: string } | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return null;
  const verifyRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!verifyRes.ok) return null;
  const verifyData = (await verifyRes.json().catch(() => ({}))) as { id?: string; email?: string; user?: { id?: string; email?: string } };
  const userId = verifyData.id ?? verifyData.user?.id;
  const email = String(verifyData.email ?? verifyData.user?.email ?? "").toLowerCase();
  if (!userId || !email) return null;
  const supabase = getSupabaseServer();
  const { data } = await supabase.from("profiles").select("is_admin").eq("user_id", userId).limit(1).maybeSingle();
  if (!(data as { is_admin?: boolean } | null)?.is_admin) return null;
  return { userId, email };
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
