import { Suspense } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-24">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="aspect-[4/3] w-full rounded-xl mb-4" />
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-3.5 w-1/2 mb-3" />
            <Skeleton className="h-3.5 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <Suspense fallback={<PropertiesLoading />}>
          <PropertiesClient />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
