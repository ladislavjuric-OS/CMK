"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import { READINESS_FULL_HISTORY_PRODUCT_KEY } from "@/lib/readinessLimits";

type CriticalGap = { priority: string; title: string; finding: string; fix: string };
type ReadinessRow = {
  id: string;
  user_id: string | null;
  email: string;
  score: number;
  verdict: string;
  created_at: string;
  payload?: { critical_gaps?: CriticalGap[] };
};

type EntitlementRow = {
  user_id: string | null;
  email: string;
  product_key: string;
  status: string;
};

function isHistoryUnlocked(e: EntitlementRow) {
  return (
    e.product_key === READINESS_FULL_HISTORY_PRODUCT_KEY &&
    (e.status === "unlocked" || e.status === "manual_unlocked")
  );
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [readiness, setReadiness] = useState<ReadinessRow[]>([]);
  const [entitlements, setEntitlements] = useState<EntitlementRow[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const supabase = getSupabaseBrowser();
        const sessRes = await supabase.auth.getSession();
        const session = sessRes.data.session;

        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;

        const res = await fetch("/api/admin/summary", {
          method: "POST",
          credentials: "include",
          headers,
          body: JSON.stringify({}),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Admin summary failed");

        setReadiness(data.readiness || []);
        setEntitlements(data.entitlements || []);
      } catch (e) {
        setErr(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const groups = useMemo(() => {
    const m = new Map<string, ReadinessRow[]>();
    for (const r of readiness) {
      const k = r.email.trim().toLowerCase();
      const list = m.get(k) || [];
      list.push(r);
      m.set(k, list);
    }
    for (const [, list] of m) {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return Array.from(m.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [readiness]);

  const unlockFullHistory = async (userId: string | null, email: string) => {
    try {
      const supabase = getSupabaseBrowser();
      const sessRes = await supabase.auth.getSession();
      const session = sessRes.data.session;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;

      await fetch("/api/admin/entitlements/set", {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify({
          ...(userId ? { userId, email } : { email }),
          productKey: READINESS_FULL_HISTORY_PRODUCT_KEY,
          status: "manual_unlocked",
        }),
      });
      window.location.reload();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    }
  };

  const groupHasFullHistory = (emailKey: string, userId: string | null) =>
    entitlements.some((e) => {
      if (!isHistoryUnlocked(e)) return false;
      if (userId && e.user_id && e.user_id === userId) return true;
      if (e.email && e.email.trim().toLowerCase() === emailKey) return true;
      return false;
    });

  if (loading) {
    return (
      <main className="cmk-container">
        <div style={{ marginTop: "4rem", textAlign: "center" }}>
          <div className="cmk-tag">Admin</div>
          <h1 style={{ marginTop: "1.25rem", marginBottom: "0.75rem" }}>Loading…</h1>
          <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.7 }}>
            Fetching readiness data.
          </p>
        </div>
      </main>
    );
  }

  if (err) {
    return (
      <main className="cmk-container">
        <div style={{ marginTop: "4rem", textAlign: "center" }}>
          <div className="cmk-tag">Admin</div>
          <h1 style={{ marginTop: "1.25rem", marginBottom: "0.75rem" }}>Access denied</h1>
          <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.7, maxWidth: 620, margin: "0 auto" }}>
            {err}
          </p>
          <p
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: 14,
              maxWidth: 520,
              margin: "1rem auto 0",
              lineHeight: 1.6,
            }}
          >
            If you’re signed in with a Google account that isn’t in{" "}
            <code style={{ color: "rgba(255,255,255,0.75)" }}>ADMIN_EMAILS</code> or doesn’t have{" "}
            <code style={{ color: "rgba(255,255,255,0.75)" }}>is_admin</code> in Supabase, sign out first and use the correct account.
          </p>
          <p style={{ marginTop: "1.25rem", display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={async () => {
                const supabase = getSupabaseBrowser();
                await supabase.auth.signOut();
                window.location.href = "/admin/login";
              }}
              style={{
                cursor: "pointer",
                padding: "12px 18px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.08)",
                color: "#fff",
                fontWeight: 700,
              }}
            >
              Sign out (Google) → login
            </button>
            <Link
              href="/admin/login"
              style={{
                display: "inline-flex",
                alignItems: "center",
                color: "var(--cmk-accent)",
                fontWeight: 700,
                textDecoration: "none",
                padding: "12px 18px",
              }}
            >
              Sign in with Google →
            </Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="cmk-container">
      <div style={{ marginTop: "3.5rem", marginBottom: "1.25rem" }}>
        <div className="cmk-tag">Admin Console</div>
        <h1 style={{ marginTop: "1.25rem", marginBottom: "0.75rem" }}>Readiness by user</h1>
        <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.7 }}>
          Latest readiness runs grouped by email (up to three most recent per person in this list). Open a run to see the full user dashboard. After three free checker emails, users get a CMK signup message — you can unlock <strong>full history</strong> (last 50 runs on their dashboard) per email.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
        {groups.map(([emailKey, allRows]) => {
          const total = allRows.length;
          const display = allRows.slice(0, 3);
          const userId = allRows.find((r) => r.user_id)?.user_id ?? null;
          const primaryEmail = allRows[0]?.email ?? emailKey;
          const unlocked = groupHasFullHistory(emailKey, userId);

          return (
            <div
              key={emailKey}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 14,
                padding: 18,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                  alignItems: "baseline",
                  marginBottom: 14,
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  paddingBottom: 12,
                }}
              >
                <div>
                  <div style={{ fontWeight: 900, fontSize: "1.05rem" }}>{allRows[0]?.email || emailKey}</div>
                  <div style={{ color: "rgba(255,255,255,0.62)", fontSize: 12, marginTop: 6 }}>
                    {total} run{total === 1 ? "" : "s"}
                    {userId ? (
                      <>
                        {" "}
                        · user id: <code style={{ color: "rgba(255,255,255,0.75)" }}>{userId}</code>
                      </>
                    ) : null}
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", justifyContent: "flex-end" }}>
                  {total > 3 ? (
                    <div
                      style={{
                        fontSize: 12,
                        color: "rgba(255,255,255,0.55)",
                        fontWeight: 600,
                      }}
                    >
                      Showing latest 3 of {total} runs
                    </div>
                  ) : null}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                    <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", fontWeight: 800 }}>
                      Dashboard history
                    </div>
                    {unlocked ? (
                      <span style={{ fontSize: 12, color: "rgba(0,255,204,0.85)", fontWeight: 800 }}>Full history unlocked (50)</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => unlockFullHistory(userId, primaryEmail)}
                        style={{
                          cursor: "pointer",
                          padding: "8px 14px",
                          borderRadius: 10,
                          border: "1px solid rgba(0,255,204,0.35)",
                          background: "rgba(0,255,204,0.1)",
                          color: "rgba(0,255,204,0.95)",
                          fontWeight: 800,
                          fontSize: 12,
                        }}
                      >
                        Unlock 50-run history →
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 12,
                }}
              >
                {display.map((r) => {
                  const gaps = r.payload?.critical_gaps || [];
                  const gapHint = gaps.length > 0 ? gaps[0]?.title : "—";

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
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", fontWeight: 700 }}>
                        {new Date(r.created_at).toLocaleString()}
                      </div>
                      <div style={{ fontWeight: 900, fontSize: "1.1rem" }}>
                        {r.score}/100 · {r.verdict}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "rgba(255,255,255,0.72)",
                          lineHeight: 1.45,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        Top gap: {gapHint}
                      </div>
                      <div style={{ marginTop: "auto", paddingTop: 4 }}>
                        <Link
                          href={`/admin/readiness/${r.id}`}
                          style={{
                            color: "var(--cmk-accent)",
                            fontWeight: 800,
                            fontSize: 13,
                            textDecoration: "none",
                          }}
                        >
                          View as user →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
