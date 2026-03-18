import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://cmk.elitegrowth.pro";
const CALLBACK_URL = `${BASE_URL}/auth/callback`;

/*
 * When moving DNS to production (cmk.elitegrowth.pro): update Supabase Dashboard →
 * Authentication → URL Configuration: Site URL + Redirect URLs to https://cmk.elitegrowth.pro
 * (and https://cmk.elitegrowth.pro/auth/callback). Set NEXT_PUBLIC_APP_URL for Production env.
 */

/**
 * GET /api/auth/magic?token=xxx
 * Exchanges a one-time token (from Resend "View your history" link) for a Supabase magic link.
 * Redirects the user to Supabase's action_link; Supabase then redirects back to /auth/callback with session.
 * Result: one email (Resend only), no Supabase email.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(`${BASE_URL}/tools/readiness?error=missing_token`, 302);
  }

  const supabase = getSupabaseServer();

  const { data: row, error: fetchError } = await supabase
    .from("magic_tokens")
    .select("email")
    .eq("token", token)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (fetchError || !row?.email) {
    // Link already used or expired — send to dashboard; if they have a session it may still work.
    return NextResponse.redirect(`${BASE_URL}/dashboard`, 302);
  }

  const email = row.email as string;

  await supabase.from("magic_tokens").delete().eq("token", token);

  const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo: CALLBACK_URL },
  });

  if (linkError || !linkData?.properties?.action_link) {
    console.error("[auth/magic] generateLink failed", linkError);
    return NextResponse.redirect(`${BASE_URL}/tools/readiness?error=link_failed`, 302);
  }

  return NextResponse.redirect(linkData.properties.action_link, 302);
}
