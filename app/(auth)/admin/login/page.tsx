"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const { isAuthenticated, setAuthenticated } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated) {
      router.replace("/admin/dashboard");
    }
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useScrollToFirstError(errors);

  if (!mounted || isAuthenticated) return null;

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

      setAuthenticated(result.email);
      toast.success("Welcome back!");
      router.push("/admin/dashboard");
    } catch {
      toast.error("Network error. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Mobile: full-screen SaaS layout */}
      <div className="lg:hidden min-h-[100dvh] w-full flex flex-col bg-gradient-to-b from-brand-charcoal via-[#252525] to-brand-charcoal">
        <div className="flex-1 flex flex-col justify-center px-5 py-8 pb-12">
          <div className="w-full max-w-sm mx-auto">
            {/* Logo + badge */}
            <div className="text-center mb-8">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-3 mb-4"
              >
                <Image
                  src="/logo-icon-bg.png"
                  alt=""
                  width={48}
                  height={48}
                  className="shrink-0 object-contain"
                  style={{ width: "auto", height: "auto" }}
                />
                <span className="flex flex-col justify-center font-heading text-lg font-bold uppercase leading-[1.2] tracking-tight text-white">
                  <span>THE REAL</span>
                  <span>BUSINESS</span>
                </span>
              </Link>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-white/80">
                <LayoutDashboard className="h-3.5 w-3.5 text-brand-gold" />
                Admin Portal
              </span>
            </div>

            {/* Form card */}
            <div className="rounded-2xl bg-white/95 backdrop-blur-sm shadow-2xl shadow-black/20 p-6 border border-white/10">
              <h1 className="text-xl font-bold text-gray-900 mb-1">Sign in</h1>
              <p className="text-sm text-gray-500 mb-6">
                Enter your credentials to continue
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label
                    htmlFor="mobile-email"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    id="mobile-email"
                    type="email"
                    placeholder="admin@example.com"
                    autoComplete="email"
                    {...register("email")}
                    className={`w-full border rounded-xl px-4 py-3.5 text-base outline-none focus:ring-2 transition-all placeholder:text-gray-400 bg-gray-50/80 ${
                      errors.email
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-gray-200 focus:border-brand-gold focus:ring-brand-gold/20"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="mobile-password"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="mobile-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      {...register("password")}
                      className={`w-full border rounded-xl px-4 py-3.5 text-base outline-none focus:ring-2 transition-all placeholder:text-gray-400 pr-12 bg-gray-50/80 ${
                        errors.password
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : "border-gray-200 focus:border-brand-gold focus:ring-brand-gold/20"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 -m-2 text-gray-400 hover:text-gray-700 active:bg-gray-200/50 rounded-lg transition-colors touch-manipulation"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-charcoal text-white text-base font-semibold py-4 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2 shadow-lg touch-manipulation"
                >
                  {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </button>
              </form>
            </div>

            <p className="mt-6 text-center text-xs text-white/50">
              <Link
                href="/"
                className="text-brand-gold hover:opacity-90 underline underline-offset-2"
              >
                ← Back to site
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Desktop: split layout */}
      <div className="hidden lg:flex min-h-screen w-full">
        {/* Left panel — premium branded content */}
        <div className="flex lg:w-1/2 relative overflow-hidden bg-brand-charcoal">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
            alt="Admin login"
            className="absolute inset-0 h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/90 via-40% to-[#1A1A1A]/70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.08),transparent)]" />
          <div className="relative z-10 flex flex-col justify-between p-14 w-full">
            <Link
              href="/"
              className="flex items-center gap-3 w-fit transition-transform hover:scale-[1.02] group"
            >
              <Image
                src="/logo-icon-bg.png"
                alt=""
                width={56}
                height={56}
                className="shrink-0 object-contain"
                style={{ width: "auto", height: "auto" }}
              />
              <span className="mt-5 flex flex-col justify-center font-heading text-[15px] font-bold uppercase leading-[1.2] tracking-tight text-white">
                <span>THE REAL</span>
                <span>BUSINESS</span>
              </span>
            </Link>

            <div className="space-y-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-6">
                  <LayoutDashboard className="h-3.5 w-3.5 text-brand-gold" />
                  <span className="text-xs font-medium text-white/90 tracking-wide uppercase">
                    Admin Portal
                  </span>
                </div>
                <h2 className="text-4xl xl:text-5xl font-bold text-white leading-[1.1] tracking-tight mb-5">
                  Manage your
                  <br />
                  <span className="bg-gradient-to-r from-brand-gold/90 to-brand-gold bg-clip-text text-transparent">
                    real estate business
                  </span>
                </h2>
                <p className="text-white/60 text-base leading-relaxed max-w-md mb-10">
                  Access your admin panel to manage properties, leads,
                  categories, and analytics—all in one place.
                </p>
              </div>

              <ul className="space-y-4">
                {FEATURES.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <li key={i} className="flex items-start gap-4 group/item">
                      <span className="flex-shrink-0 mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 text-amber-400 group-hover/item:bg-amber-500/20 group-hover/item:border-amber-400/30 transition-all duration-300">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm text-white/80 leading-relaxed pt-1 group-hover/item:text-white transition-colors">
                        {item.text}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <p className="text-xs text-white/40 tracking-wide">
              © {new Date().getFullYear()} The Real Business. All rights
              reserved.
            </p>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-gradient-to-b from-gray-50/80 to-white">
          <div className="w-full max-w-[400px]">
            <Link href="/" className="inline-flex items-center gap-3 mb-10">
              <Image
                src="/logo-icon-bg.png"
                alt=""
                width={48}
                height={48}
                className="shrink-0 object-contain"
                style={{ width: "auto", height: "auto" }}
              />
              <span className="mt-5 flex flex-col justify-center font-heading text-[15px] font-bold uppercase leading-[1.2] tracking-tight text-foreground">
                <span>THE REAL</span>
                <span>BUSINESS</span>
              </span>
            </Link>
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
                Sign in
              </h1>
              <p className="text-sm text-gray-500">
                Enter your admin credentials to access the dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  autoComplete="email"
                  {...register("email")}
                  className={`w-full border rounded-xl px-4 py-3.5 text-sm outline-none focus:ring-2 transition-all placeholder:text-gray-400 bg-white shadow-sm ${
                    errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-200 focus:border-brand-gold/50 focus:ring-brand-gold/20"
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
                  className="block text-sm font-semibold text-gray-900 mb-2"
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
                    className={`w-full border rounded-xl px-4 py-3.5 text-sm outline-none focus:ring-2 transition-all placeholder:text-gray-400 pr-12 bg-white shadow-sm ${
                      errors.password
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-gray-200 focus:border-brand-gold/50 focus:ring-brand-gold/20"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
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
                className="w-full bg-brand-charcoal text-white text-sm font-semibold py-3.5 rounded-xl hover:opacity-90 hover:ring-2 hover:ring-brand-gold/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-3 shadow-lg shadow-black/20"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-10 text-center text-xs text-gray-500">
              Protected Admin Area &mdash;{" "}
              <Link
                href="/"
                className="text-brand-charcoal font-medium hover:text-brand-gold hover:underline underline-offset-2 transition-colors"
              >
                Back to site
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
