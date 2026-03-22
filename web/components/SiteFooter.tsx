import Link from "next/link";
import CookieSettingsLink from "@/components/CookieSettingsLink";

export default function SiteFooter() {
  return (
    <footer className="cmk-footer" role="contentinfo">
      <span className="cmk-footer-copy">© 2026 The Architect™ · Elitegrowth d.o.o.</span>
      <nav className="cmk-footer-links" aria-label="Site, legal and contact">
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/data/privacy">Privacy Policy</Link>
        <Link href="/data/cookies">Cookie Policy</Link>
        <CookieSettingsLink className="cookie-settings-minimal" />
        <Link href="/data/terms">Terms</Link>
        <Link href="/data/refund">Refund Policy</Link>
        <a href="mailto:hello@elitegrowth.pro">hello@elitegrowth.pro</a>
      </nav>
    </footer>
  );
}
