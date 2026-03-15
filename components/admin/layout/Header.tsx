"use client";

import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import { useAppStore } from "@/store/appStore";

function getGreeting(displayName: string): string {
  const hour = new Date().getHours();
  const name = displayName.split(" ")[0] || "there";
  if (hour < 12) return `Good morning, ${name}`;
  if (hour < 17) return `Good afternoon, ${name}`;
  return `Good evening, ${name}`;
}
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
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
import { Logo } from "@/components/ui/Logo";

export function Header() {
  const router = useRouter();
  const { email, clearAuth } = useAuthStore();
  const { sidebarCollapsed } = useAppStore();

  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const displayName = "Admin User";

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
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
    <header
      role="banner"
      className={cn(
        "fixed top-0 right-0 z-20 flex h-16 min-h-[4rem] items-center justify-between border-b border-admin-header-border bg-admin-header-bg backdrop-blur-sm transition-all duration-300 px-3 pt-[env(safe-area-inset-top)] lg:h-[4.5rem] lg:min-h-[4.5rem] lg:px-6",
        "left-0 lg:left-64",
        sidebarCollapsed && "lg:left-16",
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {/* Mobile: icon + "The Real Business" branding */}
        <div className="flex min-w-0 flex-1 items-center gap-3 lg:hidden">
          <Logo
            href="/admin/dashboard"
            height={36}
            iconOnly
            className="shrink-0"
            title="The Real Business"
          />
          <p className="mt-2 truncate text-lg font-semibold leading-tight text-black sm:text-xl">
            The Real Business
          </p>
        </div>
        {/* Desktop: greeting + date */}
        <div className="hidden lg:block">
          <p className="text-lg font-semibold text-foreground">
            {getGreeting(displayName)}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              timeZone: "Asia/Kolkata",
            })}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg px-2 py-1.5 hover:bg-muted transition-colors lg:min-h-0 lg:min-w-0 lg:gap-2.5">
              <div className="relative">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-semibold">
                  {displayName[0]?.toUpperCase() ??
                    email?.[0]?.toUpperCase() ??
                    "A"}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-admin-header-bg" />
              </div>
              <div className="text-left hidden lg:flex flex-col">
                <span className="text-sm font-medium text-foreground leading-none">
                  {displayName}
                </span>
                <span className="text-xs text-muted-foreground mt-0.5 leading-none">
                  Super Admin
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-64 min-w-[14rem] rounded-xl border border-border bg-popover p-3 pt-3 shadow-lg"
          >
            <DropdownMenuLabel className="font-normal mt-0 px-3 pb-3 pt-0">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-semibold">
                  {displayName[0]?.toUpperCase() ??
                    email?.[0]?.toUpperCase() ??
                    "A"}
                </div>
                <div className="flex flex-col space-y-0.5 min-w-0">
                  <p className="text-sm font-medium truncate">{displayName}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {email ?? "admin@yourdomain.com"}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
              onClick={() => setShowLogoutDialog(true)}
              className="flex cursor-pointer items-center gap-3 rounded-lg py-3 text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="rounded-xl border border-border bg-card text-card-foreground shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out of your account? You will need
              to log back in to access the admin panel.
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
    </header>
  );
}
