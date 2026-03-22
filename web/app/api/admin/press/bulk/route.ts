import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";
import { getAdminFromRequest } from "@/lib/adminAuth";
import type { PressContactRow } from "@/lib/pressContact";

type BulkBody = { rows: Partial<PressContactRow>[] };

export async function POST(request: Request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 403 });

    const body = (await request.json()) as BulkBody;
    if (!Array.isArray(body.rows) || body.rows.length === 0) {
      return NextResponse.json({ error: "rows must be a non-empty array" }, { status: 400 });
    }
    if (body.rows.length > 2000) {
      return NextResponse.json({ error: "Maximum 2000 rows per request" }, { status: 400 });
    }

    const inserts = [];
    for (let i = 0; i < body.rows.length; i++) {
      const r = body.rows[i];
      const outlet = typeof r.outlet === "string" ? r.outlet.trim() : "";
      if (!outlet) {
        return NextResponse.json({ error: `Row ${i + 1}: outlet is required` }, { status: 400 });
      }
      inserts.push({
        outlet,
        contact_name: r.contact_name?.trim() || null,
        role_or_beat: r.role_or_beat?.trim() || null,
        email: r.email?.trim() || null,
        url: r.url?.trim() || null,
        region: r.region?.trim() || null,
        tags: r.tags?.trim() || null,
        category: r.category?.trim() || null,
        notes: r.notes?.trim() || null,
        status: (r.status && String(r.status).trim()) || "todo",
        sort_order: typeof r.sort_order === "number" && Number.isFinite(r.sort_order) ? r.sort_order : 0,
      });
    }

    const supabase = getSupabaseServer();
    const { data, error } = await supabase.from("press_contacts").insert(inserts).select("id");
    if (error) throw error;

    return NextResponse.json({ inserted: data?.length ?? inserts.length });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
