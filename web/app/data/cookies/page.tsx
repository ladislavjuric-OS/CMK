import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy — The Architect™",
  description: "Cookie Policy for cmk.elitegrowth.pro: analytics, consent, and how to control cookies.",
};

export default function CookiePolicyPage() {
  return (
    <div className="legal-page">
      <header className="legal-header">
        <Link href="/" className="legal-logo">
          The Architect™
        </Link>
        <span className="legal-doc-tag">LEGAL / COOK-001</span>
      </header>

      <div className="legal-container">
        <div className="legal-doc-header">
          <div className="legal-doc-ref">REF: CMK-LEGAL-COOK · v1.0</div>
          <h1>Cookie Policy</h1>
          <div className="legal-effective">
            Effective date: March 22, 2026 · Entity: Elitegrowth d.o.o.
          </div>
        </div>

        <p>
          This Cookie Policy explains how <span className="legal-entity">Elitegrowth d.o.o.</span> (&quot;we&quot;,
          &quot;us&quot;) uses cookies and similar technologies on <strong>cmk.elitegrowth.pro</strong> and related
          pages where The Architect / Crowdfunding Momentum Kit is offered. It should be read together with our{" "}
          <Link href="/data/privacy">Privacy Policy</Link>.
        </p>

        <h2>01 — What are cookies?</h2>
        <p>
          Cookies are small text files stored on your device when you visit a website. They help the site function,
          remember preferences, or (with your consent) measure usage. Similar technologies include local storage
          (e.g. browser <code>localStorage</code>) where we store your analytics choice so the consent banner does not
          reappear on every visit.
        </p>

        <h2>02 — Controller</h2>
        <p>
          <span className="legal-entity">Elitegrowth d.o.o.</span>, Jaruščica 21, 10020 Zagreb, Croatia —{" "}
          <a href="mailto:hello@elitegrowth.pro">hello@elitegrowth.pro</a>
        </p>

        <h2>03 — Categories of cookies we use</h2>

        <h3>Strictly necessary</h3>
        <p>
          Required for basic operation and security of the site (e.g. session or load balancing where applicable).
          These do not depend on marketing or analytics consent. We keep this category minimal.
        </p>

        <h3>Analytics (optional — only with your consent)</h3>
        <p>
          If you click <strong>Accept analytics</strong> on our cookie banner, we enable{" "}
          <strong>Google Analytics 4</strong> (Google Ireland Limited / Google LLC) to collect aggregated usage data
          (e.g. pages viewed, approximate location, device type). If you click <strong>Decline</strong>, we do not set
          analytics storage cookies for that purpose; Google may still receive limited, cookieless signals as allowed
          under <strong>Google Consent Mode v2</strong> when analytics storage is denied.
        </p>

        <h3>Advertising</h3>
        <p>
          We do <strong>not</strong> use advertising cookies, remarketing pixels, or social ad trackers on the basis
          described in this policy. Consent Mode flags for <code>ad_storage</code>,{" "}
          <code>ad_user_data</code>, and <code>ad_personalization</code> remain <strong>denied</strong>.
        </p>

        <h2>04 — Cookie and storage details (overview)</h2>
        <p>
          Exact cookie names and lifetimes may change when Google updates GA4. Typical analytics cookies when you have
          accepted may include (non-exhaustive):
        </p>
        <ul>
          <li>
            <code>_ga</code> — distinguishes users (persistence up to ~2 years per Google&apos;s documentation)
          </li>
          <li>
            <code>_ga_*</code> — session / measurement ID scoped cookies used by GA4
          </li>
        </ul>
        <p>
          <strong>Local storage key</strong> (not an HTTP cookie): we store <code>cmk_cookie_consent_v1</code> with
          value <code>granted</code> or <code>denied</code> so we know whether to show the banner again and how to
          initialise Consent Mode on return visits. This does not identify you personally.
        </p>

        <h2>05 — How you give or withdraw consent</h2>
        <ul>
          <li>
            <strong>First visit:</strong> the banner offers <strong>Accept analytics</strong> or{" "}
            <strong>Decline</strong>.
          </li>
          <li>
            <strong>Change later:</strong> use <strong>Cookie settings</strong> in the site footer (it clears your
            saved choice and reloads the page so the banner appears again), or clear site data for this domain in your
            browser and revisit.
          </li>
        </ul>

        <h2>06 — Legal basis (EEA / UK)</h2>
        <p>
          For optional analytics cookies, we rely on your <strong>consent</strong> (GDPR Art. 6(1)(a)). For strictly
          necessary cookies / storage, we rely on <strong>legitimate interests</strong> or performance of a contract
          where applicable. You may withdraw consent at any time without affecting the lawfulness of processing based on
          consent before withdrawal.
        </p>

        <h2>07 — Third parties</h2>
        <p>
          Google operates its own infrastructure and policies. See{" "}
          <a href="https://policies.google.com/privacy" rel="noopener noreferrer" target="_blank">
            Google Privacy Policy
          </a>{" "}
          and{" "}
          <a href="https://policies.google.com/technologies/cookies" rel="noopener noreferrer" target="_blank">
            Google&apos;s use of cookies
          </a>
          . You can also use browser add-ons to limit GA (e.g. Google&apos;s opt-out tools where available).
        </p>

        <h2>08 — Changes</h2>
        <p>
          We may update this Cookie Policy when we change tools or legal requirements. The effective date at the top
          will be revised; material changes may be announced on the site.
        </p>

        <h2>09 — Contact</h2>
        <p>
          Questions about cookies or this policy:{" "}
          <a href="mailto:hello@elitegrowth.pro">hello@elitegrowth.pro</a>
          <br />
          <span className="legal-entity">Elitegrowth d.o.o.</span>, Jaruščica 21, 10020 Zagreb, Croatia
        </p>
      </div>

      <footer className="legal-footer">
        © 2026 The Architect™ · Elitegrowth d.o.o. · <Link href="/data/privacy">Privacy Policy</Link> ·{" "}
        <Link href="/data/terms">Terms of Service</Link> · <Link href="/data/refund">Refund Policy</Link>
      </footer>
    </div>
  );
}
