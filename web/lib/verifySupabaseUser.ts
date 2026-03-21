/**
 * Validates a Supabase user JWT via GoTrue. Requires anon apikey header (GoTrue returns 401 without it).
 */
export async function verifySupabaseUserAccessToken(accessToken: string): Promise<{
  userId: string;
  email: string;
} | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) return null;

  const verifyRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      apikey: anonKey,
    },
  });

  const verifyData = await verifyRes.json().catch(() => ({}));
  if (!verifyRes.ok) return null;

  const d = verifyData as { id?: string; email?: string; user?: { id?: string; email?: string } };
  const userId = d.id ?? d.user?.id;
  const email = String(d.email ?? d.user?.email ?? "").trim();
  if (!userId || !email.includes("@")) return null;

  return { userId, email };
}
