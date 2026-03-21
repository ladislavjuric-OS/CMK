/** Free readiness checker emails (standard score) per email address before SaaS signup messaging. */
export const FREE_READINESS_RUNS_PER_EMAIL = 3;

/** Default dashboard history when user has not been granted full history. */
export const DASHBOARD_RUN_LIMIT_DEFAULT = 3;

/** Max runs returned on dashboard when admin unlocks full history (`readiness_full_history`). */
export const DASHBOARD_RUN_LIMIT_UNLOCKED = 50;

/** Entitlement product_key: admin can grant so user sees up to DASHBOARD_RUN_LIMIT_UNLOCKED runs. */
export const READINESS_FULL_HISTORY_PRODUCT_KEY = "readiness_full_history";

export type EntitlementLike = { product_key: string; status: string };

export function hasFullReadinessHistoryUnlocked(entitlements: EntitlementLike[] | undefined): boolean {
  if (!entitlements?.length) return false;
  return entitlements.some(
    (e) =>
      e.product_key === READINESS_FULL_HISTORY_PRODUCT_KEY &&
      (e.status === "unlocked" || e.status === "manual_unlocked")
  );
}

export function dashboardRunLimitForUser(entitlements: EntitlementLike[] | undefined): number {
  return hasFullReadinessHistoryUnlocked(entitlements) ? DASHBOARD_RUN_LIMIT_UNLOCKED : DASHBOARD_RUN_LIMIT_DEFAULT;
}
