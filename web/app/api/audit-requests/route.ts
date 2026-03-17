import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, payload } = body as { email?: string; payload?: Record<string, unknown> };

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from("audit_requests")
      .insert({
        email: email.trim(),
        payload: payload ?? {},
        status: "pending",
      })
      .select("id, created_at")
      .single();

    if (error) {
      console.error("[audit-requests] Supabase error:", error.message, error);
      return NextResponse.json(
        { error: "Failed to save request", detail: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, id: data.id, created_at: data.created_at });
  } catch (e) {
    console.error("[audit-requests] Exception:", e);
    return NextResponse.json(
      { error: "Server error", detail: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
