"use client";

import { PageHeader } from "@/components/admin/layout/PageHeader";
import { SettingsView } from "@/components/admin/settings/SettingsView";

export default function SettingsPage() {
  return (
    <div className="min-h-full bg-[#f5f5f5] dark:bg-admin-main-bg">
      <PageHeader
        title="Settings"
        subtitle="Manage your profile, notifications, and preferences"
        breadcrumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Settings" },
        ]}
        showDate={false}
      />
      <div className="space-y-6 px-2 pt-6 pb-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
        <SettingsView />
      </div>
    </div>
  );
}
