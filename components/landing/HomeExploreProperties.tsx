"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Bed, Bath, Maximize2, MapPin, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { PropertyWithRelations } from "@/types";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

type TabType = "all" | "sale" | "rent";

function PropertyCard({
  property,
  index,
}: {
  property: PropertyWithRelations;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.06, 0.2),
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        href={`/properties/${property.slug}`}
        className="group block h-full rounded-2xl overflow-hidden bg-white border border-border hover:border-brand-gold/30 hover:shadow-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {property.cover_image_url ? (
            <Image
              src={property.cover_image_url}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized={
                property.cover_image_url.startsWith("http") &&
                !property.cover_image_url.includes(
                  process.env.NEXT_PUBLIC_VERCEL_URL ?? ""
                )
              }
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-4xl">
              🏠
            </div>
          )}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <span className="bg-brand-charcoal/90 text-white text-xs font-medium px-3 py-1.5 rounded-full">
              {property.type === "sale" ? "For Sale" : "For Rent"}
            </span>
            {property.is_featured && (
              <span className="bg-brand-gold text-white text-xs font-bold px-3 py-1.5 rounded-full">
                Featured
              </span>
            )}
          </div>
          <div className="absolute bottom-3 right-3">
            <span className="bg-brand-gold text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
              {formatPrice(property.price ?? 0)}
            </span>
          </div>
        </div>
        <div className="p-4 sm:p-5">
          <h3 className="font-semibold text-brand-charcoal text-base leading-snug mb-2 group-hover:text-brand-gold transition-colors line-clamp-2">
            {property.title}
          </h3>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {property.city}
              {property.state ? `, ${property.state}` : ""}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-3 border-t border-border">
            {property.bedrooms != null && (
              <span className="flex items-center gap-1.5">
                <Bed className="h-3.5 w-3.5" />
                {property.bedrooms} beds
              </span>
            )}
            {property.bathrooms != null && (
              <span className="flex items-center gap-1.5">
                <Bath className="h-3.5 w-3.5" />
                {property.bathrooms} baths
              </span>
            )}
            {property.area_sqft != null && (
              <span className="flex items-center gap-1.5">
                <Maximize2 className="h-3.5 w-3.5" />
                {property.area_sqft} sqft
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-border bg-white">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-4 sm:p-5 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3.5 w-1/2" />
        <Skeleton className="h-3.5 w-2/3 pt-3 border-t border-border" />
      </div>
    </div>
  );
}

const TABS: { value: TabType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "sale", label: "For Sale" },
  { value: "rent", label: "For Rent" },
];

export function HomeExploreProperties() {
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const typeParam =
    activeTab === "all" ? undefined : activeTab === "sale" ? "sale" : "rent";
  const { data, isLoading } = useQuery({
    queryKey: ["properties", "home", activeTab],
    queryFn: async () => {
      const params = new URLSearchParams({
        status: "active",
        limit: "6",
      });
      if (typeParam) params.set("type", typeParam);
      const res = await fetch(`/api/properties?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch properties");
      const json = await res.json();
      return (json.data ?? []) as PropertyWithRelations[];
    },
    staleTime: 2 * 60 * 1000,
  });

  const properties = data ?? [];

  return (
    <section
      className="py-12 sm:py-16 md:py-20 lg:py-24 bg-muted/30"
      aria-labelledby="explore-properties-heading"
    >
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
        <div className="flex flex-col gap-6 mb-8 sm:mb-10 md:mb-12">
          <div className="min-w-0">
            <span className="text-brand-gold font-semibold tracking-widest uppercase text-xs">
              Explore
            </span>
            <h2
              id="explore-properties-heading"
              className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-brand-charcoal mt-1"
            >
              Latest properties
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mt-2 max-w-xl">
              Browse our handpicked listings for sale and rent. Find your next
              home or investment.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:justify-end">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  "min-h-[48px] sm:min-h-[44px] px-4 sm:px-5 rounded-xl text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2",
                  activeTab === tab.value
                    ? "bg-brand-charcoal text-white"
                    : "bg-white border border-border text-muted-foreground hover:border-brand-gold/50 hover:text-brand-charcoal"
                )}
              >
                {tab.label}
              </button>
            ))}
            <Link
              href="/properties"
              className="min-h-[48px] sm:min-h-[44px] px-4 sm:px-5 rounded-xl bg-brand-gold text-white text-sm font-semibold inline-flex items-center gap-2 hover:bg-brand-gold/90 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 shrink-0"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))
            : properties.length > 0
              ? properties.map((property, i) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    index={i}
                  />
                ))
              : null}
        </div>

        {!isLoading && properties.length === 0 && (
          <div className="text-center py-12 rounded-2xl bg-white border border-border">
            <p className="text-muted-foreground">
              No properties in this category right now.
            </p>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 mt-4 text-brand-gold font-semibold hover:underline"
            >
              View all properties
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        <div className="mt-8 sm:mt-10 text-center">
          <Link
            href="/properties"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto min-h-[48px] px-6 sm:px-8 rounded-xl border-2 border-brand-charcoal text-brand-charcoal font-semibold hover:bg-brand-charcoal hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2"
          >
            Browse all properties
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
