import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";
import { getAdminFromRequest } from "@/lib/adminAuth";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 403 });

    const { id } = await context.params;
    const cleanId = typeof id === "string" ? id.trim() : "";
    if (!cleanId) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const supabase = getSupabaseServer();
    const { data: row, error } = await supabase
      .from("readiness_results")
      .select("*")
      .eq("id", cleanId)
      .maybeSingle();

    if (error || !row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    let entitlements: { product_key: string; status: string }[] = [];
    if (row.user_id) {
      const { data } = await supabase.from("entitlements").select("product_key,status").eq("user_id", row.user_id);
      entitlements = data || [];
    } else {
      const { data } = await supabase
        .from("entitlements_by_email")
        .select("product_key,status")
        .eq("email", row.email);
      entitlements = (data || []).map((r) => ({ product_key: r.product_key, status: r.status }));
    }

    return NextResponse.json({
      readiness: row,
      entitlements,
      admin: { email: admin.email },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 403 }
    );
  }
}
