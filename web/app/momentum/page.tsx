import Link from "next/link";
import type { Metadata } from "next";
import ScrollRevealEffect from "@/components/ScrollRevealEffect";
import BioThumb from "@/components/BioThumb";

export const metadata: Metadata = {
  title: "Momentum Services — The Architect",
  description:
    "Momentum Services: post-audit execution options. Done-with-you and done-for-you engagement levels by The Architect.",
};

export default function MomentumPage() {
  return (
    <main className="pg-momentum">
      <div className="classified-bar">
        ⚠ MOMENTUM SERVICES — THE ARCHITECT · POST-AUDIT ENGAGEMENT OPTIONS ⚠
      </div>

      <nav>
        <div className="nav-brand">
          <div className="nav-icon">TA</div>
          <Link className="nav-name" href="/" aria-label="Back to CMK homepage">
            The <span>Architect</span>
          </Link>
        </div>
        <div className="nav-right">
          <div className="nav-stat">
            <b>$890K+</b> raised · 5 campaigns
          </div>
          <Link href="/audit" className="btn-nav">
            Get the Audit First
          </Link>
        </div>
      </nav>

      <div className="hero">
        <div className="hero-left">
          <div className="classified-tag">Post-Audit Engagement · The Architect</div>
          <h1>
            You Read
            <br />
            <span className="line-amber">The Report.</span>
            <br />
            Now Let&apos;s
            <br />
            Execute It.
            <span className="line-dim">
              &quot;The audit tells you what&apos;s broken. This is where we fix it — together, or I take the wheel entirely.&quot;
            </span>
          </h1>
          <p className="hero-desc">
            Three engagement levels. The difference isn&apos;t what you get — it&apos;s how much of my time and brain is in the room with you.
          </p>

          <div className="qualifier">
            <div className="qualifier-label">▸ This is for you if:</div>
            <div className="qual-row">
              <span className="qual-check">✓</span>
              <span className="qual-text">You&apos;ve completed an Audit or already know what&apos;s blocking you</span>
            </div>
            <div className="qual-row">
              <span className="qual-check">✓</span>
              <span className="qual-text">You have a product, prototype, or campaign in preparation</span>
            </div>
            <div className="qual-row">
              <span className="qual-check">✓</span>
              <span className="qual-text">You need a system and execution — not more information</span>
            </div>
            <div className="qual-row qual-row-note">
              <span className="qual-cross">✕</span>
              <span className="qual-text qual-text-muted">
                Not sure where you stand yet?{" "}
                <Link href="/tools/readiness" style={{ color: "var(--cmk-accent)", textDecoration: "none" }}>
                  Take the free Readiness Check →
                </Link>
              </span>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="flow-diagram">
            <div className="flow-header">
              <span>Your Path Forward</span>
              <span className="flow-header-muted">Select your level</span>
            </div>
            <div className="flow-body">
              <div className="flow-step">
                <div className="flow-node done">✓</div>
                <div className="flow-label">
                  Readiness Checker
                  <span className="flow-amt green">FREE</span>
                  <span className="muted">Where you stand before you start</span>
                </div>
              </div>
              <div className="flow-connector" />
              <div className="flow-step">
                <div className="flow-node done">✓</div>
                <div className="flow-label">
                  Campaign Audit — CIR
                  <span className="flow-amt green">$499</span>
                  <span className="muted">GO/NO-GO · gaps quantified · path forward</span>
                </div>
              </div>
              <div className="flow-connector" />
              <div className="flow-step">
                <div className="flow-node active">→</div>
                <div className="flow-label">
                  The Blueprint
                  <span>$999</span>
                  <span className="muted">System + CMK materials. You drive.</span>
                </div>
              </div>
              <div className="flow-connector" />
              <div className="flow-step">
                <div className="flow-node active">→</div>
                <div className="flow-label">
                  CMK Elite
                  <span>$1,997</span>
                  <span className="muted">Blueprint + 2h with The Architect</span>
                </div>
              </div>
              <div className="flow-connector" />
              <div className="flow-step">
                <div className="flow-node active">→</div>
                <div className="flow-label">
                  The Campaign
                  <span>$2,500</span>
                  <span className="muted">Done-With-You · 4 strategic calls</span>
                </div>
              </div>
              <div className="flow-connector" />
              <div className="flow-step">
                <div className="flow-node active">→</div>
                <div className="flow-label">
                  The Command
                  <span>$10K+</span>
                  <span className="muted">Done-For-You · I take the wheel</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="section-divider" />

      <section className="section" id="tiers">
        <div className="section-eyebrow">Engagement Options</div>
        <h2>
          Three Levels.
          <br />
          <em>One Mission.</em>
        </h2>
        <p className="section-sub">
          Choose based on how much of my time you need in the room. The system is the same. The difference is execution depth.
        </p>

        <div className="tiers-stack reveal">
          <div className="tier-card">
            <div className="tier-inner">
              <div className="tier-left">
                <div className="tier-badge">DIY · Tier 01</div>
                <div className="tier-name">The Blueprint</div>
                <div className="tier-mode">// You build. I give you the plan.</div>
                <div className="tier-tagline">
                  &quot;The complete operational system for founders who are ready to execute — and just need the right framework to do it right.&quot;
                </div>
              </div>
              <div className="tier-middle">
                <div className="tier-includes">What you get:</div>
                <div className="tier-feature">
                  <span className="check">✓</span>
                  <span className="label">Complete Crowdfunding Momentum OS — all 11 SOPs, playbooks, calculators</span>
                </div>
                <div className="tier-feature">
                  <span className="check">✓</span>
                  <span className="label">Email sequences + influencer scripts + ad-spend calculators</span>
                </div>
                <div className="tier-feature">
                  <span className="check">✓</span>
                  <span className="label">Landing page review via Loom — my eyes on your copy and structure</span>
                </div>
                <div className="tier-feature">
                  <span className="check">✓</span>
                  <span className="label">One kickoff call — I orient you to the system and flag your top 3 risks</span>
                </div>
                <div className="tier-feature">
                  <span className="check">✓</span>
                  <span className="label">Baggizmo Case Study — $890K campaign, real numbers, real mistakes</span>
                </div>
                <div className="tier-feature">
                  <span className="check">✓</span>
                  <span className="label">Instant access · Notion workspace ready to duplicate</span>
                </div>
              </div>
              <div className="tier-right">
                <div>
                  <div className="tier-price">
                    <sup>$</sup>999
                  </div>
                  <div className="tier-price-note">
                    One-time · Instant access
                    <br />
                    VAT may apply for EU
                  </div>
                </div>
                <a href="https://payhip.com/b/ALXuq" className="btn-tier btn-secondary-tier">
                  Get The Blueprint
                </a>
              </div>
            </div>
          </div>

          <div className="tier-card featured">
            <div style={{ position: "relative" }}>
              <span className="featured-label">Recommended Post-Audit</span>
            </div>
            <div className="tier-inner">
              <div className="tier-left">
                <div className="tier-badge">DIY + Architect · Tier 02</div>
                <div className="tier-name">CMK Elite</div>
                <div className="tier-mode">// The Blueprint + my brain on your campaign.</div>
                <div className="tier-tagline">
                  &quot;Everything in the Blueprint, plus two hours of direct engagement with The Architect — oriented to your specific situation, your specific gaps.&quot;
                </div>
              </div>
              <div className="tier-middle">
                <div className="tier-includes">Everything in Blueprint, plus:</div>
                <div className="tier-feature">
                  <span className="check">✓</span>
                  <span className="label">2 hours of dedicated consulting time — we work through your specific audit findings</span>
                </div>
                <div className="tier-feature">
                  <span className="check">✓</span>
                  <span className="label">Strategic session on your campaign page, perk structure, and Day 1 army plan</span>
                </div>
                <div className="tier-feature">
                  <span className="check">✓</span>
                  <span className="label">Personalized fix sequence — not generic advice, your exact P0/P1/P2 priorities</span>
                </div>
                <div className="tier-feature">
                  <span className="check">✓</span>
                  <span className="label">My review of your landing page, ad copy, and email funnel before you go live</span>
                </div>
                <div className="tier-feature">
                  <span className="check">✓</span>
                  <span className="label">Access to my private media contacts database — 300+ journalists, editors, press</span>
                </div>
                <div className="tier-feature">
                  <span className="check">✓</span>
                  <span className="label">Lifetime updates as new campaigns generate new war stories and tools</span>
                </div>
              </div>
              <div className="tier-right">
                <div>
                  <div className="tier-price">
                    <sup>$</sup>1,997
                  </div>
                  <div className="tier-price-note">
                    One-time · Includes 2h consulting
                    <br />
                    VAT may apply for EU
                  </div>
                </div>
                <a href="https://payhip.com/b/7sTA5" className="btn-tier btn-primary-tier">
                  Get CMK Elite
                </a>
              </div>
            </div>
          </div>

          <div className="tier-card">
            <div className="tier-inner">
              <div className="tier-left">
                <div className="tier-badge">DWY · Tier 03</div>
                <div className="tier-name">The Campaign</div>
                <div className="tier-mode">// We execute together.</div>
                <div className="tier-tagline">
                  &quot;Four strategic calls — one for each critical phase. I review every major decision before you make it. For founders who want guidance through the fire.&quot;
                </div>
              </div>
              <div className="tier-middle">
                <div className="tier-includes">What you get:</div>
                <div className="tier-feature">
                  <span className="check">✓</span>
                  <span className="label">4 strategic calls — Validation, Pre-Launch, Launch, Post-Launch</span>
                </div>
                <div className="tier-feature">
                  <span className="check">✓</span>
                  <span className="label">My review of every major decision before you execute it</span>
                </div>
                <div className="tier-feature">
                  <span className="check">✓</span>
                  <span className="label">Full CMK Elite access included — all materials and tools</span>
                </div>
                <div className="tier-feature">
                  <span className="check">✓</span>
                  <span className="label">Campaign page audit — copy, video, perks, social proof, structure</span>
                </div>
                <div className="tier-feature">
                  <span className="check">✓</span>
                  <span className="label">Ad copy review + email sequence review before sending</span>
                </div>
                <div className="tier-feature">
                  <span className="check">✓</span>
                  <span className="label">Async access via email between calls — no waiting 2 weeks to get unstuck</span>
                </div>
              </div>
              <div className="tier-right">
                <div>
                  <div className="tier-price">
                    <sup>$</sup>2,500
                  </div>
                  <div className="tier-price-note">
                    One-time · 4 strategic calls
                    <br />
                    Spans 2–3 months
                  </div>
                </div>
                <a href="mailto:hello@elitegrowth.pro?subject=The Campaign — Application" className="btn-tier btn-secondary-tier">
                  Apply for The Campaign
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="command-card reveal" id="command">
          <div className="command-inner">
            <div className="command-left">
              <div className="command-eyebrow">
                <span className="command-dot" />
                DFY · Tier 04
              </div>
              <div className="command-name">
                The
                <br />
                Command
              </div>
              <div className="command-mode">// I take the wheel. Entirely.</div>
              <p className="command-desc">
                Full-service campaign implementation. Landing page, ads, email sequences, factory communications, influencer pipeline. You have the capital and the product. I have the system and the track record. We split the upside.
              </p>
            </div>
            <div className="command-right">
              <div className="command-features">
                <div className="command-feature">
                  <span className="check">✓</span>
                  <span>Full landing page architecture and copy</span>
                </div>
                <div className="command-feature">
                  <span className="check">✓</span>
                  <span>Ad campaign setup + management (media buyer not included)</span>
                </div>
                <div className="command-feature">
                  <span className="check">✓</span>
                  <span>Complete email funnel — pre-launch through post-campaign</span>
                </div>
                <div className="command-feature">
                  <span className="check">✓</span>
                  <span>Factory communication, influencer pipeline, PR outreach</span>
                </div>
                <div className="command-feature">
                  <span className="check">✓</span>
                  <span>Launch day operations — hour-by-hour execution</span>
                </div>
                <div className="command-feature">
                  <span className="check">✓</span>
                  <span>Weekly strategy calls throughout campaign</span>
                </div>
                <div className="command-feature">
                  <span className="check">✓</span>
                  <span>Success fee model — I earn when you earn</span>
                </div>
              </div>
              <div className="command-price-area">
                <div>
                  <div className="command-price">
                    <sup>$</sup>10,000
                    <span className="command-plus">+</span>
                  </div>
                  <div className="command-price-note">Setup fee + revenue share</div>
                  <div className="command-price-rev">+ % of total raised · aligned incentives</div>
                </div>
                <a href="mailto:hello@elitegrowth.pro?subject=The Command — Inquiry" className="btn-command">
                  Apply for The Command
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      <div className="section-full">
        <div className="inner reveal">
          <div className="section-eyebrow">Not there yet?</div>
          <h2>
            Start with the
            <br />
            <em>Diagnosis.</em>
          </h2>
          <p className="section-sub">
            Before you choose an engagement level — the Audit tells you exactly which tier your situation requires. No guessing.
          </p>

          <div className="bridge-block">
            <div>
              <div className="bridge-tag">▸ Campaign Intelligence Report</div>
              <div className="bridge-title">Get Your GO/NO-GO Verdict First.</div>
              <p className="bridge-desc">
                I run your numbers, your page, and your strategy through the full 8-module framework. You get a clear verdict, every critical gap quantified in dollars, and a fix sequence with exact priorities. The report tells you which Momentum tier your campaign needs.
              </p>
              <div className="bridge-items">
                <div className="bridge-item">
                  <span className="bridge-check">✓</span> GO / NO-GO Verdict
                </div>
                <div className="bridge-item">
                  <span className="bridge-check">✓</span> Win-Before-Launch Math
                </div>
                <div className="bridge-item">
                  <span className="bridge-check">✓</span> Critical Gap Analysis
                </div>
                <div className="bridge-item">
                  <span className="bridge-check">✓</span> Platform Risk Assessment
                </div>
                <div className="bridge-item">
                  <span className="bridge-check">✓</span> Fix Priority Matrix
                </div>
                <div className="bridge-item">
                  <span className="bridge-check">✓</span> 72h delivery
                </div>
              </div>
            </div>
            <div className="bridge-price-block">
              <div className="bridge-price">
                <sup>$</sup>499
              </div>
              <div className="bridge-price-note">One-time · 72h delivery · 30-day guarantee</div>
              <Link href="/audit" className="btn-primary">
                Order the Audit — $499
              </Link>
            </div>
          </div>

          <div className="case-strip">
            <div>
              <div className="case-label">Proof of Work · Redacted</div>
              <div className="case-verdict">⬡ 28/100 — NO-GO</div>
            </div>
            <div>
              <div className="case-title">Fashion & Wearables · Indiegogo · Pre-Launch · Feb 2026</div>
              <p className="case-desc">
                Client received full 8-module intelligence report in 72 hours. Campaign launch delayed to implement MVL plan. Estimated loss avoided: $5,000–$15,000. Upwork 5★ review received immediately after delivery.
              </p>
            </div>
            <div className="case-numbers">
              <div className="case-num">
                <div className="n">$499</div>
                <div className="l">Audit cost</div>
              </div>
              <div className="case-num">
                <div className="n">$15K</div>
                <div className="l">Loss avoided</div>
              </div>
              <div className="case-num">
                <div className="n">15 pg</div>
                <div className="l">Report delivered</div>
              </div>
              <div className="case-num">
                <div className="n">5★</div>
                <div className="l">Upwork review</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="section-divider" />

      <section className="section reveal">
        <div className="section-eyebrow">The Operator</div>
        <h2>
          Not a Consultant.
          <br />
          <em>An Operator.</em>
        </h2>
        <p className="section-sub">Every tactic in every tier came from money I personally risked. There is no theory in this system.</p>

        <div className="bio-block">
          <div>
            <BioThumb />
          </div>
          <div>
            <div className="bio-label">▸ The Architect</div>
            <div className="bio-name">Ladislav Jurić</div>
            <div className="bio-title-line">Crowdfunding Operator · Launch Engineer · Operations Architect</div>
            <div className="bio-numbers">
              <div className="bio-num-item">
                <div className="num">$890K+</div>
                <div className="lbl">Raised across campaigns</div>
              </div>
              <div className="bio-num-item">
                <div className="num">5</div>
                <div className="lbl">Successful campaigns</div>
              </div>
              <div className="bio-num-item">
                <div className="num">800+</div>
                <div className="lbl">Units shipped globally</div>
              </div>
              <div className="bio-num-item">
                <div className="num">2</div>
                <div className="lbl">Brands built from zero</div>
              </div>
            </div>
            <p className="bio-text">
              He isn&apos;t a &quot;guru&quot; who read a book and decided to teach. He&apos;s the guy who bled for every millimeter — international manufacturing, 3PL logistics, platform compliance, and the psychological warfare of crowdfunding across five campaigns. <strong>Baggizmo. Wiseward. Real campaigns. Real scars.</strong>
            </p>
            <p className="bio-text bio-text-mt">
              He shipped pallets to America without ever having been there. He handled factory renegotiations at 3 AM. He watched his margin disappear on a single shipping surcharge he hadn&apos;t budgeted. <strong>Everything in this system happened to him first.</strong> The Momentum tiers are what he would have bought if they&apos;d existed on campaign one.
            </p>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      <section className="section reveal">
        <div className="section-eyebrow">Intel Briefing</div>
        <h2>
          Questions.
          <br />
          <em>Answered.</em>
        </h2>

        <div className="faq-grid">
          <details>
            <summary>Do I need the Audit before engaging?</summary>
            <p className="faq-answer">
              For Blueprint and CMK Elite — no. If you already know what&apos;s blocking you, you can proceed directly. For The Campaign and The Command, an Audit is required first. I need to know exactly where you stand before I commit my time to an engagement.
            </p>
          </details>
          <details>
            <summary>What&apos;s the difference between Blueprint and CMK Elite?</summary>
            <p className="faq-answer">
              Blueprint is the system alone — materials, tools, kickoff call, and LP review. CMK Elite adds 2 direct hours with me, oriented specifically to your audit findings. If you&apos;ve had the audit and want my brain on your specific situation, Elite is the answer.
            </p>
          </details>
          <details>
            <summary>Can Blueprint credits apply toward Elite?</summary>
            <p className="faq-answer">
              Yes. If you purchase Blueprint and decide within 7 days that you need the Elite level, the $999 is credited toward Elite. You pay only the difference. This is a one-time upgrade path — not available after 7 days.
            </p>
          </details>
          <details>
            <summary>What does &quot;The Campaign&quot; look like in practice?</summary>
            <p className="faq-answer">
              Four calls over 2-3 months — one at each critical phase: Validation, Pre-Launch, Launch, and Post-Launch. Between calls, you have async email access. Before you make any major decision — campaign page goes live, ads turn on, pricing locks — I review it first. You drive. I co-pilot.
            </p>
          </details>
          <details>
            <summary>How does The Command success fee work?</summary>
            <p className="faq-answer">
              The setup fee ($10,000+) covers full implementation — page, email, ads structure, factory comm, influencer pipeline. The success fee percentage is agreed upfront and applied to total funds raised. Aligned incentives.
            </p>
          </details>
          <details>
            <summary>What if I need something between tiers?</summary>
            <p className="faq-answer">
              Email hello@elitegrowth.pro. Describe your situation. I&apos;ll tell you honestly which tier fits or whether a custom scope makes more sense. I don&apos;t push people into engagements they don&apos;t need.
            </p>
          </details>
        </div>
      </section>

      <div className="final-cta reveal">
        <div className="section-eyebrow section-eyebrow-center">Deploy the System</div>
        <h2 className="final-cta-title">
          Your Campaign.
          <br />
          <em>The Architect&apos;s Execution.</em>
        </h2>
        <p className="final-cta-desc">
          The system is built. The war stories are documented. The only variable is how much of my time you want in the room.
        </p>
        <div className="final-cta-actions">
          <a href="#tiers" className="btn-primary">
            Choose Your Level
          </a>
          <Link href="/audit" className="btn-secondary">
            Start with the Audit — $499
          </Link>
        </div>
        <p className="final-cta-legal">Built from $890K in real campaigns · Elitegrowth d.o.o.</p>
      </div>

      <footer>
        <span>© 2026 The Architect™ · Elitegrowth d.o.o.</span>
        <div className="footer-links">
          <Link href="/data/privacy">Privacy Policy</Link>
          <Link href="/data/terms">Terms</Link>
          <Link href="/data/refund">Refund Policy</Link>
          <a href="mailto:hello@elitegrowth.pro">hello@elitegrowth.pro</a>
        </div>
      </footer>
      <ScrollRevealEffect scopeClass="pg-momentum" />
    </main>
  );
}
