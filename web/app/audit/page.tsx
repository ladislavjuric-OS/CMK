import Link from "next/link";
import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Campaign Intelligence Report — The Architect · $499",
  description:
    "Campaign Intelligence Report (CIR): GO/NO-GO verdict, gaps quantified in dollars, and a fix sequence delivered in 72h.",
};

const DELIVERABLES = [
  { num: "01", title: "GO / NO-GO Verdict", desc: "A binary readiness score across pre-launch infrastructure, financials, page quality, and market positioning. One clear answer — with the reasoning behind it." },
  { num: "02", title: "Win-Before-Launch Math", desc: "The 30% Rule applied to your campaign. How many backers you need on Day 1, what email list size that requires, and whether your current pipeline can hit it." },
  { num: "03", title: "Critical Gap Analysis", desc: "The specific issues most likely to kill your campaign — each with a dollar amount showing the cost of leaving it unaddressed. No filler. Only what matters." },
  { num: "04", title: "Competitive Intelligence", desc: "3–5 similar campaigns benchmarked against yours. Where you're stronger. Where you're exposed. What their numbers actually mean for your positioning." },
  { num: "05", title: "Financial Reality Check", desc: "Your actual unit economics vs. what you think they are. COGS, shipping, platform fees, refund reserves — mapped against your funding goal and perk structure." },
  { num: "06", title: "Platform Risk Assessment", desc: "Kickstarter and Indiegogo compliance flags, fund hold triggers, Trust & Safety red zones — identified before they shut you down mid-campaign." },
  { num: "07", title: "Fix Priority Matrix", desc: "What to fix first, what can wait, what doesn't move the needle. Ranked by impact and effort. So you spend the next 30 days on the right things." },
  { num: "08", title: "Launch Path or Restart Plan", desc: "For GO campaigns: a phased launch sequence. For NO-GO campaigns: the exact rebuild roadmap — what to fix, in what order, before you spend another dollar." },
];

const PROCESS_STEPS = [
  { num: "01", title: "You Order", desc: "Pay $499. Within 1 hour you receive a confirmation and intake brief — 15 targeted questions about your campaign, product, financials, and current prep status." },
  { num: "02", title: "I Analyze", desc: "Your campaign goes through all 8 intelligence modules. Every number is benchmarked against real campaign data. Every gap is quantified. No assumptions left unchallenged." },
  { num: "03", title: "Report Delivered", desc: "Within 72 hours: GO / NO-GO verdict, full scorecard, critical gaps with dollar amounts, competitive benchmark, and your fix priority matrix or restart plan." },
  { num: "04", title: "You Execute", desc: "The report tells you exactly what to fix. CMK gives you the tools, or I step in as your Co-Pilot. Either way — you're not guessing anymore." },
];

const FAQ = [
  { q: "What do I need to provide?", a: "After payment you'll receive a 15-question intake brief. You'll need your campaign URL or draft, funding goal, unit cost estimate, shipping plan, email list size, and current prep status. The more complete your answers — the sharper the report. Quality in, quality out." },
  { q: "My campaign isn't live yet — is this still relevant?", a: "Pre-launch is where the CIR delivers the most value. I'll assess your readiness across all 8 modules — pre-launch infrastructure, financials, page, platform compliance, competitive positioning. You'll know exactly what to fix before you go live and before you spend on ads." },
  { q: "My campaign failed or was cancelled. Can this help?", a: "Yes — and this is one of the most common requests. A post-failure CIR includes a full post-mortem across all 8 modules, root cause identification (not just \"you didn't have enough traffic\"), and a detailed restart roadmap with exact sequencing." },
  { q: "How is this different from generic crowdfunding advice?", a: "Every gap in your report has a dollar amount attached. Every recommendation references benchmarks from real campaigns. The framework is the same one I use on campaigns I personally run — not theory extracted from blog posts. And unlike generic advice, this is built on your specific numbers, your product category, and your platform." },
  { q: "What if I need more than just the report?", a: "Every CIR ends with a clear path forward — three options depending on your situation: execute independently with CMK ($299–$999), work with me directly as Co-Pilot, or full campaign architecture. The report will tell you which level your situation actually requires." },
  { q: "How does the 30-day guarantee work?", a: "Implement at least 3 of the critical recommendations from your report. If your campaign metrics don't improve by 15%+ within 30 days — email me with proof of implementation and I'll re-audit for free and build your restart plan personally." },
];

