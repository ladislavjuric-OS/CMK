import Link from "next/link";
import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Momentum Services — The Architect",
  description:
    "Momentum Services: post-audit execution options. Done-with-you and done-for-you engagement levels by The Architect.",
};

export default function MomentumPage() {
  return (
    <main className="cmk-container">
      <SiteNav />
      <section className="cmk-main">
        <div className="cmk-kicker">
          <span className="cmk-kicker-dot" aria-hidden="true" />
          Consulting · DWY / DFY
        </div>
        <h1 className="cmk-hero-heading">
          Execute the audit. <span className="cmk-accent">Momentum services.</span>
        </h1>
        <p className="cmk-body">
          When you need the Architect in the room — not just materials. Done-with-you (DWY) and
          done-for-you (DFY) engagement levels. Limited availability.
        </p>
        <div className="cmk-actions">
          <a
            className="cmk-cta"
            href="mailto:hello@elitegrowth.pro?subject=Momentum%20Services%20inquiry"
          >
            Contact for availability →
          </a>
          <Link className="cmk-cta cmk-cta-secondary" href="/audit">
            Start with CIR audit →
          </Link>
          <Link className="cmk-cta cmk-cta-secondary" href="/materials">
            Or get CMK materials →
          </Link>
        </div>

        <section className="audit-section" style={{ paddingTop: "3rem" }}>
          <div className="audit-eyebrow">▸ Engagement levels</div>
          <h2>Two ways to work <em>with</em> the Architect.</h2>
          <p className="audit-section-sub">
            After your Campaign Intelligence Report, you can execute on your own with CMK materials
            — or bring me in for Co-Pilot (DWY) or full Command (DFY) execution.
          </p>
          <div className="cmk-grid">
            <article className="cmk-card">
              <div className="cmk-tag">DWY</div>
              <h2>Co-Pilot — Done with you</h2>
              <p className="cmk-small">
                I work alongside you: strategy calls, review cycles, and accountability. You execute;
                I guide and course-correct.
              </p>
              <div className="cmk-actions">
                <a
                  className="cmk-cta"
                  href="mailto:hello@elitegrowth.pro?subject=Co-Pilot%20(DWY)%20inquiry"
                >
                  Inquire →
                </a>
              </div>
            </article>
            <article className="cmk-card">
              <div className="cmk-tag">DFY</div>
              <h2>Command — Done for you</h2>
              <p className="cmk-small">
                Full campaign architecture and execution. I run the build; you stay in the loop and
                make key decisions. Limited slots.
              </p>
              <div className="cmk-actions">
                <a
                  className="cmk-cta"
                  href="mailto:hello@elitegrowth.pro?subject=Command%20(DFY)%20inquiry"
                >
                  Inquire →
                </a>
              </div>
            </article>
          </div>
        </section>

        <div className="audit-cta-bottom" style={{ paddingTop: "3rem" }}>
          <h2>Start with the report.</h2>
          <p>
            Get your Campaign Intelligence Report first. The verdict and fix sequence will tell you
            whether you need materials only, Co-Pilot, or Command.
          </p>
          <Link href="/audit" className="audit-btn-primary" style={{ display: "inline-block" }}>
            Order CIR — $499
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
