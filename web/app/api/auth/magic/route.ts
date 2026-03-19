import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";
import { createMagicCookie, COOKIE_NAME, MAX_AGE_DAYS } from "@/lib/magicSession";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://cmk.elitegrowth.pro";

/*
 * When moving DNS to production: set NEXT_PUBLIC_APP_URL for Production env.
 * No Supabase redirect URLs needed for this flow — we use our own session cookie.
 */

/**
 * GET /api/auth/magic?token=xxx
 * One-time token from Resend "View your history" link. We set a signed cookie (email, 7 days)
 * and redirect to /dashboard. No Supabase magic link — no expiry, no invalid token.
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
    return NextResponse.redirect(`${BASE_URL}/dashboard`, 302);
  }

  const email = row.email as string;
  await supabase.from("magic_tokens").delete().eq("token", token);

  let cookieValue: string;
  try {
    cookieValue = createMagicCookie(email);
  } catch (e) {
    console.error("[auth/magic] MAGIC_SESSION_SECRET missing or invalid", e);
    return NextResponse.redirect(`${BASE_URL}/tools/readiness?error=config`, 302);
  }

  const res = NextResponse.redirect(`${BASE_URL}/dashboard`, 302);
  const isProd = process.env.NODE_ENV === "production";
  res.cookies.set(COOKIE_NAME, cookieValue, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: MAX_AGE_DAYS * 24 * 60 * 60,
    path: "/",
  });
  return res;
}
