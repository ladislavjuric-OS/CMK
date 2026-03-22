import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — The Architect™",
  description: "Privacy Policy for cmk.elitegrowth.pro (The Architect / Elitegrowth d.o.o.).",
};

export default function PrivacyPage() {
  return (
    <div className="legal-page">
      <header className="legal-header">
        <Link href="/" className="legal-logo">
          The Architect™
        </Link>
        <span className="legal-doc-tag">LEGAL / PRIV-001</span>
      </header>

      <div className="legal-container">
        <div className="legal-doc-header">
          <div className="legal-doc-ref">REF: CMK-LEGAL-PRIV · v1.0</div>
          <h1>Privacy Policy</h1>
          <div className="legal-effective">
            Effective date: January 1, 2026 · Entity: Elitegrowth d.o.o.
          </div>
        </div>

        <h2>01 — Controller</h2>
        <p>
          <span className="legal-entity">Elitegrowth d.o.o.</span>, Jaruščica 21, 10020 Zagreb,
          Croatia is the data controller for personal data collected through cmk.elitegrowth.pro.
        </p>

        <h2>02 — Data We Collect</h2>
        <p>We collect only the data necessary to deliver our products and services:</p>
        <ul>
          <li>Name and email address (for product delivery and communication)</li>
          <li>Payment data (processed by Paddle — we do not store card details)</li>
          <li>Usage data (anonymized analytics to improve product quality)</li>
          <li>Communications you initiate with us</li>
        </ul>

        <h2>03 — How We Use Your Data</h2>
        <ul>
          <li>To deliver purchased products and services</li>
          <li>To send product updates and relevant communications</li>
          <li>To respond to support requests</li>
          <li>To comply with legal obligations</li>
        </ul>
        <p>
          We do not sell, rent, or share your personal data with third parties for marketing
          purposes.
        </p>

        <h2>04 — Third-Party Processors</h2>
        <p>We use the following third-party services that may process your data:</p>
        <ul>
          <li>
            <strong>Paddle.com</strong> — payment processing (Merchant of Record)
          </li>
          <li>
            <strong>Email service providers</strong> — for transactional and product emails
          </li>
          <li>
            <strong>Google Ireland Limited</strong> —{" "}
            <a href="https://analytics.google.com/" rel="noopener noreferrer" target="_blank">
              Google Analytics 4
            </a>{" "}
            (website usage statistics), only if you accept analytics cookies via our on-site banner.
            Google may process data in accordance with its terms and the EU/US data transfer frameworks
            as applicable.
          </li>
        </ul>

        <h2>05 — Data Retention</h2>
        <p>
          We retain your data for as long as necessary to fulfill the purposes outlined above, or
          as required by Croatian and EU law. You may request deletion at any time by contacting us.
        </p>

        <h2>06 — Your Rights (GDPR)</h2>
        <p>As a data subject under GDPR, you have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion (&quot;right to be forgotten&quot;)</li>
          <li>Object to processing</li>
          <li>Data portability</li>
        </ul>
        <p>
          To exercise any of these rights, contact:{" "}
          <a href="mailto:hello@elitegrowth.pro">hello@elitegrowth.pro</a>
        </p>

        <h2>07 — Cookies &amp; analytics consent</h2>
        <p>
          We use strictly necessary mechanisms for the site to function. For <strong>optional</strong>{" "}
          audience measurement we use <strong>Google Analytics 4</strong>. On your first visit, a
          banner lets you <strong>accept</strong> or <strong>decline</strong> analytics cookies. If you
          decline, GA runs in a limited mode without analytics storage cookies (as supported by
          Google&apos;s Consent Mode). You can change your mind by clearing site data for this domain
          and revisiting — the banner will appear again. We do not use advertising or social pixels on
          this basis.
        </p>

        <h2>08 — Contact</h2>
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
        <Link href="/data/refund">Refund Policy</Link>
      </footer>
    </div>
  );
}
