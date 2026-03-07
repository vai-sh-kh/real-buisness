"use client";

import { useQuery } from "@tanstack/react-query";
import type { ReportsData } from "@/types";
import type { ReportsFilters } from "@/lib/queries/reports";

export function useReports(filters: ReportsFilters = {}) {
  const { date_from, date_to, sort_activity } = filters;
  return useQuery<{ data: ReportsData }>({
    queryKey: ["reports", date_from ?? "", date_to ?? "", sort_activity ?? "desc"],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (date_from) params.set("date_from", date_from);
      if (date_to) params.set("date_to", date_to);
      if (sort_activity) params.set("sort_activity", sort_activity);
      const res = await fetch(`/api/admin/reports?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch reports");
      return res.json();
    },
    staleTime: 60_000,
  });
}
