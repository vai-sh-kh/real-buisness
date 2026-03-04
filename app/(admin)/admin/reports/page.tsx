"use client";

import {
  Building2,
  Users,
  CheckCircle2,
  FileText,
  Star,
  TrendingUp,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useReports } from "@/hooks/useReports";
import { formatRelativeTime } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const PIE_COLORS = ["#0a0a0a", "#404040", "#737373", "#a3a3a3", "#d4d4d4", "#e5e5e5"];

const sourceLabels: Record<string, string> = {
  website: "Website",
  meta_ads: "Meta Ads",
  google_ads: "Google Ads",
  manual: "Manual",
};

function StatRow({ label, value, total }: { label: string; value: number; total: number }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-black transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const { data, isLoading, isError } = useReports();

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        Failed to load reports. Please try again.
      </div>
    );
  }

  const ps = data?.property_stats;
  const ls = data?.lead_stats;

  // Charts data
  const propertyStatusData = ps
    ? [
        { name: "Active", value: ps.active },
        { name: "Draft", value: ps.draft },
        { name: "Sold", value: ps.sold },
        { name: "Rented", value: ps.rented },
      ]
    : [];

  const leadSourceData = ls?.by_source.map((s) => ({
    name: sourceLabels[s.source] ?? s.source,
    value: s.count,
  })) ?? [];

  const categoryData = data?.category_distribution
    .sort((a, b) => b.property_count - a.property_count)
    .slice(0, 8) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-black tracking-tight">Reports</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Business analytics and performance overview
        </p>
      </div>

      {/* Top stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Properties",
            value: ps?.total ?? 0,
            icon: Building2,
            color: "text-blue-600",
            bg: "bg-blue-100",
          },
          {
            label: "Featured Listings",
            value: ps?.featured ?? 0,
            icon: Star,
            color: "text-yellow-600",
            bg: "bg-yellow-100",
          },
          {
            label: "Total Leads",
            value: ls?.total ?? 0,
            icon: Users,
            color: "text-purple-600",
            bg: "bg-purple-100",
          },
          {
            label: "Converted Leads",
            value: ls?.converted ?? 0,
            icon: CheckCircle2,
            color: "text-green-600",
            bg: "bg-green-100",
          },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 border border-gray-100">
                  <item.icon className="h-4 w-4 text-gray-700" />
                </div>
              </div>
              {isLoading ? (
                <Skeleton className="h-8 w-16 mt-4" />
              ) : (
                <p className="text-3xl font-bold mt-4">{item.value}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Property Status Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Property Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={propertyStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {propertyStatusData.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Lead Source Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              Lead Source Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : leadSourceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={leadSourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {leadSourceData.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                No lead data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Category distribution bar chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Properties by Category
          </CardTitle>
          <CardDescription>Number of properties in each category</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={categoryData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="property_count" fill="#0a0a0a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
              No category data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Detail + Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Property stats detail */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Property Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : (
              <>
                <StatRow label="For Sale" value={ps?.for_sale ?? 0} total={ps?.total ?? 1} />
                <StatRow label="For Rent" value={ps?.for_rent ?? 0} total={ps?.total ?? 1} />
                <StatRow label="Active" value={ps?.active ?? 0} total={ps?.total ?? 1} />
                <StatRow label="Draft" value={ps?.draft ?? 0} total={ps?.total ?? 1} />
                <StatRow label="Sold" value={ps?.sold ?? 0} total={ps?.total ?? 1} />
              </>
            )}
          </CardContent>
        </Card>

        {/* Lead pipeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Lead Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : (
              <>
                <StatRow label="New" value={ls?.new ?? 0} total={ls?.total ?? 1} />
                <StatRow label="Contacted" value={ls?.contacted ?? 0} total={ls?.total ?? 1} />
                <StatRow label="Qualified" value={ls?.qualified ?? 0} total={ls?.total ?? 1} />
                <StatRow label="Converted" value={ls?.converted ?? 0} total={ls?.total ?? 1} />
                <StatRow label="Lost" value={ls?.lost ?? 0} total={ls?.total ?? 1} />
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (data?.recent_activity?.length ?? 0) === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No recent activity</p>
          ) : (
            <div className="space-y-2">
              {data?.recent_activity.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-gray-100 text-gray-700"
                  >
                    {item.type === "property" ? "P" : "L"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className="text-xs capitalize">
                      {item.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(item.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
