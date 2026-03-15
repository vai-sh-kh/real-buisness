"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { buildQueryString } from "@/lib/utils";
import type { Lead, LeadWithProperty, LeadFilters } from "@/types";

export function useLeads(filters: LeadFilters = {}) {
  return useQuery<{
    data: LeadWithProperty[];
    total: number;
    page?: number;
    limit?: number;
  }>({
    queryKey: ["leads", filters],
    queryFn: async () => {
      const qs = buildQueryString(
        filters as Record<string, string | number | boolean | undefined>
      );
      const res = await fetch(`/api/admin/leads?${qs}`);
      if (!res.ok) throw new Error("Failed to fetch leads");
      return res.json();
    },
    placeholderData: (prev) => prev,
  });
}

export function useCreateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: Omit<Lead, "id" | "created_at" | "updated_at">) => {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create lead");
      return json.data as Lead;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead created");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: Partial<Omit<Lead, "id" | "created_at">>;
    }) => {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update lead");
      return json.data as Lead;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Failed to delete lead");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

/** Public contact form submission — POSTs to /api/leads, shows toast, invalidates admin leads list */
export function useSubmitContactForm() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: {
      name: string;
      email: string;
      phone?: string | null;
      message: string;
      source?: Lead["source"];
    }) => {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, source: body.source ?? "website" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to send message");
      return json.data as Lead;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Message sent! We'll get back to you soon.");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
