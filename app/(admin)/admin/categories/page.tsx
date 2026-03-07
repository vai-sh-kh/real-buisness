"use client";

import { CategoriesView } from "@/components/admin/categories/CategoriesView";

export default function CategoriesPage() {
  return (
    <div className="min-h-full bg-[#f5f5f5]">
      <CategoriesView
        header={{
          title: "Categories",
          subtitle: "Manage property categories (e.g. Residential, Commercial)",
          breadcrumbs: [
            { label: "Admin", href: "/admin/dashboard" },
            { label: "Categories" },
          ],
        }}
      />
    </div>
  );
}
