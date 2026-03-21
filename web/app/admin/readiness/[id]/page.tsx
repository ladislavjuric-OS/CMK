"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import { ReadinessDashboardView, type ReadinessRow } from "@/components/ReadinessDashboardView";

export default function AdminReadinessDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [readiness, setReadiness] = useState<ReadinessRow | null>(null);
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    if (!id) {
      setErr("Missing result id");
      setLoading(false);
      return;
    }

    const run = async () => {
      try {
        setLoading(true);
        const supabase = getSupabaseBrowser();
        const sessRes = await supabase.auth.getSession();
        const session = sessRes.data.session;

        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;

        const res = await fetch(`/api/admin/readiness/${id}`, {
          method: "POST",
          credentials: "include",
          headers,
          body: JSON.stringify({}),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load result");

        setReadiness(data.readiness as ReadinessRow);
        setAdminEmail(String(data.admin?.email || ""));
      } catch (e) {
        setErr(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [id]);

  if (loading) {
    return (
      <main className="cmk-container">
        <div style={{ marginTop: "4rem", textAlign: "center" }}>
          <div className="cmk-tag">Admin</div>
          <h1 style={{ marginTop: "1.25rem", marginBottom: "0.75rem" }}>Loading…</h1>
        </div>
      </main>
    );
  }

  if (err || !readiness) {
    return (
      <main className="cmk-container">
        <div style={{ marginTop: "4rem", textAlign: "center" }}>
          <div className="cmk-tag">Admin</div>
          <h1 style={{ marginTop: "1.25rem", marginBottom: "0.75rem" }}>Cannot open result</h1>
          <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 1rem" }}>
            {err || "Not found"}
          </p>
          <Link href="/admin" style={{ color: "var(--cmk-accent)", fontWeight: 800, textDecoration: "none" }}>
            ← Back to admin
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="cmk-container">
      <ReadinessDashboardView readiness={readiness} variant="admin" adminEmail={adminEmail} />
    </main>
  );
}
