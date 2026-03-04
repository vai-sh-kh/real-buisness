"use client";

import { useAppStore } from "@/store/appStore";
import { cn } from "@/lib/utils";

export function AdminClientWrapper({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useAppStore();

  return (
    <div
      className={cn(
        "transition-all duration-300",
        sidebarCollapsed ? "pl-16" : "pl-64"
      )}
    >
      <div className="pt-16">{children}</div>
    </div>
  );
}
