"use client";

import { LeadsView } from "@/components/admin/leads/LeadsView";

export default function LeadsPage() {
  return (
    <div className="min-h-full bg-[#f5f5f5]">
      <LeadsView
        header={{
          title: "Leads",
          subtitle: "Track and manage property inquiry leads",
          breadcrumbs: [
            { label: "Admin", href: "/admin/dashboard" },
            { label: "Leads" },
          ],
        }}
      />
    </div>
  );
}
