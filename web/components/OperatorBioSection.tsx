import BioThumb from "@/components/BioThumb";
import { LINKEDIN_URL } from "@/lib/site";

export default function OperatorBioSection() {
  return (
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
            He isn&apos;t a &quot;guru&quot; who read a book and decided to teach. He&apos;s the guy who bled for every millimeter — international manufacturing, 3PL logistics, platform compliance, and the psychological warfare of crowdfunding across five campaigns.{" "}
            <strong>Baggizmo. Wiseward. Real campaigns. Real scars.</strong>
          </p>
          <p className="bio-text bio-text-mt">
            He shipped pallets to America without ever having been there. He handled factory renegotiations at 3 AM. He watched his margin disappear on a single shipping surcharge he hadn&apos;t budgeted.{" "}
            <strong>Everything in this system happened to him first.</strong> The Momentum tiers are what he would have bought if they&apos;d existed on campaign one.
          </p>
          <p className="bio-text bio-text-mt bio-linkedin-wrap">
            <a href={LINKEDIN_URL} className="bio-linkedin" target="_blank" rel="noopener noreferrer">
              LinkedIn — Ladislav Jurić →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
