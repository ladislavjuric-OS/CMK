"use client";

import { useEffect, useMemo, useState } from "react";
import { publicPressSearchBlob, type PublicPressContactRow } from "@/lib/pressContact";

type SortKey = "outlet" | "region" | "category" | "sort_order";

function pickSortValue(r: PublicPressContactRow, key: SortKey): string | number {
  if (key === "sort_order") return r.sort_order ?? 0;
  const s = r[key];
  return (s == null ? "" : String(s)).toLowerCase();
}

function compareRows(a: PublicPressContactRow, b: PublicPressContactRow, key: SortKey, dir: "asc" | "desc"): number {
  const mul = dir === "asc" ? 1 : -1;
  if (key === "sort_order") {
    return ((a.sort_order ?? 0) - (b.sort_order ?? 0)) * mul;
  }
  const va = String(pickSortValue(a, key));
  const vb = String(pickSortValue(b, key));
  return va.localeCompare(vb, undefined, { sensitivity: "base" }) * mul;
}

export default function MediaListView() {
  const [rows, setRows] = useState<PublicPressContactRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("outlet");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/tools/media-list", { method: "GET" });
        const data = (await res.json()) as { error?: unknown; rows?: PublicPressContactRow[] };
        if (!res.ok) {
          const raw = data?.error;
          const msg =
            typeof raw === "string"
              ? raw
              : raw != null && typeof raw === "object"
                ? JSON.stringify(raw)
                : "Could not load media list";
          throw new Error(msg);
        }
        setRows(data.rows || []);
        setErr("");
      } catch (e) {
        setErr(e instanceof Error ? e.message : String(e));
        setRows([]);
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const r of rows) {
      const c = r.category?.trim();
      if (c) set.add(c);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
  }, [rows]);

  const hasUncategorized = useMemo(() => rows.some((r) => !r.category?.trim()), [rows]);

  const q = query.trim().toLowerCase();

  const visible = useMemo(() => {
    let list = rows.slice();
    if (category !== "all") {
      if (category === "__none__") list = list.filter((r) => !r.category?.trim());
      else list = list.filter((r) => (r.category || "").trim() === category);
    }
    if (q) list = list.filter((r) => publicPressSearchBlob(r).includes(q));
    list.sort((a, b) => compareRows(a, b, sortKey, sortDir));
    return list;
  }, [rows, category, q, sortKey, sortDir]);

  if (loading) {
    return (
      <p className="cmk-body" style={{ marginTop: "1.5rem" }}>
        Loading media list…
      </p>
    );
  }

  if (err) {
    return (
      <article className="cmk-card" style={{ marginTop: "1.5rem" }}>
        <h2>Something went wrong</h2>
        <p className="cmk-small">{err}</p>
      </article>
    );
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <div
        className="cmk-card"
        style={{
          marginBottom: "1.25rem",
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          alignItems: "end",
        }}
      >
        <label style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
          <span className="cmk-small" style={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Search
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Outlet, contact, region, tags…"
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid var(--cmk-border)",
              background: "rgba(0,0,0,0.25)",
              color: "var(--cmk-text)",
              fontSize: 15,
            }}
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span className="cmk-small" style={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Category
          </span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid var(--cmk-border)",
              background: "rgba(0,0,0,0.25)",
              color: "var(--cmk-text)",
              fontSize: 15,
            }}
          >
            <option value="all">All categories</option>
            {hasUncategorized ? <option value="__none__">Uncategorized</option> : null}
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span className="cmk-small" style={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Sort by
          </span>
          <select
            value={`${sortKey}:${sortDir}`}
            onChange={(e) => {
              const [k, d] = e.target.value.split(":") as [SortKey, "asc" | "desc"];
              setSortKey(k);
              setSortDir(d);
            }}
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid var(--cmk-border)",
              background: "rgba(0,0,0,0.25)",
              color: "var(--cmk-text)",
              fontSize: 15,
            }}
          >
            <option value="outlet:asc">Outlet (A → Z)</option>
            <option value="outlet:desc">Outlet (Z → A)</option>
            <option value="category:asc">Category (A → Z)</option>
            <option value="category:desc">Category (Z → A)</option>
            <option value="region:asc">Region (A → Z)</option>
            <option value="region:desc">Region (Z → A)</option>
            <option value="sort_order:asc">Manual order (low → high)</option>
            <option value="sort_order:desc">Manual order (high → low)</option>
          </select>
        </label>
        <div className="cmk-small" style={{ fontWeight: 700, color: "var(--cmk-muted)", paddingBottom: 4 }}>
          Showing <strong style={{ color: "var(--cmk-text)" }}>{visible.length}</strong> of {rows.length} outlets
        </div>
      </div>

      <div style={{ overflowX: "auto", borderRadius: 16, border: "1px solid var(--cmk-border)", background: "var(--cmk-panel)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 880 }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid var(--cmk-border)" }}>
              {["Outlet", "Contact", "Role / beat", "Category", "Region", "Tags", "Email", "Web"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "14px 16px",
                    color: "var(--cmk-muted)",
                    fontWeight: 800,
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <tr key={r.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <td style={{ padding: "14px 16px", fontWeight: 800, verticalAlign: "top" }}>{r.outlet}</td>
                <td style={{ padding: "14px 16px", verticalAlign: "top" }}>{r.contact_name || "—"}</td>
                <td style={{ padding: "14px 16px", verticalAlign: "top", color: "var(--cmk-muted)" }}>
                  {r.role_or_beat || "—"}
                </td>
                <td style={{ padding: "14px 16px", verticalAlign: "top" }}>{r.category?.trim() || "—"}</td>
                <td style={{ padding: "14px 16px", verticalAlign: "top" }}>{r.region || "—"}</td>
                <td style={{ padding: "14px 16px", verticalAlign: "top", color: "var(--cmk-muted)", maxWidth: 200 }}>
                  {r.tags || "—"}
                </td>
                <td style={{ padding: "14px 16px", verticalAlign: "top", wordBreak: "break-word", maxWidth: 200 }}>
                  {r.email ? (
                    <a href={`mailto:${r.email}`} style={{ color: "var(--cmk-accent)", fontWeight: 700 }}>
                      {r.email}
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td style={{ padding: "14px 16px", verticalAlign: "top" }}>
                  {r.url ? (
                    <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--cmk-accent)", fontWeight: 700 }}>
                      Open
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 ? (
          <p className="cmk-body" style={{ padding: "2rem", textAlign: "center", color: "var(--cmk-muted)" }}>
            No rows match. Try another category or clear the search.
          </p>
        ) : null}
      </div>
    </div>
  );
}
