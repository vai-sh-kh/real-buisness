import { Skeleton } from "@/components/ui/skeleton";

export default function PropertiesLoading() {
  return (
    <>
      {/* Filter skeleton – matches PropertiesClient filter layout */}
      <section className="py-12 sm:py-16 bg-white border-b border-border">
        <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
          <div className="bg-muted rounded-2xl p-4 sm:p-6 border border-border">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
              ))}
              <div className="md:col-span-4 flex flex-col gap-2">
                <Skeleton className="h-4 w-32" />
                <div className="flex gap-2">
                  <Skeleton className="h-12 flex-1 rounded-xl" />
                  <Skeleton className="h-12 w-24 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results skeleton – matches grid and card design */}
      <section className="py-16 sm:py-20 lg:py-24 bg-muted/50">
        <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sm:mb-10">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-10 w-36" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden border border-border bg-white"
              >
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-4 sm:p-5 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3.5 w-1/2" />
                  <div className="flex items-center gap-4 pt-3 border-t border-border">
                    <Skeleton className="h-3.5 w-16" />
                    <Skeleton className="h-3.5 w-14" />
                    <Skeleton className="h-3.5 w-14" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
