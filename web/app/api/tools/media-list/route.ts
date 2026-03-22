import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";
import type { PublicPressContactRow } from "@/lib/pressContact";

/**
 * Public read-only list for /tools/media-list (no auth).
 * Omits internal `notes` and timestamps.
 */
export async function GET() {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from("press_contacts")
      .select("id, outlet, contact_name, role_or_beat, email, url, region, tags, category, sort_order")
      .order("sort_order", { ascending: true })
      .order("outlet", { ascending: true });

    if (error) throw error;

    const rows = (data || []) as PublicPressContactRow[];
    return NextResponse.json({ rows });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e), rows: [] },
      { status: 500 }
    );
  }
}
