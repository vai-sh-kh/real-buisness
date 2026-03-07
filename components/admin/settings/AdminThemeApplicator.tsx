"use client";

import { useLayoutEffect } from "react";
import { useAdminTheme } from "./AdminThemeContext";

const THEME_ROOT_ID = "admin-theme-root";

export function AdminThemeApplicator() {
  const { resolvedTheme } = useAdminTheme();

  useLayoutEffect(() => {
    const el = document.getElementById(THEME_ROOT_ID);
    if (el) {
      el.classList.remove("light", "dark");
      if (resolvedTheme === "dark") {
        el.classList.add("dark");
      } else {
        el.classList.add("light");
      }
    }
  }, [resolvedTheme]);

  return null;
}
