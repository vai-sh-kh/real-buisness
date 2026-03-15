import { z } from "zod";

export const seoSchema = z.object({
  title: z.string().max(70).optional().nullable(),
  meta_description: z.string().max(160).optional().nullable(),
  meta_keywords: z.array(z.string().min(1)).default([]),
  business_type_schema: z.string().max(100).optional().nullable(),
  og_title: z.string().max(70).optional().nullable(),
  og_description: z.string().max(200).optional().nullable(),
  og_image_url: z.string().url("Please enter a valid URL").optional().nullable().or(z.literal("")),
  twitter_card: z.enum(["summary", "summary_large_image"]).default("summary_large_image"),
  canonical_url: z.string().url("Please enter a valid URL").optional().nullable().or(z.literal("")),
  robots: z.string().max(100).default("index,follow"),
});

export type SEOFormData = z.infer<typeof seoSchema>;
