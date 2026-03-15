"use client";

import {
  MapPin,
  Home,
  Banknote,
  Search,
  Bed,
  Bath,
  Maximize2,
  Heart,
  AlertCircle,
  SearchX,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { formatPrice, getPriceTypeLabel } from "@/lib/utils";
import type { PropertyWithRelations } from "@/types";
import type { Category } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { FilterSelect } from "@/components/ui/filter-select";
import { usePublicCategories } from "@/hooks/useCategories";
import { useInfinitePublicProperties } from "@/hooks/useProperties";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "views", label: "Most Viewed" },
] as const;

const PRICE_RANGES = [
  { value: "", label: "Any Price", min: undefined, max: undefined },
  { value: "0-50l", label: "Up to ₹50 L", min: 0, max: 50_00_000 },
  {
    value: "50l-1cr",
    label: "₹50 L – ₹1 Cr",
    min: 50_00_000,
    max: 1_00_00_000,
  },
  {
    value: "1cr-5cr",
    label: "₹1 Cr – ₹5 Cr",
    min: 1_00_00_000,
    max: 5_00_00_000,
  },
  { value: "5cr+", label: "₹5 Cr +", min: 5_00_00_000, max: undefined },
];

function CardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-border bg-white">
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
  );
}

function PropertyCard({
  property,
  index,
}: {
  property: PropertyWithRelations;
  index: number;
}) {
  const location = [property.city, property.state].filter(Boolean).join(", ");
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: Math.min((index % 3) * 0.06, 0.15),
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        href={`/properties/${property.slug}`}
        className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 rounded-2xl"
      >
        <article className="h-full flex flex-col rounded-2xl overflow-hidden bg-white border border-border hover:border-brand-gold/20 hover:shadow-lg transition-all duration-300">
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            {property.cover_image_url ? (
              <Image
                src={property.cover_image_url}
                alt={property.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized={
                  property.cover_image_url.startsWith("http") &&
                  !property.cover_image_url.includes(
                    process.env.NEXT_PUBLIC_VERCEL_URL ?? "",
                  )
                }
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground text-4xl">
                <Home className="h-16 w-16" />
              </div>
            )}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              <span className="bg-brand-charcoal/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
                {property.type === "sale" ? "For Sale" : "For Rent"}
              </span>
              {property.is_featured && (
                <span className="bg-brand-gold text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                  Featured
                </span>
              )}
            </div>
            <span className="absolute bottom-3 right-3 bg-brand-gold text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
              {formatPrice(property.price)}
            </span>
            <span className="absolute bottom-3 left-3 text-[10px] text-white/90 font-medium">
              {getPriceTypeLabel(property.price_type)}
            </span>
            <button
              type="button"
              onClick={(e) => e.preventDefault()}
              className="absolute top-3 right-3 min-h-[44px] min-w-[44px] flex items-center justify-center p-2 bg-white/90 rounded-full text-foreground hover:bg-white hover:text-brand-charcoal transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold"
              aria-label="Save to favourites"
            >
              <Heart className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 sm:p-5 flex flex-col flex-1">
            <h3 className="font-semibold text-brand-charcoal text-base sm:text-[15px] leading-snug mb-1 group-hover:text-brand-gold transition-colors line-clamp-2">
              {property.title}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span className="truncate">
                {location || property.address || "—"}
              </span>
            </div>
            {property.short_description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                {property.short_description}
              </p>
            )}
            {Array.isArray(property.amenities) &&
              property.amenities.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {property.amenities.slice(0, 4).map((a) => (
                    <span
                      key={a}
                      className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-muted/80 px-2 py-0.5 rounded-md"
                    >
                      <Sparkles className="h-2.5 w-2.5" />
                      {a}
                    </span>
                  ))}
                  {property.amenities.length > 4 && (
                    <span className="text-[10px] text-muted-foreground">
                      +{property.amenities.length - 4}
                    </span>
                  )}
                </div>
              )}
            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-3 mt-auto border-t border-border">
              {property.area_sqft != null && (
                <span className="flex items-center gap-1.5">
                  <Maximize2 className="h-3.5 w-3.5" aria-hidden />
                  {property.area_sqft.toLocaleString("en-IN")} sqft
                </span>
              )}
              {property.bedrooms != null && (
                <span className="flex items-center gap-1.5">
                  <Bed className="h-3.5 w-3.5" aria-hidden />
                  {property.bedrooms} beds
                </span>
              )}
              {property.bathrooms != null && (
                <span className="flex items-center gap-1.5">
                  <Bath className="h-3.5 w-3.5" aria-hidden />
                  {property.bathrooms} baths
                </span>
              )}
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

