import { create } from "zustand";
import type { Category } from "@/types";

interface AppState {
  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Categories cache
  categories: Category[];
  setCategories: (categories: Category[]) => void;

  // Global search
  globalSearch: string;
  setGlobalSearch: (search: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Sidebar
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  // Categories
  categories: [],
  setCategories: (categories) => set({ categories }),

  // Global search
  globalSearch: "",
  setGlobalSearch: (globalSearch) => set({ globalSearch }),
}));
