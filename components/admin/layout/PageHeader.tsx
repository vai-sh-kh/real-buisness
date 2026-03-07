"use client";

import { ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  /** Optional date display - removed from pages, kept for backwards compat */
  showDate?: boolean;
  /** On mobile, show a back link above the title (e.g. from edit property page) */
  backHref?: string;
  backLabel?: string;
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
  showDate = false,
  backHref,
  backLabel = "Back",
}: PageHeaderProps) {
  return (
    <header className="border-b border-[#e5e5e5] bg-[#f5f5f5] px-2 pt-4 pb-3 sm:px-6 sm:pt-5 lg:px-8 lg:pt-6">
      <div className="flex flex-row flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {backHref && (
            <Link
              href={backHref}
              className="mb-2 flex min-h-[44px] w-fit items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground lg:hidden"
            >
              <ChevronLeft className="h-4 w-4 shrink-0" />
              {backLabel}
            </Link>
          )}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav
              aria-label="Breadcrumb"
              className="mb-2 hidden items-center gap-1.5 text-sm text-muted-foreground lg:flex"
            >
              {breadcrumbs.map((item, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {i > 0 && (
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                  )}
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="font-medium transition-colors hover:text-gray-900"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="font-medium text-gray-900">
                      {item.label}
                    </span>
                  )}
                </span>
              ))}
            </nav>
          )}
          <h1 className="text-xl font-semibold tracking-tight text-[#1a1a1a] sm:text-2xl lg:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {showDate && (
            <div className="hidden text-right sm:block">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "short",
                  timeZone: "Asia/Kolkata",
                })}
              </p>
              <p className="text-sm font-semibold text-muted-foreground">
                {new Date().toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          )}
          {actions}
        </div>
      </div>
    </header>
  );
}
