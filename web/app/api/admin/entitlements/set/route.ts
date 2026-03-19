import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";
import { getAdminFromRequest } from "@/lib/adminAuth";

export async function POST(request: Request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 403 });

    const body = (await request.json().catch(() => ({}))) as {
      userId?: string | null;
      email?: string;
      productKey?: string;
      status?: string;
    };

    const userId = body.userId ?? null;
    const email = String(body.email ?? "").trim();
    const productKey = body.productKey;
    const status = body.status ?? "manual_unlocked";

    if (!productKey) return NextResponse.json({ error: "Missing productKey" }, { status: 400 });
    if (userId) {
      if (!email) return NextResponse.json({ error: "Missing email when userId provided" }, { status: 400 });
      const supabase = getSupabaseServer();
      await supabase.from("entitlements").upsert(
        { user_id: userId, email, product_key: productKey, status },
        { onConflict: "user_id,product_key" }
      );
      return NextResponse.json({ ok: true });
    }
    if (!email) return NextResponse.json({ error: "Missing email (for email-only unlock)" }, { status: 400 });
    const supabase = getSupabaseServer();
    await supabase.from("entitlements_by_email").upsert(
      { email, product_key: productKey, status },
      { onConflict: "email,product_key" }
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Update failed", detail: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}

