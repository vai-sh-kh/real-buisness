"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { adminNavItems } from "@/lib/constants/admin-nav";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function MobileNavDrawer() {
  const pathname = usePathname();
  const { mobileNavOpen, setMobileNavOpen } = useAppStore();
  const { clearAuth } = useAuthStore();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      clearAuth();
      window.location.href = "/admin/login";
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
      setIsLoggingOut(false);
    }
  }

  return (
    <>
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent
          side="left"
          className="w-[min(85vw,20rem)] border-r border-admin-sidebar-border bg-admin-sidebar-bg p-0 lg:hidden"
        >
          <SheetHeader className="sr-only px-4 pt-4">
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>Admin navigation and account</SheetDescription>
          </SheetHeader>
          <div className="flex h-full flex-col">
            <div className="flex h-14 min-h-[3.5rem] items-center border-b border-admin-sidebar-border px-4">
              <Link
                href="/admin/dashboard"
                onClick={() => setMobileNavOpen(false)}
                className="flex items-center gap-3"
              >
                <Image
                  src="/logo-icon-bg.png"
                  alt=""
                  width={36}
                  height={36}
                  className="shrink-0 object-contain"
                />
                <span className="font-heading text-sm font-bold uppercase tracking-tight text-foreground">
                  The Real Business
                </span>
              </Link>
            </div>
            <nav className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-1 px-3">
                {adminNavItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/");
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileNavOpen(false)}
                        className={cn(
                          "flex min-h-[48px] items-center gap-3.5 rounded-lg px-3 py-3 text-base font-medium transition-colors",
                          isActive
                            ? "bg-admin-sidebar-active text-admin-sidebar-text"
                            : "text-admin-sidebar-text-muted hover:bg-admin-sidebar-hover hover:text-admin-sidebar-text",
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-6 w-6 shrink-0",
                            isActive
                              ? "text-admin-sidebar-active-indicator"
                              : item.color,
                          )}
                        />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div className="border-t border-admin-sidebar-border px-3 py-4 space-y-1">
              <button
                onClick={() => {
                  setMobileNavOpen(false);
                  setShowLogoutDialog(true);
                }}
                className="flex min-h-[48px] w-full items-center gap-3.5 rounded-lg px-3 py-3 text-base font-medium text-red-600 transition-colors hover:bg-red-500/10"
              >
                <LogOut className="h-6 w-6 shrink-0" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
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
    </>
  );
}
