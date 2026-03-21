"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

const BASE_URL = typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL ?? "";

export default function LoginPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const supabase = getSupabaseBrowser();
        const { data } = await supabase.auth.getSession();
        if (data.session?.access_token) {
          router.replace("/dashboard");
          return;
        }
      } finally {
        setChecking(false);
      }
    };
    run();
  }, [router]);

  const signInWithGoogle = async () => {
    const supabase = getSupabaseBrowser();
    const redirectTo = `${BASE_URL}/auth/callback?next=${encodeURIComponent("/dashboard")}`;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
  };

  if (checking) {
    return (
      <main className="cmk-container">
        <div style={{ marginTop: "4rem", textAlign: "center", maxWidth: 420, margin: "4rem auto" }}>
          <div className="cmk-tag">CMK</div>
          <h1 style={{ marginTop: "1.25rem", marginBottom: "0.75rem" }}>Loading…</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="cmk-container">
      <div style={{ marginTop: "3.5rem", textAlign: "center", maxWidth: 440, margin: "3rem auto" }}>
        <div className="cmk-tag">Sign in</div>
        <h1 style={{ marginTop: "1.25rem", marginBottom: "0.75rem" }}>Your CMK room</h1>
        <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
          Sign in with Google to link your readiness history, dashboard, and materials in one place.
        </p>
        <button
          type="button"
          onClick={signInWithGoogle}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            width: "100%",
            padding: "14px 20px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.08)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google
        </button>
        <p style={{ marginTop: "1.25rem", fontSize: 14 }}>
          <Link href="/tools/readiness" style={{ color: "var(--cmk-accent)", textDecoration: "none", fontWeight: 600 }}>
            ← Free readiness checker
          </Link>
        </p>
      </div>
    </main>
  );
}
