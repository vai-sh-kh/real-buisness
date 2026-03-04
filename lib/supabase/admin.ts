import { createClient } from "@supabase/supabase-js";

/**
 * Admin (service-role) Supabase client.
 * MUST only be used in API routes / server actions — never on the client.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
