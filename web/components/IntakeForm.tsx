"use client";

import Link from "next/link";
import { useState } from "react";
import { computeIntakeScore } from "@/lib/intake-scoring";

const STAGE_OPTIONS = [
  "Concept only",
  "Working prototype",
  "Pre-production sample",
  "Production-ready",
  "Already in production",
];

const Q14_ASSETS = [
  "Main campaign video (script / filmed / edited / final)",
  "Hero image / key visual",
  "Product photography (studio shots)",
  "Lifestyle photography (product in use)",
  "GIFs / animations",
  "Explainer graphics / infographics",
  "Testimonials / reviews (video or written)",
  "Behind-the-scenes / manufacturing footage",
  "Press kit materials",
];

const YES_NO_UNSURE = ["Yes", "No", "Unsure"];

const TRACKING_TOOLS = ["Google Analytics 4", "Meta Pixel (Facebook/Instagram)", "UTM tracking system", "Conversion funnel tracking (landing → email)"];

const STATUS_OPTIONS = ["Live", "Planned", "Not Set Up"];

type FormState = Record<string, string | number | Record<string, string> | string[]>;

const emptyForm = (): FormState => ({
  email: "",
  q1_product: "",
  q2_stage: "",
  q3_manufacturing: "",
  q3_packaging: "",
  q3_labeling: "",
  q3_moq: "",
  q3_total: "",
  q4_certs: "",
  q5_msrp: "",
  q6_tooling: "",
  q6_production: "",
  q6_marketing: "",
  q6_ops: "",
  q6_other: "",
  q6_total: "",
  q7_prelaunch_budget: "",
  q8_country: "",
  q8_3pl: "",
  q8_domestic: "",
  q8_international: "",
  q8_handling: "",
  q8_timeline: "",
  q9_total_subscribers: "",
  q9_source: "",
  q9_open_rate: "",
  q9_click_rate: "",
  q9_platform: "",
  q10_instagram: "",
  q10_facebook: "",
  q10_tiktok: "",
  q10_youtube: "",
  q11_landing: "",
  q12_testing: "",
  q12a_charged: "",
  q12b_ads: "",
  q13_draft_page: "",
  q14_assets: [] as string[],
  q15a_decider: "",
  q15b_hours: "",
  q19_liquids: "",
  q19_drones: "",
  q19_medical: "",
  q19_crypto: "",
  q19_concept_only: "",
  q19a_roadmap: "",
  q20_tracking: {} as Record<string, string>,
  q20a_crm: "",
  q16_competitors: "",
  q17_launch_date: "",
  q18_concerns: "",
});

function getFormValue(form: FormState, key: string): string {
  const v = form[key];
  if (Array.isArray(v)) return "";
  if (typeof v === "object" && v !== null) return "";
  return String(v ?? "");
}

function setFormValue(form: FormState, key: string, value: string | number | string[]): FormState {
  return { ...form, [key]: value };
}

