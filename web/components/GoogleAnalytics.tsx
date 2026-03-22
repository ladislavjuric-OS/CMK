"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { COOKIE_CONSENT_STORAGE_KEY } from "@/lib/cookieConsent";
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * GA4 + Google Consent Mode v2 (EU-friendly): default denied until Accept.
 * Set NEXT_PUBLIC_GA_MEASUREMENT_ID on Vercel (same ID as in gtag config) — never commit the real ID.
 */
export default function GoogleAnalytics() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (!GA_ID || typeof window === "undefined") return;

    const stored = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    const analyticsDefault = stored === "granted" ? "granted" : "denied";

    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function gtag(...args: unknown[]) {
        window.dataLayer!.push(args);
      };

    window.gtag("consent", "default", {
      analytics_storage: analyticsDefault,
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      wait_for_update: 500,
    });

    const selector = `script[data-cmk-gtag="${GA_ID}"]`;
    if (!document.querySelector(selector)) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      script.dataset.cmkGtag = GA_ID;
      script.onload = () => {
        window.gtag!("js", new Date());
        window.gtag!("config", GA_ID);
      };
      document.head.appendChild(script);
    }

    if (stored === null) setShowBanner(true);
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, "granted");
    setShowBanner(false);
    window.gtag?.("consent", "update", {
      analytics_storage: "granted",
    });
  };

  const decline = () => {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, "denied");
    setShowBanner(false);
    window.gtag?.("consent", "update", {
      analytics_storage: "denied",
    });
  };

  if (!GA_ID) return null;

  if (!showBanner) return null;

  return (
    <div className="cookie-consent" role="dialog" aria-modal="false" aria-label="Cookie consent">
      <div className="cookie-consent-inner">
        <p className="cookie-consent-text">
          We use analytics cookies (Google Analytics) to understand how the site is used. No ads tracking. You can
          accept or decline non-essential analytics. Read our{" "}
          <Link href="/data/cookies" className="cookie-consent-link">
            Cookie Policy
          </Link>{" "}
          and{" "}
          <Link href="/data/privacy" className="cookie-consent-link">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="cookie-consent-actions">
          <button type="button" className="cookie-consent-btn cookie-consent-btn-decline" onClick={decline}>
            Decline
          </button>
          <button type="button" className="cookie-consent-btn cookie-consent-btn-accept" onClick={accept}>
            Accept analytics
          </button>
        </div>
      </div>
    </div>
  );
}
