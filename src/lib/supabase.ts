import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const isDemo = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
let singleton: SupabaseClient | null = null;
export function supabase(): SupabaseClient | null {
  if (isDemo) return null;
  if (!singleton) singleton = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: true, autoRefreshToken: true } }
  );
  return singleton;
}
