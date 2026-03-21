import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { CONTACT_EMAIL, LINKEDIN_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact — The Architect",
  description: "Reach The Architect / Elitegrowth: email, LinkedIn, and next steps for audit or Momentum consulting.",
};

export default function ContactPage() {
  return (
    <main className="cmk-container pg-contact">
      <SiteNav />

      <section className="cmk-main">
        <div className="cmk-kicker">
          <span className="cmk-kicker-dot" aria-hidden="true" />
          Contact
        </div>
        <h1 className="cmk-hero-heading">
          Direct line to <span className="cmk-accent">the operator</span> — no ticket queue.
        </h1>
        <p className="cmk-body">
          For questions about the Campaign Intelligence Report, CMK materials, Momentum tiers, or anything that doesn&apos;t fit a form: email is fastest. Serious
          engagement inquiries — include your campaign stage, platform, and what you&apos;ve already tried.
        </p>

        <div className="contact-cards">
          <a className="contact-card" href={`mailto:${CONTACT_EMAIL}`}>
            <div className="contact-card-ey">Email</div>
            <div className="contact-card-val">{CONTACT_EMAIL}</div>
            <div className="contact-card-hint">Typical reply within 1–2 business days.</div>
          </a>
          <a className="contact-card" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            <div className="contact-card-ey">LinkedIn</div>
            <div className="contact-card-val">linkedin.com/in/ladislavjuric</div>
            <div className="contact-card-hint">Connect or message — Ladislav Jurić.</div>
          </a>
        </div>

        <p className="cmk-body contact-legal">
          <strong>Elitegrowth d.o.o.</strong> — The Architect / CMK. Croatia-based; works with campaigns globally.
        </p>

        <div className="cmk-actions">
          <Link className="cmk-cta" href="/audit">
            Campaign Intelligence Report — $499 →
          </Link>
          <Link className="cmk-cta cmk-cta-secondary" href="/about">
            About CMK →
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
