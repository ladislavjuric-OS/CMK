"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

const CATEGORIES = [
  { k: "win_before_launch", l: "Win-Before-Launch", m: 30 },
  { k: "financial_readiness", l: "Financial Readiness", m: 25 },
  { k: "campaign_readiness", l: "Campaign Readiness", m: 25 },
  { k: "timeline_realism", l: "Timeline Realism", m: 20 },
];

const CTAS: Record<string, { h: string; url: string; l: string }> = {
  audit: { h: "You Need a Full Campaign Audit.", url: "/audit", l: "Get Campaign Audit — $499" },
  cmk_standard: { h: "Start With the Campaign Intelligence Report.", url: "/audit", l: "Get CIR — $499" },
  cmk_pro: { h: "You Need a Full Campaign Audit.", url: "/audit", l: "Get Campaign Audit — $499" },
  cmk_elite: { h: "You Need a Full Campaign Audit.", url: "/audit", l: "Get Campaign Audit — $499" },
};

const VERDICT_MAP: Record<string, string> = {
  GO: "Campaign is Ready.",
  "CONDITIONAL GO": "Almost There — Fix These First.",
  "NO-GO": "Not Ready. Here's Why.",
};

type Result = {
  score: number;
  verdict: string;
  verdict_emoji: string;
  confidence: string;
  category_scores?: Record<string, number>;
  day1_math?: Record<string, number>;
  critical_gaps?: Array<{ priority: string; title: string; finding: string; fix: string }>;
  one_win?: string;
  cta?: string;
  cta_reason?: string;
};

