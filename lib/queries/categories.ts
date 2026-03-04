import { createAdminClient } from "@/lib/supabase/admin";
import type { Category, CategoryFilters } from "@/types";
import { slugify } from "@/lib/utils";

export async function getCategories(
  opts: Partial<CategoryFilters> = {}
): Promise<{ data: Category[]; total: number }> {
  const supabase = createAdminClient();
  const {
    page = 1,
    limit = 10,
    search,
    is_active,
    sort_by = "name",
    sort_order = "asc",
  } = opts;

  let query = supabase
    .from("categories")
    .select("*", { count: "exact" });

  if (is_active !== undefined) query = query.eq("is_active", is_active);
  if (search) query = query.ilike("name", `%${search}%`);

  query = query.order(sort_by, { ascending: sort_order === "asc" });

  const from = (page - 1) * limit;
  query = query.range(from, from + limit - 1);

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  return { data: (data as Category[]) ?? [], total: count ?? 0 };
}

export async function getAllActiveCategories(): Promise<Category[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return (data as Category[]) ?? [];
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Category;
}

export async function createCategory(
  input: Pick<Category, "name" | "description" | "icon" | "is_active">
): Promise<Category> {
  const supabase = createAdminClient();
  const slug = slugify(input.name);
  const { data, error } = await supabase
    .from("categories")
    .insert({ ...input, slug })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Category;
}

export async function updateCategory(
  id: string,
  input: Partial<Pick<Category, "name" | "description" | "icon" | "is_active">>
): Promise<Category> {
  const supabase = createAdminClient();
  const payload: Record<string, unknown> = {
    ...input,
    updated_at: new Date().toISOString(),
  };
  if (input.name) payload.slug = slugify(input.name);

  const { data, error } = await supabase
    .from("categories")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Category;
}

export async function deleteCategory(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
