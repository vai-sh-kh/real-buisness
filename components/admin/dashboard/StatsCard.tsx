import { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  isLoading?: boolean;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  isLoading,
  trend,
}: StatsCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-admin-card-border bg-admin-card-bg p-4 shadow-sm lg:p-6">
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-9 rounded-xl" />
        </div>
        <Skeleton className="mb-2 h-8 w-16" />
        <Skeleton className="h-3 w-28" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-admin-card-border bg-admin-card-bg p-4 shadow-sm transition-all hover:border-brand-gold/30 hover:shadow-md lg:p-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand-gold/20 bg-brand-gold/10">
          <Icon className="h-4 w-4 text-brand-gold" />
        </div>
      </div>
      <p className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
        {value}
      </p>
      {subtitle && (
        <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      )}
      {trend && (
        <p
          className={cn(
            "text-xs mt-2 font-medium",
            trend.positive !== false ? "text-green-600" : "text-red-500",
          )}
        >
          {trend.positive !== false ? "↑" : "↓"} {Math.abs(trend.value)}%{" "}
          {trend.label}
        </p>
      )}
    </div>
  );
}
