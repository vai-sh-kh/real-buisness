import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Admin (service-role) Supabase client.
 * MUST only be used in API routes / server actions — never on the client.
 */
export function createAdminClient() {
  if (!SUPABASE_URL?.trim()) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL. Add it to .env.local (see .env.example)."
    );
  }
  if (!SUPABASE_SERVICE_ROLE_KEY?.trim()) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. Add it to .env.local (see .env.example)."
    );
  }
  if (!SUPABASE_URL.startsWith("https://")) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL must be your project URL, e.g. https://xxxx.supabase.co"
    );
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
