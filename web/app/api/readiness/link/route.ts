import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";
import { getAdminEmails } from "@/lib/adminAuth";
import { verifySupabaseUserAccessToken } from "@/lib/verifySupabaseUser";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization") ?? "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : "";
    if (!token) {
      return NextResponse.json({ error: "Missing access token" }, { status: 401 });
    }

    const verified = await verifySupabaseUserAccessToken(token);
    if (!verified) {
      return NextResponse.json(
        { error: "Invalid token", detail: "Ensure NEXT_PUBLIC_SUPABASE_ANON_KEY is set on the server (GoTrue requires apikey header)." },
        { status: 401 }
      );
    }

    const { userId, email } = verified;

    const supabase = getSupabaseServer();
    const adminEmails = getAdminEmails();
    const isAdmin = adminEmails.has(email.toLowerCase());

    // Ensure profile exists; is_admin only for emails in ADMIN_EMAILS (e.g. Google admin login).
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert(
          { user_id: userId, email, is_admin: isAdmin },
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

