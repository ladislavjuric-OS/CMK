/**
 * Draft scoring: maps intake answers to a 0–100 readiness score and verdict.
 * Replace with your real matrix when ready. Verdict bands from audit doc:
 * 0–49 = NO-GO, 50–74 = CONDITIONAL GO, 75–100 = GO.
 */
export type Verdict = "GO" | "CONDITIONAL GO" | "NO-GO";

const STAGE_POINTS: Record<string, number> = {
  "Concept only": 0,
  "Working prototype": 25,
  "Pre-production sample": 50,
  "Production-ready": 75,
  "Already in production": 100,
};

export function computeIntakeScore(answers: Record<string, unknown>): { score: number; verdict: Verdict } {
  let score = 0;

  // Product stage (max 25)
  const stage = String(answers.q2_stage ?? "").trim();
  if (stage && STAGE_POINTS[stage] !== undefined) {
    score += (STAGE_POINTS[stage] / 100) * 25;
  }

  // Pre-launch budget (max 25): $0=0, <1k=10, 1-5k=18, 5k+=25
  const budget = Number(answers.q7_prelaunch_budget) || 0;
  if (budget > 0) {
    score += budget >= 5000 ? 25 : budget >= 1000 ? 18 : 10;
  }

  // Email list size (max 25): 0=0, 1-500=8, 501-2000=18, 2000+=25
  const emailCount = Number(answers.q9_total_subscribers) || 0;
  if (emailCount > 0) {
    score += emailCount >= 2000 ? 25 : emailCount >= 501 ? 18 : 8;
  }

  // Tracking / infra (max 25): from Q20 — if any "Live" then bonus
  const tracking = answers.q20_tracking as Record<string, string> | undefined;
  let trackingLive = 0;
  if (tracking && typeof tracking === "object") {
    const statuses = Object.values(tracking).filter(Boolean);
    trackingLive = statuses.filter((s) => String(s).toLowerCase().includes("live")).length;
  }
  score += Math.min(25, trackingLive * 8);

  // Raw score is sum of components (each 0–25). Clamp to 0–100.
  const clamped = Math.min(100, Math.max(0, Math.round(score)));

  let verdict: Verdict = "NO-GO";
  if (clamped >= 75) verdict = "GO";
  else if (clamped >= 50) verdict = "CONDITIONAL GO";

  return { score: clamped, verdict };
}
