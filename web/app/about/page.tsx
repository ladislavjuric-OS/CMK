import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import OperatorBioSection from "@/components/OperatorBioSection";
import ScrollRevealEffect from "@/components/ScrollRevealEffect";

export const metadata: Metadata = {
  title: "About — The Architect · CMK",
  description:
    "Crowdfunding Momentum Kit (CMK): vision, mission, and the operator behind The Architect — real campaigns, operator-grade tools, and consulting.",
};

export default function AboutPage() {
  return (
    <main className="cmk-container pg-about">
      <SiteNav />

      <section className="cmk-main reveal">
        <div className="cmk-kicker">
          <span className="cmk-kicker-dot" aria-hidden="true" />
          About CMK
        </div>
        <h1 className="cmk-hero-heading">
          Tools and judgment from someone who{" "}
          <span className="cmk-accent">ran the launches</span> — not just the slides.
        </h1>
        <p className="cmk-body">
          <strong>Crowdfunding Momentum Kit (CMK)</strong> is the product system around The Architect: materials, calculators, readiness checks, and optional
          deep work (audit + Momentum engagements). It exists so founders stop guessing with generic advice and start using frameworks built on{" "}
          <strong>real raises, real logistics, and real platform risk</strong> — the same problems we solved across five campaigns and $890K+ raised.
        </p>
        <h2 className="about-h2">Vision</h2>
        <p className="cmk-body">
          A pre-launch crowdfunding stack that is as serious as hardware and software teams treat their own craft: clear math, honest GO/NO-GO calls, and
          execution paths that respect time and capital.
        </p>
        <h2 className="about-h2">Mission</h2>
        <p className="cmk-body">
          Give operators and first-time creators <strong>decision-grade intelligence</strong> — scored readiness, quantified gaps, and tiered help from
          self-serve CMK through done-with-you and done-for-you Momentum — without diluting the truth to sell a template.
        </p>
        <div className="cmk-actions">
          <Link className="cmk-cta" href="/tools/readiness">
            Free readiness check →
          </Link>
          <Link className="cmk-cta cmk-cta-secondary" href="/contact">
            Contact →
          </Link>
        </div>
      </section>

      <div className="pg-momentum">
        <OperatorBioSection />
      </div>

      <SiteFooter />
      <ScrollRevealEffect scopeClass="pg-about" />
    </main>
  );
}
