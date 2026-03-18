import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";

const SYSTEM_PROMPT = `You are The Architect — a crowdfunding strategist who has raised $890K across 5 real campaigns (Baggizmo, Wiseward, and others). You speak with brutal honesty, no fluff, no empty encouragement.

You use a proprietary scoring framework based on real campaign data. Your job is to analyze a founder's campaign inputs and return a JSON readiness report.

## SCORING FRAMEWORK

### 1. WIN-BEFORE-LAUNCH MATH (30 points)
- Day 1 Target = Funding Goal x 30%
- Projected Day 1 from VIP = VIP Deposits x avg_pledge x 0.65
- avg_pledge estimate = Funding Goal / 400 x 0.75
- Safe email target = (Funding Goal / avg_pledge) x 3
- Score this category 0-30

### 2. FINANCIAL READINESS (25 points)
- Break-even: COGS + shipping must be < 60% of (COGS x 3.5 x 0.75)
- If shipping > 25% of COGS flag as risk
- Add 15% stupidity tax mentally
- Score this category 0-25

### 3. CAMPAIGN READINESS (25 points)
- No video = -15 pts
- Prototype: concept=5, working=15, production-ready=25, manufactured=25
- Score this category 0-25

### 4. TIMELINE REALISM (20 points)
- <4 weeks: NO-GO territory
- 4-8 weeks: conditional
- 8-12 weeks: good
- 12+ weeks: strong
- Score this category 0-20

### VERDICT
- 0-49: NO-GO
- 50-74: CONDITIONAL GO
- 75-100: GO

Return ONLY valid JSON, no markdown:

{
  "score": <0-100>,
  "verdict": "NO-GO" or "CONDITIONAL GO" or "GO",
  "verdict_emoji": "red_circle" or "yellow_circle" or "green_circle",
  "confidence": "High" or "Medium" or "Low",
  "category_scores": {
    "win_before_launch": <0-30>,
    "financial_readiness": <0-25>,
    "campaign_readiness": <0-25>,
    "timeline_realism": <0-20>
  },
  "day1_math": {
    "target": <number>,
    "projected_vip": <number>,
    "coverage_pct": <number>,
    "email_list_needed": <number>,
    "email_gap": <number>
  },
  "critical_gaps": [
    {
      "priority": "P0" or "P1" or "P2",
      "title": "<short>",
      "finding": "<specific with real numbers>",
      "fix": "<concrete action>"
    }
  ],
  "one_win": "<genuine strength>",
  "cta": "audit" or "cmk_pro" or "cmk_elite" or "cmk_standard",
  "cta_reason": "<one sentence>"
}

CTA: score<50 and goal>30k=audit, score<50 and goal<=30k=cmk_pro, 50-74=cmk_pro, 75+=cmk_elite, already live or <4 weeks=audit always.
verdict_emoji: use actual emoji characters not words.`;

const COUNTER_OFFSET = 247;
const COUNTER_NS = "elitegrowth";
const COUNTER_KEY = "campaigns";

const EMAIL_BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://cmk.elitegrowth.pro";

