"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import type { AdminSettings, AdminSettingsUpdate } from "@/types";

const KEYS = {
  settings: ["admin", "settings"] as const,
};

function getApiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err) && err.response?.data?.error) {
    return String(err.response.data.error);
  }
  return err instanceof Error ? err.message : "Something went wrong";
}

export function useSettings() {
  return useQuery<{ data: AdminSettings }>({
    queryKey: KEYS.settings,
    queryFn: async () => {
      const { data } = await axios.get("/api/admin/settings");
      return data;
    },
    staleTime: 60 * 1000,
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) return false;
      return failureCount < 2;
    },
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: AdminSettingsUpdate) => {
      const { data } = await axios.patch("/api/admin/settings", values);
      return data.data as AdminSettings;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.settings });
      toast.success("Settings saved");
    },
    onError: (err: Error) => toast.error(getApiErrorMessage(err)),
  });
}
