"use client";

import {
  createContext,
  useContext,
  useMemo,
} from "react";

/** Theme is always light; context kept for minimal compatibility where useAdminTheme is still referenced. */
interface AdminThemeContextValue {
  theme: "light";
  resolvedTheme: "light";
  setTheme: (_: "light") => void;
}

const AdminThemeContext = createContext<AdminThemeContextValue | null>(null);

export function useAdminTheme() {
  const ctx = useContext(AdminThemeContext);
  if (!ctx)
    throw new Error("useAdminTheme must be used within AdminThemeProvider");
  return ctx;
}

const VALUE: AdminThemeContextValue = {
  theme: "light",
  resolvedTheme: "light",
  setTheme: () => {},
};

export function AdminThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = useMemo(() => VALUE, []);
  return (
    <AdminThemeContext.Provider value={value}>
      {children}
    </AdminThemeContext.Provider>
  );
}
