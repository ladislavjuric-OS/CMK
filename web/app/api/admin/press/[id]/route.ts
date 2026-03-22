import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";
import { getAdminFromRequest } from "@/lib/adminAuth";
import type { PressContactRow } from "@/lib/pressContact";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 403 });

    const { id } = await ctx.params;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const body = (await request.json()) as Partial<PressContactRow>;
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (body.outlet !== undefined) {
      const o = typeof body.outlet === "string" ? body.outlet.trim() : "";
      if (!o) return NextResponse.json({ error: "outlet cannot be empty" }, { status: 400 });
      patch.outlet = o;
    }
    if (body.contact_name !== undefined) patch.contact_name = body.contact_name?.trim() || null;
    if (body.role_or_beat !== undefined) patch.role_or_beat = body.role_or_beat?.trim() || null;
    if (body.email !== undefined) patch.email = body.email?.trim() || null;
    if (body.url !== undefined) patch.url = body.url?.trim() || null;
    if (body.region !== undefined) patch.region = body.region?.trim() || null;
    if (body.tags !== undefined) patch.tags = body.tags?.trim() || null;
    if (body.category !== undefined) patch.category = body.category?.trim() || null;
    if (body.notes !== undefined) patch.notes = body.notes?.trim() || null;
    if (body.status !== undefined) patch.status = String(body.status).trim() || "todo";
    if (body.sort_order !== undefined && typeof body.sort_order === "number" && Number.isFinite(body.sort_order)) {
      patch.sort_order = body.sort_order;
    }

    const supabase = getSupabaseServer();
    const { data, error } = await supabase.from("press_contacts").update(patch).eq("id", id).select("*").single();
    if (error) throw error;
    if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ row: data });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, ctx: Ctx) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 403 });

    const { id } = await ctx.params;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const supabase = getSupabaseServer();
    const { error } = await supabase.from("press_contacts").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
