"use client";

import { useRouter } from "next/navigation";
import { LogOut, User, Bell, Search } from "lucide-react";
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
import { useAppStore } from "@/store/appStore";
import { cn } from "@/lib/utils";

export function Header() {
  const router = useRouter();
  const { email, clearAuth } = useAuthStore();
  const { sidebarCollapsed } = useAppStore();

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      clearAuth();
      router.push("/admin/login");
      toast.success("Logged out successfully");
    } catch {
      toast.error("Failed to logout");
    }
  }

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-20 flex h-16 items-center justify-between border-b border-gray-100 bg-white px-6 transition-all duration-300",
        sidebarCollapsed ? "left-16" : "left-60"
      )}
    >
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 w-56">
          <Search className="h-3.5 w-3.5 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400 w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500 hover:text-black hover:bg-gray-100">
          <Bell className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 hover:bg-gray-100 transition-colors">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white text-xs font-bold">
                {email ? email[0].toUpperCase() : "A"}
              </div>
              {email && (
                <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
                  Admin
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Admin</p>
                <p className="text-xs leading-none text-muted-foreground truncate">
                  {email ?? "admin@yourdomain.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer focus:text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
