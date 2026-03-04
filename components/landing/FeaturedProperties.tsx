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
    city: "Los Angeles",
    state: "California",
    price: 340000,
    bedrooms: 6,
    bathrooms: 2,
    area_sqft: 300,
    type: "sale",
    cover_image_url:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=700&q=80",
    slug: "",
  },
  {
    id: "2",
    title: "Island Retreat",
    city: "Exuma",
    state: "Bahamas",
    price: 220000,
    bedrooms: 4,
    bathrooms: 1,
    area_sqft: 250,
    type: "sale",
    cover_image_url:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=700&q=80",
    slug: "",
  },
  {
    id: "3",
    title: "Mountain Lodge",
    city: "Aspen",
    state: "Colorado",
    price: 500000,
    bedrooms: 6,
    bathrooms: 3,
    area_sqft: 400,
    type: "sale",
    cover_image_url:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=700&q=80",
    slug: "",
  },
  {
    id: "4",
    title: "Comporta Beach Lux",
    city: "Lisbon Coast",
    state: "Portugal",
    price: 296000,
    bedrooms: 6,
    bathrooms: 3,
    area_sqft: 230,
    type: "rent",
    cover_image_url:
      "https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=700&q=80",
    slug: "",
  },
  {
    id: "5",
    title: "Tulum Eco Retreat",
    city: "Tulum",
    state: "Mexico",
    price: 450000,
    bedrooms: 3,
    bathrooms: 1,
    area_sqft: 150,
    type: "rent",
    cover_image_url:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=80",
    slug: "",
  },
  {
    id: "6",
    title: "Azura Villa",
    city: "Mykonos",
    state: "Greece",
    price: 470000,
    bedrooms: 6,
    bathrooms: 2,
    area_sqft: 400,
    type: "sale",
    cover_image_url:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=700&q=80",
    slug: "",
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
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const card = (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: (index % 3) * 0.1 }}
      className="group cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-gray-100">
        {property.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={property.cover_image_url}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-300 text-4xl">
            🏠
          </div>
        )}
        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-black/80 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
            {property.type === "sale" ? "For Sale" : "For Rent"}
          </span>
        </div>
        {/* Price badge */}
        <div className="absolute bottom-3 right-3">
          <span className="bg-white text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
            {formatPrice(property.price ?? 0)}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="font-semibold text-black text-[15px] leading-snug group-hover:opacity-70 transition-opacity">
          {property.title}
        </h3>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
        <MapPin className="h-3 w-3 shrink-0" />
        <span>
          {property.city}, {property.state}
        </span>
      </div>

      {/* Specs row */}
      <div className="flex items-center gap-4 text-xs text-gray-400 pt-3 border-t border-gray-100">
        {property.area_sqft != null && (
          <span className="flex items-center gap-1">
            <Maximize2 className="h-3.5 w-3.5" />
            {property.area_sqft} m²
          </span>
        )}
        {property.bedrooms != null && (
          <span className="flex items-center gap-1">
            <Bed className="h-3.5 w-3.5" />
            {property.bedrooms} beds
          </span>
        )}
        {property.bathrooms != null && (
          <span className="flex items-center gap-1">
            <Bath className="h-3.5 w-3.5" />
            {property.bathrooms} baths
          </span>
        )}
      </div>
    </motion.div>
  );

  if (property.slug) {
    return <Link href={`/properties/${property.slug}`}>{card}</Link>;
  }
  return card;
}

function CardSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-[4/3] w-full rounded-xl mb-4" />
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-3.5 w-1/2 mb-3" />
      <Skeleton className="h-3.5 w-2/3" />
    </div>
  );
}

export function FeaturedProperties() {
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, margin: "-80px" });

  const { data, isLoading } = useQuery({
    queryKey: ["featured-properties"],
    queryFn: async () => {
      const res = await fetch("/api/properties?is_featured=true&status=active&limit=6");
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
    <section id="properties" className="py-24 bg-[#f8f8f6]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div ref={headRef} className="flex items-end justify-between mb-12">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={headInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="text-sm text-gray-400 tracking-widest"
            >
              /Discover
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={headInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mt-1"
            >
              New Properties
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={headInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link
              href="/properties"
              className="hidden sm:flex items-center gap-2 text-sm font-semibold text-black hover:opacity-60 transition-opacity"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
            : properties.slice(0, 6).map((property, i) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  index={i}
                />
              ))}
        </div>

        {/* Mobile view all */}
        <div className="mt-10 sm:hidden text-center">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-sm font-semibold text-black border border-black rounded-full px-6 py-3"
          >
            View all properties <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
