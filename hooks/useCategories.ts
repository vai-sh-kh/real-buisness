"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import type { Category, CategoryFilters } from "@/types";
import { buildQueryString } from "@/lib/utils";

const CATEGORIES_KEY = "categories";

async function fetchCategories(filters: Partial<CategoryFilters>) {
  const qs = buildQueryString(filters as Record<string, string | number | boolean | undefined | null>);
  const res = await fetch(`/api/admin/categories?${qs}`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json() as Promise<{ data: Category[]; total: number }>;
}

async function fetchAllCategories() {
  const res = await fetch(`/api/admin/categories?limit=100&sort_order=asc`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  const json = await res.json();
  return json.data as Category[];
}

async function createCategory(
  values: Pick<Category, "name" | "description" | "icon" | "is_active">
) {
  const res = await fetch("/api/admin/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to create category");
  }
  return res.json();
}

async function updateCategory(
  id: string,
  values: Partial<Pick<Category, "name" | "description" | "icon" | "is_active">>
) {
  const res = await fetch(`/api/admin/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to update category");
  }
  return res.json();
}

async function deleteCategory(id: string) {
  const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to delete category");
  }
}

export function useCategories(filters: Partial<CategoryFilters>) {
  return useQuery({
    queryKey: [CATEGORIES_KEY, "list", filters],
    queryFn: () => fetchCategories(filters),
    placeholderData: keepPreviousData,
  });
}

export function useAllCategories() {
  return useQuery({
    queryKey: [CATEGORIES_KEY, "all"],
    queryFn: fetchAllCategories,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
      toast.success("Category created successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: Partial<Pick<Category, "name" | "description" | "icon" | "is_active">>;
    }) => updateCategory(id, values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
      toast.success("Category updated successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
      toast.success("Category deleted successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
