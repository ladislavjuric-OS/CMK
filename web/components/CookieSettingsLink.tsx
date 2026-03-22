"use client";

import { COOKIE_CONSENT_STORAGE_KEY } from "@/lib/cookieConsent";

type Props = { className?: string };

/** Clears saved choice and reloads so the analytics banner appears again (see Cookie Policy). */
export default function CookieSettingsLink({ className }: Props) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        try {
          localStorage.removeItem(COOKIE_CONSENT_STORAGE_KEY);
        } catch {
          /* ignore */
        }
        window.location.reload();
      }}
    >
      Cookie settings
    </button>
  );
}
