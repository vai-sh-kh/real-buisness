import { SupabaseClient } from "@supabase/supabase-js";
import type { DashboardStats } from "@/types";

export async function getDashboardStats(
  supabase: SupabaseClient
): Promise<DashboardStats> {
  const [
    { count: totalProperties },
    { count: activeProperties },
    { count: totalLeads },
    { count: newLeads },
    { data: propertiesRows },
    { data: leadsRows },
    { data: recentProperties },
    { data: recentLeads },
  ] = await Promise.all([
    supabase.from("properties").select("id", { count: "exact", head: true }),
    supabase
      .from("properties")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
    supabase.from("leads").select("id", { count: "exact", head: true }),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
    supabase.from("properties").select("status"),
    supabase.from("leads").select("status"),
    supabase
      .from("properties")
      .select("id, title, city, status, created_at, cover_image_url")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("leads")
      .select("id, name, email, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const propertyStatusMap: Record<string, number> = {};
  for (const row of propertiesRows ?? []) {
    const s = (row as { status: string }).status;
    propertyStatusMap[s] = (propertyStatusMap[s] ?? 0) + 1;
  }
  const properties_by_status = Object.entries(propertyStatusMap).map(
    ([status, count]) => ({
      status: status as DashboardStats["properties_by_status"][number]["status"],
      count,
    })
  );

  const leadStatusMap: Record<string, number> = {};
  for (const row of leadsRows ?? []) {
    const s = (row as { status: string }).status;
    leadStatusMap[s] = (leadStatusMap[s] ?? 0) + 1;
  }
  const leads_by_status = Object.entries(leadStatusMap).map(([status, count]) => ({
    status: status as DashboardStats["leads_by_status"][number]["status"],
    count,
  }));

  return {
    total_properties: totalProperties ?? 0,
    active_properties: activeProperties ?? 0,
    total_leads: totalLeads ?? 0,
    new_leads: newLeads ?? 0,
    properties_by_status,
    leads_by_status,
    recent_properties: (recentProperties ?? []) as DashboardStats["recent_properties"],
    recent_leads: (recentLeads ?? []) as DashboardStats["recent_leads"],
  };
}
