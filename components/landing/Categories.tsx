"use client";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { Category } from "@/types";

function CategoryCard({ category }: { category: Category }) {
  return (
    <a
      href="#properties"
      className="group flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-slate-100 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-2xl group-hover:bg-primary/20 transition-colors">
        {category.icon ?? "🏠"}
      </div>
      <p className="font-semibold text-sm text-slate-700 group-hover:text-primary transition-colors text-center">
        {category.name}
      </p>
    </a>
  );
}

export function CategoriesSection() {
  const { data, isLoading } = useQuery({
    queryKey: ["public-categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      return json.data as Category[];
    },
    staleTime: 10 * 60 * 1000,
  });

  return (
    <section id="categories" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">
            Browse by type
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Property Categories
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Find exactly what you&apos;re looking for by exploring our curated property categories.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-slate-50">
                <Skeleton className="h-14 w-14 rounded-xl" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))
            : (data ?? []).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
        </div>
      </div>
    </section>
  );
}
