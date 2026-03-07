import { Skeleton } from "@/components/ui/skeleton";

/** Skeleton for PageHeader (breadcrumb + title + subtitle) */
export function PageHeaderSkeleton() {
  return (
    <div className="flex flex-row flex-wrap items-start justify-between gap-4">
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-3.5 w-16 rounded" />
          <Skeleton className="h-3.5 w-3.5 rounded" />
          <Skeleton className="h-3.5 w-20 rounded" />
        </div>
        <Skeleton className="h-8 w-48 rounded sm:h-9 sm:w-56" />
        <Skeleton className="h-4 w-72 max-w-full rounded" />
      </div>
    </div>
  );
}

/** Skeleton for list/table pages: header + toolbar + table + pagination */
export function TablePageSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeaderSkeleton />
      {/* Toolbar: search, filters, primary action */}
      <div className="flex flex-wrap items-center gap-3">
        <Skeleton className="h-10 w-full max-w-sm rounded-lg" />
        <Skeleton className="h-10 w-[140px] rounded-lg" />
        <Skeleton className="h-10 w-[120px] rounded-lg" />
        <div className="ml-auto flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
      </div>
      {/* Table */}
      <div className="rounded-xl border border-admin-card-border bg-admin-card-bg overflow-hidden shadow-sm">
        <div className="border-b border-admin-card-border p-3 sm:p-4">
          <div className="flex gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-4 w-20 rounded" />
            ))}
          </div>
        </div>
        <div className="divide-y divide-admin-card-border">
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-3 sm:p-4"
            >
              <Skeleton className="h-4 w-8 rounded" />
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-4 w-20 rounded" />
              <div className="ml-auto flex gap-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          ))}
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-admin-card-border p-3 sm:p-4">
          <Skeleton className="h-4 w-28 rounded" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-4 w-16 rounded" />
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Skeleton matching DashboardView: stats row + charts + recent activity */
export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-xl border border-admin-card-border bg-admin-card-bg p-6 shadow-sm"
          >
            <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-8 w-16 rounded" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-admin-card-border bg-admin-card-bg p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <Skeleton className="h-6 w-56 rounded" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
          <Skeleton className="h-[280px] w-full rounded-xl" />
        </div>
        <div className="rounded-2xl border border-admin-card-border bg-admin-card-bg p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <Skeleton className="h-6 w-48 rounded" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
          <Skeleton className="h-[280px] w-full rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-admin-card-border bg-admin-card-bg p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <Skeleton className="h-6 w-40 rounded" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-xl border border-admin-card-border p-3"
              >
                <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-36 rounded" />
                  <Skeleton className="h-3 w-24 rounded" />
                </div>
                <Skeleton className="h-5 w-14 rounded" />
                <Skeleton className="h-3 w-16 rounded" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-admin-card-border bg-admin-card-bg p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <Skeleton className="h-6 w-28 rounded" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-xl border border-admin-card-border p-3"
              >
                <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-3 w-40 rounded" />
                </div>
                <Skeleton className="h-5 w-14 rounded" />
                <Skeleton className="h-3 w-16 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Skeleton matching ReportsView: toolbar + stats + charts + activity */
export function ReportsSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-admin-card-border bg-admin-card-bg p-4">
        <Skeleton className="h-9 w-[160px] rounded-md" />
        <Skeleton className="h-9 w-24 rounded-md" />
        <div className="ml-auto flex gap-2">
          <Skeleton className="h-9 w-20 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-admin-card-border bg-admin-card-bg p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-5 w-5 rounded" />
            </div>
            <Skeleton className="mt-2 h-8 w-12 rounded" />
            <Skeleton className="mt-2 h-3 w-20 rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-admin-card-border bg-admin-card-bg p-6 shadow-sm">
          <Skeleton className="mb-6 h-6 w-48 rounded" />
          <Skeleton className="h-[280px] w-full rounded-xl" />
        </div>
        <div className="rounded-xl border border-admin-card-border bg-admin-card-bg p-6 shadow-sm">
          <Skeleton className="mb-6 h-6 w-40 rounded" />
          <Skeleton className="h-[280px] w-full rounded-xl" />
        </div>
      </div>
      <div className="rounded-2xl border border-admin-card-border bg-admin-card-bg p-6 shadow-sm">
        <Skeleton className="mb-6 h-6 w-36 rounded" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-xl border border-admin-card-border p-4"
            >
              <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48 rounded" />
                <Skeleton className="h-3 w-32 rounded" />
              </div>
              <Skeleton className="h-6 w-16 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Skeleton matching SettingsView: tabs + card with form fields */
export function SettingsSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="grid w-full max-w-2xl grid-cols-4 gap-1 rounded-xl bg-muted p-1">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-10 rounded-lg" />
        ))}
      </div>
      <div className="rounded-xl border border-admin-card-border bg-admin-card-bg p-6 shadow-sm">
        <div className="mb-6 space-y-1">
          <Skeleton className="h-6 w-48 rounded" />
          <Skeleton className="h-4 w-72 max-w-full rounded" />
        </div>
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl border border-admin-card-border p-4 bg-muted/30"
            >
              <div className="space-y-2">
                <Skeleton className="h-4 w-40 rounded" />
                <Skeleton className="h-3 w-56 rounded" />
              </div>
              <Skeleton className="h-6 w-11 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Skeleton for property edit page (sheet/form) */
export function PropertyEditSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeaderSkeleton />
      <div className="rounded-xl border border-admin-card-border bg-admin-card-bg p-6 shadow-sm">
        <div className="space-y-6">
          <Skeleton className="h-10 w-full max-w-md rounded-lg" />
          <Skeleton className="h-10 w-full max-w-md rounded-lg" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-10 rounded-lg" />
            <Skeleton className="h-10 rounded-lg" />
          </div>
          <Skeleton className="h-24 w-full rounded-lg" />
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
