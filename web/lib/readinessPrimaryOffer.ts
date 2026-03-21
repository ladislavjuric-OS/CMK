/**
 * Primary offer for dashboard — aligned with /api/analyze `cta` and ReadinessChecker CTAS routes.
 */

export type ReadinessPayloadLike = {
  cta?: string;
  cta_reason?: string;
};

export type PrimaryOffer = {
  ctaKey: string;
  headline: string;
  href: string;
  buttonLabel: string;
};

const OFFERS: Record<string, Omit<PrimaryOffer, "ctaKey">> = {
  audit: {
    headline: "You Need a Full Campaign Audit.",
    href: "/audit",
    buttonLabel: "Get Campaign Audit — $499",
  },
  cmk_standard: {
    headline: "Start With CMK Standard.",
    href: "/materials#tier-standard",
    buttonLabel: "Get CMK Standard — $299",
  },
  cmk_pro: {
    headline: "The CMK Pro Has What You Need.",
    href: "/materials#tier-pro",
    buttonLabel: "Get CMK Pro — $699",
  },
  cmk_elite: {
    headline: "You're Close — CMK Blueprint Will Get You There.",
    href: "/materials#tier-blueprint",
    buttonLabel: "Get The Blueprint — $999",
  },
};

function fallbackCtaKey(score: number): keyof typeof OFFERS {
  if (score >= 75) return "cmk_elite";
  if (score >= 50) return "cmk_pro";
  return "audit";
}

/**
 * Uses AI `payload.cta` when valid; otherwise score-based fallback (matches analyze heuristics when cta missing).
 */
export function getPrimaryOfferFromPayload(payload: ReadinessPayloadLike | Record<string, unknown>, score: number): PrimaryOffer {
  const raw = typeof (payload as ReadinessPayloadLike).cta === "string" ? (payload as ReadinessPayloadLike).cta!.trim() : "";
  const key = raw && raw in OFFERS ? raw : fallbackCtaKey(score);
  const o = OFFERS[key] ?? OFFERS.audit;
  return { ctaKey: key, ...o };
}
