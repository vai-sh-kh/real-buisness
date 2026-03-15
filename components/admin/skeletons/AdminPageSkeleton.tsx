import { Skeleton } from "@/components/ui/skeleton";

const CARD_CLASS_PROPERTY =
  "rounded-xl border border-admin-card-border bg-admin-card-bg p-3 shadow-sm sm:p-4 lg:p-6";

/** Skeleton for PageHeader (breadcrumb visible at lg only, title, subtitle). Optionally show back link placeholder on mobile. */
export function PageHeaderSkeleton({
  showBackLink = false,
}: {
  showBackLink?: boolean;
} = {}) {
  return (
    <header className="border-b border-[#e5e5e5] bg-[#f5f5f5] px-4 pt-4 pb-4 sm:px-6 sm:pt-5 sm:pb-4 lg:px-8 lg:pt-6 lg:pb-5">
      <div className="flex flex-row flex-wrap items-center justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-2">
          {showBackLink && (
            <div className="mb-2 flex h-[44px] w-20 items-center gap-1 rounded lg:hidden">
              <Skeleton className="h-4 w-4 shrink-0 rounded" />
              <Skeleton className="h-3.5 w-8 rounded" />
            </div>
          )}
          {/* Breadcrumb: hidden on mobile, visible at lg */}
          <div className="mb-2 hidden items-center gap-1.5 lg:flex">
            <Skeleton className="h-3.5 w-12 rounded" />
            <Skeleton className="h-3.5 w-3.5 rounded" />
            <Skeleton className="h-3.5 w-20 rounded" />
          </div>
          <Skeleton className="h-7 w-48 rounded sm:h-8 sm:w-56 lg:h-9 lg:w-64" />
          <Skeleton className="h-4 w-72 max-w-full rounded" />
        </div>
      </div>
    </header>
  );
}

/** Skeleton for dashboard-style header (title + subtitle only, no breadcrumb). */
export function DashboardHeaderSkeleton() {
  return (
    <header className="border-b border-[#e5e5e5] bg-[#f5f5f5] px-4 pt-4 pb-4 sm:px-6 sm:pt-5 sm:pb-4 lg:px-8 lg:pt-6 lg:pb-5">
      <Skeleton className="h-7 w-32 rounded sm:h-8 sm:w-40 lg:h-9 lg:w-44" />
      <Skeleton className="mt-1 h-4 w-64 max-w-full rounded sm:w-80" />
    </header>
  );
}

