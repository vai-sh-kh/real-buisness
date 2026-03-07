"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { buildQueryString } from "@/lib/utils";
import type { PropertyWithRelations, PropertyFilters } from "@/types";
import type { PropertyFormValues } from "@/lib/validations/property.schema";

export function usePropertyByIdOrSlug(identifier: string | null) {
  return useQuery({
    queryKey: ["property", identifier],
    queryFn: async (): Promise<PropertyWithRelations | null> => {
      if (!identifier) return null;
      const res = await fetch(`/api/admin/properties/${identifier}`, {
        credentials: "include",
      });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch property");
      const json = await res.json();
      return json.data ?? null;
    },
    enabled: !!identifier,
  });
}

export function useProperties(filters: PropertyFilters = {}) {
  return useQuery<{
    data: PropertyWithRelations[];
    total: number;
    page?: number;
    limit?: number;
  }>({
    queryKey: ["properties", filters],
    queryFn: async () => {
      const qs = buildQueryString(
        filters as Record<string, string | number | boolean | undefined>
      );
      const res = await fetch(`/api/admin/properties?${qs}`);
      if (!res.ok) throw new Error("Failed to fetch properties");
      return res.json();
    },
    placeholderData: (prev) => prev,
  });
}

export function useCreateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: PropertyFormValues) => {
      const res = await fetch("/api/admin/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create property");
      return json.data as PropertyWithRelations;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["properties"] });
      toast.success("Property created");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: Partial<PropertyFormValues>;
    }) => {
      const res = await fetch(`/api/admin/properties/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update property");
      return json.data as PropertyWithRelations;
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["properties"] });
      qc.invalidateQueries({ queryKey: ["property", variables.id] });
      qc.invalidateQueries({ queryKey: ["property"] });
      toast.success("Property updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/properties/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Failed to delete property");
      }
    },
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["properties"] });
      qc.invalidateQueries({ queryKey: ["property", id] });
      qc.invalidateQueries({ queryKey: ["property"] });
      toast.success("Property deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
