import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";
import { getAdminFromRequest } from "@/lib/adminAuth";
import type { PressContactRow } from "@/lib/pressContact";

export async function GET(request: Request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 403 });

    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from("press_contacts")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("outlet", { ascending: true });

    if (error) throw error;
    return NextResponse.json({ rows: data || [] });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 403 });

    const body = (await request.json()) as Partial<PressContactRow>;
    const outlet = typeof body.outlet === "string" ? body.outlet.trim() : "";
    if (!outlet) return NextResponse.json({ error: "outlet is required" }, { status: 400 });

    const supabase = getSupabaseServer();
    const insert = {
      outlet,
      contact_name: body.contact_name?.trim() || null,
      role_or_beat: body.role_or_beat?.trim() || null,
      email: body.email?.trim() || null,
      url: body.url?.trim() || null,
      region: body.region?.trim() || null,
      tags: body.tags?.trim() || null,
      category: body.category?.trim() || null,
      notes: body.notes?.trim() || null,
      status: (body.status && String(body.status).trim()) || "todo",
      sort_order: typeof body.sort_order === "number" && Number.isFinite(body.sort_order) ? body.sort_order : 0,
    };

    const { data, error } = await supabase.from("press_contacts").insert(insert).select("*").single();
    if (error) throw error;
    return NextResponse.json({ row: data });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
