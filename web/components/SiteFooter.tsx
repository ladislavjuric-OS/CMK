import Link from "next/link";
import CookieSettingsLink from "@/components/CookieSettingsLink";

export default function SiteFooter() {
  return (
    <footer className="cmk-footer" role="contentinfo">
      <div className="cmk-footer-copy">© 2026 The Architect™ · Elitegrowth d.o.o.</div>
      <nav className="cmk-footer-links" aria-label="Site, legal and contact">
        <Link href="/about">About</Link>
        <span className="cmk-footer-sep" aria-hidden>
          ·
        </span>
        <Link href="/contact">Contact</Link>
        <span className="cmk-footer-sep" aria-hidden>
          ·
        </span>
        <a href="/data/privacy">Privacy</a>
        <span className="cmk-footer-sep" aria-hidden>
          ·
        </span>
        <a href="/data/cookies">Cookies</a>
        <span className="cmk-footer-sep" aria-hidden>
          ·
        </span>
        <CookieSettingsLink className="cmk-footer-cookie-settings" />
        <span className="cmk-footer-sep" aria-hidden>
          ·
        </span>
        <a href="/data/terms">Terms</a>
        <span className="cmk-footer-sep" aria-hidden>
          ·
        </span>
        <a href="/data/refund">Refund</a>
        <span className="cmk-footer-sep" aria-hidden>
          ·
        </span>
        <a href="mailto:hello@elitegrowth.pro">hello@elitegrowth.pro</a>
      </nav>
    </footer>
  );
}
