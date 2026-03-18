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
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization") ?? "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : "";
    if (!token) return NextResponse.json({ error: "Missing access token" }, { status: 401 });

    await verifyAdmin(token);

    const body = (await request.json().catch(() => ({}))) as {
      userId?: string;
      email?: string;
      productKey?: string;
      status?: string;
    };

    const userId = body.userId;
    const email = body.email ?? "";
    const productKey = body.productKey;
    const status = body.status ?? "manual_unlocked";

    if (!userId || !productKey) {
      return NextResponse.json({ error: "Missing userId/productKey" }, { status: 400 });
    }

    const supabase = getSupabaseServer();
    await supabase
      .from("entitlements")
      .upsert(
        {
          user_id: userId,
          email,
          product_key: productKey,
          status,
        },
        { onConflict: "user_id,product_key" }
      );

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Update failed", detail: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}

