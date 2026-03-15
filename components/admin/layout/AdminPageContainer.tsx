"use client";

import { cn } from "@/lib/utils";

/**
 * Wraps admin page content with the standard vertical section gap.
 * Main layout already provides horizontal padding (px-4 sm:px-6 lg:px-8);
 * use this for consistent space-y between sections and min-w-0 to prevent overflow.
 */
export function AdminPageContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0 space-y-6 sm:space-y-8", className)}>
      {children}
    </div>
  );
}
