import { z } from "zod";

export const adminSettingsSchema = z.object({
  display_name: z.string().max(100).nullable().optional(),
  avatar_url: z.union([z.string().url(), z.literal("")]).optional(),
  phone: z.string().max(20).nullable().optional(),
  notifications_enabled: z.boolean().optional(),
  email_notifications: z.boolean().optional(),
  lead_alerts: z.boolean().optional(),
  browser_notifications: z.boolean().optional(),
  theme: z.enum(["light", "dark", "system"]).optional(),
  language: z.string().max(10).optional(),
  timezone: z.string().max(50).optional(),
});

export type AdminSettingsFormValues = z.infer<typeof adminSettingsSchema>;
