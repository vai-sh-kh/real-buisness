"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Settings, LogOut, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClientSupabase } from "@/lib/supabase/client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { adminNavItems } from "@/lib/constants/admin-nav";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { clearAuth } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const supabase = createClientSupabase();

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      clearAuth();
      router.push("/admin/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
      setIsLoggingOut(false);
    }
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 hidden flex-col bg-admin-sidebar-bg border-r border-admin-sidebar-border transition-all duration-300 lg:flex",
        sidebarCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Logo + title */}
      <div
        className={cn(
          "flex h-[4.5rem] min-h-[4.5rem] items-center border-b border-admin-sidebar-border",
          sidebarCollapsed
            ? "justify-center px-0"
            : "justify-between gap-4 px-4",
        )}
      >
        <Link
          href="/admin/dashboard"
          className={cn(
            "flex items-center transition-opacity hover:opacity-90",
            !sidebarCollapsed && "min-w-0 flex-1 gap-4",
          )}
          title="The Real Business"
        >
          <Image
            src="/logo-icon-bg.png"
            alt=""
            width={44}
            height={44}
            className="shrink-0 object-contain"
            style={{ width: "auto", height: "auto" }}
          />
          {!sidebarCollapsed && (
            <span className="mt-5 flex flex-col justify-center font-heading text-[13px] font-bold uppercase leading-[1.2] tracking-tight text-foreground min-w-0">
              <span>THE REAL</span>
              <span>BUSINESS</span>
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1.5 px-3">
          {adminNavItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3.5 rounded-lg px-3 py-3 text-base font-medium transition-colors relative",
                    isActive
                      ? "bg-admin-sidebar-active text-admin-sidebar-text"
                      : "text-admin-sidebar-text-muted hover:bg-admin-sidebar-hover hover:text-admin-sidebar-text",
                    sidebarCollapsed && "justify-center px-0",
                  )}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  {isActive && !sidebarCollapsed && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-admin-sidebar-active-indicator rounded-r-full" />
                  )}
                  <item.icon
                    className={cn(
                      "h-6 w-6 shrink-0",
                      isActive
                        ? "text-admin-sidebar-active-indicator"
                        : cn(item.color, item.colorDark),
                    )}
                  />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Footer Items */}
      <div className="mt-auto px-3 pb-4 pt-4 border-t border-admin-sidebar-border space-y-2">
        <Link
          href="/admin/settings"
          className={cn(
            "flex items-center gap-3.5 rounded-lg px-3 py-3 text-base font-medium transition-colors",
            pathname === "/admin/settings"
              ? "bg-admin-sidebar-active text-admin-sidebar-text"
              : "text-admin-sidebar-text-muted hover:bg-admin-sidebar-hover hover:text-admin-sidebar-text",
            sidebarCollapsed && "justify-center px-0",
          )}
          title={sidebarCollapsed ? "Settings" : undefined}
        >
          <Settings className="h-6 w-6 shrink-0" />
          {!sidebarCollapsed && <span>Settings</span>}
        </Link>
        <button
          onClick={() => setShowLogoutDialog(true)}
          className={cn(
            "w-full flex items-center gap-3.5 rounded-lg px-3 py-3 text-base font-medium transition-colors text-red-600 hover:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/10",
            sidebarCollapsed && "justify-center px-0",
          )}
          title={sidebarCollapsed ? "Log Out" : undefined}
        >
          <LogOut className="h-6 w-6 shrink-0" />
          {!sidebarCollapsed && <span>Log Out</span>}
        </button>
      </div>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="rounded-xl border border-border bg-card text-card-foreground shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out? Your current session will be
              ended.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 mt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              variant="destructive"
              className="min-w-[110px]"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing Out…
                </>
              ) : (
                "Sign Out"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  );
}
