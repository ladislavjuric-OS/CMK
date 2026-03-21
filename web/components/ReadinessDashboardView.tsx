"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { getPrimaryOfferFromPayload } from "@/lib/readinessPrimaryOffer";

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

/** Kept for API compatibility; dashboard UI no longer gates CTAs on entitlements. */
export type EntitlementRow = { product_key: string; status: string };

const CONTACT_EMAIL = "hello@elitegrowth.pro";

export function verdictToPill(score: number, verdict: string) {
  const s = score >= 75 ? "GO" : score >= 50 ? "CONDITIONAL GO" : "NO-GO";
  const label = s === "GO" ? "GO" : s === "CONDITIONAL GO" ? "CONDITIONAL GO" : "NO-GO";
  return { key: s, label, verdict };
}

type Props = {
  readiness: ReadinessRow;
  readinessRuns?: ReadinessRow[];
  entitlements?: EntitlementRow[];
  variant?: "user" | "admin";
  adminEmail?: string;
  /** From /api/readiness/me — 3 default, 50 when admin unlocks full history. */
  readinessHistoryLimit?: number;
  fullReadinessHistoryUnlocked?: boolean;
};

export function ReadinessDashboardView({
  readiness,
  readinessRuns,
  variant = "user",
  adminEmail,
  readinessHistoryLimit = 3,
  fullReadinessHistoryUnlocked = false,
}: Props) {
  const runs = useMemo(() => {
    if (readinessRuns?.length) return readinessRuns;
    return [readiness];
  }, [readiness, readinessRuns]);

  const [focusedId, setFocusedId] = useState<string | null>(null);
  /** Mini-card accordion: which other run shows extra snippet. */
  const [expandedOtherId, setExpandedOtherId] = useState<string | null>(null);
  const mainRunAnchorRef = useRef<HTMLDivElement | null>(null);

  const active = useMemo(() => {
    if (focusedId) {
      const hit = runs.find((r) => r.id === focusedId);
      if (hit) return hit;
    }
    return readiness;
  }, [runs, readiness, focusedId]);

  const otherRuns = useMemo(() => runs.filter((r) => r.id !== active.id), [runs, active.id]);

  const pill = verdictToPill(active.score, active.verdict);
  const payload = active.payload as ReadinessPayload;
  const gaps = payload.critical_gaps || [];

  const primaryOffer = useMemo(
    () => getPrimaryOfferFromPayload(active.payload, active.score),
    [active.payload, active.score]
  );

  const primaryBlurb = payload.cta_reason?.trim() || payload.one_win?.trim() || `Based on this run, the next move is: ${primaryOffer.headline}`;

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
      ) : (
        <section
          style={{
            marginTop: "2.5rem",
            marginBottom: "1.5rem",
            padding: "18px 20px",
            borderRadius: 14,
            border: "1px solid rgba(0, 255, 204, 0.22)",
            background: "rgba(0, 255, 204, 0.06)",
            maxWidth: 720,
          }}
        >
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--cmk-accent)",
              fontWeight: 800,
              marginBottom: 8,
            }}
          >
            Your CMK room
          </div>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.88)", lineHeight: 1.65, fontSize: 15 }}>
            {fullReadinessHistoryUnlocked
              ? `Up to ${readinessHistoryLimit} recent checks can appear here. Your score, offers, and AI notes stay in one place — bookmark for your team or before launch.`
              : `Your last ${readinessHistoryLimit} checker runs live here with clear next steps. Bookmark this page, share it with your team, or come back before you go live.`}
          </p>
        </section>
      )}

      {variant === "user" && runs[0] && active.id !== runs[0].id ? (
        <p style={{ color: "rgba(255,200,120,0.95)", fontSize: 13, marginBottom: 10, maxWidth: 640 }}>
          Viewing a <strong>previous</strong> run — your latest is {runs[0].score}/100 from{" "}
          {new Date(runs[0].created_at).toLocaleString()}.
        </p>
      ) : null}

      <div ref={variant === "user" ? mainRunAnchorRef : undefined} style={{ marginBottom: "1.25rem" }}>
        <div className="cmk-tag">
          {variant === "admin"
            ? "User dashboard (preview)"
            : runs[0] && active.id !== runs[0].id
              ? "Past run"
              : "Latest score"}
        </div>
        <h1 style={{ marginTop: "1.25rem", marginBottom: "0.75rem" }}>
          Score: <span style={{ color: "var(--cmk-accent)" }}>{active.score}</span> / 100
        </h1>
        <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.7 }}>
          Verdict: <strong style={{ color: "var(--cmk-text)" }}>{pill.key}</strong> · Confidence:{" "}
          <strong style={{ color: "rgba(255,255,255,0.9)" }}>{payload.confidence || "—"}</strong>
        </p>
        {variant === "admin" ? (
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, marginTop: 8 }}>
            Submitted {new Date(active.created_at).toLocaleString()} · ID {active.id}
          </p>
        ) : (
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, marginTop: 8 }}>
            Test:{" "}
            {new Date(active.created_at).toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}{" "}
            ·{" "}
            {new Date(active.created_at).toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </p>
        )}
      </div>

      {variant === "user" ? (
        <>
          <section
            style={{
              marginBottom: "1.25rem",
              padding: "20px 22px",
              borderRadius: 14,
              border: "1px solid rgba(0, 255, 204, 0.35)",
              background: "linear-gradient(145deg, rgba(0,255,204,0.12), rgba(0,0,0,0.2))",
              maxWidth: 720,
            }}
          >
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--cmk-accent)",
                fontWeight: 900,
                marginBottom: 10,
              }}
            >
              Suggested for this run
            </div>
            <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 10, lineHeight: 1.35 }}>{primaryOffer.headline}</div>
            <p style={{ margin: "0 0 16px", color: "rgba(255,255,255,0.82)", lineHeight: 1.65, fontSize: 14 }}>{primaryBlurb}</p>
            <Link
              href={primaryOffer.href}
              style={{
                padding: "12px 20px",
                display: "inline-block",
                background: "linear-gradient(135deg, rgba(0,255,204,0.98), rgba(98,166,255,0.92))",
                color: "#041013",
                borderRadius: 10,
                fontWeight: 900,
                textDecoration: "none",
                fontSize: 14,
              }}
            >
              {primaryOffer.buttonLabel} →
            </Link>
          </section>

          <section
            style={{
              marginBottom: "1.25rem",
              padding: "20px 22px",
              borderRadius: 14,
              border: "1px solid rgba(98, 166, 255, 0.4)",
              background: "rgba(98, 166, 255, 0.1)",
              maxWidth: 720,
            }}
          >
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(180,200,255,0.95)",
                fontWeight: 900,
                marginBottom: 10,
              }}
            >
              Always available — Campaign Intelligence Report (CIR)
            </div>
            <p style={{ margin: "0 0 14px", color: "rgba(255,255,255,0.88)", lineHeight: 1.65, fontSize: 14 }}>
              GO/NO-GO verdict, gaps quantified, fix sequence — $499, 72h delivery. Independent of your score; most teams
              order this before scaling spend.
            </p>
            <Link
              href="/audit"
              style={{
                padding: "12px 20px",
                display: "inline-block",
                background: "linear-gradient(135deg, rgba(0,255,204,0.98), rgba(98,166,255,0.92))",
                color: "#041013",
                borderRadius: 10,
                fontWeight: 900,
                textDecoration: "none",
                fontSize: 14,
              }}
            >
              Order CIR — $499 →
            </Link>
          </section>

          <div style={{ marginBottom: "1.25rem", display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "flex-start" }}>
            <Link href="/tools/readiness" style={{ fontSize: 13, color: "var(--cmk-accent)", fontWeight: 700, textDecoration: "none" }}>
              Run readiness again →
            </Link>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>·</span>
            <Link href="/materials" style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontWeight: 600, textDecoration: "none" }}>
              All CMK materials →
            </Link>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>·</span>
            <Link href="/momentum" style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontWeight: 600, textDecoration: "none" }}>
              Momentum services →
            </Link>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>·</span>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("CMK — question after readiness")}`}
              style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontWeight: 600, textDecoration: "none" }}
            >
              Email {CONTACT_EMAIL}
            </a>
          </div>

          {otherRuns.length > 0 ? (
            <section style={{ marginTop: "0.25rem", marginBottom: "1.5rem", maxWidth: 900 }}>
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.5)",
                  fontWeight: 800,
                  marginBottom: 6,
                }}
              >
                Readiness history
              </div>
              <p style={{ margin: "0 0 14px", color: "rgba(255,255,255,0.72)", fontSize: 14, lineHeight: 1.55, maxWidth: 640 }}>
                <strong style={{ color: "rgba(255,255,255,0.92)" }}>{otherRuns.length} more run{otherRuns.length === 1 ? "" : "s"}</strong> — tap a card to load it at the top. Use{" "}
                <span style={{ color: "rgba(0,255,204,0.85)" }}>Expand snippet</span> for a quick peek without scrolling up.
              </p>
              <div
                style={{
                  maxHeight: otherRuns.length > 6 ? 420 : undefined,
                  overflowY: otherRuns.length > 6 ? "auto" : undefined,
                  paddingRight: otherRuns.length > 6 ? 6 : undefined,
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: 12,
                  }}
                >
                  {otherRuns.map((r) => {
                    const p = verdictToPill(r.score, r.verdict);
                    const pr = r.payload as ReadinessPayload;
                    const ogaps = pr.critical_gaps || [];
                    const gapHint = ogaps.length > 0 ? ogaps[0]?.title : "—";
                    const expanded = expandedOtherId === r.id;
                    return (
                      <div
                        key={r.id}
                        style={{
                          background: "rgba(0,0,0,0.2)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 12,
                          padding: 14,
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                          minWidth: 0,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setFocusedId(r.id);
                            setExpandedOtherId(null);
                            requestAnimationFrame(() => {
                              mainRunAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                            });
                          }}
                          style={{
                            textAlign: "left",
                            cursor: "pointer",
                            background: "transparent",
                            border: "none",
                            padding: 0,
                            color: "inherit",
                            font: "inherit",
                          }}
                        >
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", fontWeight: 700, lineHeight: 1.4 }}>
                            {new Date(r.created_at).toLocaleDateString(undefined, {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 600, marginTop: 2 }}>
                            {new Date(r.created_at).toLocaleTimeString(undefined, {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </div>
                          <div style={{ fontWeight: 900, fontSize: "1.05rem", marginTop: 8 }}>
                            {r.score}/100 · {p.key}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: "rgba(255,255,255,0.72)",
                              lineHeight: 1.45,
                              marginTop: 4,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            Top gap: {gapHint}
                          </div>
                        </button>
                        <div style={{ marginTop: "auto", paddingTop: 4, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setExpandedOtherId((id) => (id === r.id ? null : r.id));
                            }}
                            style={{
                              cursor: "pointer",
                              background: "rgba(255,255,255,0.06)",
                              border: "1px solid rgba(255,255,255,0.14)",
                              borderRadius: 8,
                              padding: "6px 10px",
                              color: "rgba(0,255,204,0.9)",
                              fontWeight: 800,
                              fontSize: 11,
                            }}
                          >
                            {expanded ? "Hide snippet" : "Expand snippet"}
                          </button>
                          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Card → full view ↑</span>
                        </div>
                        {expanded ? (
                          <div
                            style={{
                              fontSize: 12,
                              color: "rgba(255,255,255,0.78)",
                              lineHeight: 1.5,
                              borderTop: "1px solid rgba(255,255,255,0.08)",
                              paddingTop: 10,
                            }}
                          >
                            {(pr.cta_reason || pr.one_win || "—").slice(0, 280)}
                            {(pr.cta_reason || pr.one_win || "").length > 280 ? "…" : ""}
                            {ogaps.length > 1 ? (
                              <div style={{ marginTop: 8, color: "rgba(255,255,255,0.65)" }}>
                                <strong style={{ color: "rgba(255,255,255,0.88)" }}>{ogaps[1].priority}</strong> {ogaps[1].title}
                              </div>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          ) : null}
        </>
      ) : null}

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
          {variant === "user" ? "AI notes for this run" : "AI summary (this run)"}
        </div>
        {variant === "user" && otherRuns.length > 0 ? (
          <p style={{ margin: "0 0 12px", fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
            Matches the run loaded at the top — pick another run in <strong style={{ color: "rgba(255,255,255,0.75)" }}>Readiness history</strong> above to refresh this section.
          </p>
        ) : variant === "user" ? (
          <p style={{ margin: "0 0 12px", fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
            Long-form notes for this score and verdict.
          </p>
        ) : null}
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

      {variant === "admin" ? (
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
            Offer preview (same as user)
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 12,
                padding: 16,
              }}
            >
              <div style={{ fontWeight: 800, marginBottom: 8 }}>Suggested</div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", marginBottom: 0 }}>{primaryOffer.headline}</p>
              <Link href={primaryOffer.href} style={{ color: "var(--cmk-accent)", fontSize: 13, fontWeight: 700, marginTop: 8, display: "inline-block" }}>
                {primaryOffer.buttonLabel} →
              </Link>
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 12,
                padding: 16,
              }}
            >
              <div style={{ fontWeight: 800, marginBottom: 8 }}>CIR (always)</div>
              <Link href="/audit" style={{ color: "var(--cmk-accent)", fontSize: 13, fontWeight: 700 }}>
                Order CIR — $499 →
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
