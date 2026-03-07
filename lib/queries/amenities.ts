import { createAdminClient } from "@/lib/supabase/admin";
import { toUserFriendlyMessage } from "@/lib/db-errors";

export interface Amenity {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getAmenities(activeOnly = true): Promise<Amenity[]> {
  const supabase = createAdminClient();
  let query = supabase
    .from("amenities")
    .select("*")
    .order("sort_order", { ascending: true });
  if (activeOnly) query = query.eq("is_active", true);
  const { data, error } = await query;
  if (error) throw new Error(toUserFriendlyMessage(error));
  return (data as Amenity[]) ?? [];
}

export async function createAmenity(input: {
  name: string;
  slug: string;
  icon?: string | null;
  sort_order?: number;
}): Promise<Amenity> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("amenities")
    .insert({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();
  if (error) throw new Error(toUserFriendlyMessage(error));
  return data as Amenity;
}

export async function deleteAmenity(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("amenities").delete().eq("id", id);
  if (error) throw new Error(toUserFriendlyMessage(error));
}
