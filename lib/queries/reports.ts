import { createAdminClient } from "@/lib/supabase/admin";
import type { ReportsData, PropertyStats, LeadStats, CategoryDistribution, RecentActivity } from "@/types";

export async function getReportsData(): Promise<ReportsData> {
  const supabase = createAdminClient();

  // Parallel queries for performance
  const [
    propertiesResult,
    leadsResult,
    categoriesResult,
    recentPropertiesResult,
    recentLeadsResult,
  ] = await Promise.all([
    supabase.from("properties").select("status, type, is_featured"),
    supabase.from("leads").select("status, source"),
    supabase
      .from("categories")
      .select("id, name, properties(count)")
      .eq("is_active", true),
    supabase
      .from("properties")
      .select("id, title, city, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("leads")
      .select("id, name, email, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  // Property stats
  const properties = propertiesResult.data ?? [];
  const property_stats: PropertyStats = {
    total: properties.length,
    active: properties.filter((p) => p.status === "active").length,
    draft: properties.filter((p) => p.status === "draft").length,
    sold: properties.filter((p) => p.status === "sold").length,
    rented: properties.filter((p) => p.status === "rented").length,
    featured: properties.filter((p) => p.is_featured).length,
    for_sale: properties.filter((p) => p.type === "sale").length,
    for_rent: properties.filter((p) => p.type === "rent").length,
  };

  // Lead stats
  const leads = leadsResult.data ?? [];
  const sourceMap = new Map<string, number>();
  leads.forEach((l) => {
    sourceMap.set(l.source, (sourceMap.get(l.source) ?? 0) + 1);
  });

  const lead_stats: LeadStats = {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    qualified: leads.filter((l) => l.status === "qualified").length,
    converted: leads.filter((l) => l.status === "converted").length,
    lost: leads.filter((l) => l.status === "lost").length,
    by_source: Array.from(sourceMap.entries()).map(([source, count]) => ({
      source: source as LeadStats["by_source"][number]["source"],
      count,
    })),
  };

  // Category distribution
  const categories = (categoriesResult.data ?? []) as unknown as Array<{
    id: string;
    name: string;
    properties: { count: number }[] | { count: number };
  }>;
  const category_distribution: CategoryDistribution[] = categories.map((c) => ({
    id: c.id,
    name: c.name,
    property_count: Array.isArray(c.properties)
      ? c.properties[0]?.count ?? 0
      : (c.properties as { count: number })?.count ?? 0,
  }));

  // Recent activity
  const recentProperties = recentPropertiesResult.data ?? [];
  const recentLeads = recentLeadsResult.data ?? [];

  const recent_activity: RecentActivity[] = [
    ...recentProperties.map((p) => ({
      type: "property" as const,
      id: p.id,
      title: p.title,
      subtitle: p.city,
      created_at: p.created_at,
    })),
    ...recentLeads.map((l) => ({
      type: "lead" as const,
      id: l.id,
      title: l.name,
      subtitle: l.email ?? "No email",
      created_at: l.created_at,
    })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return { property_stats, lead_stats, category_distribution, recent_activity };
}

export async function getDashboardStats() {
  const supabase = createAdminClient();

  const [
    propertiesCountResult,
    leadsCountResult,
    activePropertiesResult,
    newLeadsResult,
    recentLeadsResult,
    recentPropertiesResult,
  ] = await Promise.all([
    supabase.from("properties").select("id", { count: "exact", head: true }),
    supabase.from("leads").select("id", { count: "exact", head: true }),
    supabase
      .from("properties")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return {
    total_properties: propertiesCountResult.count ?? 0,
    total_leads: leadsCountResult.count ?? 0,
    active_properties: activePropertiesResult.count ?? 0,
    new_leads: newLeadsResult.count ?? 0,
    recent_leads: recentLeadsResult.data ?? [],
    recent_properties: recentPropertiesResult.data ?? [],
  };
}