export default function ReadinessChecker() {
  const [step, setStep] = useState<"form" | "loading" | "results">("form");
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [payload, setPayload] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");
  const [count, setCount] = useState<string>("—");
  const resultsRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    funding_goal: "",
    cogs_per_unit: "",
    shipping_per_unit: "",
    email_list_size: "",
    vip_deposits: "",
    email: "",
    prototype_status: "",
    has_video: "",
    weeks_to_launch: "",
  });

  const setSel = (name: string, value: string) => {
    setForm((f) => ({ ...f, [name]: value }));
  };

  useEffect(() => {
    fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getCount" }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d?.count > 0) setCount(Number(d.count).toLocaleString());
      })
      .catch(() => {});
  }, []);

  const validate = () => {
    if (!form.funding_goal?.trim()) {
      setError("Please enter your funding goal.");
      return false;
    }
    if (!form.email_list_size?.trim()) {
      setError("Please enter your email list size.");
      return false;
    }
    if (!form.weeks_to_launch) {
      setError("Please select weeks until launch.");
      return false;
    }
    const em = form.email?.trim() ?? "";
    if (!em || !em.includes("@")) {
      setError("Please enter a valid email.");
      return false;
    }
    setError("");
    return true;
  };

  const runAnalysis = async () => {
    if (!validate()) return;

    const p = {
      email: form.email.trim(),
      funding_goal: parseFloat(form.funding_goal) || 0,
      email_list_size: parseInt(form.email_list_size, 10) || 0,
      vip_deposits: parseInt(form.vip_deposits, 10) || 0,
      cogs_per_unit: parseFloat(form.cogs_per_unit) || 0,
      shipping_per_unit: parseFloat(form.shipping_per_unit) || 0,
      has_video: form.has_video || "no",
      prototype_status: form.prototype_status || "Concept only",
      weeks_to_launch: parseInt(form.weeks_to_launch, 10) || 6,
    };
    setPayload(p);
    setStep("loading");
    setLoadingStep(0);

    const steps = 5;
    for (let i = 0; i < steps; i++) {
      await new Promise((r) => setTimeout(r, 500 + i * 380));
      setLoadingStep(i + 1);
    }

    try {
      const r = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.detail || data?.error || "Analysis failed");
      setResult(data);
      setStep("results");
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);

      fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getCount" }),
      })
        .then((res) => res.json())
        .then((d) => {
          if (d?.count > 0) setCount(Number(d.count).toLocaleString());
        })
        .catch(() => {});
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed. Try again.");
      setStep("form");
    }
  };

  const restart = () => {
    setStep("form");
    setResult(null);
    setPayload(null);
    setError("");
  };

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/tools/readiness` : "https://cmk.elitegrowth.pro/tools/readiness";
  const shareX = () => {
    if (!result) return;
    const e = result.score >= 75 ? "🟢" : result.score >= 50 ? "🟡" : "🔴";
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `My Crowdfunding Readiness Score: ${result.score}/100 — ${result.verdict} ${e}\n\nFree check:\n${shareUrl}`
      )}`,
      "_blank"
    );
  };
  const shareLI = () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank");
  const copyLink = (ev: React.MouseEvent<HTMLButtonElement>) => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      const b = ev.currentTarget;
      const o = b.textContent;
      b.textContent = "✓ Copied";
      setTimeout(() => { b.textContent = o; }, 2000);
    });
  };

  if (step === "loading") {
    const steps = [
      "Loading campaign parameters",
      "Calculating Day 1 math (30% rule)",
      "Checking VIP funnel coverage",
      "Running financial model",
      "Scoring 4 readiness modules",
      "Generating verdict",
    ];
    return (
      <div className="pg-readiness">
        <div id="loading" className="readiness-loading">
          <div className="load-card">
            <div className="load-title">Analyzing your campaign…</div>
            <div className="load-steps">
              {steps.map((text, i) => (
                <div
                  key={i}
                  className={`ls ${i < loadingStep ? "done" : i === loadingStep ? "active" : ""}`}
                >
                  <div className="ls-icon">
                    {i < loadingStep ? "✓" : i === loadingStep ? <span className="pulse">●</span> : i + 1}
                  </div>
                  <div className="ls-text">{text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === "results" && result) {
    const scoreColor = result.score >= 75 ? "#16a34a" : result.score >= 50 ? "#ca8a04" : "#dc2626";
    const vc = result.verdict === "GO" ? "go" : result.verdict === "CONDITIONAL GO" ? "cond" : "nogo";
    const c = 2 * Math.PI * 39;
    const dashOffset = c * (1 - result.score / 100);
    const cta = CTAS[result.cta ?? ""] ?? CTAS.audit;
    const m = result.day1_math ?? {};
    const fm = (n: number | undefined) => (n != null ? "$" + Number(n).toLocaleString() : "—");
    const fn = (n: number | undefined) => (n != null && n !== undefined ? Number(n).toLocaleString() : "—");
    const cc = (m.coverage_pct ?? 0) >= 80 ? "#16a34a" : (m.coverage_pct ?? 0) >= 50 ? "#ca8a04" : "#dc2626";

    return (
      <div className="pg-readiness" ref={resultsRef}>
        <div className="res-score-card">
          <div className="res-top">
            <div className="score-ring">
              <svg viewBox="0 0 90 90">
                <circle className="srb" cx="45" cy="45" r="39" />
                <circle
                  className="srf"
                  cx="45"
                  cy="45"
                  r="39"
                  style={{
                    stroke: scoreColor,
                    strokeDasharray: c,
                    strokeDashoffset: dashOffset,
                  }}
                />
              </svg>
              <div className="score-txt">
                <div className="score-num" style={{ color: scoreColor }}>
                  {result.score}
                </div>
                <div className="score-den">/ 100</div>
              </div>
            </div>
            <div className="res-right">
              <div className={`v-pill ${vc}`}>
                <span className="v-dot" />
                <span>{result.verdict_emoji} {result.verdict}</span>
              </div>
              <div className="v-title">{VERDICT_MAP[result.verdict] ?? result.verdict}</div>
              <div className="conf">Confidence: <span>{result.confidence}</span></div>
            </div>
          </div>
          <div className="cat-grid">
            {CATEGORIES.map((ca) => {
              const v = result.category_scores?.[ca.k] ?? 0;
              const pct = Math.round((v / ca.m) * 100);
              const co = pct >= 75 ? "#16a34a" : pct >= 50 ? "#ca8a04" : "#dc2626";
              return (
                <div key={ca.k} className="cat-cell">
                  <div className="cat-top2">
                    <div className="cat-nm">{ca.l}</div>
                    <div className="cat-sc" style={{ color: co }}>{v}/{ca.m}</div>
                  </div>
                  <div className="cat-track">
                    <div className="cat-bar" style={{ background: co, width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="math-card">
          <div className="sec-hdr"><div className="sec-lbl">Win-Before-Launch Math</div></div>
          <div className="math-cells">
            <div className="mc"><div className="mc-val">{fm(m.target)}</div><div className="mc-lbl">Day 1 Target (30%)</div></div>
            <div className="mc"><div className="mc-val" style={{ color: cc }}>{fm(m.projected_vip)}</div><div className="mc-lbl">Projected VIP Day 1</div></div>
            <div className="mc"><div className="mc-val" style={{ color: cc }}>{m.coverage_pct ?? 0}%</div><div className="mc-lbl">Day 1 Coverage</div></div>
            <div className="mc"><div className="mc-val">{fn(m.email_list_needed)}</div><div className="mc-lbl">Email List Needed</div></div>
            <div className="mc"><div className="mc-val" style={{ color: (m.email_gap ?? 0) > 0 ? "#dc2626" : "#16a34a" }}>{fn(m.email_gap) ?? "0"}</div><div className="mc-lbl">Email Gap</div></div>
            <div className="mc"><div className="mc-val" style={{ color: "#8a8a84" }}>{fn(payload?.email_list_size as number)}</div><div className="mc-lbl">Your Current List</div></div>
          </div>
        </div>

        <div className="gaps-card">
          <div className="sec-hdr"><div className="sec-lbl">Critical Gaps Found</div></div>
          <div className="glist">
            {(result.critical_gaps && result.critical_gaps.length > 0)
              ? result.critical_gaps.map((g, i) => (
                  <div key={i} className="gap">
                    <div className="gap-top">
                      <span className={`g-badge ${g.priority.toLowerCase()}`}>{g.priority}</span>
                      <span className="g-title">{g.title}</span>
                    </div>
                    <div className="g-finding">{g.finding}</div>
                    <div className="g-fix">{g.fix}</div>
                  </div>
                ))
              : (
                  <div className="gap" style={{ color: "#16a34a", fontSize: "13px" }}>
                    No critical blockers found.
                  </div>
                )}
          </div>
        </div>

        <div className="win-card">
          <div className="win-ico">✓</div>
          <div>
            <div className="win-lbl">What you&apos;re doing right</div>
            <div className="win-txt">{result.one_win ?? ""}</div>
          </div>
        </div>

        <div className="cta-card">
          <div className="cta-ey">Next Step</div>
          <div className="cta-h">{cta.h}</div>
          <div className="cta-r">{result.cta_reason ?? ""}</div>
          <div className="cta-btns">
            <Link href={cta.url} className="btn-cp">{cta.l}</Link>
            <Link href="/materials" className="btn-cs">View materials</Link>
          </div>
        </div>

        <div className="share-card">
          <div className="share-lbl">Share your score</div>
          <div className="share-btns">
            <button type="button" className="s-btn" onClick={shareX}>Share on 𝕏</button>
            <button type="button" className="s-btn" onClick={shareLI}>LinkedIn</button>
            <button type="button" className="s-btn" onClick={copyLink}>Copy Link</button>
          </div>
        </div>

        <div className="restart-row">
          <button type="button" className="btn-restart" onClick={restart}>← Analyze another campaign</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pg-readiness">
      <div className="readiness-hero">
        <div className="hero-eyebrow">Campaign Readiness Checker</div>
        <h1 className="readiness-h1">Is Your Campaign<br /><em>Ready to Launch?</em></h1>
        <p className="hero-sub">8 questions. AI-powered score built on real campaign data from $890K raised across 5 campaigns — not generic advice.</p>
        <div className="hero-meta">
          <div className="hero-stat"><div className="hero-dot" style={{ background: "#16a34a" }} />~2 minutes</div>
          <div className="hero-stat"><div className="hero-dot" style={{ background: "#2563eb" }} />Free, instant results</div>
          <div className="hero-stat"><div className="hero-dot" style={{ background: "#ca8a04" }} />Real numbers, no fluff</div>
          <div className="hero-stat readiness-counter">
            <div className="hero-dot" style={{ background: "#8a8a84" }} />
            <span id="counter">{count}</span> campaigns analyzed
          </div>
        </div>
      </div>
      <div className="readiness-form">
        <div className="card">
          <div className="card-header"><div className="card-num">1</div><div className="card-title">Financials</div></div>
          <div className="card-body">
            <div className="fg g3">
              <div className={`field ${!form.funding_goal && error ? "invalid" : ""}`}>
                <label>Funding Goal ($) <span className="h">— your KS/IGG target</span></label>
                <input
                  type="number"
                  placeholder="50,000"
                  min={1000}
                  value={form.funding_goal}
                  onChange={(e) => setForm((f) => ({ ...f, funding_goal: e.target.value }))}
                />
                <span className="field-err">Required</span>
              </div>
              <div className="field">
                <label>COGS Per Unit ($) <span className="h">— production cost</span></label>
                <input
                  type="number"
                  placeholder="22"
                  value={form.cogs_per_unit}
                  onChange={(e) => setForm((f) => ({ ...f, cogs_per_unit: e.target.value }))}
                />
              </div>
              <div className="field">
                <label>Shipping Per Unit ($) <span className="h">— avg to backer</span></label>
                <input
                  type="number"
                  placeholder="7"
                  value={form.shipping_per_unit}
                  onChange={(e) => setForm((f) => ({ ...f, shipping_per_unit: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-num">2</div><div className="card-title">Audience & List</div></div>
          <div className="card-body">
            <div className="fg">
              <div className={`field ${!form.email_list_size && error ? "invalid" : ""}`}>
                <label>Email List Size <span className="h">— verified subscribers</span></label>
                <input
                  type="number"
                  placeholder="1,200"
                  min={0}
                  value={form.email_list_size}
                  onChange={(e) => setForm((f) => ({ ...f, email_list_size: e.target.value }))}
                />
                <span className="field-err">Required</span>
              </div>
              <div className="field">
                <label>VIP Deposits / Reservations <span className="h">— $1–5 pre-commits</span></label>
                <input
                  type="number"
                  placeholder="85"
                  min={0}
                  value={form.vip_deposits}
                  onChange={(e) => setForm((f) => ({ ...f, vip_deposits: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-num">3</div><div className="card-title">Campaign Readiness</div></div>
          <div className="card-body readiness-card-body">
            <div className="field">
              <label className="rc-label">Prototype Status</label>
              <div className="rc-grid">
                {[
                  { v: "Concept only", sub: "Renders / idea stage" },
                  { v: "Working prototype", sub: "Functional, not final" },
                  { v: "Production-ready", sub: "Final specs confirmed" },
                  { v: "Already manufactured", sub: "Stock in hand" },
                ].map((opt) => (
                  <label
                    key={opt.v}
                    className={`rc ${form.prototype_status === opt.v ? "selected" : ""}`}
                    onClick={() => setSel("prototype_status", opt.v)}
                  >
                    <input type="radio" name="ps" readOnly checked={form.prototype_status === opt.v} />
                    <div className="rc-dot" />
                    <div>
                      <div className="rc-lbl">{opt.v}</div>
                      <span className="rc-sub">{opt.sub}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="field">
              <label className="rc-label">Campaign Video</label>
              <div className="seg-group">
                {["Yes, finished", "In production", "Not yet"].map((lbl, i) => {
                  const val = i === 0 ? "yes" : i === 1 ? "in_progress" : "no";
                  return (
                    <label
                      key={val}
                      className={`seg-opt ${form.has_video === val ? "selected" : ""}`}
                      onClick={() => setSel("has_video", val)}
                    >
                      <input type="radio" name="hv" readOnly checked={form.has_video === val} />
                      <div className="seg-label">{lbl}</div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-num">4</div><div className="card-title">Timeline</div></div>
          <div className="card-body">
            <div className="fg g1" style={{ maxWidth: 340 }}>
              <div className={`field ${!form.weeks_to_launch && error ? "invalid" : ""}`}>
                <label>Weeks Until Planned Launch</label>
                <select
                  value={form.weeks_to_launch}
                  onChange={(e) => setForm((f) => ({ ...f, weeks_to_launch: e.target.value }))}
                >
                  <option value="">Select timeframe</option>
                  <option value="1">Less than 2 weeks</option>
                  <option value="3">2–4 weeks</option>
                  <option value="6">4–8 weeks</option>
                  <option value="10">8–12 weeks</option>
                  <option value="14">12+ weeks</option>
                  <option value="0">Already live</option>
                </select>
                <span className="field-err">Required</span>
              </div>
            </div>
          </div>
        </div>

        <div className="email-card">
          <div className="email-title">Where should we send your results?</div>
          <div className="email-sub">Results appear on screen immediately, and we&apos;ll send a copy to your inbox.</div>
          <div className="email-row">
            <input
              className="email-inp"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
            <button type="button" className="btn-go" onClick={runAnalysis}>Run Analysis →</button>
          </div>
          <div className="email-note">No spam. Unsubscribe any time.</div>
          {error ? <div id="err-msg" className="err-msg">{error}</div> : null}
        </div>
      </div>
    </div>
  );
}
