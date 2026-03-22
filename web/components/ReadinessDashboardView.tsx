"use client";

import Link from "next/link";
import { Fragment, useMemo, useRef, useState } from "react";
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

/** Mailto subject so inbox can filter dashboard / paywall-interest requests. */
const EXTENDED_HISTORY_MAIL_SUBJECT = "CMK — request: extended readiness history on dashboard";

function formatTestDateTime(iso: string) {
  const d = new Date(iso);
  const datePart = d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timePart = d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  return { datePart, timePart, combined: `${datePart} · ${timePart}` };
}

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
            Test: {formatTestDateTime(active.created_at).combined}
          </p>
        )}
      </div>

      {variant === "user" ? (
        <>
          <div style={{ marginBottom: "1.25rem", display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "flex-start" }}>
            <Link href="/tools/readiness" style={{ fontSize: 14, color: "var(--cmk-accent)", fontWeight: 700, textDecoration: "none" }}>
              Run readiness again →
            </Link>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>·</span>
            <Link href="/materials" style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", fontWeight: 600, textDecoration: "none" }}>
              All CMK materials →
            </Link>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>·</span>
            <Link href="/momentum" style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", fontWeight: 600, textDecoration: "none" }}>
              Momentum services →
            </Link>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>·</span>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("CMK — question after readiness")}`}
              style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", fontWeight: 600, textDecoration: "none" }}
            >
              Email {CONTACT_EMAIL}
            </a>
          </div>

          {otherRuns.length > 0 ? (
            <section style={{ marginTop: "0.25rem", marginBottom: "1.75rem", maxWidth: 720 }}>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.5)",
                  fontWeight: 800,
                  marginBottom: 8,
                }}
              >
                Readiness history
              </div>
              <p style={{ margin: "0 0 16px", color: "rgba(255,255,255,0.72)", fontSize: 15, lineHeight: 1.55, maxWidth: 640 }}>
                Earlier checks for this account. Expand for a quick summary, or open one as the main result at the top.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {otherRuns.map((r, idx) => {
                  const p = verdictToPill(r.score, r.verdict);
                  const conf = (r.payload as ReadinessPayload).confidence || "—";
                  const testFmt = formatTestDateTime(r.created_at);
                  const expanded = expandedOtherId === r.id;
                  const showHistoryRequestCta =
                    (otherRuns.length >= 2 && idx === 1) || (otherRuns.length === 1 && idx === 0);

                  return (
                    <Fragment key={r.id}>
                      <div
                        style={{
                          background: "rgba(0,0,0,0.22)",
                          border: "1px solid rgba(255,255,255,0.12)",
                          borderRadius: 12,
                          overflow: "hidden",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedOtherId((id) => (id === r.id ? null : r.id))}
                          style={{
                            width: "100%",
                            textAlign: "left",
                            cursor: "pointer",
                            background: expanded ? "rgba(0,255,204,0.06)" : "transparent",
                            border: "none",
                            padding: "14px 16px",
                            color: "#fff",
                            font: "inherit",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          <span style={{ fontSize: 15, fontWeight: 800 }}>
                            Readiness check · {testFmt.datePart} · {r.score}/100 · {p.key}
                          </span>
                          <span style={{ fontSize: 13, color: "rgba(0,255,204,0.85)", fontWeight: 800, flexShrink: 0 }}>
                            {expanded ? "▲ Hide" : "▼ Expand"}
                          </span>
                        </button>
                        {expanded ? (
                          <div
                            style={{
                              padding: "0 16px 16px",
                              borderTop: "1px solid rgba(255,255,255,0.08)",
                            }}
                          >
                            <pre
                              style={{
                                margin: "12px 0 14px",
                                padding: "14px 16px",
                                borderRadius: 10,
                                background: "rgba(0,0,0,0.35)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                color: "rgba(255,255,255,0.9)",
                                fontSize: 15,
                                lineHeight: 1.65,
                                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                              }}
                            >
                              {`---\nScore: ${r.score} / 100\nVerdict: ${p.key} · Confidence: ${conf}\nTest: ${testFmt.combined}\n---`}
                            </pre>
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
                                cursor: "pointer",
                                padding: "10px 16px",
                                borderRadius: 10,
                                border: "1px solid rgba(0,255,204,0.35)",
                                background: "rgba(0,255,204,0.12)",
                                color: "rgba(0,255,204,0.95)",
                                fontWeight: 800,
                                fontSize: 14,
                              }}
                            >
                              Open full view at top ↑
                            </button>
                          </div>
                        ) : null}
                      </div>
                      {showHistoryRequestCta ? (
                        <p style={{ margin: "4px 0 0", fontSize: 15, lineHeight: 1.6, color: "rgba(255,255,255,0.72)", maxWidth: 640 }}>
                          Want more checks kept in your dashboard history? We&apos;re lining up plans for that —{" "}
                          <a
                            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(EXTENDED_HISTORY_MAIL_SUBJECT)}`}
                            style={{ color: "var(--cmk-accent)", fontWeight: 800, textDecoration: "none" }}
                          >
                            email us
                          </a>{" "}
                          and we&apos;ll note your request (subject is preset so we can track it).
                        </p>
                      ) : null}
                    </Fragment>
                  );
                })}
              </div>
            </section>
          ) : null}

          <section
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 12,
              padding: "clamp(22px, 2.5vw, 32px)",
              marginBottom: "1.25rem",
              maxWidth: 800,
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.65)",
                fontWeight: 800,
                marginBottom: 12,
              }}
            >
              Last readiness check
            </div>
            {otherRuns.length > 0 ? (
              <p style={{ margin: "0 0 16px", fontSize: 16, color: "rgba(255,255,255,0.58)", lineHeight: 1.55, maxWidth: 640 }}>
                For the run shown <strong style={{ color: "rgba(255,255,255,0.82)" }}>at the top</strong>. Switch checks in{" "}
                <strong style={{ color: "rgba(255,255,255,0.82)" }}>Readiness history</strong> above to load a different one.
              </p>
            ) : (
              <p style={{ margin: "0 0 16px", fontSize: 16, color: "rgba(255,255,255,0.58)", lineHeight: 1.55 }}>
                Narrative and gaps for the score at the top.
              </p>
            )}
            <div
              style={{
                color: "rgba(255,255,255,0.9)",
                lineHeight: 1.75,
                fontSize: "clamp(17px, 1.35vw, 20px)",
                marginBottom: 16,
              }}
            >
              {payload.cta_reason || payload.one_win || "—"}
            </div>
            {gaps.length > 0 ? (
              <div style={{ color: "rgba(255,255,255,0.78)", lineHeight: 1.75, fontSize: "clamp(16px, 1.15vw, 18px)" }}>
                <div style={{ fontWeight: 800, marginBottom: 10, fontSize: "clamp(15px, 1vw, 17px)", color: "rgba(255,255,255,0.88)" }}>
                  Top critical gaps
                </div>
                {gaps.slice(0, 3).map((g, i) => (
                  <div key={i} style={{ marginBottom: 14 }}>
                    <div style={{ fontWeight: 800, color: "rgba(255,255,255,0.94)" }}>
                      {g.priority}: {g.title}
                    </div>
                    <div>{g.fix}</div>
                  </div>
                ))}
              </div>
            ) : null}
          </section>

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
              Suggested based on Readiness check
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
              Campaign Intelligence Report
            </div>
            <p style={{ margin: "0 0 12px", color: "rgba(255,255,255,0.88)", lineHeight: 1.65, fontSize: 14 }}>
              Operator-grade assessment independent of this score — $499, delivered within 72 hours. Most teams order
              before scaling ad spend.
            </p>
            <ul
              style={{
                margin: "0 0 16px",
                paddingLeft: 18,
                color: "rgba(255,255,255,0.78)",
                lineHeight: 1.55,
                fontSize: 13,
              }}
            >
              <li style={{ marginBottom: 6 }}>Clear GO/NO-GO verdict for your stage (pre-launch, live, or post-campaign).</li>
              <li style={{ marginBottom: 6 }}>Critical gaps called out and quantified where it changes decisions.</li>
              <li style={{ marginBottom: 6 }}>Prioritized fix sequence — what to tackle first, second, and third.</li>
              <li>Full written report in your inbox within 72h after checkout.</li>
            </ul>
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
              Order Campaign Intelligence Report — $499 →
            </Link>
          </section>
        </>
      ) : null}

      {variant === "admin" ? (
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
            AI summary (this run)
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
      ) : null}

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
              <div style={{ fontWeight: 800, marginBottom: 8 }}>Campaign Intelligence Report</div>
              <Link href="/audit" style={{ color: "var(--cmk-accent)", fontSize: 13, fontWeight: 700 }}>
                Order Campaign Intelligence Report — $499 →
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
