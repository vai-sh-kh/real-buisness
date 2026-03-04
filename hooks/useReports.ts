"use client";

import { useQuery } from "@tanstack/react-query";
import type { ReportsData, DashboardStats } from "@/types";

export function useReports() {
  return useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const res = await fetch("/api/admin/reports");
      if (!res.ok) throw new Error("Failed to fetch reports");
      const json = await res.json();
      return json.data as ReportsData;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/admin/dashboard");
      if (!res.ok) throw new Error("Failed to fetch dashboard");
      const json = await res.json();
      return json.data as DashboardStats;
    },
    staleTime: 2 * 60 * 1000,
  });
}
