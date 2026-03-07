import { createAdminClient } from "@/lib/supabase/admin";
import { toUserFriendlyMessage } from "@/lib/db-errors";
import type { AdminSettings, AdminSettingsUpdate } from "@/types";

export async function getAdminSettingsByEmail(
  email: string
): Promise<AdminSettings | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("admin_settings")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(toUserFriendlyMessage(error));
  }
  return data as AdminSettings;
}

export async function getOrCreateAdminSettings(
  email: string
): Promise<AdminSettings> {
  const existing = await getAdminSettingsByEmail(email);
  if (existing) return existing;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("admin_settings")
    .insert({
      email,
      display_name: null,
      avatar_url: null,
      phone: null,
      notifications_enabled: true,
      email_notifications: true,
      lead_alerts: true,
      browser_notifications: true,
      theme: "system",
      language: "en",
      timezone: "UTC",
    })
    .select()
    .single();

  if (error) throw new Error(toUserFriendlyMessage(error));
  return data as AdminSettings;
}

export async function updateAdminSettings(
  email: string,
  input: AdminSettingsUpdate
): Promise<AdminSettings> {
  const supabase = createAdminClient();
  const payload: Record<string, unknown> = {
    ...input,
    updated_at: new Date().toISOString(),
  };
  if (payload.avatar_url === "") payload.avatar_url = null;

  const { data, error } = await supabase
    .from("admin_settings")
    .update(payload)
    .eq("email", email)
    .select()
    .single();

  if (error) throw new Error(toUserFriendlyMessage(error));
  return data as AdminSettings;
}
