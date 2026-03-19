import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";
import { getMagicCookieFromRequest, verifyMagicCookie } from "@/lib/magicSession";

async function verifySupabaseToken(accessToken: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  const verifyRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const verifyData = await verifyRes.json().catch(() => ({}));
  if (!verifyRes.ok) {
    const msg = (verifyData as { msg?: string }).msg ?? (verifyData as { error_description?: string }).error_description ?? "Invalid token";
    throw new Error(msg);
  }
  const data = verifyData as { id?: string; email?: string; user?: { id?: string; email?: string } };
  const userId = data.id ?? data.user?.id;
  const email = String(data.email ?? data.user?.email ?? "");
  if (!userId || !email.includes("@")) throw new Error("User verification failed");
  return { userId, email };
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseServer();
    const authHeader = request.headers.get("authorization") ?? "";
    const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : "";
    const magicCookie = getMagicCookieFromRequest(request);
    const magicSession = verifyMagicCookie(magicCookie);

    let userId: string | null = null;
    let email = "";

    if (bearerToken) {
      try {
        const verified = await verifySupabaseToken(bearerToken);
        userId = verified.userId;
        email = verified.email;
      } catch {
        // Fall through to magic cookie if Bearer invalid
      }
    }
    if (!email && magicSession) {
      email = magicSession.email;
    }
    if (!email.includes("@")) {
      return NextResponse.json({ error: "Please sign in or use the link from your results email." }, { status: 401 });
    }

    if (userId) {
      const [rrRows, entRows] = await Promise.all([
        supabase.from("readiness_results").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(1),
        supabase.from("entitlements").select("product_key,status").eq("user_id", userId),
      ]);
      const readiness = (rrRows.data && rrRows.data[0]) || null;
      const entitlements = entRows.data || [];
      return NextResponse.json({ readiness, entitlements, user: { userId, email } });
    }

    const rrRows = await supabase
      .from("readiness_results")
      .select("*")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1);
    const readiness = (rrRows.data && rrRows.data[0]) || null;
    const entitlements: { product_key: string; status: string }[] = [];

    return NextResponse.json({ readiness, entitlements, user: { userId: null, email } });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: "Failed to load dashboard", detail: message },
      { status: 500 }
    );
  }
}

