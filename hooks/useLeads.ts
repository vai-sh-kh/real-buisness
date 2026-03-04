"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import type { Lead, LeadFilters, LeadWithProperty } from "@/types";
import { buildQueryString } from "@/lib/utils";

const LEADS_KEY = "leads";

async function fetchLeads(filters: Partial<LeadFilters>) {
  const qs = buildQueryString(filters as Record<string, string | number | boolean | undefined | null>);
  const res = await fetch(`/api/admin/leads?${qs}`);
  if (!res.ok) throw new Error("Failed to fetch leads");
  return res.json() as Promise<{ data: LeadWithProperty[]; total: number }>;
}

async function fetchLead(id: string) {
  const res = await fetch(`/api/admin/leads/${id}`);
  if (!res.ok) throw new Error("Failed to fetch lead");
  const json = await res.json();
  return json.data as LeadWithProperty;
}

async function updateLead(id: string, values: Partial<Lead>) {
  const res = await fetch(`/api/admin/leads/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to update lead");
  }
  return res.json();
}

async function deleteLead(id: string) {
  const res = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to delete lead");
  }
}

export function useLeads(filters: Partial<LeadFilters>) {
  return useQuery({
    queryKey: [LEADS_KEY, "list", filters],
    queryFn: () => fetchLeads(filters),
    placeholderData: keepPreviousData,
  });
}

export function useLead(id: string | null) {
  return useQuery({
    queryKey: [LEADS_KEY, "detail", id],
    queryFn: () => fetchLead(id!),
    enabled: !!id,
  });
}

export function useUpdateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: Partial<Lead> }) =>
      updateLead(id, values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [LEADS_KEY] });
      toast.success("Lead updated successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteLead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [LEADS_KEY] });
      toast.success("Lead deleted successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
