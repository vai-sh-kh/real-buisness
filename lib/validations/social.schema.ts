import { z } from "zod";

export const socialSchema = z.object({
  platform: z.enum(["facebook", "instagram", "twitter", "linkedin", "youtube", "tiktok", "custom"]),
  custom_platform_name: z.string().max(50).optional().nullable(),
  handle: z.string().max(100).optional().nullable(),
  url: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  profile_image_url: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().min(0).default(0),
});

export type SocialFormData = z.infer<typeof socialSchema>;
