"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import {
  getPropertiesForAdmin,
  getPropertyById,
  type AdminListPropertiesOptions,
} from "@/lib/queries/properties";
import type { PropertyWithRelations } from "@/types";
import { propertySchema } from "@/lib/validations/property.schema";
import { slugify } from "@/lib/utils";
import type { PropertyFormValues } from "@/lib/validations/property.schema";

export async function getPropertiesListAction(
  options: AdminListPropertiesOptions
): Promise<{ data: PropertyWithRelations[]; total: number }> {
  return getPropertiesForAdmin(options);
}

export async function getPropertyByIdAction(
  id: string
): Promise<PropertyWithRelations | null> {
  try {
    return await getPropertyById(id);
  } catch {
    return null;
  }
}

function toDbPayload(data: PropertyFormValues) {
  const slug = data.slug || slugify(data.title);
  return {
    title: data.title,
    slug,
    description: data.description ?? null,
    short_description: data.short_description ?? null,
    type: data.type,
    status: data.status,
    category_id: data.category_id ?? null,
    price: data.price,
    price_label: data.price_label ?? null,
    area_sqft: data.area_sqft ?? null,
    bedrooms: data.bedrooms ?? null,
    bathrooms: data.bathrooms ?? null,
    floors: data.floors ?? null,
    facing: data.facing ?? null,
    age_years: data.age_years ?? null,
    parking: data.parking ?? false,
    furnished: data.furnished ?? null,
    address: data.address,
    city: data.city,
    state: data.state,
    zip_code: data.zip_code ?? null,
    country: data.country ?? "India",
    latitude: data.latitude ?? null,
    longitude: data.longitude ?? null,
    map_embed_url: data.map_embed_url || null,
    cover_image_url: data.cover_image_url || null,
    amenities: data.amenities ?? null,
    highlights: data.highlights ?? null,
    plot_number: data.plot_number ?? null,
    plot_dimensions: data.plot_dimensions ?? null,
    is_featured: data.is_featured ?? false,
    meta_title: data.meta_title ?? null,
    meta_description: data.meta_description ?? null,
    meta_keywords: data.meta_keywords ?? null,
    og_image_url: data.og_image_url || null,
  };
}

export async function createProperty(
  input: PropertyFormValues
): Promise<{ success: true; data: { id: string } } | { success: false; error: string }> {
  const parsed = propertySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.message ?? "Validation failed" };
  }
  const supabase = createAdminClient();
  const insertPayload = toDbPayload(parsed.data);
  const { data, error } = await supabase
    .from("properties")
    .insert(insertPayload as never)
    .select("id")
    .single();
  if (error) return { success: false, error: error.message };
  return { success: true, data: { id: (data as { id: string }).id } };
}

const NULLABLE_STRING_KEYS = new Set([
  "description", "short_description", "price_label", "facing", "zip_code",
  "map_embed_url", "cover_image_url", "plot_number", "plot_dimensions",
  "meta_title", "meta_description", "meta_keywords", "og_image_url",
]);

export async function updateProperty(
  id: string,
  input: Partial<PropertyFormValues>
): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = propertySchema.partial().safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.message ?? "Validation failed" };
  }
  const supabase = createAdminClient();
  const data = parsed.data as Record<string, unknown>;
  const updatePayload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue;
    if (key === "slug" && (value === "" || !value)) {
      updatePayload.slug = data.title ? slugify(data.title as string) : undefined;
    } else if (value === "" && NULLABLE_STRING_KEYS.has(key)) {
      updatePayload[key] = null;
    } else {
      updatePayload[key] = value;
    }
  }
  if (updatePayload.slug === undefined) delete updatePayload.slug;
  const { error } = await supabase
    .from("properties")
    .update(updatePayload as never)
    .eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteProperty(
  id: string
): Promise<{ success: true } | { success: false; error: string }> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}
