"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavItems } from "@/lib/constants/admin-nav";
import { cn } from "@/lib/utils";

const APP_BAR_HEIGHT = "3.5rem"; // 56px
const BOTTOM_NAV_HEIGHT = "4rem"; // 64px, min touch 48px

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-admin-sidebar-border bg-admin-sidebar-bg pb-[env(safe-area-inset-bottom)] pt-2 lg:hidden"
      style={{ minHeight: BOTTOM_NAV_HEIGHT }}
    >
      {adminNavItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex min-h-[48px] flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-2 text-xs font-medium transition-colors",
              isActive
                ? "text-admin-sidebar-active-indicator"
                : "text-admin-sidebar-text-muted hover:bg-admin-sidebar-hover hover:text-admin-sidebar-text",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <item.icon
              className={cn(
                "h-6 w-6 shrink-0",
                isActive
                  ? "text-admin-sidebar-active-indicator"
                  : cn(item.color, item.colorDark),
              )}
            />
            <span className="truncate max-w-[4.5rem]">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
