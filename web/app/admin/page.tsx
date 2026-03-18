"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

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
  user_id: string;
  email: string;
  product_key: string;
  status: string;
};

function isUnlocked(status: string) {
  return status === "unlocked" || status === "manual_unlocked";
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
        if (!session?.access_token) {
          setErr("Sign in required.");
          return;
        }

        const res = await fetch("/api/admin/summary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
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

  const entMap = useMemo(() => {
    const map = new Map<string, EntitlementRow[]>();
    for (const e of entitlements) {
      const list = map.get(e.user_id) || [];
      list.push(e);
      map.set(e.user_id, list);
    }
    return map;
  }, [entitlements]);

  const productKeys = ["blueprint", "audit", "ladislav"];

  const unlock = async (userId: string, email: string, productKey: string) => {
    try {
      const supabase = getSupabaseBrowser();
      const sessRes = await supabase.auth.getSession();
      const session = sessRes.data.session;
      if (!session?.access_token) throw new Error("No active session");

      await fetch("/api/admin/entitlements/set", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          userId,
          email,
          productKey,
          status: "manual_unlocked",
        }),
      }).catch(() => {});

      // Refresh by reload.
      window.location.reload();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    }
  };

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
        </div>
      </main>
    );
  }

  return (
    <main className="cmk-container">
      <div style={{ marginTop: "3.5rem", marginBottom: "1.25rem" }}>
        <div className="cmk-tag">Admin Console</div>
        <h1 style={{ marginTop: "1.25rem", marginBottom: "0.75rem" }}>
          Readiness + Entitlements
        </h1>
        <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.7 }}>
          Manual unlock of modules until Payhip webhook / fulfillment pipeline is fully automated.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
        {readiness.map((r) => {
          if (!r.user_id) return null;
          const ent = entMap.get(r.user_id) || [];
          const unlocked = new Set(ent.filter((x) => isUnlocked(x.status)).map((x) => x.product_key));

          const gaps = r.payload?.critical_gaps || [];

          return (
            <div
              key={r.id}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 14,
                padding: 16,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontWeight: 900 }}>
                    {r.email} · Score {r.score}/100 · {r.verdict}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, marginTop: 4 }}>
                    {new Date(r.created_at).toLocaleString()}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.72)", fontSize: 13, marginTop: 10 }}>
                    Critical gaps: {gaps.length > 0 ? gaps.slice(0, 2).map((g) => g.title).join(" · ") : "None"}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.62)", fontWeight: 800, marginBottom: 8 }}>
                    Unlock
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {productKeys.map((pk) => {
                      const on = unlocked.has(pk);
                      return (
                        <button
                          key={pk}
                          type="button"
                          onClick={() => unlock(r.user_id as string, r.email, pk)}
                          disabled={on}
                          style={{
                            cursor: on ? "not-allowed" : "pointer",
                            opacity: on ? 0.65 : 1,
                            padding: "10px 14px",
                            borderRadius: 10,
                            border: "1px solid rgba(255,255,255,0.14)",
                            background: on ? "rgba(255,255,255,0.04)" : "rgba(0,255,204,0.12)",
                            color: on ? "rgba(255,255,255,0.62)" : "rgba(0,255,204,0.9)",
                            fontWeight: 800,
                            fontSize: 12,
                          }}
                        >
                          {pk} {on ? "✓" : "→"}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

