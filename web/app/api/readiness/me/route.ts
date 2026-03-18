import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";

async function verifyAccessToken(accessToken: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");

  const verifyRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const verifyData = await verifyRes.json().catch(() => ({}));
  if (!verifyRes.ok) throw new Error("Invalid token");
  return verifyData as { id?: string; email?: string; user?: { id?: string; email?: string } };
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization") ?? "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : "";
    if (!token) return NextResponse.json({ error: "Missing access token" }, { status: 401 });

    const verifyData = await verifyAccessToken(token);
    const userId =
      verifyData.id ?? verifyData.user?.id;
    const email = String(verifyData.email ?? verifyData.user?.email ?? "");

    if (!userId || !email.includes("@")) {
      return NextResponse.json({ error: "User verification failed" }, { status: 400 });
    }

    const supabase = getSupabaseServer();

    const [rrRows, entRows] = await Promise.all([
      supabase
        .from("readiness_results")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1),
      supabase
        .from("entitlements")
        .select("product_key,status")
        .eq("user_id", userId),
    ]);

    const readiness = (rrRows.data && rrRows.data[0]) || null;
    const entitlements = entRows.data || [];

    return NextResponse.json({ readiness, entitlements, user: { userId, email } });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to load dashboard", detail: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}

