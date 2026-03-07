import { Skeleton } from "@/components/ui/skeleton";

export default function LoginLoading() {
  return (
    <div className="min-h-screen flex bg-white">
      {/* Desktop: split layout skeleton */}
      <div className="hidden lg:flex min-h-screen w-full">
        <div className="flex lg:w-1/2 relative overflow-hidden bg-brand-charcoal">
          <div className="absolute inset-0 bg-gray-900/50" />
          <div className="relative z-10 flex flex-col justify-between p-14 w-full">
            <div className="flex items-center gap-3">
              <Skeleton className="h-14 w-14 rounded-lg bg-white/10" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-24 rounded bg-white/10" />
                <Skeleton className="h-4 w-20 rounded bg-white/10" />
              </div>
            </div>
            <div className="space-y-10">
              <div className="space-y-6">
                <Skeleton className="h-6 w-28 rounded-full bg-white/10" />
                <Skeleton className="h-12 w-72 max-w-full rounded bg-white/10" />
                <Skeleton className="h-12 w-64 rounded bg-white/10" />
                <Skeleton className="h-4 w-96 max-w-full rounded bg-white/10" />
              </div>
              <ul className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <li key={i} className="flex items-start gap-4">
                    <Skeleton className="h-8 w-8 shrink-0 rounded-lg bg-white/10" />
                    <Skeleton className="h-4 w-64 rounded bg-white/10" />
                  </li>
                ))}
              </ul>
            </div>
            <Skeleton className="h-4 w-48 rounded bg-white/10" />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-gradient-to-b from-gray-50/80 to-white">
          <div className="w-full max-w-[400px] space-y-10">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-4 w-20 rounded" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-9 w-24 rounded" />
              <Skeleton className="h-4 w-72 max-w-full rounded" />
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
            <Skeleton className="h-4 w-48 mx-auto rounded" />
          </div>
        </div>
      </div>
      {/* Mobile skeleton */}
      <div className="lg:hidden min-h-[100dvh] w-full flex flex-col bg-gradient-to-b from-brand-charcoal via-[#252525] to-brand-charcoal">
        <div className="flex-1 flex flex-col justify-center px-5 py-8 pb-12">
          <div className="w-full max-w-sm mx-auto space-y-8">
            <div className="text-center">
              <div className="flex justify-center gap-3 mb-4">
                <Skeleton className="h-12 w-12 rounded-lg bg-white/10" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-20 rounded bg-white/10" />
                  <Skeleton className="h-4 w-16 rounded bg-white/10" />
                </div>
              </div>
              <Skeleton className="h-6 w-24 mx-auto rounded-full bg-white/10" />
            </div>
            <div className="rounded-2xl bg-white/95 p-6 space-y-4">
              <Skeleton className="h-7 w-20 rounded" />
              <Skeleton className="h-4 w-48 rounded" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <Skeleton className="h-4 w-24 mx-auto rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