export default function IntakeForm() {
  const [form, setForm] = useState<FormState>(emptyForm());
  const [step, setStep] = useState<"form" | "submitting" | "done" | "error">("form");
  const [error, setError] = useState("");

  const set = (key: string, value: string | number | string[]) => {
    setForm((f) => setFormValue(f, key, value));
  };

  const toggleQ14 = (item: string) => {
    const current = (form.q14_assets as string[]) || [];
    const next = current.includes(item) ? current.filter((x) => x !== item) : [...current, item];
    set("q14_assets", next);
  };

  const setTracking = (tool: string, status: string) => {
    const current = (form.q20_tracking as Record<string, string>) || {};
    set("q20_tracking", { ...current, [tool]: status });
  };

  const validate = (): boolean => {
    const em = getFormValue(form, "email").trim();
    if (!em || !em.includes("@")) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!getFormValue(form, "q1_product").trim()) {
      setError("Please describe your product (Q1).");
      return false;
    }
    setError("");
    return true;
  };

  const submit = async () => {
    if (!validate()) return;
    setStep("submitting");
    setError("");

    const answers: Record<string, unknown> = {};
    Object.entries(form).forEach(([k, v]) => {
      if (k === "email") return;
      answers[k] = v;
    });

    const { score, verdict } = computeIntakeScore(answers);
    const payload = {
      answers,
      score,
      verdict,
      source: "intake_form",
    };

    try {
      const res = await fetch("/api/audit-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: getFormValue(form, "email").trim(),
          payload,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || data?.error || "Failed to submit");
      setStep("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submission failed. Try again.");
      setStep("form");
    }
  };

  if (step === "done") {
    return (
      <div className="pg-readiness">
        <div className="intake-done-card">
          <div className="intake-done-title">Brief submitted</div>
          <p className="intake-done-text">
            Thank you. Your Client Discovery Brief has been received. Based on your answers we&apos;ve calculated a preliminary readiness score; the full Campaign Intelligence Report will be delivered after you complete the order.
          </p>
          <Link href="/audit" className="btn-cp">
            Order Campaign Intelligence Report — $499
          </Link>
        </div>
      </div>
    );
  }

  const inputCls = "intake-inp";
  const labelCls = "intake-label";
  const sectionCls = "intake-section";

  return (
    <div className="pg-readiness pg-intake">
      <div className="readiness-hero">
        <div className="hero-eyebrow">Client Discovery Brief</div>
        <h1 className="readiness-h1">20 Questions for a Complete Audit</h1>
        <p className="hero-sub">
          Fill out as thoroughly as possible. Every answer impacts the quality of our audit. If you don&apos;t know — write &quot;N/A&quot;. That&apos;s valuable too.
        </p>
      </div>

      <div className="readiness-form">
        {/* Email first */}
        <div className="card">
          <div className="card-header"><div className="card-num">0</div><div className="card-title">Your email</div></div>
          <div className="card-body">
            <div className="field">
              <label className={labelCls}>Where should we send the report and follow-up?</label>
              <input
                type="email"
                className={inputCls}
                placeholder="your@email.com"
                value={getFormValue(form, "email")}
                onChange={(e) => set("email", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section A */}
        <div className={sectionCls}>
          <h2 className="intake-sec-title">Section A — Product & Brand</h2>

          <div className="card">
            <div className="card-header"><div className="card-num">1</div><div className="card-title">What is your product and its main function?</div></div>
            <div className="card-body">
              <div className="field">
                <label className={labelCls}>Describe in 2–3 sentences. What does it do, who is it for, why is it better?</label>
                <textarea className="intake-textarea" rows={4} placeholder="Product description…" value={getFormValue(form, "q1_product")} onChange={(e) => set("q1_product", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-num">2</div><div className="card-title">Product stage</div></div>
            <div className="card-body">
              <div className="field">
                <select className={inputCls} value={getFormValue(form, "q2_stage")} onChange={(e) => set("q2_stage", e.target.value)}>
                  <option value="">Select stage</option>
                  {STAGE_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-num">3</div><div className="card-title">COGS per unit (USD)</div></div>
            <div className="card-body">
              <div className="fg g3">
                <div className="field">
                  <label className={labelCls}>Manufacturing per unit ($)</label>
                  <input type="number" className={inputCls} placeholder="0" min={0} step={0.01} value={getFormValue(form, "q3_manufacturing")} onChange={(e) => set("q3_manufacturing", e.target.value)} />
                </div>
                <div className="field">
                  <label className={labelCls}>Packaging per unit ($)</label>
                  <input type="number" className={inputCls} placeholder="0" min={0} step={0.01} value={getFormValue(form, "q3_packaging")} onChange={(e) => set("q3_packaging", e.target.value)} />
                </div>
                <div className="field">
                  <label className={labelCls}>Labeling / inserts per unit ($)</label>
                  <input type="number" className={inputCls} placeholder="0" min={0} step={0.01} value={getFormValue(form, "q3_labeling")} onChange={(e) => set("q3_labeling", e.target.value)} />
                </div>
              </div>
              <div className="fg g3" style={{ marginTop: 14 }}>
                <div className="field">
                  <label className={labelCls}>MOQ (units)</label>
                  <input type="text" className={inputCls} placeholder="—" value={getFormValue(form, "q3_moq")} onChange={(e) => set("q3_moq", e.target.value)} />
                </div>
                <div className="field">
                  <label className={labelCls}>Total COGS per unit ($)</label>
                  <input type="number" className={inputCls} placeholder="0" min={0} step={0.01} value={getFormValue(form, "q3_total")} onChange={(e) => set("q3_total", e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-num">4</div><div className="card-title">Certificates, permits, safety documentation</div></div>
            <div className="card-body">
              <div className="field">
                <label className={labelCls}>MSDS, CE, FCC, UL, FDA, leak-test, etc. What you have and what you&apos;re missing.</label>
                <textarea className="intake-textarea" rows={3} placeholder="List or N/A" value={getFormValue(form, "q4_certs")} onChange={(e) => set("q4_certs", e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* Section B */}
        <div className={sectionCls}>
          <h2 className="intake-sec-title">Section B — Finances & Pricing</h2>

          <div className="card">
            <div className="card-header"><div className="card-num">5</div><div className="card-title">Planned retail price (MSRP) $</div></div>
            <div className="card-body">
              <div className="field">
                <input type="number" className={inputCls} placeholder="0" min={0} step={0.01} value={getFormValue(form, "q5_msrp")} onChange={(e) => set("q5_msrp", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-num">6</div><div className="card-title">Funding goal breakdown (USD)</div></div>
            <div className="card-body">
              <div className="fg g3">
                <div className="field"><label className={labelCls}>Tooling / Moulds</label><input type="number" className={inputCls} placeholder="0" min={0} value={getFormValue(form, "q6_tooling")} onChange={(e) => set("q6_tooling", e.target.value)} /></div>
                <div className="field"><label className={labelCls}>First batch production</label><input type="number" className={inputCls} placeholder="0" min={0} value={getFormValue(form, "q6_production")} onChange={(e) => set("q6_production", e.target.value)} /></div>
                <div className="field"><label className={labelCls}>Marketing / Ads</label><input type="number" className={inputCls} placeholder="0" min={0} value={getFormValue(form, "q6_marketing")} onChange={(e) => set("q6_marketing", e.target.value)} /></div>
                <div className="field"><label className={labelCls}>Operations / Logistics</label><input type="number" className={inputCls} placeholder="0" min={0} value={getFormValue(form, "q6_ops")} onChange={(e) => set("q6_ops", e.target.value)} /></div>
                <div className="field"><label className={labelCls}>Other</label><input type="number" className={inputCls} placeholder="0" min={0} value={getFormValue(form, "q6_other")} onChange={(e) => set("q6_other", e.target.value)} /></div>
                <div className="field"><label className={labelCls}>Total funding goal</label><input type="number" className={inputCls} placeholder="0" min={0} value={getFormValue(form, "q6_total")} onChange={(e) => set("q6_total", e.target.value)} /></div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-num">7</div><div className="card-title">Pre-launch marketing budget (USD)</div></div>
            <div className="card-body">
              <div className="field">
                <label className={labelCls}>Ads, PR, influencers, video — before launch. If none, enter 0.</label>
                <input type="number" className={inputCls} placeholder="0" min={0} value={getFormValue(form, "q7_prelaunch_budget")} onChange={(e) => set("q7_prelaunch_budget", e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* Section C */}
        <div className={sectionCls}>
          <h2 className="intake-sec-title">Section C — Shipping & Logistics</h2>
          <div className="card">
            <div className="card-header"><div className="card-num">8</div><div className="card-title">Delivery plan</div></div>
            <div className="card-body">
              <div className="fg g3">
                <div className="field"><label className={labelCls}>Shipping from (country)</label><input type="text" className={inputCls} placeholder="—" value={getFormValue(form, "q8_country")} onChange={(e) => set("q8_country", e.target.value)} /></div>
                <div className="field"><label className={labelCls}>3PL partner</label><input type="text" className={inputCls} placeholder="—" value={getFormValue(form, "q8_3pl")} onChange={(e) => set("q8_3pl", e.target.value)} /></div>
                <div className="field"><label className={labelCls}>Domestic shipping cost (est. $)</label><input type="number" className={inputCls} placeholder="0" min={0} value={getFormValue(form, "q8_domestic")} onChange={(e) => set("q8_domestic", e.target.value)} /></div>
                <div className="field"><label className={labelCls}>International shipping (est. $)</label><input type="number" className={inputCls} placeholder="0" min={0} value={getFormValue(form, "q8_international")} onChange={(e) => set("q8_international", e.target.value)} /></div>
                <div className="field"><label className={labelCls}>Special handling (hazmat, fragile?)</label><input type="text" className={inputCls} placeholder="—" value={getFormValue(form, "q8_handling")} onChange={(e) => set("q8_handling", e.target.value)} /></div>
                <div className="field"><label className={labelCls}>Delivery timeline (months after campaign)</label><input type="text" className={inputCls} placeholder="—" value={getFormValue(form, "q8_timeline")} onChange={(e) => set("q8_timeline", e.target.value)} /></div>
              </div>
            </div>
          </div>
        </div>

        {/* Section D */}
        <div className={sectionCls}>
          <h2 className="intake-sec-title">Section D — Audience & Marketing Assets</h2>
          <div className="card">
            <div className="card-header"><div className="card-num">9</div><div className="card-title">Email subscribers</div></div>
            <div className="card-body">
              <div className="fg g3">
                <div className="field"><label className={labelCls}>Total email subscribers</label><input type="number" className={inputCls} placeholder="0" min={0} value={getFormValue(form, "q9_total_subscribers")} onChange={(e) => set("q9_total_subscribers", e.target.value)} /></div>
                <div className="field"><label className={labelCls}>Source (organic / paid / existing)</label><input type="text" className={inputCls} placeholder="—" value={getFormValue(form, "q9_source")} onChange={(e) => set("q9_source", e.target.value)} /></div>
                <div className="field"><label className={labelCls}>Open rate %</label><input type="text" className={inputCls} placeholder="—" value={getFormValue(form, "q9_open_rate")} onChange={(e) => set("q9_open_rate", e.target.value)} /></div>
                <div className="field"><label className={labelCls}>Click rate %</label><input type="text" className={inputCls} placeholder="—" value={getFormValue(form, "q9_click_rate")} onChange={(e) => set("q9_click_rate", e.target.value)} /></div>
                <div className="field"><label className={labelCls}>Email platform</label><input type="text" className={inputCls} placeholder="Mailchimp, Klaviyo, etc." value={getFormValue(form, "q9_platform")} onChange={(e) => set("q9_platform", e.target.value)} /></div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-num">10</div><div className="card-title">{"Social media (followers / engagement)"}</div></div>
            <div className="card-body">
              <div className="fg g3">
                <div className="field"><label className={labelCls}>Instagram</label><input type="text" className={inputCls} placeholder="followers, eng %" value={getFormValue(form, "q10_instagram")} onChange={(e) => set("q10_instagram", e.target.value)} /></div>
                <div className="field"><label className={labelCls}>Facebook</label><input type="text" className={inputCls} placeholder="—" value={getFormValue(form, "q10_facebook")} onChange={(e) => set("q10_facebook", e.target.value)} /></div>
                <div className="field"><label className={labelCls}>TikTok</label><input type="text" className={inputCls} placeholder="—" value={getFormValue(form, "q10_tiktok")} onChange={(e) => set("q10_tiktok", e.target.value)} /></div>
                <div className="field"><label className={labelCls}>YouTube</label><input type="text" className={inputCls} placeholder="—" value={getFormValue(form, "q10_youtube")} onChange={(e) => set("q10_youtube", e.target.value)} /></div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-num">11</div><div className="card-title">{"Landing / pre-launch page"}</div></div>
            <div className="card-body">
              <div className="field">
                <label className={labelCls}>Link or tools (Systeme.io, Carrd, own site)</label>
                <input type="text" className={inputCls} placeholder="URL or N/A" value={getFormValue(form, "q11_landing")} onChange={(e) => set("q11_landing", e.target.value)} />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-num">12</div><div className="card-title">Leak-test video, ad testing, survey</div></div>
            <div className="card-body">
              <div className="field">
                <textarea className="intake-textarea" rows={2} placeholder="Results or reason not done" value={getFormValue(form, "q12_testing")} onChange={(e) => set("q12_testing", e.target.value)} />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-num">12A</div><div className="card-title">Ever charged for this product?</div></div>
            <div className="card-body">
              <div className="field">
                <label className={labelCls}>Pre-orders, deposits, early access — units/deposits and price</label>
                <textarea className="intake-textarea" rows={2} placeholder="—" value={getFormValue(form, "q12a_charged")} onChange={(e) => set("q12a_charged", e.target.value)} />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-num">12B</div><div className="card-title">Paid ads validation</div></div>
            <div className="card-body">
              <div className="field">
                <label className={labelCls}>CPL and conversion (landing → email). Or planned test budget.</label>
                <textarea className="intake-textarea" rows={2} placeholder="—" value={getFormValue(form, "q12b_ads")} onChange={(e) => set("q12b_ads", e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* Section E */}
        <div className={sectionCls}>
          <h2 className="intake-sec-title">Section E — Campaign Page & Content</h2>
          <div className="card">
            <div className="card-header"><div className="card-num">13</div><div className="card-title">Indiegogo draft page</div></div>
            <div className="card-body">
              <div className="field">
                <label className={labelCls}>Link and access, or current stage</label>
                <input type="text" className={inputCls} placeholder="—" value={getFormValue(form, "q13_draft_page")} onChange={(e) => set("q13_draft_page", e.target.value)} />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-num">14</div><div className="card-title">{"Video / visual materials"}</div></div>
            <div className="card-body">
              <div className="field">
                <label className={labelCls}>Check what you have</label>
                <div className="intake-checkgrid">
                  {Q14_ASSETS.map((item) => (
                    <label key={item} className="intake-check">
                      <input type="checkbox" checked={(form.q14_assets as string[])?.includes(item)} onChange={() => toggleQ14(item)} />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section F */}
        <div className={sectionCls}>
          <h2 className="intake-sec-title">Section F — Team & Resources</h2>
          <div className="card">
            <div className="card-header"><div className="card-num">15A</div><div className="card-title">Final decision authority</div></div>
            <div className="card-body">
              <div className="field">
                <label className={labelCls}>Who makes the final call on creative, pricing, timeline, go/no-go?</label>
                <input type="text" className={inputCls} placeholder="—" value={getFormValue(form, "q15a_decider")} onChange={(e) => set("q15a_decider", e.target.value)} />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-num">15B</div><div className="card-title">Hours per week (founder) for next 6–8 weeks</div></div>
            <div className="card-body">
              <div className="field">
                <input type="number" className={inputCls} placeholder="0" min={0} max={168} value={getFormValue(form, "q15b_hours")} onChange={(e) => set("q15b_hours", e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* Section G */}
        <div className={sectionCls}>
          <h2 className="intake-sec-title">Section G — Platform Risk & Readiness</h2>
          <div className="card">
            <div className="card-header"><div className="card-num">19</div><div className="card-title">High-risk category?</div></div>
            <div className="card-body">
              <div className="intake-ynu">
                {(["liquids", "drones", "medical", "crypto", "concept_only"] as const).map((key) => (
                  <div key={key} className="field">
                    <label className={labelCls}>
                      {key === "liquids" && "Liquids / Consumables"}
                      {key === "drones" && "Drones / Aviation"}
                      {key === "medical" && "Medical / Health claims"}
                      {key === "crypto" && "Crypto / Blockchain / Finance"}
                      {key === "concept_only" && "Concept-only (no working prototype)"}
                    </label>
                    <div className="seg-group">
                      {YES_NO_UNSURE.map((opt) => (
                        <label key={opt} className={`seg-opt ${getFormValue(form, `q19_${key}`) === opt ? "selected" : ""}`} onClick={() => set(`q19_${key}`, opt)}>
                          <input type="radio" readOnly checked={getFormValue(form, `q19_${key}`) === opt} />
                          <div className="seg-label">{opt}</div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-num">19A</div><div className="card-title">{"Engineering roadmap / project plan"}</div></div>
            <div className="card-body">
              <div className="field">
                <textarea className="intake-textarea" rows={2} placeholder="Describe or N/A" value={getFormValue(form, "q19a_roadmap")} onChange={(e) => set("q19a_roadmap", e.target.value)} />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-num">20</div><div className="card-title">Tracking & analytics</div></div>
            <div className="card-body">
              <div className="field">
                <label className={labelCls}>{"Status per tool: Live / Planned / Not Set Up"}</label>
                <div className="intake-tracking">
                  {TRACKING_TOOLS.map((tool) => (
                    <div key={tool} className="intake-tracking-row">
                      <span className="intake-tracking-name">{tool}</span>
                      <div className="seg-group">
                        {STATUS_OPTIONS.map((opt) => (
                          <label key={opt} className={`seg-opt ${(form.q20_tracking as Record<string, string>)?.[tool] === opt ? "selected" : ""}`} onClick={() => setTracking(tool, opt)}>
                          <input type="radio" readOnly checked={(form.q20_tracking as Record<string, string>)?.[tool] === opt} />
                          <div className="seg-label">{opt}</div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-num">20A</div><div className="card-title">{"CRM / email platform & landing integration"}</div></div>
            <div className="card-body">
              <div className="field">
                <input type="text" className={inputCls} placeholder="Tool name, integrated? Plan?" value={getFormValue(form, "q20a_crm")} onChange={(e) => set("q20a_crm", e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* Bonus */}
        <div className={sectionCls}>
          <h2 className="intake-sec-title">Bonus (optional)</h2>
          <div className="card">
            <div className="card-header"><div className="card-num">16</div><div className="card-title">Competitors who ran crowdfunding</div></div>
            <div className="card-body">
              <div className="field">
                <textarea className="intake-textarea" rows={2} placeholder="Links to campaigns" value={getFormValue(form, "q16_competitors")} onChange={(e) => set("q16_competitors", e.target.value)} />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-num">17</div><div className="card-title">Ideal launch date and why</div></div>
            <div className="card-body">
              <div className="field">
                <input type="text" className={inputCls} placeholder="—" value={getFormValue(form, "q17_launch_date")} onChange={(e) => set("q17_launch_date", e.target.value)} />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-num">18</div><div className="card-title">What concerns you most about this campaign?</div></div>
            <div className="card-body">
              <div className="field">
                <textarea className="intake-textarea" rows={3} placeholder="—" value={getFormValue(form, "q18_concerns")} onChange={(e) => set("q18_concerns", e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className="email-card">
          <div className="email-title">Submit your brief</div>
          <div className="email-sub">We&apos;ll calculate a preliminary readiness score and store your answers for the full Campaign Intelligence Report (after you order).</div>
          <button type="button" className="btn-go" onClick={submit} disabled={step === "submitting"}>
            {step === "submitting" ? "Submitting…" : "Submit Brief →"}
          </button>
          {error ? <div className="err-msg">{error}</div> : null}
        </div>
      </div>
    </div>
  );
}
