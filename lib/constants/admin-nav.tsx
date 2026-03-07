import {
  LayoutDashboard,
  Home,
  Tags,
  UserPlus,
  FileBarChart,
  type LucideIcon,
} from "lucide-react";

export const adminNavItems: {
  label: string;
  href: string;
  icon: LucideIcon;
  color: string;
  colorDark: string;
}[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    color: "text-blue-500",
    colorDark: "dark:text-blue-400",
  },
  {
    label: "Properties",
    href: "/admin/properties",
    icon: Home,
    color: "text-emerald-600",
    colorDark: "dark:text-emerald-400",
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: Tags,
    color: "text-amber-600",
    colorDark: "dark:text-amber-400",
  },
  {
    label: "Leads",
    href: "/admin/leads",
    icon: UserPlus,
    color: "text-violet-600",
    colorDark: "dark:text-violet-400",
  },
  {
    label: "Reports",
    href: "/admin/reports",
    icon: FileBarChart,
    color: "text-orange-600",
    colorDark: "dark:text-orange-400",
  },
];

export const adminPageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/properties": "Properties",
  "/admin/categories": "Categories",
  "/admin/leads": "Leads",
  "/admin/reports": "Reports",
  "/admin/settings": "Settings",
};

export function getAdminPageTitle(pathname: string): string {
  if (adminPageTitles[pathname]) return adminPageTitles[pathname];
  if (pathname.startsWith("/admin/properties/")) return "Property";
  if (pathname.startsWith("/admin/settings")) return "Settings";
  return "Admin";
}
