"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useScrollToFirstError } from "@/hooks/useScrollToFirstError";
import {
  Eye,
  EyeOff,
  Loader2,
  Building2,
  Users,
  BarChart3,
  Shield,
  Zap,
  LayoutDashboard,
} from "lucide-react";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import Link from "next/link";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth.schema";

const FEATURES = [
  {
    icon: Building2,
    text: "Manage properties, listings, and media in one unified dashboard",
  },
  {
    icon: Users,
    text: "Track leads and customer inquiries with real-time notifications",
  },
  {
    icon: BarChart3,
    text: "Analytics and reports to grow your real estate business",
  },
  {
    icon: Shield,
    text: "Secure, role-based access for your team members",
  },
  {
    icon: Zap,
    text: "Fast, responsive admin experience built for productivity",
  },
];

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, setAuthenticated, clearAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const redirectParam = searchParams.get("redirect");
    // If we were sent here by the server (redirect param), our session is invalid — clear client state so we show the form instead of "Signing you in..."
    if (redirectParam) {
      if (isAuthenticated) clearAuth();
      return;
    }
    if (isAuthenticated) {
      router.replace("/admin/dashboard");
    }
  }, [isAuthenticated, router, searchParams, clearAuth]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useScrollToFirstError(errors);

  async function onSubmit(data: LoginFormData) {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error ?? "Login failed");
        return;
      }

      setAuthenticated(result.email ?? data.email);
      toast.success("Welcome back!");
      const redirectTo = searchParams.get("redirect") || "/admin/dashboard";
      router.replace(
        redirectTo.startsWith("/admin") ? redirectTo : "/admin/dashboard",
      );
    } catch {
      toast.error("Network error. Please try again.");
    }
  }

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void handleSubmit(onSubmit)(e);
  };

  if (!mounted) return null;

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-charcoal">
        <div className="flex flex-col items-center gap-4 text-white">
          <Loader2 className="h-10 w-10 animate-spin text-brand-gold" />
          <p className="text-sm font-medium">Signing you in…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left panel — desktop only */}
      <div className="hidden lg:flex lg:w-1/2 min-h-screen w-full">
        {/* Left panel — premium branded content */}
        <div className="flex w-full relative overflow-hidden bg-brand-charcoal">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-home.jpg"
            alt="Admin login"
            className="absolute inset-0 h-full w-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/95 via-[#1A1A1A]/50 via-40% to-[#1A1A1A]/30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.06),transparent)]" />
          <div className="relative z-10 flex flex-col justify-between p-14 w-full">
            <div className="md:mt-[150px] space-y-10">
              <div>
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-6">
                  <LayoutDashboard className="h-4 w-4 text-brand-gold" />
                  <span className="text-sm font-medium text-white/90 tracking-wide uppercase">
                    Admin Portal
                  </span>
                </div>
                <h2 className="text-5xl xl:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                  Manage your
                  <br />
                  <span className="bg-gradient-to-r from-brand-gold/90 to-brand-gold bg-clip-text text-transparent">
                    real estate business
                  </span>
                </h2>
                <p className="text-white/60 text-lg leading-relaxed max-w-md mb-10">
                  Access your admin panel to manage properties, leads,
                  categories, and analytics—all in one place.
                </p>
              </div>

              <ul className="space-y-5">
                {FEATURES.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <li key={i} className="flex items-start gap-4 group/item">
                      <span className="flex-shrink-0 mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 text-amber-400 group-hover/item:bg-amber-500/20 group-hover/item:border-amber-400/30 transition-all duration-300">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-base text-white/80 leading-relaxed pt-1 group-hover/item:text-white transition-colors">
                        {item.text}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <p className="text-sm text-white/40 tracking-wide">
              © {new Date().getFullYear()} The Real Business. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel — single form (visible on mobile and desktop). Mobile: white, no sidebar/header. */}
      <div className="flex-1 flex flex-col min-h-[100dvh] lg:min-h-screen relative overflow-hidden bg-white lg:bg-transparent">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/80 to-white hidden lg:block" />
        <div className="relative z-10 flex flex-col flex-1 min-h-0 pt-[env(safe-area-inset-top)] lg:pt-0 pb-[max(1.5rem,env(safe-area-inset-bottom))] lg:pb-0">
          <main className="flex-1 flex flex-col justify-center px-5 lg:px-12 py-4 overflow-auto">
            <div className="w-full max-w-[340px] lg:max-w-[500px] mx-auto">
              <Link
                href="/"
                className="hidden lg:inline-flex items-center gap-3 mb-10"
              >
                <Image
                  src="/logo-icon-bg.png"
                  alt=""
                  width={48}
                  height={48}
                  className="shrink-0 object-contain"
                  style={{ width: "auto", height: "auto" }}
                />
                <span className="mt-5 flex flex-col justify-center font-heading text-lg font-bold uppercase leading-[1.2] tracking-tight text-foreground">
                  <span>THE REAL</span>
                  <span>BUSINESS</span>
                </span>
              </Link>
              <div className="mb-8 lg:mb-10">
                <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-2 lg:mb-3">
                  Sign in
                </h1>
                <p className="text-sm text-gray-500">
                  Use your admin email and password to continue.
                </p>
              </div>

              <form onSubmit={onFormSubmit} className="space-y-5" noValidate>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs lg:text-sm font-medium lg:font-semibold text-gray-900 mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    autoComplete="email"
                    {...register("email")}
                    className={`w-full border rounded-xl px-4 py-3.5 text-base lg:text-sm outline-none focus:ring-2 transition-all touch-manipulation bg-white placeholder:text-gray-400 text-gray-900 border-gray-200 shadow-sm pr-4 lg:pr-12 ${
                      errors.email
                        ? "border-red-500 focus:ring-red-500/20"
                        : "focus:border-brand-gold focus:ring-brand-gold/25 lg:focus:ring-brand-gold/20"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs lg:text-sm font-medium lg:font-semibold text-gray-900 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      {...register("password")}
                      className={`w-full border rounded-xl px-4 py-3.5 text-base lg:text-sm outline-none focus:ring-2 transition-all pr-12 touch-manipulation bg-white placeholder:text-gray-400 text-gray-900 border-gray-200 shadow-sm ${
                        errors.password
                          ? "border-red-500 focus:ring-red-500/20"
                          : "focus:border-brand-gold focus:ring-brand-gold/25 lg:focus:ring-brand-gold/20"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] lg:min-h-0 lg:min-w-0 flex items-center justify-center text-gray-400 hover:text-gray-900 rounded-lg transition-colors touch-manipulation"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 lg:h-4 lg:w-4" />
                      ) : (
                        <Eye className="h-5 w-5 lg:h-4 lg:w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[52px] lg:min-h-0 bg-brand-gold lg:bg-brand-charcoal text-white text-base lg:text-sm font-semibold py-3.5 rounded-xl hover:bg-brand-gold/90 lg:hover:opacity-90 hover:ring-2 hover:ring-brand-gold/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 lg:disabled:opacity-60 disabled:cursor-not-allowed mt-2 lg:mt-3 touch-manipulation lg:shadow-lg lg:shadow-black/20"
                >
                  {isSubmitting && (
                    <Loader2 className="h-5 w-5 lg:h-4 lg:w-4 animate-spin shrink-0" />
                  )}
                  {isSubmitting ? "Signing in…" : "Sign in"}
                </button>
              </form>

              <p className="mt-8 lg:mt-10 text-center">
                <Link
                  href="/"
                  className="text-sm text-gray-500 hover:text-brand-gold font-medium hover:underline underline-offset-2 transition-colors touch-manipulation inline-flex items-center gap-1"
                >
                  ← Back to site
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
