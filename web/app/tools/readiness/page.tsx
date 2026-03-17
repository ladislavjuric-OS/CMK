import Link from "next/link";
import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import ReadinessChecker from "@/components/ReadinessChecker";

export const metadata: Metadata = {
  title: "Campaign Readiness Checker — The Architect",
  description:
    "Find out if your crowdfunding campaign is ready to launch. AI-powered score based on real campaign data.",
};

export default function ReadinessPage() {
  return (
    <main className="pg-readiness-page">
      <div className="readiness-topbar">
        <div className="readiness-wrap">
          <Link href="/" className="topbar-logo">
            The Architect <span>/ readiness checker</span>
          </Link>
          <div className="topbar-pill">Free Tool</div>
        </div>
      </div>
      <div className="readiness-wrap">
        <ReadinessChecker />
      </div>
      <SiteFooter />
    </main>
  );
}
