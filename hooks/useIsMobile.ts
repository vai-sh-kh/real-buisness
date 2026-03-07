"use client";

import { useEffect, useState } from "react";

const LG_BREAKPOINT = 1024;

/**
 * Returns true when viewport is below the lg breakpoint (1024px).
 * Use for conditional mobile layout (bottom sheet vs right sheet, card list vs table).
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${LG_BREAKPOINT - 1}px)`);
    function handleChange(e: MediaQueryListEvent) {
      setIsMobile(e.matches);
    }
    setIsMobile(mql.matches);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return isMobile;
}
