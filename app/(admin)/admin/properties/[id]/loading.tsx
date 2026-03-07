import { PageHeaderSkeleton } from "@/components/admin/skeletons/AdminPageSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

const CARD_CLASS =
  "rounded-xl border border-admin-card-border bg-admin-card-bg p-4 shadow-sm sm:p-6";

export default function PropertyDetailLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200 px-2 pt-6 pb-4 sm:px-6 lg:px-8">
      <PageHeaderSkeleton />
      <div className={CARD_CLASS}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <Skeleton className="h-40 w-full rounded-xl sm:h-48 sm:w-64" />
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
            <Skeleton className="h-8 w-32 rounded" />
            <Skeleton className="h-4 w-full max-w-md rounded" />
          </div>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className={CARD_CLASS}>
          <Skeleton className="mb-3 h-4 w-24 rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="mt-2 h-4 w-3/4 rounded" />
        </div>
        <div className={CARD_CLASS}>
          <Skeleton className="mb-3 h-4 w-28 rounded" />
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
      <div className={CARD_CLASS}>
        <Skeleton className="mb-3 h-4 w-20 rounded" />
        <Skeleton className="h-20 w-full rounded" />
      </div>
    </div>
  );
}