/** Skeleton matching DashboardView: stats row + charts + recent activity. Responsive at all breakpoints. */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex min-w-0 items-center gap-3 overflow-hidden rounded-xl border border-admin-card-border bg-admin-card-bg p-4 shadow-sm sm:gap-4 sm:p-6"
          >
            <Skeleton className="h-10 w-10 shrink-0 rounded-lg sm:h-12 sm:w-12 sm:rounded-xl" />
            <div className="min-w-0 flex-1 space-y-1.5 sm:space-y-2">
              <Skeleton className="h-3 w-16 rounded sm:h-4 sm:w-28" />
              <Skeleton className="h-6 w-12 rounded sm:h-8 sm:w-16" />
              <Skeleton className="h-2.5 w-14 rounded sm:h-3 sm:w-20" />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        <div className="min-w-0 overflow-hidden rounded-xl border border-admin-card-border bg-admin-card-bg p-4 shadow-sm sm:rounded-2xl sm:p-6">
          <div className="mb-4 flex items-center justify-between sm:mb-6">
            <Skeleton className="h-5 w-32 rounded sm:h-6 sm:w-56" />
            <Skeleton className="h-3 w-12 shrink-0 rounded sm:h-4 sm:w-16" />
          </div>
          <Skeleton className="h-48 w-full rounded-xl sm:h-64 lg:h-[280px]" />
        </div>
        <div className="min-w-0 overflow-hidden rounded-xl border border-admin-card-border bg-admin-card-bg p-4 shadow-sm sm:rounded-2xl sm:p-6">
          <div className="mb-4 flex items-center justify-between sm:mb-6">
            <Skeleton className="h-5 w-28 rounded sm:h-6 sm:w-48" />
            <Skeleton className="h-3 w-12 shrink-0 rounded sm:h-4 sm:w-16" />
          </div>
          <Skeleton className="h-48 w-full rounded-xl sm:h-64 lg:h-[280px]" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        <div className="min-w-0 overflow-hidden rounded-xl border border-admin-card-border bg-admin-card-bg p-4 shadow-sm sm:rounded-2xl sm:p-6">
          <div className="mb-4 flex items-center justify-between sm:mb-6">
            <Skeleton className="h-5 w-28 rounded sm:h-6 sm:w-40" />
            <Skeleton className="h-3 w-12 shrink-0 rounded sm:h-4 sm:w-16" />
          </div>
          <div className="space-y-3 sm:space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex min-w-0 items-center gap-2 overflow-hidden rounded-xl border border-admin-card-border p-2 sm:gap-4 sm:p-3"
              >
                <Skeleton className="h-8 w-8 shrink-0 rounded-lg sm:h-10 sm:w-10 sm:rounded-xl" />
                <div className="min-w-0 flex-1 space-y-1.5 sm:space-y-2">
                  <Skeleton className="h-3 w-24 max-w-full rounded sm:h-4 sm:w-36" />
                  <Skeleton className="h-2.5 w-16 rounded sm:h-3 sm:w-24" />
                </div>
                <Skeleton className="h-4 w-10 shrink-0 rounded sm:h-5 sm:w-14" />
                <Skeleton className="hidden h-3 w-12 rounded sm:block sm:w-16" />
              </div>
            ))}
          </div>
        </div>
        <div className="min-w-0 overflow-hidden rounded-xl border border-admin-card-border bg-admin-card-bg p-4 shadow-sm sm:rounded-2xl sm:p-6">
          <div className="mb-4 flex items-center justify-between sm:mb-6">
            <Skeleton className="h-5 w-20 rounded sm:h-6 sm:w-28" />
            <Skeleton className="h-3 w-12 shrink-0 rounded sm:h-4 sm:w-16" />
          </div>
          <div className="space-y-3 sm:space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex min-w-0 items-center gap-2 overflow-hidden rounded-xl border border-admin-card-border p-2 sm:gap-4 sm:p-3"
              >
                <Skeleton className="h-8 w-8 shrink-0 rounded-full sm:h-10 sm:w-10" />
                <div className="min-w-0 flex-1 space-y-1.5 sm:space-y-2">
                  <Skeleton className="h-3 w-20 max-w-full rounded sm:h-4 sm:w-32" />
                  <Skeleton className="h-2.5 w-24 max-w-full rounded sm:h-3 sm:w-40" />
                </div>
                <Skeleton className="h-4 w-10 shrink-0 rounded sm:h-5 sm:w-14" />
                <Skeleton className="hidden h-3 w-12 rounded sm:block sm:w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** List page: toolbar (mobile = search + Filters; desktop = search + selects + Clear) + mobile card list (block lg:hidden) + desktop table (hidden lg:block). */
