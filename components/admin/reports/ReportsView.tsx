"use client";

import { useState, useMemo } from "react";
import {
  Building2,
  UserPlus,
  FolderOpen,
  Activity,
  Loader2,
  TrendingUp,
  BarChart3,
  Download,
  FileSpreadsheet,
  FileText,
  ArrowUpDown,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useExportWorker } from "@/hooks/useExportWorker";
import { toast } from "sonner";
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
import { useReports } from "@/hooks/useReports";
import { formatDate, cn } from "@/lib/utils";
import Link from "next/link";
import type { LeadSource, ReportsData } from "@/types";

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

const SOURCE_LABELS: Record<LeadSource, string> = {
  website: "Website",
  meta_ads: "Meta Ads",
  google_ads: "Google Ads",
  manual: "Manual",
};

function reportsToExportRows(reports: ReportsData): Record<string, unknown>[] {
  if (!reports) return [];
  const { property_stats, lead_stats, category_distribution, recent_activity } =
    reports;
  const rows: Record<string, unknown>[] = [
    {
      Metric: "Properties Total",
      Value: property_stats.total,
      Type: "",
      Title: "",
      Subtitle: "",
      "Created At": "",
    },
    {
      Metric: "Properties Active",
      Value: property_stats.active,
      Type: "",
      Title: "",
      Subtitle: "",
      "Created At": "",
    },
    {
      Metric: "Properties Draft",
      Value: property_stats.draft,
      Type: "",
      Title: "",
      Subtitle: "",
      "Created At": "",
    },
    {
      Metric: "Properties Sold",
      Value: property_stats.sold,
      Type: "",
      Title: "",
      Subtitle: "",
      "Created At": "",
    },
    {
      Metric: "Properties Rented",
      Value: property_stats.rented,
      Type: "",
      Title: "",
      Subtitle: "",
      "Created At": "",
    },
    {
      Metric: "Leads Total",
      Value: lead_stats.total,
      Type: "",
      Title: "",
      Subtitle: "",
      "Created At": "",
    },
    {
      Metric: "Leads New",
      Value: lead_stats.new,
      Type: "",
      Title: "",
      Subtitle: "",
      "Created At": "",
    },
    {
      Metric: "Leads Contacted",
      Value: lead_stats.contacted,
      Type: "",
      Title: "",
      Subtitle: "",
      "Created At": "",
    },
    {
      Metric: "Leads Qualified",
      Value: lead_stats.qualified,
      Type: "",
      Title: "",
      Subtitle: "",
      "Created At": "",
    },
    {
      Metric: "Leads Converted",
      Value: lead_stats.converted,
      Type: "",
      Title: "",
      Subtitle: "",
      "Created At": "",
    },
    {
      Metric: "Leads Lost",
      Value: lead_stats.lost,
      Type: "",
      Title: "",
      Subtitle: "",
      "Created At": "",
    },
  ];
  lead_stats.by_source.forEach((s) => {
    rows.push({
      Metric: `Leads by Source: ${SOURCE_LABELS[s.source]}`,
      Value: s.count,
      Type: "",
      Title: "",
      Subtitle: "",
      "Created At": "",
    });
  });
  category_distribution.forEach((c) => {
    rows.push({
      Metric: `Category: ${c.name}`,
      Value: c.property_count,
      Type: "",
      Title: "",
      Subtitle: "",
      "Created At": "",
    });
  });
  rows.push({
    Metric: "Recent Activity",
    Value: "",
    Type: "",
    Title: "",
    Subtitle: "",
    "Created At": "",
  });
  recent_activity.forEach((a) => {
    rows.push({
      Metric: "",
      Value: "",
      Type: a.type,
      Title: a.title,
      Subtitle: a.subtitle,
      "Created At": a.created_at,
    });
  });
  return rows;
}

const SECTIONS = [
  { id: "stats" as const, label: "Summary stats" },
  { id: "property_pie" as const, label: "Property status" },
  { id: "lead_pie" as const, label: "Lead status" },
  { id: "category_bar" as const, label: "By category" },
  { id: "source_bar" as const, label: "By source" },
  { id: "activity" as const, label: "Recent activity" },
];

function ReportsSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-admin-card-border bg-admin-card-bg p-4">
        <div className="h-9 w-[160px] rounded-md bg-muted" />
        <div className="h-9 w-24 rounded-md bg-muted" />
        <div className="ml-auto h-9 w-20 rounded-md bg-muted" />
      </div>
      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-admin-card-border bg-admin-card-bg p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-5 w-5 rounded bg-muted" />
            </div>
            <div className="mt-2 h-8 w-12 rounded bg-muted" />
            <div className="mt-2 h-3 w-20 rounded bg-muted" />
          </div>
        ))}
      </div>
      {/* Charts row 1 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-admin-card-border bg-admin-card-bg p-6 shadow-sm">
          <div className="mb-6 h-6 w-48 rounded bg-muted" />
          <div className="h-[280px] rounded-xl bg-muted/50" />
        </div>
        <div className="rounded-xl border border-admin-card-border bg-admin-card-bg p-6 shadow-sm">
          <div className="mb-6 h-6 w-40 rounded bg-muted" />
          <div className="h-[280px] rounded-xl bg-muted/50" />
        </div>
      </div>
      {/* Charts row 2 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-admin-card-border bg-admin-card-bg p-6 shadow-sm">
          <div className="mb-6 h-6 w-44 rounded bg-muted" />
          <div className="h-[260px] rounded-xl bg-muted/50" />
        </div>
        <div className="rounded-xl border border-admin-card-border bg-admin-card-bg p-6 shadow-sm">
          <div className="mb-6 h-6 w-36 rounded bg-muted" />
          <div className="h-[260px] rounded-xl bg-muted/50" />
        </div>
      </div>
      {/* Recent activity */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 h-6 w-36 rounded bg-muted" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-xl border border-admin-card-border p-4"
            >
              <div className="h-10 w-10 shrink-0 rounded-xl bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 rounded bg-muted" />
                <div className="h-3 w-32 rounded bg-muted" />
              </div>
              <div className="h-6 w-16 rounded bg-muted" />
              <div className="h-4 w-20 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ReportsView() {
  const [sortActivity, setSortActivity] = useState<"asc" | "desc">("desc");
  const [sections, setSections] = useState<Set<string>>(
    new Set(SECTIONS.map((s) => s.id)),
  );

  const filters = useMemo(
    () => ({ sort_activity: sortActivity }),
    [sortActivity],
  );
  const { data, isLoading } = useReports(filters);
  const reports = data?.data;
  const { exportToFile } = useExportWorker();
  const [exporting, setExporting] = useState<"csv" | "xlsx" | null>(null);
  const [exportConfirmFormat, setExportConfirmFormat] = useState<
    "csv" | "xlsx" | null
  >(null);

  const toggleSection = (id: string) => {
    setSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  async function handleExport(format: "csv" | "xlsx") {
    if (!reports) return;
    setExportConfirmFormat(null);
    setExporting(format);
    try {
      const rows = reportsToExportRows(reports);
      if (rows.length === 0) {
        toast.error("No report data to export");
        return;
      }
      const filename = `reports-${new Date().toISOString().slice(0, 10)}`;
      await exportToFile({
        data: rows,
        format,
        filename,
        sheetName: "Reports",
      });
    } catch (err) {
      console.error("Export failed:", err);
      toast.error("Export failed. Please try again.");
    } finally {
      setExporting(null);
    }
  }

  const propertyPieData = reports
    ? [
        {
          name: "Active",
          value: reports.property_stats.active,
          color: PROPERTY_STATUS_COLORS.active,
        },
        {
          name: "Draft",
          value: reports.property_stats.draft,
          color: PROPERTY_STATUS_COLORS.draft,
        },
        {
          name: "Sold",
          value: reports.property_stats.sold,
          color: PROPERTY_STATUS_COLORS.sold,
        },
        {
          name: "Rented",
          value: reports.property_stats.rented,
          color: PROPERTY_STATUS_COLORS.rented,
        },
      ].filter((d) => d.value > 0)
    : [];

  const leadPieData = reports
    ? [
        {
          name: "New",
          value: reports.lead_stats.new,
          color: LEAD_STATUS_COLORS.new,
        },
        {
          name: "Contacted",
          value: reports.lead_stats.contacted,
          color: LEAD_STATUS_COLORS.contacted,
        },
        {
          name: "Qualified",
          value: reports.lead_stats.qualified,
          color: LEAD_STATUS_COLORS.qualified,
        },
        {
          name: "Converted",
          value: reports.lead_stats.converted,
          color: LEAD_STATUS_COLORS.converted,
        },
        {
          name: "Lost",
          value: reports.lead_stats.lost,
          color: LEAD_STATUS_COLORS.lost,
        },
      ].filter((d) => d.value > 0)
    : [];

  const categoryBarData =
    reports?.category_distribution?.map((c) => ({
      name: c.name.length > 12 ? c.name.slice(0, 12) + "…" : c.name,
      fullName: c.name,
      count: c.property_count,
    })) ?? [];

  const sourceBarData =
    reports?.lead_stats?.by_source?.map((s) => ({
      name: SOURCE_LABELS[s.source] ?? s.source,
      count: s.count,
    })) ?? [];

  if (isLoading) {
    return <ReportsSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Sort, Sections, Export toolbar */}
      <div className="flex flex-col gap-3 rounded-xl border border-admin-card-border bg-admin-card-bg p-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 sm:p-4">
        <div className="flex items-center gap-2 min-w-0 flex-1 sm:flex-initial">
          <ArrowUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Select
            value={sortActivity}
            onValueChange={(v) => setSortActivity(v as "asc" | "desc")}
          >
            <SelectTrigger className="h-9 w-full min-w-0 sm:w-[160px]">
              <SelectValue placeholder="Sort activity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest first</SelectItem>
              <SelectItem value="asc">Oldest first</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-full flex-row items-center gap-2 sm:ml-auto sm:w-auto">
          <div className="flex w-1/2 min-w-0 sm:w-auto sm:shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 min-h-[44px] w-full gap-1.5 rounded-lg sm:w-auto"
                >
                  <LayoutGrid className="h-4 w-4 shrink-0 text-muted-foreground" />
                  Sections
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {SECTIONS.map((s) => (
                  <DropdownMenuItem
                    key={s.id}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleSection(s.id);
                    }}
                  >
                    {sections.has(s.id) ? "✓ " : ""}
                    {s.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex w-1/2 min-w-0 items-center gap-2 sm:w-auto sm:shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 min-h-[44px] w-full rounded-lg gap-1.5 sm:w-auto"
                  disabled={!!exporting}
                >
                  {exporting ? (
                    <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                  ) : (
                    <Download className="h-4 w-4 shrink-0" />
                  )}
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => setExportConfirmFormat("csv")}
                  disabled={!!exporting}
                  className="gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Export to CSV
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setExportConfirmFormat("xlsx")}
                  disabled={!!exporting}
                  className="gap-2"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Export to Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      {/* Summary Stats */}
      {sections.has("stats") && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            {
              title: "Total Properties",
              value: reports?.property_stats.total ?? 0,
              icon: Building2,
              color: "emerald",
              href: "/admin/properties",
            },
            {
              title: "Active Listings",
              value: reports?.property_stats.active ?? 0,
              icon: TrendingUp,
              color: "emerald",
              href: "/admin/properties",
            },
            {
              title: "Total Leads",
              value: reports?.lead_stats.total ?? 0,
              icon: UserPlus,
              color: "blue",
              href: "/admin/leads",
            },
            {
              title: "Converted",
              value: reports?.lead_stats.converted ?? 0,
              icon: Activity,
              color: "blue",
              href: "/admin/leads",
            },
          ].map((item) => (
            <div
              key={item.title}
              className={cn(
                "rounded-xl border border-admin-card-border bg-admin-card-bg p-6 shadow-sm",
              )}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  {item.title}
                </p>
                <item.icon
                  className={cn(
                    "h-5 w-5",
                    item.color === "emerald"
                      ? "text-emerald-500"
                      : "text-blue-500",
                  )}
                />
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">
                {item.value}
              </p>
              <Link
                href={item.href}
                className="mt-2 inline-block text-xs font-semibold text-blue-600 hover:underline"
              >
                View details →
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {sections.has("property_pie") && (
          <div className="rounded-xl border border-admin-card-border bg-admin-card-bg p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-bold text-foreground">
              Property Status Overview
            </h2>
            {propertyPieData.length === 0 ? (
              <div className="flex h-[280px] flex-col items-center justify-center rounded-xl bg-muted/50">
                <BarChart3 className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-1 text-sm text-muted-foreground">
                  No property data
                </p>
              </div>
            ) : (
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={propertyPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {propertyPieData.map((entry, i) => (
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
        )}

        {sections.has("lead_pie") && (
          <div className="rounded-xl border border-admin-card-border bg-admin-card-bg p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-bold text-foreground">
              Lead Status Overview
            </h2>
            {leadPieData.length === 0 ? (
              <div className="flex h-[280px] flex-col items-center justify-center rounded-xl bg-muted/50">
                <UserPlus className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-1 text-sm text-muted-foreground">
                  No lead data
                </p>
              </div>
            ) : (
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leadPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {leadPieData.map((entry, i) => (
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
        )}
      </div>

      {/* Charts Row 2 - Category & Source */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {sections.has("category_bar") && (
          <div className="rounded-xl border border-admin-card-border bg-admin-card-bg p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-bold text-foreground">
              Properties by Category
            </h2>
            {categoryBarData.length === 0 ? (
              <div className="flex h-[260px] flex-col items-center justify-center rounded-xl bg-muted/50">
                <FolderOpen className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-1 text-sm text-muted-foreground">
                  No category data
                </p>
              </div>
            ) : (
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryBarData}
                    margin={{ top: 5, right: 8, left: 0, bottom: 5 }}
                    barCategoryGap="12%"
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e5e7eb"
                      className="stroke-gray-300"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      width={28}
                      tick={{ fontSize: 10, fill: "#6b7280" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => (Number(v) === v ? String(v) : v)}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e5e7eb",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                      formatter={(value: number) => [value, "Properties"]}
                    />
                    <Bar
                      dataKey="count"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      name="Properties"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {sections.has("source_bar") && (
          <div className="rounded-xl border border-admin-card-border bg-admin-card-bg p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-bold text-foreground">
              Leads by Source
            </h2>
            {sourceBarData.length === 0 ? (
              <div className="flex h-[260px] flex-col items-center justify-center rounded-xl bg-muted/50">
                <Activity className="h-12 w-12 text-gray-300" />
                <p className="mt-1 text-sm text-muted-foreground">
                  No source data
                </p>
              </div>
            ) : (
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={sourceBarData}
                    margin={{ top: 5, right: 8, left: 0, bottom: 5 }}
                    barCategoryGap="12%"
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e5e7eb"
                      className="stroke-gray-300"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      width={28}
                      tick={{ fontSize: 10, fill: "#6b7280" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => (Number(v) === v ? String(v) : v)}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e5e7eb",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Bar
                      dataKey="count"
                      fill="#8b5cf6"
                      radius={[4, 4, 0, 0]}
                      name="Leads"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      {sections.has("activity") && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-bold text-foreground">
            Recent Activity
          </h2>
          {!reports?.recent_activity?.length ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Activity className="h-12 w-12 text-gray-300" />
              <p className="mt-2 text-sm text-muted-foreground">
                No recent activity
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.recent_activity.slice(0, 10).map((a, i) => (
                <div
                  key={`${a.type}-${a.id}-${i}`}
                  className={cn(
                    "flex items-center gap-4 rounded-xl border p-4 transition-colors",
                    "border-admin-card-border hover:bg-muted/30",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                      a.type === "property"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-amber-50 text-amber-600",
                    )}
                  >
                    {a.type === "property" ? (
                      <Building2 className="h-4 w-4" />
                    ) : (
                      <UserPlus className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900">
                      {a.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {a.subtitle}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <span className="rounded-lg bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                      {a.type}
                    </span>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDate(a.created_at)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <AlertDialog
        open={!!exportConfirmFormat}
        onOpenChange={(open) => !open && setExportConfirmFormat(null)}
      >
        <AlertDialogContent className="rounded-xl border border-border bg-card shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Export report as {exportConfirmFormat === "csv" ? "CSV" : "Excel"}
              ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will export the current reports summary and activity. The
              file will download when ready.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              onClick={() =>
                exportConfirmFormat && handleExport(exportConfirmFormat)
              }
              disabled={!!exporting}
              className="min-w-[100px]"
            >
              {exporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting…
                </>
              ) : (
                "Export"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
