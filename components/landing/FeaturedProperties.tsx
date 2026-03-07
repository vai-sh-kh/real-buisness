"use client";

import { useRef } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion, useInView } from "framer-motion";
import { Bed, Bath, Maximize2, MapPin, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { PropertyWithRelations } from "@/types";
import { formatPrice } from "@/lib/utils";

const fallbackProperties: Partial<PropertyWithRelations>[] = [
  {
    id: "1",
    title: "Serenity Tower",
    city: "Mumbai",
    state: "Maharashtra",
    price: 340000,
    bedrooms: 3,
    bathrooms: 2,
    area_sqft: 300,
    type: "sale",
    cover_image_url:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=700&q=80",
    slug: "serenity-tower",
  },
  {
    id: "2",
    title: "Island Retreat",
    city: "Goa",
    state: "Goa",
    price: 220000,
    bedrooms: 4,
    bathrooms: 2,
    area_sqft: 250,
    type: "sale",
    cover_image_url:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=700&q=80",
    slug: "island-retreat",
  },
  {
    id: "3",
    title: "Mountain Lodge",
    city: "Bangalore",
    state: "Karnataka",
    price: 500000,
    bedrooms: 4,
    bathrooms: 3,
    area_sqft: 400,
    type: "sale",
    cover_image_url:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=700&q=80",
    slug: "mountain-lodge",
  },
  {
    id: "4",
    title: "Beach Lux",
    city: "Chennai",
    state: "Tamil Nadu",
    price: 296000,
    bedrooms: 3,
    bathrooms: 2,
    area_sqft: 230,
    type: "rent",
    cover_image_url:
      "https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=700&q=80",
    slug: "beach-lux",
  },
  {
    id: "5",
    title: "Eco Retreat",
    city: "Hyderabad",
    state: "Telangana",
    price: 450000,
    bedrooms: 3,
    bathrooms: 2,
    area_sqft: 150,
    type: "rent",
    cover_image_url:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=80",
    slug: "eco-retreat",
  },
  {
    id: "6",
    title: "Azura Villa",
    city: "Pune",
    state: "Maharashtra",
    price: 470000,
    bedrooms: 4,
    bathrooms: 2,
    area_sqft: 400,
    type: "sale",
    cover_image_url:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=700&q=80",
    slug: "azura-villa",
  },
];

function PropertyCard({
  property,
  index,
}: {
  property: Partial<PropertyWithRelations>;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const card = (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay: Math.min((index % 3) * 0.08, 0.2),
      }}
      className="group cursor-pointer h-full flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-100 hover:border-brand-gold/20 hover:shadow-lg transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {property.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={property.cover_image_url}
            alt={property.title ?? ""}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-300 text-4xl">
            🏠
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-brand-charcoal/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
            {property.type === "sale" ? "For Sale" : "For Rent"}
          </span>
        </div>
        <div className="absolute bottom-3 right-3">
          <span className="bg-brand-gold text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
            {formatPrice(property.price ?? 0)}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-brand-charcoal text-base sm:text-[15px] leading-snug mb-1 group-hover:text-brand-gold transition-colors line-clamp-2">
          {property.title}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="truncate">
            {property.city}, {property.state}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 mt-auto border-t border-gray-100">
          {property.area_sqft != null && (
            <span className="flex items-center gap-1.5">
              <Maximize2 className="h-3.5 w-3.5" aria-hidden />
              {property.area_sqft} sqft
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
    </motion.article>
  );

  if (property.slug) {
    return (
      <Link
        href={`/properties/${property.slug}`}
        className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 rounded-2xl"
      >
        {card}
      </Link>
    );
  }
  return card;
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-4 sm:p-5 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3.5 w-1/2" />
        <Skeleton className="h-3.5 w-2/3 pt-3" />
      </div>
    </div>
  );
}

export function FeaturedProperties() {
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, margin: "-60px" });

  const { data, isLoading } = useQuery({
    queryKey: ["featured-properties"],
    queryFn: async () => {
      const res = await fetch("/api/properties?status=active&limit=6");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      return json.data as PropertyWithRelations[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const properties =
    data && data.length > 0
      ? data
      : (fallbackProperties as Partial<PropertyWithRelations>[]);

  return (
    <section
      id="properties"
      className="py-16 sm:py-20 lg:py-24 bg-gray-50/50"
      aria-labelledby="featured-properties-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div
          ref={headRef}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-12"
        >
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={headInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4 }}
              className="text-xs sm:text-sm text-brand-gold/80 tracking-widest"
            >
              /Discover
            </motion.span>
            <motion.h2
              id="featured-properties-heading"
              initial={{ opacity: 0, y: 16 }}
              animate={headInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.06,
              }}
              className="font-heading text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-brand-charcoal mt-1"
            >
              New Properties
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={headInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-charcoal hover:text-brand-gold transition-colors min-h-[44px] sm:min-h-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 rounded-lg px-1"
            >
              View all <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
            : properties
                .slice(0, 6)
                .map((property, i) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    index={i}
                  />
                ))}
        </div>

        <div className="mt-10 sm:mt-12 text-center sm:hidden">
          <Link
            href="/properties"
            className="inline-flex items-center justify-center gap-2 min-h-[48px] text-sm font-semibold text-brand-charcoal border-2 border-brand-charcoal rounded-full px-6 py-3 hover:bg-brand-charcoal hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
          >
            View all properties <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