export default function AuditPage() {
  return (
    <div className="audit-page">
      <div className="audit-classified">
        ⚠ CAMPAIGN INTELLIGENCE REPORT — THE ARCHITECT · LAUNCH ENGINEERING ⚠
      </div>
      <SiteNav />

      <div className="audit-hero">
        <div>
          <div className="audit-tag">Campaign Intelligence Report · $499 · 72h Delivery</div>
          <h1>
            Before You Launch —<br />
            <span className="audit-amber">Know The Verdict.</span>
            <span className="audit-sub">
              &quot;I run your campaign through 8 intelligence modules. You get a GO / NO-GO score,
              every critical gap quantified in dollars, and an exact fix sequence. Not theory.
              Operator math.&quot;
            </span>
          </h1>
          <p className="audit-hero-desc">
            Most campaigns fail in the preparation phase — not on launch day. The Campaign
            Intelligence Report tells you exactly where you stand, what will kill your campaign,
            and what to fix first. Before you spend a dollar on ads.
          </p>
          <div className="audit-price-big">
            <sup>$</sup>499
          </div>
          <div className="audit-price-note">
            One-time · Delivered within 72 hours · 30-day improvement guarantee · VAT may apply for
            EU customers
          </div>
          <div className="audit-btn-row">
            <a
              href="https://payhip.com/b/FP7Aq"
              className="audit-btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Order Your Intelligence Report
            </a>
            <Link href="/tools/intake" className="audit-btn-intake">
              Fill intake brief first →
            </Link>
          </div>
          <span className="audit-btn-guarantee">
            🛡 If your campaign doesn&apos;t improve 15%+ in 30 days — I re-audit for free.
          </span>
        </div>
        <div className="audit-score-mockup">
          <div className="audit-sm-header">
            <span className="audit-sm-title">Campaign Intelligence Report</span>
            <span className="audit-sm-ref">REF: CIR-SAMPLE-001</span>
          </div>
          <div className="audit-sm-body">
            <div className="audit-sm-section">Pre-Launch Infrastructure</div>
            <div className="audit-sm-row">
              <span>Email list (30% rule target)</span>
              <span className="audit-warn">847 / min. 2,000</span>
            </div>
            <div className="audit-sm-row">
              <span>Day 1 backer pipeline</span>
              <span className="audit-fail">NOT BUILT</span>
            </div>
            <div className="audit-sm-row">
              <span>VIP reservation funnel</span>
              <span className="audit-fail">0 / 50 target</span>
            </div>
            <div className="audit-sm-row">
              <span>Demand validation done</span>
              <span className="audit-ok">✓ CONFIRMED</span>
            </div>
            <div className="audit-sm-section">Financial Readiness</div>
            <div className="audit-sm-row">
              <span>COGS accuracy</span>
              <span className="audit-fail">23% underestimated</span>
            </div>
            <div className="audit-sm-row">
              <span>Refund reserve (5%)</span>
              <span className="audit-fail">NOT ALLOCATED</span>
            </div>
            <div className="audit-sm-row">
              <span>Break-even math</span>
              <span className="audit-warn">Incomplete</span>
            </div>
            <div className="audit-sm-section">Campaign Page</div>
            <div className="audit-sm-row">
              <span>Video length</span>
              <span className="audit-fail">4:12 / max 1:30</span>
            </div>
            <div className="audit-sm-row">
              <span>Perk tiers</span>
              <span className="audit-warn">2 built / 4 needed</span>
            </div>
            <div className="audit-sm-row">
              <span>Social proof</span>
              <span className="audit-ok">✓ STRONG</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "rgba(0,255,204,0.07)",
                border: "1px solid rgba(0,255,204,0.18)",
                padding: "0.6rem 1rem",
                marginTop: "0.75rem",
                borderRadius: "14px",
              }}
            >
              <span className="audit-sm-title">⬡ READINESS SCORE</span>
              <span style={{ fontSize: "1.3rem", fontWeight: 900, color: "#ff5a6a" }}>
                28 / 100 — NO-GO
              </span>
            </div>
          </div>
        </div>
      </div>

      <hr className="audit-divider" />

      <div className="audit-section-full">
        <div className="audit-section">
          <div className="audit-eyebrow">▸ Report Deliverables</div>
          <h2>8 Intelligence<br /><em>Modules.</em></h2>
          <p className="audit-section-sub">
            Not a checklist. A custom campaign dossier built on your numbers, your page, your market
            — with dollar amounts attached to every gap found.
          </p>
          <div className="audit-del-grid">
            {DELIVERABLES.map((d) => (
              <div key={d.num} className="audit-del-cell">
                <div className="audit-del-num">{d.num}</div>
                <div className="audit-del-title">{d.title}</div>
                <div className="audit-del-desc">{d.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr className="audit-divider" />

      <section className="audit-section">
        <div className="audit-eyebrow">▸ Who This Is For</div>
        <h2>Two Moments.<br /><em>One Report.</em></h2>
        <p className="audit-section-sub">
          The Campaign Intelligence Report was built for founders at a decision point — either
          about to launch, or trying to understand why it went wrong.
        </p>
        <div className="audit-track-grid">
          <div className="audit-track-card">
            <div className="audit-track-label">▸ Track 01 — Pre-Launch</div>
            <div className="audit-track-title">You&apos;re about to launch. You need to know if you&apos;re ready.</div>
            <p className="audit-track-desc">
              You have a campaign in preparation. Maybe 30–60 days out. You&apos;ve done work — but you
              don&apos;t know what you don&apos;t know. The CIR gives you an operator&apos;s eyes on your
              campaign before you go live.
            </p>
            <ul className="audit-track-bullets">
              <li>Find out if your email list is large enough for Day 1 momentum</li>
              <li>Know if your perk pricing will hit your funding goal</li>
              <li>Identify platform compliance risks before they freeze your funds</li>
              <li>Get a GO / NO-GO score with a clear fix sequence</li>
            </ul>
          </div>
          <div className="audit-track-card">
            <div className="audit-track-label">▸ Track 02 — Post-Failure</div>
            <div className="audit-track-title">Your campaign failed. You need to know exactly why.</div>
            <p className="audit-track-desc">
              You launched. It didn&apos;t work — or it&apos;s live and struggling. Before you rebuild,
              you need a post-mortem that tells you the real cause, not just the symptom. Most
              founders guess wrong and repeat the same mistakes.
            </p>
            <ul className="audit-track-bullets">
              <li>Full post-mortem across all 8 intelligence modules</li>
              <li>Identify the root cause — not just &quot;not enough traffic&quot;</li>
              <li>Get a restart roadmap with exact sequencing</li>
              <li>Know what to change and what actually worked</li>
            </ul>
          </div>
        </div>
      </section>

      <hr className="audit-divider" />

      <section className="audit-section">
        <div className="audit-eyebrow">▸ How It Works</div>
        <h2>From Order<br /><em>to Report.</em></h2>
        <div className="audit-process-steps">
          {PROCESS_STEPS.map((s) => (
            <div key={s.num} className="audit-p-step">
              <div className="audit-p-num">{s.num}</div>
              <div className="audit-p-title">{s.title}</div>
              <p className="audit-p-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="audit-divider" />

      <section className="audit-section">
        <div className="audit-eyebrow">▸ Risk Reversal</div>
        <h2>The Architect&apos;s<br /><em>Guarantee.</em></h2>
        <div className="audit-guarantee-block">
          <div className="audit-g-label">✓ 30-Day Improvement Guarantee</div>
          <div className="audit-g-title">If It Doesn&apos;t Work — I Re-Audit for Free.</div>
          <p className="audit-g-text">
            Implement at least 3 of the critical fixes from your report. If your campaign metrics
            don&apos;t improve by 15%+ within 30 days — email me proof of implementation and I&apos;ll
            re-audit at no cost and personally build your restart plan.
          </p>
          <p className="audit-g-text" style={{ marginTop: "0.75rem" }}>
            Nobody else in crowdfunding consulting offers this. I do because I know the framework
            works — and I want to be accountable to it.
          </p>
        </div>
      </section>

      <hr className="audit-divider" />

      <section className="audit-section">
        <div className="audit-eyebrow">▸ Intel Briefing</div>
        <h2>Questions.<br /><em>Answered.</em></h2>
        <div className="audit-faq-grid">
          {FAQ.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p className="audit-faq-answer">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="audit-cta-bottom">
        <div className="audit-eyebrow" style={{ justifyContent: "center" }}>Deploy Intelligence</div>
        <h2>Stop Guessing.<br /><em>Get the Verdict.</em></h2>
        <p>
          72 hours from now you&apos;ll know exactly where your campaign stands, what will kill it if
          left unfixed, and the exact sequence to fix it. Dollar amounts on every gap. One clear
          verdict.
        </p>
        <a
          href="https://payhip.com/b/FP7Aq"
          className="audit-btn-primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          Order Your Intelligence Report — $499
        </a>
        <p style={{ fontSize: "0.65rem", color: "var(--cmk-muted)", marginTop: "1rem" }}>
          One-time · 72h delivery · 30-day improvement guarantee · VAT may apply for EU customers
        </p>
      </div>

      <SiteFooter />
    </div>
  );
}
