"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { buildQueryString } from "@/lib/utils";
import type { Category, CategoryFilters } from "@/types";

const KEYS = {
  list: (f: CategoryFilters) => ["categories", f] as const,
  allActive: ["categories", "all-active"] as const,
  detail: (id: string) => ["categories", id] as const,
};

function getApiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err) && err.response?.data?.error) {
    return String(err.response.data.error);
  }
  return err instanceof Error ? err.message : "Something went wrong";
}

export function useCategories(filters: CategoryFilters = {}) {
  return useQuery<{ data: Category[]; total: number; page?: number; limit?: number }>({
    queryKey: KEYS.list(filters),
    queryFn: async () => {
      const qs = buildQueryString(filters as Record<string, string | number | boolean | undefined>);
      const { data } = await axios.get(`/api/admin/categories?${qs}`);
      return data;
    },
    placeholderData: (prev) => prev,
  });
}

export function useAllCategories() {
  return useQuery<Category[]>({
    queryKey: KEYS.allActive,
    queryFn: async () => {
      const { data } = await axios.get("/api/admin/categories?limit=100&is_active=true");
      return (data.data ?? []) as Category[];
    },
    placeholderData: (prev) => prev,
  });
}

/** Public categories for properties page filters (no auth). */
export function usePublicCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories", "public"],
    queryFn: async () => {
      const res = await fetch("/api/categories", { credentials: "include" });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error ?? "Failed to load categories");
      }
      const json = await res.json();
      return (json.data ?? []) as Category[];
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: Pick<Category, "name" | "description" | "icon" | "is_active">) => {
      try {
        const { data } = await axios.post("/api/admin/categories", body);
        return data.data as Category;
      } catch (err) {
        throw new Error(getApiErrorMessage(err));
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: Partial<Pick<Category, "name" | "description" | "icon" | "is_active">>;
    }) => {
      try {
        const { data } = await axios.put(`/api/admin/categories/${id}`, values);
        return data.data as Category;
      } catch (err) {
        throw new Error(getApiErrorMessage(err));
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/admin/categories/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
