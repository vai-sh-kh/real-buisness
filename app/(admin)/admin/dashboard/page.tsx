"use client";

import {
  Building2,
  Users,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { StatsCard } from "@/components/admin/dashboard/StatsCard";
import { RecentLeads } from "@/components/admin/dashboard/RecentLeads";
import { RecentProperties } from "@/components/admin/dashboard/RecentProperties";
import { useDashboard } from "@/hooks/useReports";

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboard();

  if (isError) {
    return (
      <div className="p-4 rounded-2xl border border-red-100 bg-red-50 text-red-600 text-sm">
        Failed to load dashboard data. Please refresh the page.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-black tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">Overview of your real estate business</p>
        </div>
        <div className="text-xs text-gray-400 hidden sm:block">
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Properties"
          value={data?.total_properties ?? 0}
          subtitle="All listed properties"
          icon={Building2}
          isLoading={isLoading}
        />
        <StatsCard
          title="Active Properties"
          value={data?.active_properties ?? 0}
          subtitle="Currently live"
          icon={TrendingUp}
          isLoading={isLoading}
        />
        <StatsCard
          title="Total Leads"
          value={data?.total_leads ?? 0}
          subtitle="All time leads"
          icon={Users}
          isLoading={isLoading}
        />
        <StatsCard
          title="New Leads"
          value={data?.new_leads ?? 0}
          subtitle="Awaiting contact"
          icon={Sparkles}
          isLoading={isLoading}
        />
      </div>

      {/* Recent activity */}
      <div className="grid gap-5 lg:grid-cols-2">
        <RecentLeads leads={data?.recent_leads ?? []} isLoading={isLoading} />
        <RecentProperties properties={data?.recent_properties ?? []} isLoading={isLoading} />
      </div>
    </div>
  );
}
