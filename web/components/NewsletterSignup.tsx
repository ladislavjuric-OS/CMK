"use client";

import { useState } from "react";

type Variant = "full" | "compact";

type Props = {
  variant: Variant;
  /** Unique prefix for aria ids when multiple instances on one page */
  idPrefix?: string;
  title?: string;
  lead?: string;
};

export default function NewsletterSignup({ variant, idPrefix = "nl", title, lead }: Props) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "err">("idle");
  const [msg, setMsg] = useState("");

  const headingId = `${idPrefix}-newsletter-heading`;

  const defaultTitle = "Get useful growth updates";
  const defaultLead =
    "Occasional emails about CMK services, product updates, and practical stuff that helps you ship stronger launches — no spam.";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMsg("");
    try {
      const res = await fetch("/api/tools/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setStatus("err");
        setMsg(data.error || "Could not subscribe.");
        return;
      }
      setStatus("done");
      setMsg("You’re in — thanks. Watch your inbox for CMK updates.");
      setEmail("");
      setConsent(false);
    } catch {
      setStatus("err");
      setMsg("Network error. Try again in a moment.");
    }
  };

  if (variant === "compact") {
    return (
      <div className="cmk-footer-newsletter" aria-labelledby={`${idPrefix}-footer-nl-label`}>
        <p id={`${idPrefix}-footer-nl-label`} className="cmk-footer-newsletter-label">
          Email updates
        </p>
        {status === "done" ? (
          <p className="cmk-footer-newsletter-done" role="status">
            {msg}
          </p>
        ) : (
          <form className="cmk-footer-newsletter-form" onSubmit={(e) => void submit(e)}>
            <div className="cmk-footer-newsletter-row">
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="cmk-footer-newsletter-input"
                aria-label="Email for CMK updates"
              />
              <button type="submit" className="cmk-footer-newsletter-btn" disabled={status === "loading"}>
                {status === "loading" ? "…" : "Join"}
              </button>
            </div>
            <label className="cmk-footer-newsletter-consent">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
              <span>I agree to receive updates; I can unsubscribe anytime.</span>
            </label>
            {status === "err" && msg ? (
              <p className="cmk-footer-newsletter-err" role="alert">
                {msg}
              </p>
            ) : null}
          </form>
        )}
      </div>
    );
  }

  return (
    <section className="cmk-tools-newsletter" aria-labelledby={headingId}>
      <div className="cmk-tag">Updates</div>
      <h2 id={headingId} className="cmk-tools-newsletter-title">
        {title ?? defaultTitle}
      </h2>
      <p className="cmk-tools-newsletter-lead">{lead ?? defaultLead}</p>
      {status === "done" ? (
        <p className="cmk-tools-newsletter-msg cmk-tools-newsletter-msg--ok" role="status">
          {msg}
        </p>
      ) : (
        <form className="cmk-tools-newsletter-form" onSubmit={(e) => void submit(e)}>
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="cmk-tools-newsletter-input"
            aria-label="Email for updates"
          />
          <label className="cmk-tools-newsletter-consent">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span>I want to receive updates from The Architect / CMK. I can unsubscribe anytime.</span>
          </label>
          <button type="submit" className="cmk-tools-newsletter-btn" disabled={status === "loading"}>
            {status === "loading" ? "Sending…" : "Subscribe"}
          </button>
          {status === "err" && msg ? (
            <p className="cmk-tools-newsletter-msg cmk-tools-newsletter-msg--err" role="alert">
              {msg}
            </p>
          ) : null}
        </form>
      )}
    </section>
  );
}
