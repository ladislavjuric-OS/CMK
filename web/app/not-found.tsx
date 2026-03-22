import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export const dynamic = "force-dynamic";

const JOKES = [
  {
    kicker: "NO-GO verdict",
    line: "This URL didn’t pass the 30% Day‑1 rule — it doesn’t exist.",
    sub: "Even The Architect can’t ship a page with zero backers.",
  },
  {
    kicker: "Stretch goal unlocked",
    line: "You found our rarest perk: a route that was never manufactured.",
    sub: "Estimated delivery: never. Refund: a free trip home.",
  },
  {
    kicker: "Campaign update #404",
    line: "We’re delayed — the page you wanted is still “in fulfillment.”",
    sub: "(Translation: it’s not here. The homepage is.)",
  },
] as const;

export default function NotFound() {
  const pick = JOKES[Math.floor(Math.random() * JOKES.length)];

  return (
    <main className="pg-not-found">
      <div className="nf-card">
        <div className="nf-code">404</div>
        <div className="nf-kicker">{pick.kicker}</div>
        <h1 className="nf-title">{pick.line}</h1>
        <p className="nf-sub">{pick.sub}</p>
        <div className="nf-actions">
          <Link href="/" className="nf-btn nf-btn-primary">
            ← Back to HQ (homepage)
          </Link>
          <Link href="/tools/readiness" className="nf-btn nf-btn-ghost">
            Run the free readiness check →
          </Link>
        </div>
        <p className="nf-foot">
          Lost on purpose?{" "}
          <Link href="/contact" className="nf-inline">
            Contact
          </Link>{" "}
          — we answer faster than most campaign comments.
        </p>
      </div>
    </main>
  );
}
