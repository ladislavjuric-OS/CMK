import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy — The Architect™",
  description: "Refund Policy for CMK materials (The Architect / Elitegrowth d.o.o.).",
};

export default function RefundPage() {
  return (
    <div className="legal-page">
      <header className="legal-header">
        <Link href="/" className="legal-logo">
          The Architect™
        </Link>
        <span className="legal-doc-tag">LEGAL / REF-001</span>
      </header>

      <div className="legal-container">
        <div className="legal-doc-header">
          <div className="legal-doc-ref">REF: CMK-LEGAL-REFUND · v1.0</div>
          <h1>Refund Policy</h1>
          <div className="legal-effective">
            Effective date: January 1, 2026 · Entity: Elitegrowth d.o.o.
          </div>
        </div>

        <div className="legal-guarantee-box">
          <div className="legal-label">// 7-DAY GUARANTEE</div>
          <p>
            If CMK doesn&apos;t save you hours in the first week — full refund. No questions asked.
            That&apos;s the deal.
          </p>
        </div>

        <h2>01 — Digital Products</h2>
        <p>
          All CMK digital products (Standard, Pro, Elite tiers) are covered by a 7-day satisfaction
          guarantee from the date of purchase.
        </p>
        <p>To qualify for a refund:</p>
        <ul>
          <li>Request must be submitted within 7 days of purchase</li>
          <li>Less than 20% of product content accessed</li>
          <li>
            Contact us at <a href="mailto:hello@elitegrowth.pro">hello@elitegrowth.pro</a> with your
            order number
          </li>
        </ul>
        <p>
          Refunds are processed within 5–10 business days via the original payment method through
          Paddle.
        </p>

        <h2>02 — Audit Services</h2>
        <p>
          Campaign Audit ($499) is non-refundable once delivery has commenced. If we have not yet
          begun your audit, a full refund is available upon request.
        </p>

        <h2>03 — Exceptions</h2>
        <p>Refunds will not be issued for:</p>
        <ul>
          <li>Purchases where more than 20% of content has been accessed</li>
          <li>Requests submitted after the 7-day window</li>
          <li>Violations of our Terms of Service</li>
          <li>Change of mind after audit delivery has begun</li>
        </ul>

        <h2>04 — Process</h2>
        <p>
          To request a refund, email <a href="mailto:hello@elitegrowth.pro">hello@elitegrowth.pro</a>{" "}
          with:
        </p>
        <ul>
          <li>Your full name and email used for purchase</li>
          <li>Order number (from Paddle confirmation)</li>
          <li>Brief reason (optional but helpful)</li>
        </ul>

        <h2>05 — Contact</h2>
        <p>
          <span className="legal-entity">Elitegrowth d.o.o.</span>
          <br />
          Jaruščica 21, 10020 Zagreb, Croatia
          <br />
          <a href="mailto:hello@elitegrowth.pro">hello@elitegrowth.pro</a>
        </p>
      </div>

      <footer className="legal-footer">
        © 2026 The Architect™ · Elitegrowth d.o.o. · <Link href="/data/terms">Terms of Service</Link> ·{" "}
        <Link href="/data/privacy">Privacy Policy</Link> · <Link href="/data/cookies">Cookie Policy</Link>
      </footer>
    </div>
  );
}
