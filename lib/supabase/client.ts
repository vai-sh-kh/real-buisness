import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client — uses anon key only.
 * Only for public read operations from the client side.
 */
export function createClientSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
