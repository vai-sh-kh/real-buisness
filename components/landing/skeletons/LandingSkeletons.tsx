import { Skeleton } from "@/components/ui/skeleton";

/** Top bar mimicking Navbar (for use in route loading) */
export function NavbarSkeleton() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-gray-800 dark:bg-gray-950/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
        <Skeleton className="h-8 w-32 rounded" />
        <div className="hidden md:flex items-center gap-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-4 w-16 rounded" />
          ))}
        </div>
        <Skeleton className="h-10 w-24 rounded-lg" />
      </div>
    </header>
  );
}

/** Hero block (dark bg) for about/contact/team */
export function HeroSkeleton() {
  return (
    <section className="bg-black pt-20 pb-24 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
          <div className="space-y-6">
            <Skeleton className="h-3 w-24 rounded bg-white/20" />
            <Skeleton className="h-14 w-full max-w-xl rounded bg-white/10" />
            <Skeleton className="h-14 w-3/4 rounded bg-white/10" />
          </div>
          <div className="lg:max-w-xs space-y-3">
            <Skeleton className="h-4 w-full rounded bg-white/10" />
            <Skeleton className="h-4 w-full rounded bg-white/10" />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Home page hero (full-width) */
export function HomeHeroSkeleton() {
  return (
    <section className="relative min-h-[85vh] flex items-center px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto w-full">
        <div className="max-w-2xl space-y-6">
          <Skeleton className="h-4 w-32 rounded bg-white/20" />
          <Skeleton className="h-16 w-full rounded bg-white/10" />
          <Skeleton className="h-16 w-4/5 rounded bg-white/10" />
          <div className="flex gap-4 pt-4">
            <Skeleton className="h-12 w-36 rounded-full bg-white/20" />
            <Skeleton className="h-12 w-36 rounded-full bg-white/10" />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Two-column section with image left + text (about story) */
export function TwoColumnSectionSkeleton() {
  return (
    <section className="py-24 bg-white px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-10 w-3/4 rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-2/3 rounded" />
            <Skeleton className="h-10 w-32 rounded-full mt-6" />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Stats row (4 columns) */
export function StatsRowSkeleton() {
  return (
    <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center space-y-2">
              <Skeleton className="h-12 w-20 mx-auto rounded" />
              <Skeleton className="h-4 w-24 mx-auto rounded" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Values grid (about page) */
export function ValuesGridSkeleton() {
  return (
    <section className="py-24 bg-white px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14 space-y-3">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-12 w-96 max-w-full rounded" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="pt-8 border-t border-gray-200 space-y-3">
              <Skeleton className="h-3 w-8 rounded" />
              <Skeleton className="h-6 w-48 rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-2/3 rounded" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Contact: left info + right form */
export function ContactPageSkeleton() {
  return (
    <>
      <NavbarSkeleton />
      <HeroSkeleton />
      <section className="py-20 bg-white px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-20">
            <div className="lg:col-span-2 space-y-8">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-12 w-3/4 rounded" />
              <div className="space-y-7">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-3 w-24 rounded" />
                      <Skeleton className="h-4 w-full rounded" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-10 border-t border-gray-100 space-y-4">
                <Skeleton className="h-3 w-20 rounded" />
                <div className="flex gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-9 w-9 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-3 space-y-4">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-10 w-28 rounded-lg" />
            </div>
          </div>
        </div>
      </section>
      <section className="h-80 bg-gray-100">
        <Skeleton className="h-full w-full rounded-none" />
      </section>
      <FooterSkeleton />
    </>
  );
}

/** Team grid (cards with image + text) */
export function TeamGridSkeleton() {
  return (
    <>
      <NavbarSkeleton />
      <section className="bg-[#f8f8f6] pt-20 pb-16 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="space-y-4">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-16 w-full max-w-xl rounded" />
              <Skeleton className="h-16 w-4/5 rounded" />
            </div>
            <div className="lg:max-w-xs space-y-3">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-10 w-36 rounded-full" />
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-white px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="space-y-5">
                <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-px w-full rounded" />
                  <Skeleton className="h-3 w-28 rounded" />
                  <Skeleton className="h-6 w-32 rounded" />
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-2/3 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-black px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <Skeleton className="h-10 w-72 rounded bg-white/10" />
            <Skeleton className="h-4 w-96 max-w-full rounded bg-white/10" />
          </div>
          <Skeleton className="h-12 w-32 rounded-full bg-white/20" />
        </div>
      </section>
      <FooterSkeleton />
    </>
  );
}

/** Footer strip skeleton */
export function FooterSkeleton() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 px-4 sm:px-6 lg:px-10 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <Skeleton className="h-8 w-40 rounded" />
          <div className="flex gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-4 w-20 rounded" />
            ))}
          </div>
        </div>
        <Skeleton className="mt-8 h-4 w-64 rounded" />
      </div>
    </footer>
  );
}

/** Home page skeleton (hero + section blocks) */
export function HomePageSkeleton() {
  return (
    <>
      <NavbarSkeleton />
      <main>
        <section className="relative min-h-[85vh] flex items-center px-4 sm:px-6 lg:px-10 bg-gray-950">
          <div className="max-w-7xl mx-auto w-full">
            <div className="max-w-2xl space-y-6">
              <Skeleton className="h-4 w-32 rounded bg-white/20" />
              <Skeleton className="h-16 w-full rounded bg-white/10" />
              <Skeleton className="h-16 w-4/5 rounded bg-white/10" />
              <div className="flex gap-4 pt-4">
                <Skeleton className="h-12 w-36 rounded-full bg-white/20" />
                <Skeleton className="h-12 w-36 rounded-full bg-white/10" />
              </div>
            </div>
          </div>
        </section>
        <section className="py-16 px-4 sm:px-6 lg:px-10 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <Skeleton className="h-6 w-40 rounded" />
                  <Skeleton className="h-4 w-full rounded" />
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-20 px-4 sm:px-6 lg:px-10 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Skeleton className="h-10 w-64 mb-10 rounded" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i}>
                  <Skeleton className="aspect-[4/3] w-full rounded-xl mb-4" />
                  <Skeleton className="h-5 w-3/4 mb-2 rounded" />
                  <Skeleton className="h-3.5 w-1/2 rounded" />
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-20 px-4 sm:px-6 lg:px-10 bg-white">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
            <Skeleton className="h-12 w-96 max-w-full rounded" />
            <Skeleton className="h-12 w-40 rounded-full" />
          </div>
        </section>
      </main>
      <FooterSkeleton />
    </>
  );
}

/** About page full skeleton */
export function AboutPageSkeleton() {
  return (
    <>
      <NavbarSkeleton />
      <HeroSkeleton />
      <TwoColumnSectionSkeleton />
      <StatsRowSkeleton />
      <ValuesGridSkeleton />
      <section className="py-24 bg-[#0f0f0f] px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 space-y-3">
            <Skeleton className="h-4 w-24 rounded bg-white/20" />
            <Skeleton className="h-12 w-64 rounded bg-white/10" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="pr-8 pb-8 border-b lg:border-b-0 lg:border-r border-white/10 last:border-0 space-y-4"
              >
                <Skeleton className="h-3 w-12 rounded bg-white/20" />
                <Skeleton className="h-px w-12 rounded bg-white/10" />
                <Skeleton className="h-6 w-24 rounded bg-white/10" />
                <Skeleton className="h-4 w-full rounded bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-white px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <Skeleton className="h-10 w-96 max-w-full mx-auto rounded" />
          <Skeleton className="h-4 w-80 max-w-full mx-auto rounded" />
          <Skeleton className="h-12 w-40 mx-auto rounded-full" />
        </div>
      </section>
    </>
  );
}
