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
    const { email, funding_goal, email_list_size, vip_deposits, cogs_per_unit, shipping_per_unit, has_video, prototype_status, weeks_to_launch } = req.body;

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

    // Add to Systeme.io (non-blocking)
    if (email && process.env.SYSTEME_API_KEY) {
      fetch('https://api.systeme.io/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-Key': process.env.SYSTEME_API_KEY },
        body: JSON.stringify({ email, tags: [{ name: 'readiness-checker' }] })
      }).catch(() => {});
    }

    return res.status(200).json(result);

  } catch (err) {
    return res.status(500).json({ error: 'Analysis failed', detail: err?.message || String(err) });
  }
}

