import Link from "next/link";
import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import IntakeForm from "@/components/IntakeForm";

export const metadata: Metadata = {
  title: "Client Discovery Brief — 20 Questions | The Architect",
  description:
    "Complete the Client Discovery Brief for your Campaign Intelligence Report. 20 questions covering product, finances, shipping, audience, and readiness.",
};

export default function IntakePage() {
  return (
    <main className="pg-readiness-page">
      <div className="readiness-topbar">
        <div className="readiness-wrap">
          <Link href="/" className="topbar-logo">
            The Architect <span>/ intake brief</span>
          </Link>
          <div className="topbar-pill">Audit intake</div>
        </div>
      </div>
      <div className="readiness-wrap">
        <IntakeForm />
      </div>
      <SiteFooter />
    </main>
  );
}
