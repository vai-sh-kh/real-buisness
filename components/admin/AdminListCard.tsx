"use client";

import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AdminListCardProps {
  title: string;
  subtitle?: string | null;
  badge?: React.ReactNode;
  onClick: () => void;
  right?: React.ReactNode;
  className?: string;
}

/**
 * Mobile-friendly list row/card for admin list views (Properties, Leads, Categories).
 * Min touch target 44px; use with useIsMobile() to show instead of DataTable on small screens.
 */
export function AdminListCard({
  title,
  subtitle,
  badge,
  onClick,
  right,
  className,
}: AdminListCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-[56px] w-full items-center gap-3 rounded-xl border border-admin-card-border bg-admin-card-bg px-4 py-3 text-left transition-colors hover:bg-muted/50 active:bg-muted",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{title}</p>
        {subtitle != null && subtitle !== "" && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
      {badge != null && <div className="shrink-0">{badge}</div>}
      {right ?? (
        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
      )}
    </button>
  );
}
