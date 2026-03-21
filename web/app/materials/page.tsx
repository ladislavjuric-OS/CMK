import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crowdfunding Momentum Kit — Materials",
  description:
    "CMK materials: Standard, Pro, and Blueprint tiers. Self-serve operational system built from real crowdfunding campaigns.",
};

export default function MaterialsPage() {
  return (
    <main className="pg-materials">
      <div className="classified-bar">
        ⚠ CLASSIFIED OPERATIONAL DOCUMENT — CROWDFUNDING MOMENTUM KIT · THE ARCHITECT ⚠
      </div>

      <nav>
        <div className="nav-brand">
          <div className="nav-icon">TA</div>
          <Link className="nav-name" href="/">
            The <span>Architect</span>
          </Link>
        </div>
        <div className="nav-right">
          <div className="nav-stat">
            <b>$890K+</b> raised · 5 campaigns
          </div>
          <a href="#pricing" className="btn-nav">
            Get the Kit
          </a>
        </div>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="hero-left">
          <div className="classified-tag">Crowdfunding Operations · KS / IGG</div>
          <h1>
            The Only
            <br />
            <span className="line-amber">Crowdfunding</span>
            <br />
            OS That Runs
            <br />
            on Real Scars.
            <span className="line-dim">
              "Most consultants sell you the dream. I sell you the blueprint that survived contact with reality."
            </span>
          </h1>
          <p className="hero-desc">
            $890K raised. 5 campaigns. Every expensive mistake documented so you don&apos;t repeat it. Self-serve
            materials that run on the same system I used to build two international brands.
          </p>
          <div className="hero-stats">
            <div>
              <div className="stat-num">$890K</div>
              <div className="stat-label">Raised across campaigns</div>
            </div>
            <div>
              <div className="stat-num">111</div>
              <div className="stat-label">Battle-tested tactics</div>
            </div>
            <div>
              <div className="stat-num">5</div>
              <div className="stat-label">Real campaigns</div>
            </div>
          </div>

          {/* PATH GATE */}
          <div className="path-gate">
            <a href="#pricing" className="path-card active">
              <div className="path-label">
                <span className="path-dot" />
                Path A · Ready
              </div>
              <div className="path-title">
                I know I&apos;m launching.
                <br />
                Give me the system.
              </div>
              <div className="path-desc">
                You&apos;ve decided. You need a framework that covers every critical variable before you press
                Launch.
              </div>
              <div className="path-cta">→ See CMK Tiers</div>
            </a>
            <Link href="/tools/readiness" className="path-card">
              <div className="path-label">
                <span className="path-dot" />
                Path B · Not Sure Yet
              </div>
              <div className="path-title">
                I don&apos;t know
                <br />
                where I stand.
              </div>
              <div className="path-desc">
                Free. 4 minutes. Get a scored readiness report on your campaign before you spend anything.
              </div>
              <div className="path-cta">→ Take the Free Check</div>
            </Link>
          </div>
        </div>

        {/* DOC MOCKUP */}
        <div className="hero-right">
          <div className="doc-mockup">
            <div className="doc-header">
              <span className="doc-title">Campaign Intelligence Report</span>
              <span className="doc-ref">REF: CIR-SAMPLE-001</span>
            </div>
            <div className="doc-body">
              <div className="doc-st">Pre-Launch Infrastructure</div>
              <div className="doc-row">
                <span>Email list (30% rule target)</span>
                <span className="warn">847 / min. 2,000</span>
              </div>
              <div className="doc-row">
                <span>Day 1 backer pipeline</span>
                <span className="fail">NOT BUILT</span>
              </div>
              <div className="doc-row">
                <span>VIP reservation funnel</span>
                <span className="fail">0 / 50 target</span>
              </div>
              <div className="doc-row">
                <span>Demand validation</span>
                <span className="ok">✓ CONFIRMED</span>
              </div>
              <hr className="doc-div" />
              <div className="doc-st">Financial Readiness</div>
              <div className="doc-row">
                <span>COGS accuracy</span>
                <span className="fail">23% underestimated</span>
              </div>
              <div className="doc-row">
                <span>Refund reserve (5%)</span>
                <span className="fail">NOT ALLOCATED</span>
              </div>
              <div className="doc-row">
                <span>Hidden cost tracker</span>
                <span className="ok">✓ IN KIT</span>
              </div>
              <hr className="doc-div" />
              <div className="doc-st">Campaign Page</div>
              <div className="doc-row">
                <span>Video length</span>
                <span className="fail">4:12 / max 1:30</span>
              </div>
              <div className="doc-row">
                <span>Perk structure</span>
                <span className="warn">2 tiers / need 4</span>
              </div>
              <div className="doc-row">
                <span>Social proof elements</span>
                <span className="ok">✓ STRONG</span>
              </div>
              <div className="doc-score">
                <span className="doc-score-label">⬡ READINESS SCORE</span>
                <span className="doc-score-val">28 / 100 — NO-GO</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="section-divider" />

      {/* THE PROBLEM */}
      <section className="section reveal">
        <div className="section-eyebrow">The Problem</div>
        <h2>
          Why <em>90%</em> of Campaigns
          <br />
          Die in 48 Hours.
        </h2>
        <p className="section-sub">
          They follow YouTube advice. They hire &quot;gurus&quot; who&apos;ve never shipped a product. They skip
          the Day 1 army. The blueprint doesn&apos;t match reality.
        </p>
        <div className="gap-grid">
          <div className="gap-col bad">
            <div className="gap-col-title">✕ Generic Advice</div>
            <div className="gap-item">
              <span>✕</span>
              <span>Theoretical scenarios — no real dollar amounts</span>
            </div>
            <div className="gap-item">
              <span>✕</span>
              <span>Budget templates that ignore the 20% stupidity tax</span>
            </div>
            <div className="gap-item">
              <span>✕</span>
              <span>No Day 1 army — launch to silence</span>
            </div>
            <div className="gap-item">
              <span>✕</span>
              <span>Shipping costs wrong — $42 budgeted, $58 real</span>
            </div>
            <div className="gap-item">
              <span>✕</span>
              <span>No Dead Zone recovery plan for days 10–20</span>
            </div>
            <div className="gap-item">
              <span>✕</span>
              <span>Zero brutal honesty about what doesn&apos;t work</span>
            </div>
          </div>
          <div className="gap-vs">
            <div className="vs-badge">VS</div>
          </div>
          <div className="gap-col good">
            <div className="gap-col-title">✓ The Architect&apos;s System</div>
            <div className="gap-item">
              <span className="text-amber">✓</span>
              <span>111 real war stories with exact dollar figures</span>
            </div>
            <div className="gap-item">
              <span className="text-amber">✓</span>
              <span>Budget calculator with stupidity tax built in</span>
            </div>
            <div className="gap-item">
              <span className="text-amber">✓</span>
              <span>Super-backer database + 48-hour launch playbook</span>
            </div>
            <div className="gap-item">
              <span className="text-amber">✓</span>
              <span>23-touchpoint hidden cost tracker, real benchmarks</span>
            </div>
            <div className="gap-item">
              <span className="text-amber">✓</span>
              <span>Dead Zone Recovery Playbook — pre-loaded for days 10–20</span>
            </div>
            <div className="gap-item">
              <span className="text-amber">✓</span>
              <span>Radical honesty — what doesn&apos;t work, documented in blood</span>
            </div>
          </div>
        </div>
        <div className="war-story">
          <div className="ws-label">▸ War Story — Bullet #44 / Baggizmo Campaign</div>
          <p className="ws-text">
            &quot;I shipped 800 packages to the US using a budget courier. Quoted: $4.80 per unit. Actual after
            residential surcharges, fuel fees, and redelivery: $8.40 per unit. That&apos;s $2,880 I never budgeted.
            The campaign was fully funded. The margin was gone. That number is now in the Hidden Cost Tracker so you
            never repeat it.&quot;
          </p>
          <div className="ws-numbers">
            <div>
              <div className="ws-num">$4.80</div>
              <div className="ws-desc">Quoted cost / unit</div>
            </div>
            <div>
              <div className="ws-num">$8.40</div>
              <div className="ws-desc">Actual cost / unit</div>
            </div>
            <div>
              <div className="ws-num">$2,880</div>
              <div className="ws-desc">Unbudgeted loss</div>
            </div>
            <div>
              <div className="ws-num">0</div>
              <div className="ws-desc">Times you&apos;ll repeat this</div>
            </div>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* SYSTEM CONTENTS */}
      <div className="section-full">
        <div className="inner reveal">
          <div className="section-eyebrow">System Contents</div>
          <h2>
            196+ Deliverables.
            <br />
            <em>One Operational System.</em>
          </h2>
          <p className="section-sub">
            Not a PDF dump. An operational OS covering every phase from idea to post-campaign retail. The materials are
            the deliverable — the knowledge is the product.
          </p>
          <div className="contents-grid">
            <div className="content-cell">
              <div className="content-cell-icon">📖</div>
              <div className="content-cell-title">The Elite Blueprint</div>
              <div className="content-cell-desc">
                11 chapters. 111 bullets, each with Task + Guidance + Architect&apos;s Cut + War Story. 444 actionable
                segments from real campaigns.
              </div>
              <div className="content-cell-count">444 segments</div>
            </div>
            <div className="content-cell">
              <div className="content-cell-icon">📊</div>
              <div className="content-cell-title">12 Calculators</div>
              <div className="content-cell-desc">
                Budget with Stupidity Tax, Hidden Cost Tracker (23-touchpoint), 3PL vs Direct, Cash Flow Waterfall, CAC
                Survival, Pricing Tier Builder.
              </div>
              <div className="content-cell-count">12 spreadsheets</div>
            </div>
            <div className="content-cell">
              <div className="content-cell-icon">⚔️</div>
              <div className="content-cell-title">10 Tactical Playbooks</div>
              <div className="content-cell-desc">
                48-Hour Launch Sequence, Dead Zone Recovery, Final 48H Surge, Amazon Survival, V2 Evolution, Day 101,
                Troll Response, Golden Sample Protocol.
              </div>
              <div className="content-cell-count">10 playbooks</div>
            </div>
            <div className="content-cell">
              <div className="content-cell-icon">✉️</div>
              <div className="content-cell-title">6 Email Sequences</div>
              <div className="content-cell-desc">
                Pre-launch nurture, Super-Backer outreach, Post-campaign vault, 14-day survey, Address Lock,
                Post-fulfillment loyalty (Day 3/14/30/60/90).
              </div>
              <div className="content-cell-count">6 sequences</div>
            </div>
            <div className="content-cell">
              <div className="content-cell-icon">✅</div>
              <div className="content-cell-title">9 Checklists</div>
              <div className="content-cell-desc">
                Landing page conversion, VAT/IOSS compliance, Post-campaign Day 1, Pledge Manager setup, IP Protection,
                Marine cargo insurance, QC inspection.
              </div>
              <div className="content-cell-count">9 checklists</div>
            </div>
            <div className="content-cell">
              <div className="content-cell-icon">🎁</div>
              <div className="content-cell-title">Bonus Vault</div>
              <div className="content-cell-desc">
                50+ Support Scripts, Baggizmo Case Study, Readiness Quiz, Master Press List, Commercial Invoice
                Template, SOP Documentation.
              </div>
              <div className="content-cell-count">15 items</div>
            </div>
            <div className="content-cell">
              <div className="content-cell-icon">🧪</div>
              <div className="content-cell-title">9 Scored Checkpoints</div>
              <div className="content-cell-desc">
                5 GO/NO-GO criteria at the end of every chapter. 45 self-assessment questions that tell you exactly
                where you&apos;re not ready.
              </div>
              <div className="content-cell-count">45 criteria</div>
            </div>
            <div className="content-cell">
              <div className="content-cell-icon">📐</div>
              <div className="content-cell-title">13 Templates</div>
              <div className="content-cell-desc">
                Competitor audit, influencer outreach, campaign video structure, perk architecture, backer update
                calendar, unboxing blueprint, VA onboarding.
              </div>
              <div className="content-cell-count">13 templates</div>
            </div>
          </div>
        </div>
      </div>

      <hr className="section-divider" />

      {/* CMK PRICING */}
      <section className="section" id="pricing">
        <div className="section-eyebrow">CMK Materials</div>
        <h2>
          One Arsenal.
          <br />
          <em>Three Tiers.</em>
        </h2>
        <p className="section-sub">
          Self-serve operational materials. Instant access. No consulting time included — this is the system you run
          yourself. Need my brain in the room?{" "}
          <Link href="/momentum" style={{ color: "var(--amber)", textDecoration: "none" }}>
            See Momentum Services →
          </Link>
        </p>

        {/* READINESS STRIP */}
        <div className="readiness-strip">
          <div className="rs-left">
            <div className="rs-icon">RC</div>
            <div>
              <div className="rs-label">Free Tool · 4 Minutes</div>
              <div className="rs-title">Not Sure Which Tier?</div>
              <div className="rs-desc">
                Take the Campaign Readiness Check first — it tells you exactly where your gaps are and which tier you
                need.
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
            <div className="rs-score-demo">
              <div className="rs-score-item">
                <div className="rs-score-num green">75+</div>
                <div className="rs-score-lbl">Blueprint</div>
              </div>
              <div style={{ color: "rgba(255,255,255,0.22)", fontSize: "1.2rem" }}>·</div>
              <div className="rs-score-item">
                <div className="rs-score-num amber">50–74</div>
                <div className="rs-score-lbl">Pro</div>
              </div>
              <div style={{ color: "rgba(255,255,255,0.22)", fontSize: "1.2rem" }}>·</div>
              <div className="rs-score-item">
                <div className="rs-score-num red">&lt;50</div>
                <div className="rs-score-lbl">Standard</div>
              </div>
            </div>
            <Link href="/tools/readiness" className="rs-cta">
              Take Free Check →
            </Link>
          </div>
        </div>

        <div className="pricing-grid reveal">
          {/* STANDARD */}
          <div className="price-card" id="tier-standard" style={{ scrollMarginTop: "5.5rem" }}>
            <div className="price-tier">// TIER 01 · Affiliate Available</div>
            <div className="price-name">Standard</div>
            <div className="price-desc">
              The knowledge layer. Everything you need to understand the battlefield before you step onto it.
            </div>
            <div className="price-amount">
              <sup>$</sup>299
            </div>
            <div className="price-note">One-time · Instant access · VAT may apply</div>
            <div
              style={{
                marginTop: "-6px",
                fontFamily: "var(--mono)",
                fontSize: "0.62rem",
                color: "var(--muted)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Best for: First-time founders who need the framework.
            </div>
            <hr className="price-divider" />
            <div className="price-includes">Includes:</div>
            <div className="price-feature">
              <span className="check">✓</span>
              <span className="label">Elite Blueprint (111 bullets, 11 chapters)</span>
            </div>
            <div className="price-feature">
              <span className="check">✓</span>
              <span className="label">9 Scored Checkpoints (45 GO/NO-GO criteria)</span>
            </div>
            <div className="price-feature">
              <span className="check">✓</span>
              <span className="label">111 War Stories with exact dollar figures</span>
            </div>
            <div className="price-feature">
              <span className="check">✓</span>
              <span className="label">Epilogue: The 101st Day Manifesto</span>
            </div>
            <div className="price-feature">
              <span className="cross">—</span>
              <span className="label dim">70 Plugin Tools</span>
            </div>
            <div className="price-feature">
              <span className="cross">—</span>
              <span className="label dim">Financial Calculators &amp; Playbooks</span>
            </div>
            <div className="price-feature">
              <span className="cross">—</span>
              <span className="label dim">Master Press List · Lifetime Updates</span>
            </div>
            <a href="https://payhip.com/b/rNsfn" className="btn-tier btn-ts" target="_blank" rel="noopener noreferrer">
              Get Standard
            </a>
          </div>

          {/* PRO */}
          <div className="price-card featured" id="tier-pro" style={{ scrollMarginTop: "5.5rem" }}>
            <div className="price-tier">// TIER 02 · Affiliate Available</div>
            <div className="price-name">Pro</div>
            <div className="price-desc">
              The full operational toolkit. Knowledge plus every calculator, playbook, and email sequence you&apos;ll
              actually run.
            </div>
            <div className="price-amount">
              <sup>$</sup>699
            </div>
            <div className="price-note">One-time · Instant access · VAT may apply</div>
            <div
              style={{
                marginTop: "-6px",
                fontFamily: "var(--mono)",
                fontSize: "0.62rem",
                color: "var(--muted)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Best for: Launching in 4–12 weeks and need tools + SOPs.
            </div>
            <hr className="price-divider" />
            <div className="price-includes">Everything in Standard, plus:</div>
            <div className="price-feature">
              <span className="check">✓</span>
              <span className="label">70 Plugin Tools — calculators, templates, scripts</span>
            </div>
            <div className="price-feature">
              <span className="check">✓</span>
              <span className="label">12 Financial Calculators incl. Hidden Cost Tracker</span>
            </div>
            <div className="price-feature">
              <span className="check">✓</span>
              <span className="label">10 Tactical Playbooks (48H Launch, Dead Zone, Surge)</span>
            </div>
            <div className="price-feature">
              <span className="check">✓</span>
              <span className="label">6 Complete Email Sequences</span>
            </div>
            <div className="price-feature">
              <span className="check">✓</span>
              <span className="label">Master Campaign Checklist</span>
            </div>
            <div className="price-feature">
              <span className="cross">—</span>
              <span className="label dim">Master Press List · Lifetime Updates</span>
            </div>
            <a href="https://payhip.com/b/JCx6L" className="btn-tier btn-tp" target="_blank" rel="noopener noreferrer">
              Get Pro
            </a>
          </div>

          {/* BLUEPRINT (API key: cmk_elite) */}
          <div className="price-card" id="tier-blueprint" style={{ scrollMarginTop: "5.5rem" }}>
            <div className="price-tier">// TIER 03 · Exclusive · No Affiliate</div>
            <div className="price-name">The Blueprint</div>
            <div className="price-desc">
              The complete system. Pro plus the press network, Baggizmo case study, $250K Mistake Map, and lifetime
              updates.
            </div>
            <div className="price-amount">
              <sup>$</sup>999
            </div>
            <div className="price-note">One-time · Instant access · Lifetime updates</div>
            <div
              style={{
                marginTop: "-6px",
                fontFamily: "var(--mono)",
                fontSize: "0.62rem",
                color: "var(--muted)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Best for: Serious campaigns and repeat operators.
            </div>
            <hr className="price-divider" />
            <div className="price-includes">Everything in Pro, plus:</div>
            <div className="price-feature">
              <span className="check">✓</span>
              <span className="label">Bonus Vault — 15 standalone deliverables</span>
            </div>
            <div className="price-feature">
              <span className="check">✓</span>
              <span className="label">50+ Support Scripts Vault</span>
            </div>
            <div className="price-feature">
              <span className="check">✓</span>
              <span className="label">Master Press List — 300+ journalists, searchable</span>
            </div>
            <div className="price-feature">
              <span className="check">✓</span>
              <span className="label">Full Baggizmo Case Study — real campaign, real numbers</span>
            </div>
            <div className="price-feature">
              <span className="check">✓</span>
              <span className="label">$250K Mistake Map — 29 most expensive errors</span>
            </div>
            <div className="price-feature">
              <span className="check">✓</span>
              <span className="label">Lifetime Updates — new war stories, new tools</span>
            </div>
            <a href="https://payhip.com/b/ALXuq" className="btn-tier btn-ts" target="_blank" rel="noopener noreferrer">
              Get The Blueprint
            </a>
          </div>
        </div>

        {/* AUDIT HOOK */}
        <div className="audit-hook reveal" id="audit">
          <div>
            <div className="ah-tag">▸ Not sure which tier? Need a diagnosis first.</div>
            <div className="ah-title">Get Your Campaign Intelligence Report.</div>
            <p className="ah-desc">
              Before you invest in a campaign — or before you relaunch a failing one — I run your numbers, your page,
              your strategy through the full 8-module framework. GO/NO-GO verdict. Every critical gap quantified in
              dollars. The report tells you which CMK tier your situation requires.
            </p>
            <div className="ah-items">
              <div className="ah-item">
                <span>✓</span>GO / NO-GO Verdict
              </div>
              <div className="ah-item">
                <span>✓</span>Win-Before-Launch Math
              </div>
              <div className="ah-item">
                <span>✓</span>Critical Gap Analysis
              </div>
              <div className="ah-item">
                <span>✓</span>Platform Risk Assessment
              </div>
              <div className="ah-item">
                <span>✓</span>Fix Priority Matrix
              </div>
              <div className="ah-item">
                <span>✓</span>72h delivery
              </div>
            </div>
          </div>
          <div className="ah-price-block">
            <div className="ah-price">
              <sup>$</sup>499
            </div>
            <div className="ah-price-note">One-time · 72h delivery · 30-day guarantee</div>
            <Link href="/audit" className="btn-primary">
              Order CIR — $499
            </Link>
          </div>
        </div>

        {/* MOMENTUM BRIDGE */}
        <div className="momentum-bridge reveal">
          <div className="mb-eyebrow">Next Level</div>
          <div className="mb-title">
            Need More Than Materials?
            <br />
            The Architect Comes With It.
          </div>
          <p className="mb-desc">
            CMK gives you the system. Momentum Services puts me in the room — reviewing your numbers, stress-testing
            your strategy, or running the entire campaign.
          </p>
          <Link href="/momentum" className="mb-cta">
            See Momentum Services →
          </Link>
          <div className="mb-cta-note">
            Application required for The Campaign and The Command · Very limited availability
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      <footer>
        <span>© 2026 The Architect™ · Elitegrowth d.o.o.</span>
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          <Link href="/data/privacy">Privacy Policy</Link>
          <Link href="/data/terms">Terms</Link>
          <Link href="/data/refund">Refund Policy</Link>
          <a href="mailto:hello@elitegrowth.pro">hello@elitegrowth.pro</a>
        </div>
      </footer>
    </main>
  );
}
