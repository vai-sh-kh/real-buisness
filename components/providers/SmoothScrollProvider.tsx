"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

/** Enable Lenis smooth scroll only on public routes (not admin). Scroll to top on navigation. */
export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  // Scroll to top when route changes (fixes Next.js navigation leaving scroll mid-page)
  useEffect(() => {
    if (lenisRef.current && !isAdmin) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else if (isAdmin && typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [pathname, isAdmin]);

  // Init/destroy Lenis based on route: only public pages get smooth scroll
  useEffect(() => {
    if (isAdmin) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [isAdmin]);

  return <>{children}</>;
}
