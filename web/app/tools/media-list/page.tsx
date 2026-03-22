import Link from "next/link";
import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import MediaListView from "@/components/MediaListView";

const NOTION_MASTER_PRESS =
  "https://www.notion.so/ladislav-command-center/Master-Press-Lista-2f75511910e680618eeff49cffd20ff2";

export const metadata: Metadata = {
  title: "Media list — Tools",
  description:
    "Searchable media and press outlet list for CMK founders, with guidance on how to use it responsibly.",
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
        <p className="cmk-body">
          A working list of outlets and contacts to support your outreach. Use <strong>search</strong> to narrow by name,
          beat, region, or tags; use <strong>category</strong> to focus on a segment (e.g. podcast, national, trade).
          Internal admin notes are never shown here.
        </p>

        <article className="cmk-card" style={{ marginTop: "2rem" }}>
          <div className="cmk-tag">How to use this (education)</div>
          <h2 style={{ marginTop: "1rem" }}>Before you email anyone</h2>
          <ul className="cmk-body" style={{ paddingLeft: "1.25rem", lineHeight: 1.75 }}>
            <li>
              <strong>Read the beat</strong> — match your story to what they actually cover; generic blasts waste trust.
            </li>
            <li>
              <strong>One clear ask</strong> — subject + 3–5 sentences + link; offer assets (facts, founder quote, hi-res)
              only when relevant.
            </li>
            <li>
              <strong>Lead time</strong> — podcasts and print often book weeks out; news moves fast; plan accordingly.
            </li>
            <li>
              <strong>Compliance</strong> — don’t misrepresent traction or incentives; follow CAN-SPAM/GDPR where
              applicable and honor unsubscribe requests.
            </li>
            <li>
              <strong>Your playbook in Notion</strong> — for SOPs, pitch templates, and the full working list workflow,
              keep using{" "}
              <a href={NOTION_MASTER_PRESS} target="_blank" rel="noopener noreferrer" style={{ color: "var(--cmk-accent)", fontWeight: 800 }}>
                Master Press Lista (Notion)
              </a>
              . This site mirrors the <em>data</em>; Notion remains great for narrative, process, and research notes.
            </li>
          </ul>
        </article>

        <MediaListView />
      </section>
      <SiteFooter />
    </main>
  );
}
