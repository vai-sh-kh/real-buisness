import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  email: string | null;
  setAuthenticated: (email: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      email: null,
      setAuthenticated: (email: string) =>
        set({ isAuthenticated: true, email }),
      clearAuth: () => set({ isAuthenticated: false, email: null }),
    }),
    {
      name: "admin-auth",
    }
  )
);
