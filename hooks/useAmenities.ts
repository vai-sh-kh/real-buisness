"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface Amenity {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const FALLBACK_AMENITIES: Amenity[] = [
  { id: "1", name: "Swimming Pool", slug: "swimming-pool", icon: "🏊", sort_order: 1, is_active: true, created_at: "", updated_at: "" },
  { id: "2", name: "Gym", slug: "gym", icon: "🏋️", sort_order: 2, is_active: true, created_at: "", updated_at: "" },
  { id: "3", name: "Parking", slug: "parking", icon: "🅿️", sort_order: 3, is_active: true, created_at: "", updated_at: "" },
  { id: "4", name: "Garden", slug: "garden", icon: "🌳", sort_order: 4, is_active: true, created_at: "", updated_at: "" },
  { id: "5", name: "Balcony", slug: "balcony", icon: "🏠", sort_order: 5, is_active: true, created_at: "", updated_at: "" },
  { id: "6", name: "Security", slug: "security", icon: "🔒", sort_order: 6, is_active: true, created_at: "", updated_at: "" },
  { id: "7", name: "Lift/Elevator", slug: "lift-elevator", icon: "🛗", sort_order: 7, is_active: true, created_at: "", updated_at: "" },
  { id: "8", name: "Power Backup", slug: "power-backup", icon: "⚡", sort_order: 8, is_active: true, created_at: "", updated_at: "" },
  { id: "9", name: "Club House", slug: "club-house", icon: "🏛️", sort_order: 9, is_active: true, created_at: "", updated_at: "" },
  { id: "10", name: "Modular Kitchen", slug: "modular-kitchen", icon: "🍳", sort_order: 10, is_active: true, created_at: "", updated_at: "" },
  { id: "11", name: "AC", slug: "ac", icon: "❄️", sort_order: 11, is_active: true, created_at: "", updated_at: "" },
  { id: "12", name: "WiFi", slug: "wifi", icon: "📶", sort_order: 12, is_active: true, created_at: "", updated_at: "" },
];

export function useAmenities() {
  return useQuery<Amenity[]>({
    queryKey: ["amenities"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/admin/amenities", { credentials: "include" });
        if (!res.ok) return FALLBACK_AMENITIES;
        const json = await res.json();
        return (json.data ?? []).length > 0 ? json.data : FALLBACK_AMENITIES;
      } catch {
        return FALLBACK_AMENITIES;
      }
    },
  });
}

export function useAmenitiesForAdmin() {
  return useQuery<Amenity[]>({
    queryKey: ["amenities", "all"],
    queryFn: async () => {
      const res = await fetch("/api/admin/amenities?all=true", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch amenities");
      const json = await res.json();
      return json.data ?? [];
    },
  });
}

export function useCreateAmenity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { name: string; icon?: string }) => {
      const res = await fetch("/api/admin/amenities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(input),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create amenity");
      return json.data as Amenity;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["amenities"] });
      toast.success("Amenity added");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteAmenity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/amenities/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Failed to delete amenity");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["amenities"] });
      toast.success("Amenity deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
