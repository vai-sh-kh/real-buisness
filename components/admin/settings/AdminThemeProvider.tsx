"use client";

import { useEffect } from "react";
import { useSettings } from "@/hooks/useSettings";
import type { ThemePreference } from "@/types";

function getResolvedTheme(preference: ThemePreference): "light" | "dark" {
  if (preference === "system") {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "light";
  }
  return preference;
}

export function AdminThemeProvider() {
  const { data } = useSettings();
  const theme = data?.data?.theme ?? "system";

  useEffect(() => {
    const root = document.documentElement;
    const resolved = getResolvedTheme(theme);
    root.classList.remove("light", "dark");
    root.classList.add(resolved);
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const resolved = getResolvedTheme("system");
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(resolved);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  return null;
}