export function PropertiesClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const type = searchParams.get("type") ?? "";
  const category_id = searchParams.get("category_id") ?? "";
  const priceRange = searchParams.get("price") ?? "";
  const bedrooms = searchParams.get("bedrooms") ?? "";
  const sort =
    (searchParams.get("sort") as (typeof SORT_OPTIONS)[number]["value"]) ??
    "newest";
  const search = searchParams.get("search") ?? "";
  const city = searchParams.get("city") ?? "";
  const [searchInput, setSearchInput] = useState(search);
  const [cityInput, setCityInput] = useState(city);

  useEffect(() => {
    setSearchInput(search);
    setCityInput(city);
  }, [search, city]);

  const priceRangeOption = PRICE_RANGES.find((r) => r.value === priceRange);
  const min_price = priceRangeOption?.min;
  const max_price = priceRangeOption?.max;

  const { data: categories = [] } = usePublicCategories();

  const infiniteFilters: Omit<
    import("@/hooks/useProperties").PublicPropertyFilters,
    "page" | "limit"
  > = {
    sort,
    type: type === "sale" || type === "rent" ? type : undefined,
    category_id: category_id || undefined,
    city: city.trim() || undefined,
    min_price,
    max_price,
    bedrooms: bedrooms ? Number(bedrooms) : undefined,
    search: search.trim() || undefined,
    status: "active",
  };

  const {
    data: infiniteData,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfinitePublicProperties(infiniteFilters);

  const properties = infiniteData?.pages.flatMap((p) => p.data) ?? [];
  const total = infiniteData?.pages[0]?.total ?? 0;

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el || !hasNextPage || isFetchingNextPage) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) fetchNextPage();
      },
      { rootMargin: "200px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const updateParams = useCallback(
    (updates: Record<string, string | number | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === "" || value === null) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      }
      router.push(`/properties?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  // Auto-trigger search (debounced, no button)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const updateParamsRef = useRef(updateParams);
  updateParamsRef.current = updateParams;
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      updateParamsRef.current({
        search: searchInput.trim() || undefined,
        city: cityInput.trim() || undefined,
      });
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchInput, cityInput]);

  const errorMessage =
    isError && error
      ? error instanceof Error
        ? error.message
        : "Failed to load properties"
      : null;
  const hasFilters =
    type || search || city || category_id || priceRange || bedrooms;
  const filterCount = [
    type,
    city.trim(),
    category_id,
    priceRange,
    bedrooms,
    search.trim(),
  ].filter(Boolean).length;

  const clearFilters = useCallback(() => {
    router.push("/properties", { scroll: false });
  }, [router]);

  return (
    <>
      {/* Filters: search + filters side by side, badge count, clear button, less gap below */}
      <section className="pt-8 pb-6 sm:pt-10 sm:pb-8 bg-white border-b border-border">
        <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-muted rounded-2xl p-4 sm:p-5 border border-border"
          >
            {/* Mobile: search + Filters button with count badge + Clear */}
            <div className="flex flex-col gap-3 md:hidden">
              <div className="flex gap-2">
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="search"
                    placeholder="Search properties..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full min-h-[48px] pl-10 pr-4 py-3 text-base bg-white border border-border rounded-xl text-brand-charcoal placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all"
                    aria-label="Search properties"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setFilterSheetOpen(true)}
                  className="relative flex items-center justify-center gap-2 min-h-[48px] px-4 bg-white border border-border rounded-xl text-brand-charcoal font-medium hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 shrink-0"
                  aria-label={
                    filterCount
                      ? `Filters (${filterCount} active)`
                      : "Open filters"
                  }
                >
                  <SlidersHorizontal className="h-4 w-4" aria-hidden />
                  Filters
                  {filterCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-brand-gold text-white text-xs font-bold">
                      {filterCount > 9 ? "9+" : filterCount}
                    </span>
                  )}
                </button>
              </div>
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="min-h-[44px] w-full rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-brand-charcoal hover:bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Desktop: search + filters in one row + badge + Clear */}
            <div className="hidden md:flex flex-wrap items-end gap-3">
              <div className="flex flex-col gap-1.5 min-w-[200px] flex-1 max-w-md">
                <label className="block text-sm font-medium text-foreground">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="search"
                    placeholder="Search properties..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full min-h-[48px] pl-10 pr-4 py-3 text-base bg-white border border-border rounded-xl text-brand-charcoal placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5 w-[160px]">
                <label className="block text-sm font-medium text-foreground">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    placeholder="City"
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    className="w-full min-h-[48px] pl-10 pr-4 py-3 text-base bg-white border border-border rounded-xl text-brand-charcoal placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all"
                  />
                </div>
              </div>
              <div className="w-[130px]">
                <FilterSelect
                  label="Type"
                  value={type}
                  onValueChange={(v) => updateParams({ type: v || undefined })}
                  options={[
                    { value: "", label: "All" },
                    { value: "sale", label: "Sale" },
                    { value: "rent", label: "Rent" },
                  ]}
                  icon={<Home className="h-4 w-4" />}
                />
              </div>
              <div className="w-[160px]">
                <FilterSelect
                  label="Category"
                  value={category_id}
                  onValueChange={(v) =>
                    updateParams({ category_id: v || undefined })
                  }
                  options={[
                    { value: "", label: "All" },
                    ...categories.map((c) => ({ value: c.id, label: c.name })),
                  ]}
                  icon={<Home className="h-4 w-4" />}
                />
              </div>
              <div className="w-[140px]">
                <FilterSelect
                  label="Price"
                  value={priceRange}
                  onValueChange={(v) => updateParams({ price: v || undefined })}
                  options={PRICE_RANGES.map((r) => ({
                    value: r.value,
                    label: r.label,
                  }))}
                  icon={<Banknote className="h-4 w-4" />}
                />
              </div>
              {hasFilters && (
                <>
                  <div className="flex items-end h-[48px]">
                    <span
                      className="flex min-w-[22px] h-[22px] items-center justify-center rounded-full bg-brand-gold text-white text-xs font-bold"
                      title={`${filterCount} filter${filterCount !== 1 ? "s" : ""} active`}
                    >
                      {filterCount > 9 ? "9+" : filterCount}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="min-h-[48px] px-4 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-brand-charcoal hover:bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                  >
                    Clear
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mobile filter bottom sheet */}
      <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-2xl max-h-[85vh] overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-1.5">
              <label className="block text-sm font-medium text-foreground">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. Mumbai, Maharashtra"
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  className="w-full min-h-[48px] pl-10 pr-4 py-3 text-base bg-muted border border-border rounded-xl text-brand-charcoal placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                />
              </div>
            </div>
            <FilterSelect
              label="Type"
              value={type}
              onValueChange={(v) => updateParams({ type: v || undefined })}
              options={[
                { value: "", label: "All Types" },
                { value: "sale", label: "For Sale" },
                { value: "rent", label: "For Rent" },
              ]}
              icon={<Home className="h-4 w-4" />}
              triggerClassName="bg-muted"
            />
            <FilterSelect
              label="Category"
              value={category_id}
              onValueChange={(v) =>
                updateParams({ category_id: v || undefined })
              }
              options={[
                { value: "", label: "All Categories" },
                ...categories.map((c) => ({ value: c.id, label: c.name })),
              ]}
              icon={<Home className="h-4 w-4" />}
              triggerClassName="bg-muted"
            />
            <FilterSelect
              label="Price Range"
              value={priceRange}
              onValueChange={(v) => updateParams({ price: v || undefined })}
              options={PRICE_RANGES.map((r) => ({
                value: r.value,
                label: r.label,
              }))}
              icon={<Banknote className="h-4 w-4" />}
              triggerClassName="bg-muted"
            />
          </div>
          <SheetFooter className="flex-row gap-3 sm:gap-3">
            {hasFilters && (
              <button
                type="button"
                onClick={() => {
                  clearFilters();
                  setFilterSheetOpen(false);
                }}
                className="min-h-[48px] px-6 rounded-xl border border-border text-muted-foreground font-semibold hover:text-brand-charcoal hover:bg-muted focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2"
              >
                Clear all
              </button>
            )}
            <button
              type="button"
              onClick={() => setFilterSheetOpen(false)}
              className="min-h-[48px] px-6 bg-brand-charcoal text-white font-semibold rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2"
            >
              Done
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Results (reduced top padding so no large gap below filters) */}
      <section className="pt-8 pb-16 sm:pt-10 sm:pb-20 lg:pt-12 lg:pb-24 bg-muted/50">
        <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
          {isLoading && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sm:mb-10">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-10 w-32" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-14">
                {Array.from({ length: 9 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            </>
          )}

          {!isLoading && errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-16 sm:py-24 text-center"
            >
              <div className="rounded-full bg-destructive/10 p-4 mb-4">
                <AlertCircle
                  className="h-10 w-10 text-destructive"
                  aria-hidden
                />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Failed to load properties
              </h2>
              <p className="text-muted-foreground text-base max-w-md mb-6">
                {errorMessage}
              </p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 rounded-xl bg-brand-charcoal text-white font-semibold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2"
              >
                Try again
              </button>
            </motion.div>
          )}

          {!isLoading && !errorMessage && properties.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-16 sm:py-24 text-center"
            >
              <div className="rounded-full bg-muted p-4 mb-4">
                <SearchX
                  className="h-10 w-10 text-muted-foreground"
                  aria-hidden
                />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                No properties found
              </h2>
              <p className="text-muted-foreground text-base max-w-md mb-6">
                {hasFilters
                  ? "Try adjusting your filters or search to see more results."
                  : "There are no properties listed yet. Check back later."}
              </p>
              {hasFilters && (
                <button
                  type="button"
                  onClick={() => router.push("/properties")}
                  className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-muted focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2"
                >
                  Clear filters
                </button>
              )}
            </motion.div>
          )}

          {!isLoading && !errorMessage && properties.length > 0 && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sm:mb-10">
                <p className="text-muted-foreground text-base">
                  Showing{" "}
                  <span className="font-semibold text-brand-charcoal">
                    {properties.length} of {total}
                  </span>{" "}
                  properties
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Sort by:</span>
                  <FilterSelect
                    value={sort}
                    onValueChange={(v) =>
                      updateParams({
                        sort: v as (typeof SORT_OPTIONS)[number]["value"],
                      })
                    }
                    options={SORT_OPTIONS.map((o) => ({
                      value: o.value,
                      label: o.label,
                    }))}
                    placeholder="Sort"
                    triggerClassName="min-h-[44px] w-auto min-w-[160px] border-0 bg-transparent font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-14">
                {properties.map((property, index) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    index={index}
                  />
                ))}
              </div>

              <div
                ref={loadMoreRef}
                className="min-h-[24px] flex items-center justify-center py-8"
              >
                {isFetchingNextPage && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="size-4 animate-spin rounded-full border-2 border-brand-gold border-t-transparent" />
                    Loading more…
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
