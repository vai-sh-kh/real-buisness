"use client";

import { PropertiesView } from "@/components/admin/properties/PropertiesView";

export default function PropertiesPage() {
  return (
    <div className="min-h-full bg-[#f5f5f5] dark:bg-admin-main-bg">
      <PropertiesView
        header={{
          title: "Properties",
          subtitle: "Manage property listings (sale and rent)",
          breadcrumbs: [
            { label: "Admin", href: "/admin/dashboard" },
            { label: "Properties" },
          ],
        }}
      />
    </div>
  );
}
