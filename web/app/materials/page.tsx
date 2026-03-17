import Link from "next/link";
import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Crowdfunding Momentum Kit — Materials",
  description:
    "CMK materials: Standard, Pro, and Blueprint tiers. Self-serve operational system built from real crowdfunding campaigns.",
};

const TIERS = [
  {
    name: "Standard",
    price: "299",
    desc: "Core playbooks, calculators, and templates. Best for: founders who want the essentials.",
    features: ["Core playbooks", "Key calculators", "Email sequences", "Templates"],
  },
  {
    name: "Pro",
    price: "699",
    featured: true,
    desc: "Full system: 111 tactics, 70+ tools, 12 calculators, 10 playbooks. Best for: serious pre-launch prep.",
    features: ["Everything in Standard", "70+ Plugin Tools", "12 Calculators", "10 Playbooks", "6 Email Sequences", "300+ Media Contacts"],
  },
  {
    name: "Blueprint",
    price: "999",
    desc: "Pro + war stories, redacted reports, and the full operator playbook. Best for: teams going all-in.",
    features: ["Everything in Pro", "War stories & case studies", "Redacted CIR samples", "Full operator playbook"],
  },
];

export default function MaterialsPage() {
  return (
    <main className="cmk-container">
      <SiteNav />
      <section className="cmk-main">
        <div className="cmk-kicker">
          <span className="cmk-kicker-dot" aria-hidden="true" />
          CMK · Crowdfunding Momentum Kit
        </div>
        <h1 className="cmk-hero-heading">
          The operational system <span className="cmk-accent">built from real campaigns.</span>
        </h1>
        <p className="cmk-body">
          $890K raised. 5 campaigns. Self-serve SOPs, calculators, playbooks, templates, and war
          stories — so you don&apos;t repeat the same expensive mistakes.
        </p>
        <div className="cmk-actions">
          <Link className="cmk-cta" href="#pricing">
            Choose tier →
          </Link>
          <Link className="cmk-cta cmk-cta-secondary" href="/tools/readiness">
            Not sure yet? Free readiness check →
          </Link>
        </div>

        <section id="pricing" className="audit-section" style={{ paddingTop: "4rem" }}>
          <div className="audit-eyebrow">▸ Tiers</div>
          <h2>Standard · Pro · <em>Blueprint.</em></h2>
          <p className="audit-section-sub">
            One-time purchase. Instant access. Pick the level that matches where you are.
          </p>
          <div className="materials-grid">
            {TIERS.map((tier) => (
              <article
                key={tier.name}
                className="cmk-card"
                style={tier.featured ? { borderColor: "rgba(0,255,204,0.35)", background: "rgba(255,255,255,0.06)" } : undefined}
              >
                {tier.featured && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      background: "linear-gradient(135deg, var(--cmk-accent), var(--cmk-accent2))",
                      color: "#041013",
                      fontSize: "0.6rem",
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      padding: "0.2rem 0.6rem",
                      borderBottomLeftRadius: "10px",
                    }}
                  >
                    MOST COMPLETE
                  </div>
                )}
                <div className="cmk-tag">{tier.name}</div>
                <h2>{tier.name}</h2>
                <p className="cmk-small">{tier.desc}</p>
                <div style={{ fontSize: "2rem", fontWeight: 900, color: "var(--cmk-accent)", margin: "0.5rem 0" }}>
                  ${tier.price}
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: "1rem 0", fontSize: "0.85rem" }}>
                  {tier.features.map((f) => (
                    <li key={f} style={{ marginBottom: "0.5rem", display: "flex", gap: "0.5rem" }}>
                      <span style={{ color: "#57e0b3" }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <div className="cmk-actions">
                  <a
                    className="cmk-cta"
                    href="https://payhip.com/b/CMK"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get {tier.name} →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div
          className="audit-guarantee-block"
          style={{ marginTop: "4rem" }}
        >
          <div className="audit-g-label">▸ Before you buy</div>
          <div className="audit-g-title">Not sure where you stand?</div>
          <p className="audit-g-text">
            Run the free readiness checker. 8 questions, instant score, next best step. Then choose
            your tier — or order a Campaign Intelligence Report for a full GO/NO-GO verdict.
          </p>
          <div className="cmk-actions" style={{ marginTop: "1rem" }}>
            <Link className="cmk-cta" href="/tools/readiness">
              Free readiness check →
            </Link>
            <Link className="cmk-cta cmk-cta-secondary" href="/audit">
              Order CIR — $499 →
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
