import SiteFooter from "@/components/SiteFooter";

export default function Home() {
  return (
    <main className="cmk-container">
      <header className="cmk-nav" role="banner">
        <div className="cmk-nav-inner">
          <a className="cmk-brand" href="/" aria-label="Home">
            <span className="cmk-brand-mark" aria-hidden="true" />
            The <span className="cmk-brand-accent">Architect</span>
          </a>
          <nav className="cmk-links" aria-label="Primary">
            <a href="/materials">Materials</a>
            <a href="/audit">Audit</a>
            <a href="/momentum">Consulting</a>
            <a href="/tools">Tools</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </nav>
        </div>
      </header>

      <section className="cmk-main">
        <div className="cmk-kicker">
          <span className="cmk-kicker-dot" aria-hidden="true" />
          CMK — Crowdfunding Momentum Kit
        </div>
        <h1 className="cmk-hero-heading">
          One-stop page for <span className="cmk-accent">tools</span>, a{" "}
          <span className="cmk-accent">GO/NO‑GO audit</span>, consulting, and CMK materials.
        </h1>
        <p className="cmk-body">
          If you’re not sure where you stand, start with the <strong>free readiness checker</strong>. If
          you want a brutal verdict + fix sequence, order the{" "}
          <strong>Campaign Intelligence Report</strong>. If you want to execute with SOPs and tools,
          choose your CMK materials tier.
        </p>

        <div className="cmk-actions">
          <a className="cmk-cta" href="/tools/readiness">
            Free readiness check →
          </a>
          <a className="cmk-cta cmk-cta-secondary" href="/audit">
            Order audit (CIR) →
          </a>
          <a className="cmk-cta cmk-cta-secondary" href="/materials">
            Browse materials →
          </a>
        </div>

        <section className="cmk-grid" aria-label="Main paths">
          <article className="cmk-card">
            <div className="cmk-tag">Tools</div>
            <h2>Start free: Readiness Checker</h2>
            <p className="cmk-small">
              8 questions → instant score → next best step based on your situation.
            </p>
            <div className="cmk-actions">
              <a className="cmk-cta" href="/tools/readiness">
                Open tool →
              </a>
              <a className="cmk-cta cmk-cta-secondary" href="/tools">
                All tools →
              </a>
            </div>
          </article>

          <article className="cmk-card">
            <div className="cmk-tag">Audit</div>
            <h2>Campaign Intelligence Report (CIR) — $499</h2>
            <p className="cmk-small">
              GO/NO‑GO verdict, gaps quantified, and a fix sequence delivered in 72h.
            </p>
            <div className="cmk-actions">
              <a className="cmk-cta" href="/audit">
                See audit page →
              </a>
              <a className="cmk-cta cmk-cta-secondary" href="/tools/readiness">
                Do readiness first →
              </a>
            </div>
          </article>

          <article className="cmk-card">
            <div className="cmk-tag">Consulting</div>
            <h2>Momentum / DFY execution</h2>
            <p className="cmk-small">
              When you need the Architect in the room (DWY/DFY), not just materials.
            </p>
            <div className="cmk-actions">
              <a className="cmk-cta" href="/momentum">
                See consulting →
              </a>
              <a className="cmk-cta cmk-cta-secondary" href="/audit">
                Start with audit →
              </a>
            </div>
          </article>

          <article className="cmk-card">
            <div className="cmk-tag">Materials</div>
            <h2>CMK tiers: $299 / $699 / $999</h2>
            <p className="cmk-small">
              Self‑serve SOPs, calculators, playbooks, templates, and war stories.
            </p>
            <div className="cmk-actions">
              <a className="cmk-cta" href="/materials#pricing">
                Choose tier →
              </a>
              <a className="cmk-cta cmk-cta-secondary" href="/materials">
                View materials page →
              </a>
            </div>
          </article>
        </section>

        <SiteFooter />
      </section>
    </main>
  );
}
