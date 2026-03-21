"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import type { Session } from "@supabase/supabase-js";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Connecting your account…");

  useEffect(() => {
    const run = async () => {
      try {
        // Same singleton as /admin/login so PKCE code_verifier from signInWithOAuth matches.
        const supabase = getSupabaseBrowser();

        const url = new URL(window.location.href);
        const next = url.searchParams.get("next") || "/dashboard";

        const oauthError = url.searchParams.get("error");
        const oauthDesc = url.searchParams.get("error_description");
        if (oauthError) {
          setStatus(
            `OAuth error: ${oauthDesc?.replace(/\+/g, " ") || oauthError}. Check Supabase redirect URLs match this site.`
          );
          return;
        }

        const hashParams = new URLSearchParams(url.hash.replace(/^#/, ""));
        const code =
          url.searchParams.get("code") ||
          hashParams.get("code") ||
          null;

        const access_token =
          url.searchParams.get("access_token") || hashParams.get("access_token");
        const refresh_token =
          url.searchParams.get("refresh_token") || hashParams.get("refresh_token");

        let session: Session | null = null;

        if (access_token && refresh_token) {
          const { data, error } = await supabase.auth.setSession({ access_token, refresh_token });
          if (error) {
            setStatus(`Sign-in failed: ${error.message}`);
            return;
          }
          session = data.session;
        } else if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            // React Strict Mode runs this effect twice in dev; second exchange fails with "invalid code".
            const { data: again } = await supabase.auth.getSession();
            session = again.session;
            if (!session) {
              setStatus(`Sign-in failed: ${error.message}`);
              return;
            }
          } else {
            session = data.session;
          }
        } else {
          // detectSessionInUrl may have already run on client init
          const { data } = await supabase.auth.getSession();
          session = data.session;
        }

        if (!session?.access_token) {
          setStatus(
            "Session missing — the callback URL had no ?code= or tokens. Confirm in Supabase → Auth → URL Configuration that this exact URL is allowed: " +
              `${url.origin}/auth/callback`
          );
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
          setStatus(
            `Linking failed: ${(errData as { error?: string }).error ?? linkRes.statusText}. You’re signed in — try the dashboard.`
          );
          setTimeout(() => router.replace(next), 2500);
          return;
        }

        router.replace(next);
      } catch (e) {
        setStatus(e instanceof Error ? e.message : "Auth failed. Please try again.");
      }
    };

    run();
  }, [router]);

  return (
    <main className="cmk-container">
      <div style={{ marginTop: "4rem", textAlign: "center" }}>
        <div className="cmk-tag">Account</div>
        <h1 style={{ marginTop: "1.25rem", marginBottom: "0.75rem" }}>Please wait…</h1>
        <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto" }}>{status}</p>
      </div>
    </main>
  );
}
