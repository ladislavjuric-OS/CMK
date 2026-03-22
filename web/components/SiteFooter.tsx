import Link from "next/link";
import CookieSettingsLink from "@/components/CookieSettingsLink";
import FooterNewsletterSignup from "@/components/FooterNewsletterSignup";

export default function SiteFooter() {
  return (
    <footer className="cmk-footer" role="contentinfo">
      <div className="cmk-footer-copy">© 2026 The Architect™ · Elitegrowth d.o.o.</div>
      <FooterNewsletterSignup />
      <nav className="cmk-footer-nav" aria-label="Site, legal and contact">
        <div className="cmk-footer-col cmk-footer-col--site">
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <a href="mailto:hello@elitegrowth.pro">hello@elitegrowth.pro</a>
        </div>
        <div className="cmk-footer-col cmk-footer-col--legal">
          <a href="/data/privacy">Privacy</a>
          <a href="/data/cookies">Cookies</a>
          <CookieSettingsLink className="cmk-footer-cookie-settings" />
          <a href="/data/terms">Terms</a>
          <a href="/data/refund">Refund</a>
        </div>
      </nav>
    </footer>
  );
}
