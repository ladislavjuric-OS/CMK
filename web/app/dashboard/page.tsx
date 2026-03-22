"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import { ReadinessDashboardView, type ReadinessRow } from "@/components/ReadinessDashboardView";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [readinessRuns, setReadinessRuns] = useState<ReadinessRow[]>([]);
  const [readinessHistoryLimit, setReadinessHistoryLimit] = useState(3);
  const [fullReadinessHistoryUnlocked, setFullReadinessHistoryUnlocked] = useState(false);

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

        setReadinessRuns(Array.isArray(data.readinessRuns) ? data.readinessRuns : data.readiness ? [data.readiness] : []);
        if (typeof data.readinessHistoryLimit === "number") setReadinessHistoryLimit(data.readinessHistoryLimit);
        if (typeof data.fullReadinessHistoryUnlocked === "boolean") setFullReadinessHistoryUnlocked(data.fullReadinessHistoryUnlocked);
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
      <main className="cmk-container dashboard-page">
        <div style={{ marginTop: "4rem", textAlign: "center" }}>
          <div className="cmk-tag">Dashboard</div>
          <h1 style={{ marginTop: "1.25rem", marginBottom: "0.75rem" }}>Loading…</h1>
          <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.7 }}>
            Fetching your readiness results.
          </p>
        </div>
        <SiteFooter />
      </main>
    );
  }

  const readiness = readinessRuns[0] ?? null;

  if (err || !readiness) {
    return (
      <main className="cmk-container dashboard-page">
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
        <SiteFooter />
      </main>
    );
  }

  return (
    <main className="cmk-container dashboard-page">
      <ReadinessDashboardView
        readiness={readiness}
        readinessRuns={readinessRuns}
        variant="user"
        readinessHistoryLimit={readinessHistoryLimit}
        fullReadinessHistoryUnlocked={fullReadinessHistoryUnlocked}
      />
      <SiteFooter />
    </main>
  );
}