export function ListPageSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Toolbar: mobile (search + Filters) | desktop (search + selects + Clear) */}
      <div className="rounded-xl border border-admin-card-border bg-admin-card-bg p-4 shadow-sm lg:p-6">
        <div className="flex items-center gap-2 lg:hidden">
          <Skeleton className="h-10 min-w-0 flex-1 rounded-xl" />
          <Skeleton className="h-10 w-[88px] shrink-0 rounded-xl" />
        </div>
        <div className="hidden items-center gap-3 lg:flex">
          <Skeleton className="h-10 min-w-0 flex-1 max-w-sm rounded-xl" />
          <Skeleton className="h-10 w-36 shrink-0 rounded-xl" />
          <Skeleton className="h-10 w-32 shrink-0 rounded-xl" />
          <Skeleton className="h-10 w-40 shrink-0 rounded-xl" />
          <Skeleton className="h-10 w-16 shrink-0 rounded-xl" />
        </div>
      </div>

      {/* List: mobile cards | desktop table */}
      <div className="flex flex-col overflow-hidden rounded-xl border border-admin-card-border bg-admin-card-bg shadow-sm">
        {/* Mobile: card list (block lg:hidden) */}
        <div className="space-y-2 p-4 lg:hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex min-h-[56px] items-center gap-3 rounded-xl border border-admin-card-border bg-admin-card-bg p-2 sm:p-4"
            >
              <Skeleton className="h-20 w-20 shrink-0 rounded-lg" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <Skeleton className="h-4 w-28 rounded sm:w-36" />
                <Skeleton className="h-3 w-20 rounded sm:w-28" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-14 rounded-full" />
                  <Skeleton className="h-5 w-10 rounded" />
                </div>
              </div>
              <Skeleton className="h-5 w-5 shrink-0 rounded" />
            </div>
          ))}
        </div>

        {/* Desktop: table (hidden lg:block) */}
        <div className="hidden overflow-hidden lg:block">
          <div className="border-b border-admin-card-border p-3 sm:p-4">
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-4 w-20 rounded" />
              ))}
            </div>
          </div>
          <div className="divide-y divide-admin-card-border">
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 sm:p-4">
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
          <div className="flex items-center justify-between border-t border-admin-card-border px-2 py-3 sm:px-4">
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
    </div>
  );
}

/** Legacy name: list/table pages. Prefer ListPageSkeleton for new code. */
export function TablePageSkeleton({ rows = 8 }: { rows?: number }) {
  return <ListPageSkeleton rows={rows} />;
}

/** Skeleton matching ReportsView: toolbar (flex-col sm:flex-row) + stats + charts + activity. */
export function ReportsSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col gap-3 rounded-xl border border-admin-card-border bg-admin-card-bg p-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 sm:p-4">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:flex-initial">
          <Skeleton className="h-9 w-full rounded-md sm:w-[160px]" />
        </div>
        <div className="flex w-full flex-row items-center gap-2 sm:ml-auto sm:w-auto">
          <Skeleton className="h-9 min-h-[44px] w-1/2 rounded-lg sm:w-24" />
          <Skeleton className="h-9 min-h-[44px] w-1/2 rounded-lg sm:w-20" />
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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-admin-card-border bg-admin-card-bg p-6 shadow-sm">
          <Skeleton className="mb-6 h-6 w-44 rounded" />
          <Skeleton className="h-[260px] w-full rounded-xl" />
        </div>
        <div className="rounded-xl border border-admin-card-border bg-admin-card-bg p-6 shadow-sm">
          <Skeleton className="mb-6 h-6 w-36 rounded" />
          <Skeleton className="h-[260px] w-full rounded-xl" />
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
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-48 rounded" />
                <Skeleton className="h-3 w-32 rounded" />
              </div>
              <Skeleton className="h-6 w-16 shrink-0 rounded" />
              <Skeleton className="h-4 w-20 shrink-0 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Skeleton for property detail page: hero, location/specs grid, amenities & highlights, description, assets, SEO, timeline. */
