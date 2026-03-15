import { z } from "zod";

/** Accept Google Maps embed URL or share link (embed works in iframe; share links may redirect but are valid). */
function isValidMapUrl(value: string): boolean {
  try {
    const trimmed = value.trim();
    if (!trimmed) return true;
    const url = new URL(trimmed);
    if (url.protocol !== "https:") return false;
    const host = url.hostname.toLowerCase();
    const path = url.pathname.toLowerCase();
    // Embed URL: https://www.google.com/maps/embed?pb=...
    if (
      (host === "www.google.com" || host === "google.com" || host === "maps.google.com") &&
      path.includes("/maps/embed")
    )
      return true;
    // Share links: maps.app.goo.gl, goo.gl/maps
    if (host === "maps.app.goo.gl" || host === "goo.gl") return true;
    // maps.google.com with any path
    if (host === "maps.google.com") return true;
    return false;
  } catch {
    return false;
  }
}

export const propertySchema = z.object({
  title: z.string().min(1, "Please enter the listing title"),
  slug: z.string().optional(),
  description: z.string().nullable().optional(),
  short_description: z.string().max(160, "Please keep to 160 characters or less").nullable().optional(),
  type: z.enum(["sale", "rent"], { required_error: "Please select type (sale or rent)" }),
  status: z.enum(["active", "sold", "rented", "draft"]).default("active"),
  is_featured: z.boolean().default(false),
  category_id: z.string().uuid().nullable().optional(),
  price: z
    .number({ required_error: "Please enter the price", invalid_type_error: "Please enter a valid number for price" })
    .min(0, "Please enter 0 or more for price"),
  price_type: z.enum(["total", "percent"]).default("total"),
  price_label: z.string().nullable().optional(),
  area_sqft: z.number().min(0).nullable().optional(),
  bedrooms: z.number().int().min(0).nullable().optional(),
  bathrooms: z.number().int().min(0).nullable().optional(),
  floors: z.number().int().min(0).nullable().optional(),
  facing: z.string().nullable().optional(),
  age_years: z.number().int().min(0).nullable().optional(),
  furnished: z.enum(["furnished", "semi-furnished", "unfurnished"]).nullable().optional(),
  address: z.string().min(1, "Please enter the address"),
  city: z.string().min(1, "Please enter the city"),
  state: z.string().min(1, "Please enter the state"),
  zip_code: z.string().max(20).nullable().optional().or(z.literal("")),
  country: z.string().default("India"),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  map_embed_url: z
    .string()
    .nullable()
    .or(z.literal(""))
    .optional()
    .refine(
      (v) => {
        const s = v == null ? "" : String(v).trim();
        return s === "" || isValidMapUrl(s);
      },
      {
        message:
          "Please enter a valid Google Maps URL (embed or share link, e.g. google.com/maps/embed or maps.app.goo.gl)",
      },
    )
    .transform((v) => (v != null && String(v).trim() !== "" ? String(v).trim() : null)),
  cover_image_url: z
    .string()
    .url("Please provide a valid cover image URL")
    .nullable()
    .or(z.literal(""))
    .refine((v) => v != null && String(v).trim() !== "", {
      message: "Please add a cover image",
    }),
  gallery_images: z.array(z.string().url()).nullable().optional(),
  amenities: z.array(z.string()).nullable().optional(),
  highlights: z.array(z.string()).nullable().optional(),
  plot_number: z.string().nullable().optional(),
  plot_dimensions: z.string().nullable().optional(),
  meta_title: z.string().nullable().optional(),
  meta_description: z.string().nullable().optional(),
  meta_keywords: z.string().nullable().optional(),
  og_image_url: z.string().url().nullable().or(z.literal("")).optional(),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;
