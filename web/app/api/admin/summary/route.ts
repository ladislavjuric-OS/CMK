import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";

async function verifyAdmin(accessToken: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");

  const verifyRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const verifyData = await verifyRes.json().catch(() => ({}));
  if (!verifyRes.ok) throw new Error("Invalid token");

  const userId =
    (verifyData as { id?: string }).id ?? (verifyData as { user?: { id?: string } }).user?.id;
  if (!userId) throw new Error("User id missing");

  const supabase = getSupabaseServer();
  const profileRes = await supabase
    .from("profiles")
    .select("user_id,is_admin")
    .eq("user_id", userId)
    .limit(1);

  const row = profileRes.data?.[0];
  if (!row?.is_admin) throw new Error("Forbidden");

  return { userId, email: String((verifyData as { email?: string }).email ?? "") };
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization") ?? "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : "";
    if (!token) return NextResponse.json({ error: "Missing access token" }, { status: 401 });

    await verifyAdmin(token);
    const supabase = getSupabaseServer();

    const rrRes = await supabase
      .from("readiness_results")
      .select("id,user_id,email,score,verdict,created_at,payload")
      .order("created_at", { ascending: false })
      .limit(30);

    const entRes = await supabase
      .from("entitlements")
      .select("user_id,email,product_key,status,created_at")
      .order("created_at", { ascending: false })
      .limit(200);

    return NextResponse.json({
      readiness: rrRes.data || [],
      entitlements: entRes.data || [],
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 403 }
    );
  }
}

