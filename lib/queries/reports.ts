import { createAdminClient } from "@/lib/supabase/admin";
import type { ReportsData, PropertyStats, LeadStats, CategoryDistribution, RecentActivity } from "@/types";

export interface ReportsFilters {
  date_from?: string; // ISO date
  date_to?: string;
  sort_activity?: "asc" | "desc";
}

export async function getReportsData(filters: ReportsFilters = {}): Promise<ReportsData> {
  const supabase = createAdminClient();
  const { date_from, date_to, sort_activity = "desc" } = filters;

  let propertiesQuery = supabase.from("properties").select("status, type, created_at");
  let leadsQuery = supabase.from("leads").select("status, source, created_at");
  if (date_from) {
    propertiesQuery = propertiesQuery.gte("created_at", date_from);
    leadsQuery = leadsQuery.gte("created_at", date_from);
  }
  if (date_to) {
    const end = date_to.includes("T") ? date_to : `${date_to}T23:59:59.999Z`;
    propertiesQuery = propertiesQuery.lte("created_at", end);
    leadsQuery = leadsQuery.lte("created_at", end);
  }

  const [
    propertiesResult,
    leadsResult,
    categoriesResult,
    recentPropertiesResult,
    recentLeadsResult,
  ] = await Promise.all([
    propertiesQuery,
    leadsQuery,
    supabase
      .from("categories")
      .select("id, name, properties(count)")
      .eq("is_active", true),
    supabase
      .from("properties")
      .select("id, title, city, created_at")
      .order("created_at", { ascending: sort_activity === "asc" })
      .limit(20),
    supabase
      .from("leads")
      .select("id, name, email, created_at")
      .order("created_at", { ascending: sort_activity === "asc" })
      .limit(20),
  ]);

  // Property stats
  const properties = propertiesResult.data ?? [];
  const property_stats: PropertyStats = {
    total: properties.length,
    active: properties.filter((p) => p.status === "active").length,
    draft: properties.filter((p) => p.status === "draft").length,
    sold: properties.filter((p) => p.status === "sold").length,
    rented: properties.filter((p) => p.status === "rented").length,
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
  ].sort(
    (a, b) =>
      (sort_activity === "asc" ? 1 : -1) *
      (new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  );

  return { property_stats, lead_stats, category_distribution, recent_activity };
}
