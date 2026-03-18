import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization") ?? "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : "";
    if (!token) {
      return NextResponse.json({ error: "Missing access token" }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      return NextResponse.json({ error: "Missing NEXT_PUBLIC_SUPABASE_URL" }, { status: 500 });
    }

    // Verify token (no service role needed): Supabase exposes /auth/v1/user.
    const verifyRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const verifyData = await verifyRes.json().catch(() => ({}));
    if (!verifyRes.ok) {
      return NextResponse.json(
        { error: "Invalid token", detail: verifyData },
        { status: 401 }
      );
    }

    const userId =
      (verifyData as { id?: string; user?: { id?: string } }).id ??
      (verifyData as { user?: { id?: string } }).user?.id;
    const email = String((verifyData as { email?: string }).email ?? "");
    if (!userId || !email.includes("@")) {
      return NextResponse.json({ error: "User verification failed" }, { status: 400 });
    }

    const supabase = getSupabaseServer();

    // Ensure profile exists (used later for admin flag).
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert(
          { user_id: userId, email, is_admin: false },
          { onConflict: "user_id" }
        );
      if (error) console.error("[readiness/link] profile upsert failed:", error);
    } catch (e) {
      console.error("[readiness/link] profile upsert exception:", e);
    }

    // Link readiness rows created by email-only flow.
    try {
      const { error } = await supabase
        .from("readiness_results")
        .update({ user_id: userId })
        .eq("email", email)
        .is("user_id", null);
      if (error) console.error("[readiness/link] readiness update failed:", error);
    } catch (e) {
      console.error("[readiness/link] readiness update exception:", e);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Link failed", detail: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}

