import BioThumb from "@/components/BioThumb";
import { LINKEDIN_URL } from "@/lib/site";

const FIVE_STARS: { mark: string; title: string; body: string }[] = [
  {
    mark: "★",
    title: "Star 1 — You commit",
    body: "You validate the idea and decide to make it real. Everyone has ideas; only a small slice actually follows the dream.",
  },
  {
    mark: "★",
    title: "Star 2 — You build",
    body: "The product exists as a prototype. Creating something of your own — living inside the product — is already a serious milestone.",
  },
  {
    mark: "★",
    title: "Star 3 — You fund",
    body: "You find a path and the project gets funded. Only about 40% of crowdfunding campaigns cross the finish line.",
  },
  {
    mark: "★",
    title: "Star 4 — You deliver",
    body: "What you promised in the campaign reaches the backer. Roughly 30% of campaigns still fail to ship the product to backers.",
  },
  {
    mark: "★",
    title: "Star 5 — You commercialize",
    body: "The product moves past the campaign and is offered in open market — real commerce, not just a closed raise.",
  },
];

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
          <div className="bio-numbers bio-numbers-five">
            <div className="bio-num-item">
              <div className="num">$890K+</div>
              <div className="lbl">Raised across campaigns</div>
            </div>
            <div className="bio-num-item">
              <div className="num">5</div>
              <div className="lbl">Successful campaigns</div>
            </div>
            <div className="bio-num-item">
              <div className="num">12,000+</div>
              <div className="lbl">Units shipped globally</div>
            </div>
            <div className="bio-num-item">
              <div className="num">5</div>
              <div className="lbl">Brands built from zero</div>
            </div>
            <div className="bio-num-item">
              <div className="num">2</div>
              <div className="lbl">Physical products built from zero</div>
            </div>
          </div>

          <div className="bio-founder-card">
            <div className="bio-founder-eyebrow">Founder → founder</div>
            <h3 className="bio-founder-title">
              The <span>Five Star Success</span> strategy
            </h3>
            <ol className="bio-star-list">
              {FIVE_STARS.map((s) => (
                <li key={s.title} className="bio-star-item">
                  <span className="bio-star-mark" aria-hidden>
                    {s.mark}
                  </span>
                  <div>
                    <strong>{s.title}</strong>
                    {s.body}
                  </div>
                </li>
              ))}
            </ol>
            <p className="bio-founder-close">
              From first idea to product in the wild is a long, hard road — even for the most experienced among us. Most of us start without the skills, the network, and with almost no real odds.{" "}
              <strong>Persistence and grit are the baseline.</strong> With the right tools and knowledge, you can cover serious distance.{" "}
              <strong>Crowdfunding Momentum Kit</strong> exists to tie those stars together — a practical stack that helps founders turn ideas into executable, market-ready products built to stand up in public.
            </p>
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
