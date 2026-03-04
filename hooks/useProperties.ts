"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import type { PropertyFilters, PropertyWithRelations } from "@/types";
import type { PropertyFormValues } from "@/lib/validations/property.schema";
import { buildQueryString } from "@/lib/utils";

const PROPERTIES_KEY = "properties";

async function fetchProperties(filters: Partial<PropertyFilters>) {
  const qs = buildQueryString(filters as Record<string, string | number | boolean | undefined | null>);
  const res = await fetch(`/api/admin/properties?${qs}`);
  if (!res.ok) throw new Error("Failed to fetch properties");
  return res.json() as Promise<{ data: PropertyWithRelations[]; total: number }>;
}

async function fetchProperty(id: string) {
  const res = await fetch(`/api/admin/properties/${id}`);
  if (!res.ok) throw new Error("Failed to fetch property");
  const json = await res.json();
  return json.data as PropertyWithRelations;
}

async function createProperty(values: PropertyFormValues) {
  const res = await fetch("/api/admin/properties", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to create property");
  }
  return res.json();
}

async function updateProperty(id: string, values: Partial<PropertyFormValues>) {
  const res = await fetch(`/api/admin/properties/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to update property");
  }
  return res.json();
}

async function deleteProperty(id: string) {
  const res = await fetch(`/api/admin/properties/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to delete property");
  }
}

export function useProperties(filters: Partial<PropertyFilters>) {
  return useQuery({
    queryKey: [PROPERTIES_KEY, "list", filters],
    queryFn: () => fetchProperties(filters),
    placeholderData: keepPreviousData,
  });
}

export function useProperty(id: string | null) {
  return useQuery({
    queryKey: [PROPERTIES_KEY, "detail", id],
    queryFn: () => fetchProperty(id!),
    enabled: !!id,
  });
}

export function useCreateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createProperty,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PROPERTIES_KEY] });
      toast.success("Property created successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: Partial<PropertyFormValues> }) =>
      updateProperty(id, values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PROPERTIES_KEY] });
      toast.success("Property updated successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PROPERTIES_KEY] });
      toast.success("Property deleted successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
