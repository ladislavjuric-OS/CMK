"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Connecting your account…");

  useEffect(() => {
    const run = async () => {
      try {
        // Force a new client instance so `detectSessionInUrl` re-runs on this callback URL.
        const supabase = getSupabaseBrowser({ forceNew: true });

        // Supabase magic link returns tokens in the query string.
        // Depending on configuration, they may also be present in the URL hash.
        const url = new URL(window.location.href);
        const next = url.searchParams.get("next") || "/dashboard";
        const access_token =
          url.searchParams.get("access_token") ||
          new URLSearchParams(url.hash.replace(/^#/, "")).get("access_token");
        const refresh_token =
          url.searchParams.get("refresh_token") ||
          new URLSearchParams(url.hash.replace(/^#/, "")).get("refresh_token");
        const code = url.searchParams.get("code");

        if (access_token && refresh_token) {
          await supabase.auth.setSession({ access_token, refresh_token });
          await new Promise((r) => setTimeout(r, 300));
        } else if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            setStatus(`Sign-in failed: ${error.message}`);
            return;
          }
          await new Promise((r) => setTimeout(r, 300));
        }

        const sessRes = await supabase.auth.getSession();
        const session = sessRes.data.session;
        if (!session?.access_token) {
          setStatus("Session missing. Try signing in again from the login page.");
          return;
        }

        setStatus(next === "/admin" ? "Checking admin access…" : "Linking your readiness results…");
        const linkRes = await fetch("/api/readiness/link", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({}),
        });
        if (!linkRes.ok) {
          const errData = await linkRes.json().catch(() => ({}));
          setStatus(`Linking failed: ${(errData as { error?: string }).error ?? linkRes.statusText}. You’re signed in — try the dashboard.`);
          setTimeout(() => router.replace(next), 2500);
          return;
        }

        router.replace(next);
      } catch {
        setStatus("Auth failed. Please try again.");
      }
    };

    run();
  }, [router]);

  return (
    <main className="cmk-container">
      <div style={{ marginTop: "4rem", textAlign: "center" }}>
        <div className="cmk-tag">Account</div>
        <h1 style={{ marginTop: "1.25rem", marginBottom: "0.75rem" }}>Please wait…</h1>
        <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.7 }}>{status}</p>
      </div>
    </main>
  );
}

