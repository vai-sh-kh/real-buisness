import { createAdminClient } from "@/lib/supabase/admin";
import { toUserFriendlyMessage } from "@/lib/db-errors";
import type { PropertyWithRelations, PropertyFilters } from "@/types";

export interface AdminListPropertiesOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  category_id?: string;
  city?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface PublicPropertiesOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  category_id?: string;
  city?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  sort?: "newest" | "price_asc" | "price_desc";
}

export async function getProperties(
  opts: PublicPropertiesOptions
): Promise<{ data: PropertyWithRelations[]; total: number }> {
  const supabase = createAdminClient();
  const {
    page = 1,
    limit = 12,
    search,
    type,
    status = "active",
    category_id,
    city,
    min_price,
    max_price,
    bedrooms,
    sort = "newest",
  } = opts;

  let query = supabase
    .from("properties")
    .select("*, category:categories(id,name,slug)", { count: "exact" });

  if (status && status !== "all") query = query.eq("status", status);
  if (type && type !== "all") query = query.eq("type", type);
  if (category_id) query = query.eq("category_id", category_id);
  if (city) query = query.ilike("city", `%${city}%`);
  if (min_price !== undefined) query = query.gte("price", min_price);
  if (max_price !== undefined) query = query.lte("price", max_price);
  if (bedrooms !== undefined) query = query.eq("bedrooms", bedrooms);
  if (search) {
    query = query.or(`title.ilike.%${search}%,address.ilike.%${search}%,city.ilike.%${search}%`);
  }

  switch (sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const from = (page - 1) * limit;
  query = query.range(from, from + limit - 1);

  const { data, error, count } = await query;
  if (error) throw new Error(toUserFriendlyMessage(error));

  return { data: (data as PropertyWithRelations[]) ?? [], total: count ?? 0 };
}

export async function getPropertiesForAdmin(
  opts: AdminListPropertiesOptions
): Promise<{ data: PropertyWithRelations[]; total: number }> {
  const supabase = createAdminClient();
  const {
    page = 1,
    limit = 10,
    search,
    status,
    type,
    category_id,
    city,
    min_price,
    max_price,
    bedrooms,
    sort_by = "created_at",
    sort_order = "desc",
  } = opts;

  let query = supabase
    .from("properties")
    .select("*, category:categories(id,name,slug)", { count: "exact" });

  if (status && status !== "all") query = query.eq("status", status);
  if (type && type !== "all") query = query.eq("type", type);
  if (category_id) query = query.eq("category_id", category_id);
  if (city) query = query.ilike("city", `%${city}%`);
  if (min_price !== undefined) query = query.gte("price", min_price);
  if (max_price !== undefined) query = query.lte("price", max_price);
  if (bedrooms !== undefined) query = query.eq("bedrooms", bedrooms);
  if (search) {
    query = query.or(`title.ilike.%${search}%,address.ilike.%${search}%,city.ilike.%${search}%`);
  }

  query = query.order(sort_by, { ascending: sort_order === "asc" });

  const from = (page - 1) * limit;
  query = query.range(from, from + limit - 1);

  const { data, error, count } = await query;
  if (error) throw new Error(toUserFriendlyMessage(error));

  return { data: (data as PropertyWithRelations[]) ?? [], total: count ?? 0 };
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isPropertyId(id: string): boolean {
  return UUID_REGEX.test(id);
}

export async function getPropertyById(id: string): Promise<PropertyWithRelations | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*, category:categories(id,name,slug)")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as PropertyWithRelations;
}

export async function getPropertyBySlug(slug: string): Promise<PropertyWithRelations | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*, category:categories(id,name,slug)")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data as PropertyWithRelations;
}

export async function getPropertyByIdOrSlug(
  identifier: string
): Promise<PropertyWithRelations | null> {
  if (isPropertyId(identifier)) {
    return getPropertyById(identifier);
  }
  return getPropertyBySlug(identifier);
}

export async function getFeaturedProperties(limit = 6): Promise<PropertyWithRelations[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*, category:categories(id,name,slug)")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(toUserFriendlyMessage(error));
  return (data as PropertyWithRelations[]) ?? [];
}
