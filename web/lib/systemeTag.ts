/**
 * Create or resolve a Systeme.io contact and apply a tag (best-effort).
 * Same flow as readiness/analyze; uses Contacts + Tags API.
 */
export async function systemeAddContactWithTag(email: string, tagId: number): Promise<void> {
  if (!email || !process.env.SYSTEME_API_KEY) return;
  if (!tagId || Number.isNaN(tagId)) return;

  const debug = String(process.env.SYSTEME_DEBUG ?? "").toLowerCase() === "true";
  const headers = {
    "Content-Type": "application/json",
    "X-API-Key": process.env.SYSTEME_API_KEY,
  };

  try {
    const sr = await fetch("https://api.systeme.io/api/contacts", {
      method: "POST",
      headers,
      body: JSON.stringify({ email }),
    });
    const sd = await sr.json().catch(() => ({}));
    if (debug && !sr.ok && sr.status !== 409) {
      console.error("[systeme] create contact failed", { status: sr.status, body: sd });
    }

    const contactIdRaw =
      (sd as { id?: unknown } | null)?.id ??
      (sd as { contact?: { id?: unknown } } | null)?.contact?.id ??
      (sd as { data?: { id?: unknown } } | null)?.data?.id ??
      (sd as { contactId?: unknown } | null)?.contactId ??
      (sd as { contact_id?: unknown } | null)?.contact_id;

    const contactId =
      typeof contactIdRaw === "number"
        ? contactIdRaw
        : typeof contactIdRaw === "string" && /^\d+$/.test(contactIdRaw)
          ? parseInt(contactIdRaw, 10)
          : undefined;

    if (!contactId) {
      if (debug) console.error("[systeme] contactId missing from response", { response: sd });
      return;
    }

    const tr = await fetch(`https://api.systeme.io/api/contacts/${contactId}/tags`, {
      method: "POST",
      headers,
      body: JSON.stringify({ tagId }),
    });
    if (debug && !(tr.ok || tr.status === 204)) {
      const tb = await tr.text().catch(() => "");
      console.error("[systeme] tag contact failed", { status: tr.status, body: tb, contactId, tagId });
    }
  } catch {
    // best-effort
  }
}
