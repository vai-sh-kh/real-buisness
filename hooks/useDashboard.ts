"use client";

import { useQuery } from "@tanstack/react-query";
import type { DashboardStats } from "@/types";

export function useDashboard() {
  return useQuery<{ data: DashboardStats }>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/admin/dashboard");
      if (!res.ok) throw new Error("Failed to fetch dashboard stats");
      return res.json();
    },
    staleTime: 30_000,
  });
}
