"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import {
  ReadinessDashboardView,
  type EntitlementRow,
  type ReadinessRow,
} from "@/components/ReadinessDashboardView";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [readiness, setReadiness] = useState<ReadinessRow | null>(null);
  const [entitlements, setEntitlements] = useState<EntitlementRow[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const supabase = getSupabaseBrowser();
        const sessRes = await supabase.auth.getSession();
        const session = sessRes.data.session;

        const doFetch = (bearer?: string) =>
          fetch("/api/readiness/me", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
            },
            body: JSON.stringify({}),
          });

        let res = session?.access_token ? await doFetch(session.access_token) : await doFetch();
        if (res.status === 401 && session?.access_token) {
          const { data: refreshData } = await supabase.auth.refreshSession();
          if (refreshData.session?.access_token) {
            res = await doFetch(refreshData.session.access_token);
          }
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load");

        setReadiness(data.readiness);
        setEntitlements(data.entitlements || []);
      } catch (e) {
        setErr(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [router]);

  if (loading) {
    return (
      <main className="cmk-container">
        <div style={{ marginTop: "4rem", textAlign: "center" }}>
          <div className="cmk-tag">Dashboard</div>
          <h1 style={{ marginTop: "1.25rem", marginBottom: "0.75rem" }}>Loading…</h1>
          <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.7 }}>
            Fetching your readiness results.
          </p>
        </div>
      </main>
    );
  }

  if (err || !readiness) {
    return (
      <main className="cmk-container">
        <div style={{ marginTop: "4rem", textAlign: "center" }}>
          <div className="cmk-tag">Dashboard</div>
          <h1 style={{ marginTop: "1.25rem", marginBottom: "0.75rem" }}>No access yet</h1>
          <p
            style={{
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.7,
              maxWidth: 560,
              margin: "0 auto 1.25rem",
            }}
          >
            {err ||
              "Your readiness results will appear here after you connect your account via magic link."}
          </p>
          <Link
            href="/tools/readiness"
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, rgba(0,255,204,0.98), rgba(98,166,255,0.92))",
              color: "#041013",
              border: "1px solid rgba(0,0,0,0.25)",
              fontWeight: 900,
              letterSpacing: "-0.01em",
              padding: "12px 22px",
              borderRadius: 10,
              textDecoration: "none",
            }}
          >
            Run readiness again →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="cmk-container">
      <ReadinessDashboardView readiness={readiness} entitlements={entitlements} variant="user" />
    </main>
  );
}
