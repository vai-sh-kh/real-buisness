"use client";

import { DashboardView } from "@/components/admin/dashboard/DashboardView";

export default function DashboardPage() {
  return (
    <div className="min-h-full bg-[#f5f5f5]">
      {/* Title block: clean sans-serif title + thin separator (ref design) */}
      <header className="bg-[#f5f5f5] px-4 pt-4 pb-4 sm:px-6 sm:pt-5 sm:pb-4 lg:px-8 lg:pt-6 lg:pb-5">
        <h1 className="font-semibold tracking-tight text-[#1a1a1a] text-xl sm:text-2xl lg:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Overview of your properties, leads, and activity.
        </p>
      </header>
      <div className="space-y-6 sm:space-y-8">
        <DashboardView />
      </div>
    </div>
  );
}
