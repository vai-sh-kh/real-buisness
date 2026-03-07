"use client";

import { useAppStore } from "@/store/appStore";
import { cn } from "@/lib/utils";
import { AdminThemeProvider } from "@/components/admin/settings/AdminThemeContext";
import { AdminThemeApplicator } from "@/components/admin/settings/AdminThemeApplicator";
import { useSettings } from "@/hooks/useSettings";

const THEME_INIT_SCRIPT = `
(function(){
  try {
    var c = document.cookie.match(/admin_theme=([^;]+)/);
    var t = (c && c[1]) ? c[1] : (typeof localStorage !== 'undefined' ? localStorage.getItem('admin_theme') : null) || 'system';
    if (t === 'system') t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    var el = document.getElementById('admin-theme-root');
    if (el) { el.classList.remove('light','dark'); el.classList.add(t); }
  } catch(e) {}
})();
`;

export function AdminClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarCollapsed } = useAppStore();
  const { data } = useSettings();
  const serverTheme = data?.data?.theme;

  return (
    <div
      id="admin-theme-root"
      className="min-h-screen"
      suppressHydrationWarning
    >
      <script
        dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
        suppressHydrationWarning
      />
      <AdminThemeProvider serverTheme={serverTheme}>
        <AdminThemeApplicator />
        <div
          className={cn(
            "relative flex h-screen flex-col transition-all duration-300",
            "pl-0 lg:pl-64",
            sidebarCollapsed && "lg:pl-16",
          )}
        >
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto">{children}</div>
          </div>
        </div>
      </AdminThemeProvider>
    </div>
  );
}
