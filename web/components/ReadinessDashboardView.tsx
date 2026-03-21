"use client";

import Link from "next/link";

export type CriticalGap = { priority: string; title: string; finding: string; fix: string };
export type ReadinessPayload = {
  verdict?: string;
  verdict_emoji?: string;
  confidence?: string;
  one_win?: string;
  cta_reason?: string;
  critical_gaps?: CriticalGap[];
  cta?: string;
};

export type ReadinessRow = {
  id: string;
  user_id: string | null;
  email: string;
  score: number;
  verdict: string;
  payload: ReadinessPayload | Record<string, unknown>;
  created_at: string;
};

export type EntitlementRow = { product_key: string; status: string };

export function verdictToPill(score: number, verdict: string) {
  const s = score >= 75 ? "GO" : score >= 50 ? "CONDITIONAL GO" : "NO-GO";
  const label = s === "GO" ? "GO" : s === "CONDITIONAL GO" ? "CONDITIONAL GO" : "NO-GO";
  return { key: s, label, verdict };
}

function isUnlocked(status: string) {
  return status === "unlocked" || status === "manual_unlocked";
}

type Props = {
  readiness: ReadinessRow;
  entitlements: EntitlementRow[];
  /** Admin preview: same UI, extra banner + no fake "no access" state */
  variant?: "user" | "admin";
  adminEmail?: string;
};

export function ReadinessDashboardView({ readiness, entitlements, variant = "user", adminEmail }: Props) {
  const unlockedKeys = new Set<string>();
  for (const e of entitlements) {
    if (isUnlocked(e.status)) unlockedKeys.add(e.product_key);
  }

  const pill = verdictToPill(readiness.score, readiness.verdict);
  const payload = readiness.payload as ReadinessPayload;
  const gaps = payload.critical_gaps || [];
  const recommendedKey = readiness.score >= 75 ? "ladislav" : "audit";

  const modules = [
    {
      key: "blueprint",
      title: "Blueprint (recommended base package)",
      desc: "Start with the structured campaign blueprint and the execution path.",
      unlocked: unlockedKeys.has("blueprint"),
      url: "/materials",
      highlight: true,
    },
    {
      key: "audit",
      title: "Campaign Intelligence Report",
      desc: "Detailed audit with critical gaps quantified and exact fix sequence.",
      unlocked: unlockedKeys.has("audit"),
      url: "/audit",
      highlight: recommendedKey === "audit",
    },
    {
      key: "ladislav",
      title: "Ladislav session (operator deep dive)",
      desc: "If you want the highest-touch upgrade: deeper operator guidance.",
      unlocked: unlockedKeys.has("ladislav"),
      url: "/audit",
      highlight: recommendedKey === "ladislav",
    },
  ];

  return (
    <>
      {variant === "admin" ? (
        <div
          style={{
            marginBottom: "1.25rem",
            padding: "12px 16px",
            borderRadius: 12,
            border: "1px solid rgba(255, 200, 80, 0.35)",
            background: "rgba(255, 200, 80, 0.08)",
            color: "rgba(255, 248, 220, 0.95)",
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          <strong>Admin preview</strong> — same view as the user sees for this run ({readiness.email}
          {adminEmail ? ` · signed in as ${adminEmail}` : ""}).
          <div style={{ marginTop: 8 }}>
            <Link
              href="/admin"
              style={{ color: "var(--cmk-accent)", fontWeight: 800, textDecoration: "none" }}
            >
              ← Back to admin
            </Link>
          </div>
        </div>
      ) : null}

      <div style={{ marginTop: variant === "admin" ? 0 : "3.5rem", marginBottom: "1.25rem" }}>
        <div className="cmk-tag">{variant === "admin" ? "User dashboard (preview)" : "Your Readiness"}</div>
        <h1 style={{ marginTop: "1.25rem", marginBottom: "0.75rem" }}>
          Score: <span style={{ color: "var(--cmk-accent)" }}>{readiness.score}</span> / 100
        </h1>
        <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.7 }}>
          Verdict: <strong style={{ color: "var(--cmk-text)" }}>{pill.key}</strong> · Confidence:{" "}
          <strong style={{ color: "rgba(255,255,255,0.9)" }}>{payload.confidence || "—"}</strong>
        </p>
        {variant === "admin" ? (
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, marginTop: 8 }}>
            Submitted {new Date(readiness.created_at).toLocaleString()} · ID {readiness.id}
          </p>
        ) : null}
      </div>

      <section
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 12,
          padding: "20px 22px",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.62)",
            fontWeight: 800,
            marginBottom: 10,
          }}
        >
          Your base suggestions (draft)
        </div>
        <div style={{ color: "rgba(255,255,255,0.86)", lineHeight: 1.8, fontSize: 14, marginBottom: 10 }}>
          {payload.cta_reason || payload.one_win || "—"}
        </div>
        {gaps.length > 0 ? (
          <div style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.7, fontSize: 13 }}>
            <div style={{ fontWeight: 800, marginBottom: 6 }}>Top critical gaps</div>
            {gaps.slice(0, 3).map((g, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: 800, color: "rgba(255,255,255,0.92)" }}>
                  {g.priority}: {g.title}
                </div>
                <div>{g.fix}</div>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <section style={{ marginTop: 10 }}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.62)",
            fontWeight: 800,
            marginBottom: 12,
          }}
        >
          Upsell modules
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {modules.map((m) => (
            <div
              key={m.key}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 12,
                padding: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                  marginBottom: 6,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ fontWeight: 900 }}>{m.title}</div>
                {m.highlight ? (
                  <div
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--cmk-accent)",
                      fontWeight: 900,
                    }}
                  >
                    Recommended
                  </div>
                ) : null}
              </div>
              <div style={{ color: "rgba(255,255,255,0.72)", fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>
                {m.desc}
              </div>
              {m.unlocked ? (
                <Link
                  href={m.url}
                  style={{
                    padding: "10px 16px",
                    display: "inline-block",
                    background: "linear-gradient(135deg, rgba(0,255,204,0.98), rgba(98,166,255,0.92))",
                    color: "#041013",
                    border: "1px solid rgba(0,0,0,0.25)",
                    borderRadius: 10,
                    fontWeight: 900,
                    textDecoration: "none",
                  }}
                >
                  Open module →
                </Link>
              ) : (
                <button
                  type="button"
                  style={{
                    cursor: "not-allowed",
                    opacity: 0.75,
                    padding: "10px 16px",
                    borderRadius: 10,
                    fontWeight: 700,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    color: "rgba(255,255,255,0.62)",
                  }}
                >
                  Locked (unlock after purchase)
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
