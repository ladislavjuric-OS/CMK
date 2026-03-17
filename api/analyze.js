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

const COUNTER_OFFSET = 247; // Starting offset — real count + this = displayed number
const COUNTER_NS = 'elitegrowth';
const COUNTER_KEY = 'campaigns';

async function sendResultsEmail({ email, result, debug }) {
  const dbg = {
    attempted: false,
    status: null,
    error: null
  };

  if (!email || !process.env.RESEND_API_KEY) return dbg;
  dbg.attempted = true;

  const score = Number(result?.score ?? 0);
  const verdict = String(result?.verdict ?? '');
  const verdictEmoji = String(result?.verdict_emoji ?? '');
  const verdictColor = score >= 75 ? '#57e0b3' : score >= 50 ? '#ffd166' : '#ff5a6a';

  const gaps = (result?.critical_gaps || []).slice(0, 3).map(g => `
    <li style="margin:0 0 10px;">
      <div style="font-weight:700;color:#e5e7eb;">${g.priority} — ${g.title}</div>
      <div style="color:#9ca3af;">${g.finding}</div>
      <div style="color:#e5e7eb;"><span style="color:#00ffcc;">Fix:</span> ${g.fix}</div>
    </li>
  `).join('');

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
            ${result?.cta_reason ? `<div style="margin-top:10px;color:#9ca3af;line-height:1.6;">${result.cta_reason}</div>` : ''}
            <div style="margin-top:16px;padding-top:14px;border-top:1px solid rgba(255,255,255,0.10);">
              <div style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#00ffcc;font-weight:800;margin-bottom:10px;">Top gaps (if any)</div>
              <ul style="padding-left:18px;margin:0;color:#e5e7eb;">${gaps || '<li style="color:#57e0b3;">No critical blockers found.</li>'}</ul>
            </div>
            <div style="margin-top:18px;">
              <a href="https://cmk.elitegrowth.pro/tools/readinesschecker.html" style="display:inline-block;background:linear-gradient(135deg,#00ffcc,#62a6ff);color:#041013;font-weight:900;text-decoration:none;padding:12px 16px;border-radius:12px;">Open Readiness Checker</a>
              <a href="https://cmk.elitegrowth.pro/audit.html" style="display:inline-block;margin-left:10px;color:#e5e7eb;text-decoration:none;border:1px solid rgba(255,255,255,0.14);padding:12px 16px;border-radius:12px;background:rgba(255,255,255,0.06);">Get the Audit</a>
            </div>
            <div style="margin-top:18px;color:#6b7280;font-size:12px;">
              If you didn’t request this email, ignore it. Contact: <a href="mailto:hello@elitegrowth.pro" style="color:#00ffcc;text-decoration:none;">hello@elitegrowth.pro</a>
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>`;

  // Best-effort: do not fail the API request if email fails
  try {
    const rr = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: 'The Architect <architect@elitegrowth.pro>',
      to: email,
      subject: `Your Campaign Score: ${score}/100 — ${verdict}`,
      html
    })
    });
    dbg.status = rr.status;
    if (!rr.ok) {
      const t = await rr.text().catch(() => '');
      dbg.error = t.slice(0, 900) || null;
      console.log('[resend] fail', rr.status, dbg.error);
    } else if (debug) {
      console.log('[resend] ok', rr.status);
    }
  } catch (e) {
    dbg.error = String(e?.message || e);
    console.log('[resend] error', dbg.error);
  }

  return dbg;
}

async function upsertSystemeAndTag({ email }) {
  const dbg = {
    enabled: false,
    upsertStatus: null,
    contactId: null,
    tagStatus: null,
    tagError: null
  };

  if (!email || !process.env.SYSTEME_API_KEY) return dbg;
  const tagIdRaw = process.env.SYSTEME_TAG_ID ?? '1914659';
  const tagId = Number(tagIdRaw);
  if (!tagId || Number.isNaN(tagId)) return dbg;

  try {
    const headers = { 'Content-Type': 'application/json', 'X-API-Key': process.env.SYSTEME_API_KEY };

    // Step 1: Create/update contact
    const sr = await fetch('https://api.systeme.io/api/contacts', {
      method: 'POST',
      headers,
      body: JSON.stringify({ email })
    });
    dbg.upsertStatus = sr.status;
    const sd = await sr.json().catch(() => ({}));
    const contactId = sd?.id ?? sd?.contact?.id ?? sd?.data?.id ?? sd?.contactId ?? sd?.contact_id;
    dbg.contactId = contactId ? String(contactId) : null;
    console.log('[systeme] upsert', sr.status, 'contactId', contactId ? 'present' : 'missing');
    if (!contactId) {
      try { console.log('[systeme] upsert response', JSON.stringify(sd).slice(0, 600)); } catch {}
      return dbg;
    }

    const tr = await fetch(`https://api.systeme.io/api/contacts/${contactId}/tags`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ tagId })
    });
    dbg.tagStatus = tr.status;
    if (!tr.ok) {
      const td = await tr.text().catch(() => '');
      dbg.tagError = td.slice(0, 600) || null;
      console.log('[systeme] tag fail', tr.status, td.slice(0, 600));
    } else {
      console.log('[systeme] tag ok', tr.status);
    }
  } catch {
    // best-effort
  }

  return dbg;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Counter fetch action
  if (req.body?.action === 'getCount') {
    try {
      const r = await fetch(`https://api.counterapi.dev/v1/${COUNTER_NS}/${COUNTER_KEY}`);
      const d = await r.json();
      return res.status(200).json({ count: (d.count || 0) + COUNTER_OFFSET });
    } catch {
      return res.status(200).json({ count: COUNTER_OFFSET });
    }
  }

  try {
    const { email, funding_goal, email_list_size, vip_deposits, cogs_per_unit, shipping_per_unit, has_video, prototype_status, weeks_to_launch, debug } = req.body;

    const avg_pledge = Math.round((funding_goal / 400) * 0.75);
    const backers_needed = Math.round(funding_goal / avg_pledge);
    const email_list_needed = backers_needed * 3;
    const day1_target = Math.round(funding_goal * 0.30);

    const userMessage = `Analyze this campaign:
FUNDING GOAL: $${Number(funding_goal).toLocaleString()}
EMAIL LIST: ${Number(email_list_size).toLocaleString()} subscribers
VIP DEPOSITS: ${Number(vip_deposits).toLocaleString()} people
COGS PER UNIT: $${cogs_per_unit}
SHIPPING PER UNIT: $${shipping_per_unit}
CAMPAIGN VIDEO: ${has_video || 'no'}
PROTOTYPE STATUS: ${prototype_status}
WEEKS UNTIL LAUNCH: ${weeks_to_launch}

Pre-calculated:
- Est avg pledge: $${avg_pledge}
- Backers needed: ${backers_needed}
- Day 1 target (30%): $${day1_target.toLocaleString()}
- Safe email target: ${email_list_needed.toLocaleString()}
- Email gap: ${Math.max(0, email_list_needed - email_list_size).toLocaleString()}

Return JSON only.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }]
      })
    });

    const data = await response.json();
    const text = data.content?.[0]?.text?.trim?.() ?? '';
    const clean = text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);

    // Hit counter (fire and forget)
    fetch(`https://api.counterapi.dev/v1/${COUNTER_NS}/${COUNTER_KEY}/up`).catch(() => {});

    // Send results email (best-effort)
    const resendDebug = await sendResultsEmail({ email, result, debug });

    // Add to Systeme.io (non-blocking)
    const systemeDebug = await upsertSystemeAndTag({ email });

    if (debug) {
      return res.status(200).json({
        ...result,
        _debug: {
          resend: resendDebug,
          systeme: systemeDebug
        }
      });
    }

    return res.status(200).json(result);

  } catch (err) {
    return res.status(500).json({ error: 'Analysis failed', detail: err?.message || String(err) });
  }
}