async function sendResultsEmail({
  email,
  result,
  historyLink,
}: {
  email: string;
  result: Record<string, unknown>;
  historyLink?: string | null;
}) {
  if (!email || !process.env.RESEND_API_KEY) return;
  const score = Number(result?.score ?? 0);
  const verdict = String(result?.verdict ?? "");
  const verdictEmoji = String(result?.verdict_emoji ?? "");
  const verdictColor =
    score >= 75 ? "#57e0b3" : score >= 50 ? "#ffd166" : "#ff5a6a";
  const gaps = (result?.critical_gaps as Array<{ priority: string; title: string; finding: string; fix: string }> || [])
    .slice(0, 3)
    .map(
      (g) => `
    <li style="margin:0 0 10px;">
      <div style="font-weight:700;color:#e5e7eb;">${g.priority} — ${g.title}</div>
      <div style="color:#9ca3af;">${g.finding}</div>
      <div style="color:#e5e7eb;"><span style="color:#00ffcc;">Fix:</span> ${g.fix}</div>
    </li>
  `
    )
    .join("");
  const historyButton = historyLink
    ? `<a href="${historyLink}" style="display:inline-block;margin-left:10px;background:rgba(0,255,204,0.15);color:#00ffcc;font-weight:700;text-decoration:none;padding:12px 16px;border-radius:12px;border:1px solid rgba(0,255,204,0.4);">View your history</a>`
    : "";
  const html = `<!doctype html>
  <html>
    <body style="margin:0;background:#0b0f14;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;">
      <div style="max-width:720px;margin:0 auto;padding:28px 18px;">
        <div style="border:1px solid rgba(255,255,255,0.12);border-radius:16px;overflow:hidden;background:rgba(255,255,255,0.06);">
          <div style="padding:18px 18px;border-bottom:1px solid rgba(255,255,255,0.10);background:rgba(11,15,20,0.75);">
            <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#00ffcc;font-weight:800;">The Architect</div>
            <div style="margin-top:4px;color:#9ca3af;font-size:13px;">Campaign Readiness Checker</div>
          </div>
          <div style="padding:18px 18px;">
            <div style="font-size:44px;font-weight:900;line-height:1;color:${verdictColor};">${score}<span style="font-size:18px;color:#6b7280;font-weight:700;">/100</span></div>
            <div style="margin-top:6px;font-size:16px;font-weight:900;color:#e5e7eb;">${verdictEmoji} ${verdict}</div>
            ${(result?.cta_reason as string) ? `<div style="margin-top:10px;color:#9ca3af;line-height:1.6;">${result.cta_reason}</div>` : ""}
            <div style="margin-top:16px;padding-top:14px;border-top:1px solid rgba(255,255,255,0.10);">
              <div style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#00ffcc;font-weight:800;margin-bottom:10px;">Top gaps (if any)</div>
              <ul style="padding-left:18px;margin:0;color:#e5e7eb;">${gaps || '<li style="color:#57e0b3;">No critical blockers found.</li>'}</ul>
            </div>
            <div style="margin-top:18px;">
              <a href="${EMAIL_BASE_URL}/tools/readiness" style="display:inline-block;background:linear-gradient(135deg,#00ffcc,#62a6ff);color:#041013;font-weight:900;text-decoration:none;padding:12px 16px;border-radius:12px;">Open Readiness Checker</a>
              <a href="${EMAIL_BASE_URL}/audit" style="display:inline-block;margin-left:10px;color:#e5e7eb;text-decoration:none;border:1px solid rgba(255,255,255,0.14);padding:12px 16px;border-radius:12px;background:rgba(255,255,255,0.06);">Get the Audit</a>
              ${historyButton}
            </div>
            <div style="margin-top:18px;color:#6b7280;font-size:12px;">
              If you didn't request this email, ignore it. Contact: <a href="mailto:hello@elitegrowth.pro" style="color:#00ffcc;text-decoration:none;">hello@elitegrowth.pro</a>
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>`;
  try {
    const rr = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "The Architect <architect@elitegrowth.pro>",
        to: email,
        subject: `Your Campaign Score: ${score}/100 — ${verdict}`,
        html,
      }),
    });
    if (!rr.ok) await rr.text().catch(() => "");
  } catch {
    // ignore
  }
}

function getContactIdFromResponse(sd: unknown): number | undefined {
  if (!sd || typeof sd !== "object") return undefined;
  const o = sd as Record<string, unknown>;
  const from = (v: unknown): number | undefined => {
    if (typeof v === "number" && !Number.isNaN(v)) return v;
    if (typeof v === "string" && /^\d+$/.test(v)) return parseInt(v, 10);
    return undefined;
  };
  return (
    from(o.id) ??
    from((o.contact as Record<string, unknown>)?.id) ??
    from((o.data as Record<string, unknown>)?.id) ??
    from(o.contactId) ??
    from(o.contact_id) ??
    (Array.isArray(o.items) && o.items[0] != null
      ? from((o.items[0] as Record<string, unknown>).id)
      : undefined)
  );
}

