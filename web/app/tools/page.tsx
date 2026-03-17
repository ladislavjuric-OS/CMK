import Link from "next/link";
import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Tools — The Architect",
  description:
    "Free and paid tools by The Architect: readiness checker and campaign intelligence utilities.",
};

export default function ToolsPage() {
  return (
    <main className="cmk-container">
      <SiteNav />
      <section className="cmk-main">
        <h1 className="cmk-hero-heading">Tools</h1>
        <p className="cmk-body">
          Free tools that help you figure out where you stand, before you spend time or money on a
          launch.
        </p>

        <section className="cmk-grid" aria-label="Tools list">
          <article className="cmk-card">
            <div className="cmk-tag">Free tool</div>
            <h2>Readiness Checker</h2>
            <p className="cmk-small">Answer 8 questions and get an instant score + next step.</p>
            <div className="cmk-actions">
              <Link className="cmk-cta" href="/tools/readiness">
                Open readiness checker →
              </Link>
            </div>
          </article>

          <article className="cmk-card">
            <div className="cmk-tag">Audit intake</div>
            <h2>Client Discovery Brief (20 questions)</h2>
            <p className="cmk-small">Complete the brief before or after ordering the Campaign Intelligence Report. Feeds scoring and verdict.</p>
            <div className="cmk-actions">
              <Link className="cmk-cta" href="/tools/intake">
                Open intake form →
              </Link>
            </div>
          </article>

          <article className="cmk-card">
            <div className="cmk-tag">Tool page</div>
            <h2>Campaign Intelligence (preview)</h2>
            <p className="cmk-small">
              A landing/tool page to showcase campaign scoring and offer paths.
            </p>
            <div className="cmk-actions">
              <Link className="cmk-cta" href="/tools/campaignintelligence">
                Open →
              </Link>
            </div>
          </article>
        </section>
      </section>
      <SiteFooter />
    </main>
  );
}
