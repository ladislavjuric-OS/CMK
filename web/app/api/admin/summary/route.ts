import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";
import { getAdminFromRequest } from "@/lib/adminAuth";

export async function POST(request: Request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 403 });

    const supabase = getSupabaseServer();

    const [rrRes, entRes, entByEmailRes] = await Promise.all([
      supabase
        .from("readiness_results")
        .select("id,user_id,email,score,verdict,created_at,payload")
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("entitlements")
        .select("user_id,email,product_key,status,created_at")
        .order("created_at", { ascending: false })
        .limit(200),
      supabase
        .from("entitlements_by_email")
        .select("email,product_key,status,created_at")
        .order("created_at", { ascending: false })
        .limit(200),
    ]);

    const entitlementsByEmail = (entByEmailRes.data || []).map((r) => ({
      user_id: null as string | null,
      email: r.email,
      product_key: r.product_key,
      status: r.status,
      created_at: r.created_at,
    }));

    return NextResponse.json({
      readiness: rrRes.data || [],
      entitlements: [...(entRes.data || []), ...entitlementsByEmail],
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 403 }
    );
  }
}

