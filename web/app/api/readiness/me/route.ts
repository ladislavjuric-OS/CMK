import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";
import { getMagicCookieFromRequest, verifyMagicCookie } from "@/lib/magicSession";
import { verifySupabaseUserAccessToken } from "@/lib/verifySupabaseUser";
import { dashboardRunLimitForUser, hasFullReadinessHistoryUnlocked } from "@/lib/readinessLimits";

async function verifySupabaseToken(accessToken: string) {
  const v = await verifySupabaseUserAccessToken(accessToken);
  if (!v) throw new Error("Invalid token");
  return { userId: v.userId, email: v.email };
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseServer();
    const authHeader = request.headers.get("authorization") ?? "";
    const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : "";
    const magicCookie = getMagicCookieFromRequest(request);
    const magicSession = verifyMagicCookie(magicCookie);

    let userId: string | null = null;
    let email = "";

    if (bearerToken) {
      try {
        const verified = await verifySupabaseToken(bearerToken);
        userId = verified.userId;
        email = verified.email;
      } catch {
        // Fall through to magic cookie if Bearer invalid
      }
    }
    if (!email && magicSession) {
      email = magicSession.email;
    }
    if (!email.includes("@")) {
      return NextResponse.json({ error: "Please sign in or use the link from your results email." }, { status: 401 });
    }

    if (userId) {
      const [entRows, entByEmailRows] = await Promise.all([
        supabase.from("entitlements").select("product_key,status").eq("user_id", userId),
        supabase.from("entitlements_by_email").select("product_key,status").eq("email", email),
      ]);
      const byUser = entRows.data || [];
      const byEmail = (entByEmailRows.data || []).map((r) => ({ product_key: r.product_key, status: r.status }));
      const entitlements = [...byUser, ...byEmail];
      const runLimit = dashboardRunLimitForUser(entitlements);

      const rrRows = await supabase
        .from("readiness_results")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(runLimit);

      const readinessRuns = rrRows.data || [];
      const readiness = readinessRuns[0] || null;
      return NextResponse.json({
        readiness,
        readinessRuns,
        entitlements,
        readinessHistoryLimit: runLimit,
        fullReadinessHistoryUnlocked: hasFullReadinessHistoryUnlocked(entitlements),
        user: { userId, email },
      });
    }

    const entByEmailRows = await supabase
      .from("entitlements_by_email")
      .select("product_key,status")
      .eq("email", email);
    const entitlements = (entByEmailRows.data || []).map((r) => ({ product_key: r.product_key, status: r.status }));
    const runLimit = dashboardRunLimitForUser(entitlements);

    const rrRows = await supabase
      .from("readiness_results")
      .select("*")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(runLimit);

    const readinessRuns = rrRows.data || [];
    const readiness = readinessRuns[0] || null;

    return NextResponse.json({
      readiness,
      readinessRuns,
      entitlements,
      readinessHistoryLimit: runLimit,
      fullReadinessHistoryUnlocked: hasFullReadinessHistoryUnlocked(entitlements),
      user: { userId: null, email },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: "Failed to load dashboard", detail: message },
      { status: 500 }
    );
  }
}