async function upsertSystemeAndTag({ email }: { email: string }) {
  if (!email || !process.env.SYSTEME_API_KEY) return;
  const tagIdRaw = process.env.SYSTEME_TAG_ID ?? "1914659";
  const tagId = Number(tagIdRaw);
  if (!tagId || Number.isNaN(tagId)) return;
  const debug = String(process.env.SYSTEME_DEBUG ?? "").toLowerCase() === "true";
  const headers = {
    "Content-Type": "application/json",
    "X-API-Key": process.env.SYSTEME_API_KEY,
  };

  try {
    const sr = await fetch("https://api.systeme.io/api/contacts", {
      method: "POST",
      headers,
      body: JSON.stringify({ email }),
    });
    const sd = await sr.json().catch(() => ({}));
    if (debug && !sr.ok && sr.status !== 409) {
      console.error("[systeme] create contact failed", { status: sr.status, body: sd });
    }

    // Mirror the legacy HTML behavior (`api/analyze.js`) to remove differences.
    const contactIdRaw =
      (sd as { id?: unknown } | null)?.id ??
      (sd as { contact?: { id?: unknown } } | null)?.contact?.id ??
      (sd as { data?: { id?: unknown } } | null)?.data?.id ??
      (sd as { contactId?: unknown } | null)?.contactId ??
      (sd as { contact_id?: unknown } | null)?.contact_id;

    const contactId =
      typeof contactIdRaw === "number"
        ? contactIdRaw
        : typeof contactIdRaw === "string" && /^\d+$/.test(contactIdRaw)
          ? parseInt(contactIdRaw, 10)
          : undefined;

    if (!contactId) {
      if (debug) console.error("[systeme] contactId missing from response", { response: sd });
      return;
    }

    const tr = await fetch(`https://api.systeme.io/api/contacts/${contactId}/tags`, {
      method: "POST",
      headers,
      body: JSON.stringify({ tagId }),
    });
    if (debug && !(tr.ok || tr.status === 204)) {
      const tb = await tr.text().catch(() => "");
      console.error("[systeme] tag contact failed", { status: tr.status, body: tb, contactId, tagId });
    }
  } catch {
    // best-effort
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(request: Request) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400, headers }
    );
  }

  if (body?.action === "getCount") {
    try {
      const r = await fetch(
        `https://api.counterapi.dev/v1/${COUNTER_NS}/${COUNTER_KEY}`
      );
      const d = await r.json();
      return NextResponse.json(
        { count: (Number((d as { count?: number }).count) || 0) + COUNTER_OFFSET },
        { headers }
      );
    } catch {
      return NextResponse.json(
        { count: COUNTER_OFFSET },
        { headers }
      );
    }
  }

  try {
    const {
      email,
      funding_goal,
      email_list_size,
      vip_deposits = 0,
      cogs_per_unit = 0,
      shipping_per_unit = 0,
      has_video = "no",
      prototype_status = "Concept only",
      weeks_to_launch = 6,
    } = body;

    const fg = Number(funding_goal) || 0;
    const els = Number(email_list_size) || 0;
    const vip = Number(vip_deposits) || 0;
    const cogs = Number(cogs_per_unit) || 0;
    const ship = Number(shipping_per_unit) || 0;
    const wks = Number(weeks_to_launch) ?? 6;

    const avg_pledge = Math.round((fg / 400) * 0.75);
    const backers_needed = Math.round(fg / avg_pledge);
    const email_list_needed = backers_needed * 3;
    const day1_target = Math.round(fg * 0.3);

    const userMessage = `Analyze this campaign:
FUNDING GOAL: $${fg.toLocaleString()}
EMAIL LIST: ${els.toLocaleString()} subscribers
VIP DEPOSITS: ${vip.toLocaleString()} people
COGS PER UNIT: $${cogs}
SHIPPING PER UNIT: $${ship}
CAMPAIGN VIDEO: ${String(has_video) || "no"}
PROTOTYPE STATUS: ${String(prototype_status)}
WEEKS UNTIL LAUNCH: ${wks}

Pre-calculated:
- Est avg pledge: $${avg_pledge}
- Backers needed: ${backers_needed}
- Day 1 target (30%): $${day1_target.toLocaleString()}
- Safe email target: ${email_list_needed.toLocaleString()}
- Email gap: ${Math.max(0, email_list_needed - els).toLocaleString()}

Return JSON only.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    const data = await response.json();
    const text = (data.content?.[0] as { text?: string })?.text?.trim?.() ?? "";
    const clean = text.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean) as Record<string, unknown>;

    const emailStr = String(email ?? "");
    let historyLink: string | null = null;

    try {
      const supabase = getSupabaseServer();
      const score = Number(result?.score ?? 0);
      const verdict = String(result?.verdict ?? "");
      await supabase.from("readiness_results").insert({
        user_id: null,
        email: emailStr,
        score,
        verdict,
        payload: result,
      });

      const { data: tokenRow } = await supabase
        .from("magic_tokens")
        .insert({ email: emailStr })
        .select("token")
        .single();
      if (tokenRow?.token) {
        historyLink = `${EMAIL_BASE_URL}/api/auth/magic?token=${tokenRow.token}`;
      }
    } catch (e) {
      console.error("[readiness_results / magic_tokens] insert failed", e);
    }

    fetch(
      `https://api.counterapi.dev/v1/${COUNTER_NS}/${COUNTER_KEY}/up`
    ).catch(() => {});

    await sendResultsEmail({
      email: emailStr,
      result,
      historyLink,
    });
    // Ensure Systeme.io tagging completes in serverless environments.
    await Promise.allSettled([
      upsertSystemeAndTag({ email: String(email ?? "") }),
    ]);

    return NextResponse.json(result, { headers });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Analysis failed",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500, headers }
    );
  }
}
