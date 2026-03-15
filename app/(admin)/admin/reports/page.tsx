"use client";

import { PageHeader } from "@/components/admin/layout/PageHeader";
import { ReportsView } from "@/components/admin/reports/ReportsView";

export default function ReportsPage() {
  return (
    <div className="min-h-full bg-[#f5f5f5]">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Performance metrics, distributions, and recent activity"
        breadcrumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Reports" },
        ]}
      />
      <div className="space-y-6 sm:space-y-8">
        <ReportsView />
      </div>
    </div>
  );
}
