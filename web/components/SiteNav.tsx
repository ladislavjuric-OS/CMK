import Link from "next/link";

export default function SiteNav() {
  return (
    <header className="cmk-nav" role="banner">
      <div className="cmk-nav-inner">
        <Link className="cmk-brand" href="/" aria-label="Home">
          <span className="cmk-brand-mark" aria-hidden="true" />
          The <span className="cmk-brand-accent">Architect</span>
        </Link>
        <nav className="cmk-links" aria-label="Primary">
          <Link href="/materials">Materials</Link>
          <Link href="/audit">Audit</Link>
          <Link href="/momentum">Consulting</Link>
          <Link href="/tools">Tools</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/newsletter" className="cmk-nav-updates">
            Updates
          </Link>
        </nav>
      </div>
    </header>
  );
}