export function PropertyDetailSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-in fade-in duration-200">
      {/* Hero */}
      <div className={CARD_CLASS_PROPERTY}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
          <Skeleton className="h-32 w-full min-w-0 rounded-lg sm:h-44 sm:w-52 lg:h-48 lg:w-64" />
          <div className="min-w-0 flex-1 space-y-2 sm:space-y-3">
            <Skeleton className="h-6 w-full max-w-md rounded" />
            <Skeleton className="h-3.5 w-32 rounded" />
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-7 w-28 rounded sm:h-8" />
            <Skeleton className="h-4 w-full max-w-md rounded" />
            <Skeleton className="h-4 w-[90%] max-w-md rounded" />
          </div>
        </div>
      </div>
      {/* Location + Specifications grid */}
      <div className="grid min-w-0 gap-4 sm:gap-6 lg:grid-cols-2">
        <div className={CARD_CLASS_PROPERTY}>
          <Skeleton className="h-4 w-24 rounded" />
          <div className="mt-2 space-y-1 sm:mt-3 sm:space-y-2">
            <Skeleton className="h-3 w-14 rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="h-4 w-40 rounded" />
          </div>
          <div className="mt-3 sm:mt-4">
            <Skeleton className="h-3 w-10 rounded" />
            <Skeleton className="mt-1 aspect-video min-h-[140px] w-full min-w-0 rounded-lg sm:min-h-[160px]" />
          </div>
        </div>
        <div className={CARD_CLASS_PROPERTY}>
          <Skeleton className="h-4 w-28 rounded" />
          <div className="mt-2 grid grid-cols-2 gap-2 sm:mt-3 sm:gap-3 sm:grid-cols-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <Skeleton key={i} className="h-14 rounded-lg sm:h-16" />
            ))}
          </div>
        </div>
      </div>
      {/* Amenities & Highlights */}
      <div className={CARD_CLASS_PROPERTY}>
        <Skeleton className="h-4 w-40 rounded" />
        <div className="mt-2 space-y-3 sm:mt-3 sm:space-y-4">
          <div>
            <Skeleton className="h-3 w-20 rounded" />
            <div className="mt-1 flex flex-wrap gap-1.5 sm:gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-5 w-14 rounded-lg" />
              ))}
            </div>
          </div>
          <div>
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="mt-1 h-4 w-full rounded" />
            <Skeleton className="mt-1 h-4 w-[85%] rounded" />
          </div>
        </div>
      </div>
      {/* Description */}
      <div className={CARD_CLASS_PROPERTY}>
        <Skeleton className="h-4 w-24 rounded" />
        <div className="mt-2 space-y-2 sm:mt-3">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-[95%] max-w-full rounded" />
          <Skeleton className="h-4 w-[70%] max-w-full rounded" />
        </div>
      </div>
      {/* Assets */}
      <div className={CARD_CLASS_PROPERTY}>
        <Skeleton className="h-4 w-16 rounded" />
        <div className="mt-2 space-y-3 sm:mt-3 sm:space-y-4">
          <div>
            <Skeleton className="h-3 w-24 rounded" />
            <Skeleton className="mt-1 h-40 w-full max-w-md rounded-lg sm:h-48" />
          </div>
          <div>
            <Skeleton className="h-3 w-14 rounded" />
            <div className="mt-1.5 grid grid-cols-2 gap-1.5 sm:mt-2 sm:gap-2 sm:grid-cols-3 md:grid-cols-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* SEO & Meta */}
      <div className={CARD_CLASS_PROPERTY}>
        <Skeleton className="h-4 w-28 rounded" />
        <div className="mt-2 space-y-2 sm:mt-3 sm:space-y-3">
          <div>
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="mt-0.5 h-4 w-64 rounded" />
          </div>
          <div>
            <Skeleton className="h-3 w-28 rounded" />
            <Skeleton className="mt-0.5 h-4 w-full max-w-md rounded" />
          </div>
          <div>
            <Skeleton className="h-3 w-24 rounded" />
            <Skeleton className="mt-0.5 h-4 w-48 rounded" />
          </div>
          <div>
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="mt-1 h-24 w-48 rounded-lg" />
          </div>
        </div>
      </div>
      {/* Timeline */}
      <div className={CARD_CLASS_PROPERTY}>
        <Skeleton className="h-4 w-20 rounded" />
        <div className="mt-2 grid grid-cols-1 gap-2 sm:mt-3 sm:gap-3 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 rounded-lg sm:h-[4.5rem]" />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Skeleton for property edit page (sheet/form): header + form card. */
export function PropertyEditSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="rounded-xl border border-admin-card-border bg-admin-card-bg p-4 shadow-sm sm:p-5 lg:p-6">
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
