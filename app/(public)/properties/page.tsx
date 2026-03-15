import { Suspense } from "react";
import { PropertiesClient } from "@/components/properties/PropertiesClient";
import { Skeleton } from "@/components/ui/skeleton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Properties — The Real Business",
  description:
    "Browse our curated collection of premium properties for sale and rent.",
};

function PropertiesLoading() {
  return (
    <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-16 xl:px-24 py-12 sm:py-16">
      <Skeleton className="h-24 w-full rounded-2xl mb-12" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl overflow-hidden border border-border"
          >
            <Skeleton className="aspect-[4/3] w-full" />
            <div className="p-4 sm:p-5 space-y-3 bg-white">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3.5 w-1/2" />
              <Skeleton className="h-3.5 w-2/3 pt-3 border-t border-border" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<PropertiesLoading />}>
      <PropertiesClient />
    </Suspense>
  );
}
