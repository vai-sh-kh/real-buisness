import { z } from "zod";

export const businessSchema = z.object({
  business_name: z.string().max(200).optional().nullable(),
  business_type: z.string().max(100).optional().nullable(),
  tagline: z.string().max(300).optional().nullable(),
  description: z.string().max(5000).optional().nullable(),
  website: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  logo_url: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  cover_image_url: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  address: z.string().max(500).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  state: z.string().max(100).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  zip: z.string().max(20).optional().nullable(),
  established_year: z.number().int().min(1800).max(new Date().getFullYear()).optional().nullable(),
});

export type BusinessFormData = z.infer<typeof businessSchema>;
