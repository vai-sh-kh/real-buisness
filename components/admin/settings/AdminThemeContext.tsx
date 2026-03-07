"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ThemePreference } from "@/types";
import {
  getAdminThemeFromStorage,
  setAdminThemeStorage,
} from "@/lib/constants/admin-theme";

interface AdminThemeContextValue {
  theme: ThemePreference;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: ThemePreference) => void;
}

const AdminThemeContext = createContext<AdminThemeContextValue | null>(null);

export function useAdminTheme() {
  const ctx = useContext(AdminThemeContext);
  if (!ctx)
    throw new Error("useAdminTheme must be used within AdminThemeProvider");
  return ctx;
}

interface AdminThemeProviderProps {
  children: React.ReactNode;
  /** Initial theme from API/settings (optional) */
  serverTheme?: ThemePreference;
}

export function AdminThemeProvider({
  children,
  serverTheme,
}: AdminThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemePreference>(() => {
    const stored = getAdminThemeFromStorage();
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
    return serverTheme ?? "dark";
  });

  const [systemResolved, setSystemResolved] = useState<"light" | "dark">(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
  );

  const resolvedTheme = useMemo(() => {
    if (theme === "system") return systemResolved;
    return theme;
  }, [theme, systemResolved]);

  const setTheme = useCallback((newTheme: ThemePreference) => {
    setThemeState(newTheme);
    setAdminThemeStorage(newTheme);
  }, []);

  // Sync with server/API when it loads
  useEffect(() => {
    if (serverTheme && serverTheme !== theme) {
      setThemeState(serverTheme);
      setAdminThemeStorage(serverTheme);
    }
  }, [serverTheme]);

  // Listen for system preference changes when theme is "system"
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setSystemResolved(mq.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const value = useMemo<AdminThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return (
    <AdminThemeContext.Provider value={value}>
      {children}
    </AdminThemeContext.Provider>
  );
}
