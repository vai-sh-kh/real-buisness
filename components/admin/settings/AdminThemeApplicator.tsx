"use client";

import { useLayoutEffect } from "react";

const THEME_ROOT_ID = "admin-theme-root";

export function AdminThemeApplicator() {
  useLayoutEffect(() => {
    const el = document.getElementById(THEME_ROOT_ID);
    if (el) {
      el.classList.remove("dark");
      el.classList.add("light");
    }
  }, []);

  return null;
}
