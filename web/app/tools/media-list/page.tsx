import Link from "next/link";
import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Media list — Tools",
  description: "CMK media directory — coming soon.",
  robots: { index: false, follow: true },
};

export default function MediaListPage() {
  return (
    <main className="cmk-container">
      <SiteNav />
      <section className="cmk-main">
        <p className="cmk-small" style={{ marginBottom: "0.75rem" }}>
          <Link href="/tools" style={{ color: "var(--cmk-accent)", fontWeight: 800 }}>
            ← Tools
          </Link>
        </p>
        <h1 className="cmk-hero-heading">Media list</h1>
        <section className="cmk-tools-roadmap" style={{ maxWidth: 640, marginTop: "1.5rem" }}>
          <h2>Coming soon</h2>
          <p>
            This directory is temporarily unavailable while we finish the data setup. You’ll find it again from{" "}
            <Link href="/tools" style={{ color: "var(--cmk-accent)", fontWeight: 700 }}>
              Tools
            </Link>{" "}
            when it’s ready.
          </p>
        </section>
      </section>
      <SiteFooter />
    </main>
  );
}
