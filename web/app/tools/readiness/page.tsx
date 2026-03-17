import Link from "next/link";
import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Campaign Readiness Checker — The Architect",
  description:
    "Find out if your crowdfunding campaign is ready to launch. AI-powered score based on real campaign data.",
};

export default function ReadinessPage() {
  return (
    <main className="cmk-container">
      <SiteNav />
      <section className="cmk-main">
        <div className="cmk-kicker">
          <span className="cmk-kicker-dot" aria-hidden="true" />
          Free tool · ~2 min
        </div>
        <h1 className="cmk-hero-heading">
          Is your campaign <span className="cmk-accent">ready to launch?</span>
        </h1>
        <p className="cmk-body">
          8 questions. Instant score + next best step, built on real campaign data — not generic
          advice.
        </p>
        <div className="cmk-actions">
          <a
            className="cmk-cta"
            href="https://cmk.elitegrowth.pro/tools/readinesschecker.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open readiness checker (current version) →
          </a>
          <Link className="cmk-cta cmk-cta-secondary" href="/tools">
            Back to Tools
          </Link>
        </div>
        <p className="cmk-small" style={{ marginTop: "1.5rem" }}>
          The full 8-question form will be migrated into this Next.js app in a follow-up step. For
          now use the link above to run the checker on the live site.
        </p>
      </section>
      <SiteFooter />
    </main>
  );
}
