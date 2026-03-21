"use client";

import { useEffect, useState } from "react";

const PAYHIP_AUDIT = "https://payhip.com/b/FP7Aq";

/**
 * Fixed bottom CTA on /audit. Hidden while the hero primary order link is in view
 * (IntersectionObserver); shown after the user scrolls past it.
 */
export default function AuditStickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const heroBtn = document.getElementById("audit-hero-order");
    if (!heroBtn) {
      setShow(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        setShow(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "0px 0px -8px 0px" }
    );

    obs.observe(heroBtn);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      className={`audit-sticky-cta ${show ? "audit-sticky-cta--visible" : ""}`}
      role="region"
      aria-label="Order Campaign Intelligence Report"
    >
      <div className="audit-sticky-cta-inner">
        <span className="audit-sticky-cta-label">CIR · $499 · 72h delivery</span>
        <a
          href={PAYHIP_AUDIT}
          className="audit-sticky-cta-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          Order report
        </a>
      </div>
    </div>
  );
}
