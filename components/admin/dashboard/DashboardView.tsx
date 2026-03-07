"use client";

import { Building2, UserPlus, BarChart3, TrendingUp } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDashboard } from "@/hooks/useDashboard";
import { formatDate, cn } from "@/lib/utils";
import Link from "next/link";

const PROPERTY_STATUS_COLORS: Record<string, string> = {
  active: "#22c55e",
  draft: "#94a3b8",
  sold: "#3b82f6",
  rented: "#8b5cf6",
};

const LEAD_STATUS_COLORS: Record<string, string> = {
  new: "#3b82f6",
  contacted: "#22c55e",
  qualified: "#8b5cf6",
  converted: "#16a34a",
  lost: "#94a3b8",
};

const LEAD_STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  converted: "Converted",
  lost: "Lost",
};

function DashboardSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex min-w-0 items-center gap-3 overflow-hidden rounded-xl border border-admin-card-border bg-admin-card-bg p-4 shadow-sm sm:gap-4 sm:p-6"
          >
            <div className="h-10 w-10 shrink-0 rounded-lg bg-muted sm:h-12 sm:w-12 sm:rounded-xl" />
            <div className="min-w-0 flex-1 space-y-1.5 sm:space-y-2">
              <div className="h-3 w-16 rounded bg-muted sm:h-4 sm:w-28" />
              <div className="h-6 w-12 rounded bg-muted sm:h-8 sm:w-16" />
              <div className="h-2.5 w-14 rounded bg-muted sm:h-3 sm:w-20" />
            </div>
          </div>
        ))}
      </div>
      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        <div className="min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6">
          <div className="mb-4 flex items-center justify-between sm:mb-6">
            <div className="h-5 w-32 rounded bg-muted sm:h-6 sm:w-56" />
            <div className="h-3 w-12 shrink-0 rounded bg-muted sm:h-4 sm:w-16" />
          </div>
          <div className="h-48 rounded-xl bg-muted/50 sm:h-64 lg:h-[280px]" />
        </div>
        <div className="min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6">
          <div className="mb-4 flex items-center justify-between sm:mb-6">
            <div className="h-5 w-28 rounded bg-muted sm:h-6 sm:w-48" />
            <div className="h-3 w-12 shrink-0 rounded bg-muted sm:h-4 sm:w-16" />
          </div>
          <div className="h-48 rounded-xl bg-muted/50 sm:h-64 lg:h-[280px]" />
        </div>
      </div>
      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        <div className="min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6">
          <div className="mb-4 flex items-center justify-between sm:mb-6">
            <div className="h-5 w-28 rounded bg-muted sm:h-6 sm:w-40" />
            <div className="h-3 w-12 shrink-0 rounded bg-muted sm:h-4 sm:w-16" />
          </div>
          <div className="space-y-3 sm:space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex min-w-0 items-center gap-2 overflow-hidden rounded-xl border border-admin-card-border p-2 sm:gap-4 sm:p-3"
              >
                <div className="h-8 w-8 shrink-0 rounded-lg bg-muted sm:h-10 sm:w-10 sm:rounded-xl" />
                <div className="min-w-0 flex-1 space-y-1.5 sm:space-y-2">
                  <div className="h-3 w-24 max-w-full rounded bg-muted sm:h-4 sm:w-36" />
                  <div className="h-2.5 w-16 rounded bg-muted sm:h-3 sm:w-24" />
                </div>
                <div className="h-4 w-10 shrink-0 rounded bg-muted sm:h-5 sm:w-14" />
                <div className="hidden h-3 w-12 rounded bg-muted sm:block sm:w-16" />
              </div>
            ))}
          </div>
        </div>
        <div className="min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6">
          <div className="mb-4 flex items-center justify-between sm:mb-6">
            <div className="h-5 w-20 rounded bg-muted sm:h-6 sm:w-28" />
            <div className="h-3 w-12 shrink-0 rounded bg-muted sm:h-4 sm:w-16" />
          </div>
          <div className="space-y-3 sm:space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex min-w-0 items-center gap-2 overflow-hidden rounded-xl border border-admin-card-border p-2 sm:gap-4 sm:p-3"
              >
                <div className="h-8 w-8 shrink-0 rounded-full bg-muted sm:h-10 sm:w-10" />
                <div className="min-w-0 flex-1 space-y-1.5 sm:space-y-2">
                  <div className="h-3 w-20 max-w-full rounded bg-muted sm:h-4 sm:w-32" />
                  <div className="h-2.5 w-24 max-w-full rounded bg-muted sm:h-3 sm:w-40" />
                </div>
                <div className="h-4 w-10 shrink-0 rounded bg-muted sm:h-5 sm:w-14" />
                <div className="hidden h-3 w-12 rounded bg-muted sm:block sm:w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardView() {
  const { data, isLoading } = useDashboard();
  const stats = data?.data;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const propertyStatusData = (stats?.properties_by_status ?? []).map((s) => ({
    name: s.status.charAt(0).toUpperCase() + s.status.slice(1),
    value: s.count,
    color: PROPERTY_STATUS_COLORS[s.status] ?? "#94a3b8",
  }));

  const leadStatusData = (stats?.leads_by_status ?? []).map((s) => ({
    name: LEAD_STATUS_LABELS[s.status] ?? s.status,
    value: s.count,
    color: LEAD_STATUS_COLORS[s.status] ?? "#94a3b8",
  }));

  const totalProperties = stats?.total_properties ?? 0;
  const activeProperties = stats?.active_properties ?? 0;
  const totalLeads = stats?.total_leads ?? 0;
  const newLeads = stats?.new_leads ?? 0;

  return (
    <div className="space-y-8">
      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[
          {
            title: "Total Properties",
            value: totalProperties,
            sub: `${activeProperties} active`,
            icon: Building2,
            href: "/admin/properties",
            color: "emerald",
            bg: "bg-emerald-50",
            iconColor: "text-emerald-600",
          },
          {
            title: "Active Listings",
            value: activeProperties,
            sub: "Live on site",
            icon: TrendingUp,
            href: "/admin/properties",
            color: "emerald",
            bg: "bg-emerald-50",
            iconColor: "text-emerald-600",
          },
          {
            title: "Total Leads",
            value: totalLeads,
            sub: "with status New",
            icon: UserPlus,
            href: "/admin/leads",
            color: "blue",
            bg: "bg-blue-50",
            iconColor: "text-blue-600",
          },
          {
            title: "New Leads",
            value: newLeads,
            sub: "Require attention",
            icon: UserPlus,
            href: "/admin/leads",
            color: "blue",
            bg: "bg-blue-50",
            iconColor: "text-blue-600",
          },
        ].map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className={cn(
              "flex min-w-0 items-center gap-3 overflow-hidden rounded-xl border border-admin-card-border bg-admin-card-bg p-4 shadow-sm transition-all duration-200 sm:gap-4 sm:p-6",
              "hover:border-admin-card-border/80 hover:shadow-md",
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg sm:h-12 sm:w-12 sm:rounded-xl",
                item.bg,
              )}
            >
              <item.icon
                className={cn("h-5 w-5 sm:h-6 sm:w-6", item.iconColor)}
              />
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="truncate text-xs font-medium text-muted-foreground sm:text-sm">
                {item.title}
              </p>
              <p className="mt-0.5 truncate text-xl font-bold text-foreground sm:mt-1 sm:text-2xl">
                {item.value}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-muted-foreground sm:text-xs">
                {item.sub}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Property Status Distribution */}
        <div className="min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">
              Property Status Distribution
            </h2>
            <Link
              href="/admin/properties"
              className="text-sm font-semibold text-brand-blue hover:underline"
            >
              View all
            </Link>
          </div>
          {propertyStatusData.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl bg-gray-50 sm:min-h-[280px]">
              <BarChart3 className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-1 text-sm text-muted-foreground">
                No property data yet
              </p>
            </div>
          ) : (
            <div className="h-64 min-w-0 sm:h-64 lg:h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={propertyStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {propertyStatusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [value, "Count"]}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Lead Status Distribution - full width on mobile, X/Y axis lines visible */}
        <div className="w-full min-w-0 overflow-hidden rounded-xl border border-admin-card-border bg-admin-card-bg p-3 shadow-sm sm:p-4 lg:rounded-2xl lg:p-6">
          <div className="mb-4 flex items-center justify-between lg:mb-6">
            <h2 className="text-base font-semibold text-foreground lg:text-lg">
              Lead Status Distribution
            </h2>
            <Link
              href="/admin/leads"
              className="text-sm font-semibold text-brand-blue hover:underline"
            >
              View all
            </Link>
          </div>
          {leadStatusData.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center rounded-xl bg-muted/50 sm:h-64 lg:h-[280px]">
              <UserPlus className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-1 text-sm text-muted-foreground">
                No lead data yet
              </p>
            </div>
          ) : (
            <div className="h-48 w-full min-w-0 sm:h-64 lg:h-[280px] -mx-3 sm:-mx-4 lg:-mx-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={leadStatusData}
                  layout="vertical"
                  margin={{ top: 8, right: 8, left: 0, bottom: 24 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={true}
                    stroke="hsl(var(--border))"
                    className="stroke-gray-400"
                  />
                  <XAxis
                    type="number"
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    tickLine={{ stroke: "hsl(var(--border))" }}
                    tick={{
                      fontSize: 11,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={48}
                    tick={{
                      fontSize: 11,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    tickLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid hsl(var(--border))",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    formatter={(value: number) => [value, "Leads"]}
                  />
                  <Bar
                    dataKey="value"
                    fill="#3b82f6"
                    radius={[0, 4, 4, 0]}
                    maxBarSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="min-w-0 overflow-hidden rounded-xl border border-admin-card-border bg-admin-card-bg p-4 shadow-sm lg:rounded-2xl lg:p-6">
          <div className="mb-4 flex items-center justify-between lg:mb-6">
            <h2 className="text-base font-semibold text-foreground lg:text-lg">
              Recent Properties
            </h2>
            <Link
              href="/admin/properties"
              className="text-sm font-semibold text-brand-blue hover:underline"
            >
              View all
            </Link>
          </div>
          {!stats?.recent_properties?.length ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">
                No properties yet
              </p>
              <Link
                href="/admin/properties"
                className="mt-2 text-sm font-semibold text-blue-600 hover:underline"
              >
                Add your first property
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {stats.recent_properties.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/admin/properties/${p.id}`}
                    className="group flex items-center justify-between gap-4 rounded-xl border border-admin-card-border p-3 transition-colors hover:bg-muted/30"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-admin-card-border bg-muted">
                        {p.cover_image_url ? (
                          <img
                            src={p.cover_image_url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-blue-600">
                            <Building2 className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-foreground group-hover:text-brand-blue">
                          {p.title}
                        </span>
                        <p className="truncate text-xs text-gray-500">
                          {p.city}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end">
                      <span
                        className={cn(
                          "rounded-lg px-2 py-0.5 text-xs font-semibold capitalize",
                          p.status === "active" &&
"bg-emerald-100 text-emerald-700",
                        p.status === "sold" &&
                            "bg-blue-100 text-blue-700",
                        p.status === "rented" &&
                            "bg-violet-100 text-violet-700",
                        p.status === "draft" &&
                            "bg-gray-100 text-gray-600",
                        )}
                      >
                        {p.status}
                      </span>
                      <span className="mt-1 text-[11px] text-muted-foreground">
                        {formatDate(p.created_at)}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="min-w-0 overflow-hidden rounded-xl border border-admin-card-border bg-admin-card-bg p-4 shadow-sm lg:rounded-2xl lg:p-6">
          <div className="mb-4 flex items-center justify-between lg:mb-6">
            <h2 className="text-base font-semibold text-foreground lg:text-lg">
              Recent Leads
            </h2>
            <Link
              href="/admin/leads"
              className="text-sm font-semibold text-brand-blue hover:underline"
            >
              View all
            </Link>
          </div>
          {!stats?.recent_leads?.length ? (
            <div className="flex flex-col items-center justify-center py-12">
              <UserPlus className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">No leads yet</p>
              <Link
                href="/admin/leads"
                className="mt-2 text-sm font-semibold text-blue-600 hover:underline"
              >
                Add your first lead
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {stats.recent_leads.map((l) => (
                <li
                  key={l.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-admin-card-border p-3 transition-colors hover:bg-muted/30"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 font-bold text-amber-600">
                      {l.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {l.name}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {l.email ?? "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end">
                    <span
                      className={cn(
                        "rounded-lg px-2 py-0.5 text-xs font-semibold capitalize",
                        l.status === "new" &&
                          "bg-blue-100 text-blue-700",
                        l.status === "contacted" &&
                          "bg-emerald-100 text-emerald-700",
                        l.status === "qualified" &&
                          "bg-violet-100 text-violet-700",
                        l.status === "converted" &&
                          "bg-green-100 text-green-700",
                        l.status === "lost" &&
                          "bg-gray-100 text-gray-600",
                      )}
                    >
                      {l.status}
                    </span>
                    <span className="mt-1 text-[11px] text-muted-foreground">
                      {formatDate(l.created_at)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
