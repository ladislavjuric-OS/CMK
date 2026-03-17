import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client (API routes, server actions).
 * Reads env at call time so build succeeds even when vars are not set on Vercel build.
 * Uses service role key — never expose to the client.
 */
export function getSupabaseServer(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
}
