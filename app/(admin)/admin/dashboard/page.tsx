"use client";

import { DashboardView } from "@/components/admin/dashboard/DashboardView";

export default function DashboardPage() {
  return (
    <div className="min-h-full bg-[#f5f5f5]">
      {/* Title block: clean sans-serif title + thin separator (ref design) */}
      <header className="border-b border-[#e5e5e5] bg-[#f5f5f5] px-2 pt-4 pb-3 sm:px-6 sm:pt-5 lg:px-8 lg:pt-6">
        <h1 className="font-semibold tracking-tight text-[#1a1a1a] text-xl sm:text-2xl lg:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Overview of your properties, leads, and activity.
        </p>
      </header>
      <div className="space-y-6 px-2 pt-6 pb-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
        <DashboardView />
      </div>
    </div>
  );
}
