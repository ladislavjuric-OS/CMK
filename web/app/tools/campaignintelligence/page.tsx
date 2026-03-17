import Link from "next/link";
import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Campaign Intelligence — The Architect",
  description:
    "Data-backed crowdfunding due diligence. Get a campaign score, benchmarks, and a clear verdict before you launch.",
};

export default function CampaignIntelligencePage() {
  return (
    <main className="cmk-container">
      <SiteNav />
      <section className="cmk-main">
        <div className="cmk-kicker">
          <span className="cmk-kicker-dot" aria-hidden="true" />
          Campaign Intelligence
        </div>
        <h1 className="cmk-hero-heading">
          Score your campaign <span className="cmk-accent">before you launch</span>
        </h1>
        <p className="cmk-body">
          We analyzed 600,000+ campaigns. The Campaign Intelligence Report gives you a GO/NO-GO
          verdict, gaps quantified in dollars, and a fix sequence — delivered in 72h.
        </p>
        <div className="cmk-actions">
          <a
            className="cmk-cta"
            href="https://payhip.com/b/FP7Aq"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get your report — $499
          </a>
          <Link className="cmk-cta cmk-cta-secondary" href="/audit">
            Full audit page →
          </Link>
          <Link className="cmk-cta cmk-cta-secondary" href="/tools">
            Back to Tools
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
