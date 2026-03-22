"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import { pressRowSearchBlob, type PressContactRow } from "@/lib/pressContact";

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(0,0,0,0.25)",
  color: "#fff",
  fontSize: 14,
};

function adminHeaders(sessionToken: string | undefined): Record<string, string> {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (sessionToken) h.Authorization = `Bearer ${sessionToken}`;
  return h;
}

export default function AdminPressPage() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [rows, setRows] = useState<PressContactRow[]>([]);
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [bulkJson, setBulkJson] = useState("");
  const [bulkMsg, setBulkMsg] = useState("");

  const [draft, setDraft] = useState({
    outlet: "",
    contact_name: "",
    role_or_beat: "",
    email: "",
    url: "",
    region: "",
    tags: "",
    category: "",
    notes: "",
    status: "todo",
    sort_order: 0,
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const supabase = getSupabaseBrowser();
    const sessRes = await supabase.auth.getSession();
    const session = sessRes.data.session;
    const res = await fetch("/api/admin/press", {
      method: "GET",
      credentials: "include",
      headers: adminHeaders(session?.access_token),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Failed to load press list");
    setRows(data.rows || []);
  }, []);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        await load();
        setErr("");
      } catch (e) {
        setErr(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [load]);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return rows;
    return rows.filter((r) => pressRowSearchBlob(r).includes(q));
  }, [rows, q]);

  const startEdit = (r: PressContactRow) => {
    setEditingId(r.id);
    setDraft({
      outlet: r.outlet,
      contact_name: r.contact_name || "",
      role_or_beat: r.role_or_beat || "",
      email: r.email || "",
      url: r.url || "",
      region: r.region || "",
      tags: r.tags || "",
      category: r.category || "",
      notes: r.notes || "",
      status: r.status || "todo",
      sort_order: r.sort_order ?? 0,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({
      outlet: "",
      contact_name: "",
      role_or_beat: "",
      email: "",
      url: "",
      region: "",
      tags: "",
      category: "",
      notes: "",
      status: "todo",
      sort_order: 0,
    });
  };

  const runBulkImport = async () => {
    setBulkMsg("");
    let parsed: unknown;
    try {
      parsed = JSON.parse(bulkJson) as unknown;
    } catch {
      setBulkMsg("Invalid JSON.");
      return;
    }
    const arr = Array.isArray(parsed) ? parsed : (parsed as { rows?: unknown }).rows;
    if (!Array.isArray(arr)) {
      setBulkMsg('Expected a JSON array of rows, or { "rows": [ ... ] }.');
      return;
    }
    const supabase = getSupabaseBrowser();
    const sessRes = await supabase.auth.getSession();
    const session = sessRes.data.session;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/press/bulk", {
        method: "POST",
        credentials: "include",
        headers: adminHeaders(session?.access_token),
        body: JSON.stringify({ rows: arr }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Bulk import failed");
      setBulkMsg(`Imported ${data.inserted} row(s).`);
      setBulkJson("");
      await load();
    } catch (e) {
      setBulkMsg(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };

  const saveNew = async () => {
    const supabase = getSupabaseBrowser();
    const sessRes = await supabase.auth.getSession();
    const session = sessRes.data.session;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/press", {
        method: "POST",
        credentials: "include",
        headers: adminHeaders(session?.access_token),
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Save failed");
      await load();
      cancelEdit();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const supabase = getSupabaseBrowser();
    const sessRes = await supabase.auth.getSession();
    const session = sessRes.data.session;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/press/${editingId}`, {
        method: "PATCH",
        credentials: "include",
        headers: adminHeaders(session?.access_token),
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Update failed");
      await load();
      cancelEdit();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Remove this row from the press list?")) return;
    const supabase = getSupabaseBrowser();
    const sessRes = await supabase.auth.getSession();
    const session = sessRes.data.session;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/press/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: adminHeaders(session?.access_token),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Delete failed");
      if (editingId === id) cancelEdit();
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };

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

  if (err) {
    return (
      <main className="cmk-container">
        <div style={{ marginTop: "4rem", textAlign: "center" }}>
          <div className="cmk-tag">Admin</div>
          <h1 style={{ marginTop: "1.25rem", marginBottom: "0.75rem" }}>Press list</h1>
          <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto" }}>{err}</p>
          <p style={{ marginTop: "1.25rem" }}>
            <Link href="/admin" style={{ color: "var(--cmk-accent)", fontWeight: 800 }}>
              ← Admin home
            </Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="cmk-container">
      <div style={{ marginTop: "3.5rem", marginBottom: "1.25rem" }}>
        <div className="cmk-tag">Admin · Master Press Lista</div>
        <h1 style={{ marginTop: "1.25rem", marginBottom: "0.75rem" }}>Searchable press table</h1>
        <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.7, maxWidth: 720 }}>
          Quick find across all columns (including <strong>category</strong>). The public media directory is{" "}
          <strong>paused</strong> until data is ready; admin editing here still applies. Ensure{" "}
          <code style={{ color: "rgba(255,255,255,0.78)" }}>category</code> exists — see{" "}
          <code style={{ color: "rgba(255,255,255,0.78)" }}>web/supabase/schema.sql</code>.
        </p>
        <p style={{ marginTop: "0.75rem" }}>
          <Link href="/admin" style={{ color: "var(--cmk-accent)", fontWeight: 800, textDecoration: "none" }}>
            ← Admin home
          </Link>
        </p>
      </div>

      <div
        style={{
          marginBottom: 20,
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
        }}
      >
        <label style={{ flex: "1 1 280px", minWidth: 0 }}>
          <span
            style={{
              display: "block",
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.5)",
              fontWeight: 800,
              marginBottom: 6,
            }}
          >
            Search (all columns)
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. tech, podcast, croatia…"
            style={{ ...inputStyle, maxWidth: 480 }}
          />
        </label>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", fontWeight: 700 }}>
          Showing <strong style={{ color: "rgba(255,255,255,0.9)" }}>{filtered.length}</strong> of {rows.length}
        </div>
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 14,
          padding: 18,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)",
            fontWeight: 800,
            marginBottom: 10,
          }}
        >
          Bulk import (JSON)
        </div>
        <p style={{ color: "rgba(255,255,255,0.62)", fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>
          Paste an array of objects with keys: <code style={{ color: "rgba(255,255,255,0.85)" }}>outlet</code> (required),{" "}
          <code style={{ color: "rgba(255,255,255,0.85)" }}>category</code>, <code style={{ color: "rgba(255,255,255,0.85)" }}>contact_name</code>,{" "}
          <code style={{ color: "rgba(255,255,255,0.85)" }}>role_or_beat</code>, <code style={{ color: "rgba(255,255,255,0.85)" }}>email</code>,{" "}
          <code style={{ color: "rgba(255,255,255,0.85)" }}>url</code>, <code style={{ color: "rgba(255,255,255,0.85)" }}>region</code>,{" "}
          <code style={{ color: "rgba(255,255,255,0.85)" }}>tags</code>, <code style={{ color: "rgba(255,255,255,0.85)" }}>notes</code>,{" "}
          <code style={{ color: "rgba(255,255,255,0.85)" }}>status</code>, <code style={{ color: "rgba(255,255,255,0.85)" }}>sort_order</code>. Max 2000 rows per
          request.
        </p>
        <textarea
          value={bulkJson}
          onChange={(e) => setBulkJson(e.target.value)}
          placeholder='[ { "outlet": "Example Mag", "category": "Trade", "region": "US" } ]'
          rows={5}
          style={{ ...inputStyle, resize: "vertical", width: "100%", fontFamily: "ui-monospace, monospace", fontSize: 12 }}
        />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10, alignItems: "center" }}>
          <button type="button" disabled={saving || !bulkJson.trim()} onClick={() => void runBulkImport()} style={btnPrimary}>
            Import rows
          </button>
          {bulkMsg ? (
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>{bulkMsg}</span>
          ) : null}
        </div>
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 14,
          padding: 18,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)",
            fontWeight: 800,
            marginBottom: 14,
          }}
        >
          {editingId ? "Edit row" : "Add row"}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 12,
          }}
        >
          <Field label="Outlet *" value={draft.outlet} onChange={(v) => setDraft((d) => ({ ...d, outlet: v }))} />
          <Field label="Contact name" value={draft.contact_name} onChange={(v) => setDraft((d) => ({ ...d, contact_name: v }))} />
          <Field label="Role / beat" value={draft.role_or_beat} onChange={(v) => setDraft((d) => ({ ...d, role_or_beat: v }))} />
          <Field label="Email" value={draft.email} onChange={(v) => setDraft((d) => ({ ...d, email: v }))} type="email" />
          <Field label="URL" value={draft.url} onChange={(v) => setDraft((d) => ({ ...d, url: v }))} />
          <Field label="Region" value={draft.region} onChange={(v) => setDraft((d) => ({ ...d, region: v }))} />
          <Field label="Category" value={draft.category} onChange={(v) => setDraft((d) => ({ ...d, category: v }))} />
          <Field label="Tags" value={draft.tags} onChange={(v) => setDraft((d) => ({ ...d, tags: v }))} />
          <Field label="Status" value={draft.status} onChange={(v) => setDraft((d) => ({ ...d, status: v }))} />
          <Field
            label="Sort order"
            value={String(draft.sort_order)}
            onChange={(v) => setDraft((d) => ({ ...d, sort_order: Number(v) || 0 }))}
          />
        </div>
        <label style={{ display: "block", marginTop: 12 }}>
          <span
            style={{
              display: "block",
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.5)",
              fontWeight: 800,
              marginBottom: 6,
            }}
          >
            Notes
          </span>
          <textarea
            value={draft.notes}
            onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
            rows={3}
            style={{ ...inputStyle, resize: "vertical", minHeight: 72 }}
          />
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
          {editingId ? (
            <>
              <button
                type="button"
                disabled={saving || !draft.outlet.trim()}
                onClick={() => void saveEdit()}
                style={btnPrimary}
              >
                Save changes
              </button>
              <button type="button" disabled={saving} onClick={() => cancelEdit()} style={btnGhost}>
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled={saving || !draft.outlet.trim()}
              onClick={() => void saveNew()}
              style={btnPrimary}
            >
              Add to table
            </button>
          )}
        </div>
      </div>

      <div style={{ overflowX: "auto", borderRadius: 14, border: "1px solid rgba(255,255,255,0.12)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 960 }}>
          <thead>
            <tr style={{ background: "rgba(0,0,0,0.35)", textAlign: "left" }}>
              {["Outlet", "Contact", "Role", "Email", "URL", "Region", "Tags", "Status", "Notes", ""].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "10px 12px",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.65)",
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
            {filtered.map((r) => (
              <tr key={r.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <td style={{ padding: "10px 12px", fontWeight: 800, verticalAlign: "top" }}>{r.outlet}</td>
                <td style={{ padding: "10px 12px", verticalAlign: "top", color: "rgba(255,255,255,0.85)" }}>
                  {r.contact_name || "—"}
                </td>
                <td style={{ padding: "10px 12px", verticalAlign: "top", color: "rgba(255,255,255,0.75)" }}>
                  {r.role_or_beat || "—"}
                </td>
                <td style={{ padding: "10px 12px", verticalAlign: "top", wordBreak: "break-word", maxWidth: 160 }}>
                  {r.email ? (
                    <a href={`mailto:${r.email}`} style={{ color: "var(--cmk-accent)" }}>
                      {r.email}
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td style={{ padding: "10px 12px", verticalAlign: "top", wordBreak: "break-all", maxWidth: 140 }}>
                  {r.url ? (
                    <a href={r.url} target="_blank" rel="noreferrer" style={{ color: "var(--cmk-accent)" }}>
                      link
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td style={{ padding: "10px 12px", verticalAlign: "top" }}>{r.region || "—"}</td>
                <td style={{ padding: "10px 12px", verticalAlign: "top" }}>{r.category?.trim() || "—"}</td>
                <td style={{ padding: "10px 12px", verticalAlign: "top", color: "rgba(255,255,255,0.7)" }}>
                  {r.tags || "—"}
                </td>
                <td style={{ padding: "10px 12px", verticalAlign: "top" }}>{r.status}</td>
                <td
                  style={{
                    padding: "10px 12px",
                    verticalAlign: "top",
                    color: "rgba(255,255,255,0.65)",
                    maxWidth: 220,
                    lineHeight: 1.45,
                  }}
                >
                  {r.notes ? (
                    <span style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {r.notes}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td style={{ padding: "10px 12px", verticalAlign: "top", whiteSpace: "nowrap" }}>
                  <button type="button" onClick={() => startEdit(r)} style={btnLink}>
                    Edit
                  </button>
                  <button type="button" onClick={() => void remove(r.id)} style={{ ...btnLink, marginLeft: 8 }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", color: "rgba(255,255,255,0.55)" }}>
            No rows match this search. Clear the search box or add contacts above.
          </div>
        ) : null}
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label style={{ display: "block", minWidth: 0 }}>
      <span
        style={{
          display: "block",
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.5)",
          fontWeight: 800,
          marginBottom: 6,
        }}
      >
        {label}
      </span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
    </label>
  );
}

const btnPrimary: CSSProperties = {
  cursor: "pointer",
  padding: "10px 18px",
  borderRadius: 10,
  border: "1px solid rgba(0,255,204,0.4)",
  background: "rgba(0,255,204,0.12)",
  color: "rgba(0,255,204,0.95)",
  fontWeight: 800,
};

const btnGhost: CSSProperties = {
  cursor: "pointer",
  padding: "10px 18px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(255,255,255,0.06)",
  color: "#fff",
  fontWeight: 700,
};

const btnLink: CSSProperties = {
  cursor: "pointer",
  background: "none",
  border: "none",
  color: "var(--cmk-accent)",
  fontWeight: 800,
  fontSize: 13,
  padding: 0,
  textDecoration: "underline",
};
