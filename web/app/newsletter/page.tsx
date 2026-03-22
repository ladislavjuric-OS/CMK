import Link from "next/link";
import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import NewsletterSignup from "@/components/NewsletterSignup";

export const metadata: Metadata = {
  title: "Updates — Newsletter",
  description:
    "Subscribe to The Architect / CMK: product updates, launch tips, and occasional notes on services — opt in anytime.",
};

export default function NewsletterPage() {
  return (
    <main className="cmk-container">
      <SiteNav />
      <section className="cmk-main">
        <p className="cmk-small" style={{ marginBottom: "0.75rem" }}>
          <Link href="/" style={{ color: "var(--cmk-accent)", fontWeight: 800 }}>
            ← Home
          </Link>
        </p>
        <h1 className="cmk-hero-heading">Updates from The Architect</h1>
        <p className="cmk-body" style={{ maxWidth: 640 }}>
          This list is for founders who want <strong>occasional</strong>, useful mail: CMK product changes, practical
          launch notes, and relevant service updates. No daily blasts — unsubscribe in one click from any email.
        </p>
        <ul className="cmk-body" style={{ maxWidth: 640, paddingLeft: "1.25rem", lineHeight: 1.75 }}>
          <li>Share this page when someone asks how to follow CMK.</li>
          <li>We use your email only for this list (and normal transactional mail if you buy or use tools).</li>
          <li>
            Privacy: see our{" "}
            <Link href="/data/privacy" style={{ color: "var(--cmk-accent)", fontWeight: 700 }}>
              Privacy policy
            </Link>
            .
          </li>
        </ul>

        <NewsletterSignup
          variant="full"
          idPrefix="page"
          title="Subscribe"
          lead="Enter your work email, confirm below, and you’re on the list. The same signup also appears in the site footer and on Tools."
        />
      </section>
      <SiteFooter />
    </main>
  );
}
