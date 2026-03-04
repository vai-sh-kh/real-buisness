"use client";

import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, useInView } from "framer-motion";
import { Bed, Bath, Maximize2, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { PropertyWithRelations } from "@/types";
import { formatPrice } from "@/lib/utils";

const fallbackProperties = [
  {
    id: "1",
    title: "DuneHaven Residences",
    city: "Santa Ana",
    state: "Illinois",
    price: 550000,
    price_label: null,
    bedrooms: 4,
    bathrooms: 3,
    area_sqft: 3200,
    type: "sale" as const,
    status: "active" as const,
    is_featured: true,
    category: null,
    cover_image_url:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80",
    slug: "",
    description: null,
    address: "",
    country: "",
    images: [],
    created_at: "",
    updated_at: "",
    category_id: null,
  },
  {
    id: "2",
    title: "Family-Friendly Villas",
    city: "San Jose",
    state: "California",
    price: 840000,
    price_label: null,
    bedrooms: 5,
    bathrooms: 4,
    area_sqft: 4100,
    type: "sale" as const,
    status: "active" as const,
    is_featured: true,
    category: null,
    cover_image_url:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80",
    slug: "",
    description: null,
    address: "",
    country: "",
    images: [],
    created_at: "",
    updated_at: "",
    category_id: null,
  },
  {
    id: "3",
    title: "Oceanfront Condominiums",
    city: "Miami",
    state: "Florida",
    price: 655000,
    price_label: null,
    bedrooms: 3,
    bathrooms: 2,
    area_sqft: 2100,
    type: "rent" as const,
    status: "active" as const,
    is_featured: true,
    category: null,
    cover_image_url:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
    slug: "",
    description: null,
    address: "",
    country: "",
    images: [],
    created_at: "",
    updated_at: "",
    category_id: null,
  },
  {
    id: "4",
    title: "Stonehaven Realty",
    city: "Portland",
    state: "Oregon",
    price: 200000,
    price_label: null,
    bedrooms: 2,
    bathrooms: 1,
    area_sqft: 1400,
    type: "sale" as const,
    status: "active" as const,
    is_featured: true,
    category: null,
    cover_image_url:
      "https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=600&q=80",
    slug: "",
    description: null,
    address: "",
    country: "",
    images: [],
    created_at: "",
    updated_at: "",
    category_id: null,
  },
];

function PropertyCard({ property, delay }: { property: PropertyWithRelations; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className="group cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-44 rounded-2xl overflow-hidden mb-3 bg-gray-100">
        {property.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={property.cover_image_url}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-300 text-4xl">🏠</div>
        )}
        <div className="absolute top-2.5 left-2.5">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              property.type === "sale"
                ? "bg-black text-white"
                : "bg-white text-black border border-gray-200"
            }`}
          >
            {property.type === "sale" ? "For Sale" : "For Rent"}
          </span>
        </div>
      </div>

      {/* Info */}
      <h3 className="font-semibold text-black text-sm mb-1 leading-snug">{property.title}</h3>
      <div className="flex items-center gap-1 text-xs text-gray-400 mb-2.5">
        <MapPin className="h-3 w-3 shrink-0" />
        <span>{property.city}, {property.state}</span>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3 text-xs text-gray-400 mb-2.5 border-t border-gray-100 pt-2.5">
        {property.bedrooms != null && (
          <span className="flex items-center gap-1">
            <Bed className="h-3.5 w-3.5" /> {property.bedrooms}
          </span>
        )}
        {property.bathrooms != null && (
          <span className="flex items-center gap-1">
            <Bath className="h-3.5 w-3.5" /> {property.bathrooms}
          </span>
        )}
        {property.area_sqft != null && (
          <span className="flex items-center gap-1">
            <Maximize2 className="h-3.5 w-3.5" /> {property.area_sqft?.toLocaleString()}
          </span>
        )}
      </div>

      <p className="text-sm font-bold text-black">{formatPrice(property.price)}</p>
    </motion.div>
  );
}

function CardSkeleton() {
  return (
    <div>
      <Skeleton className="h-44 w-full rounded-2xl mb-3" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2 mb-2" />
      <Skeleton className="h-3 w-2/3 mb-2" />
      <Skeleton className="h-5 w-1/3" />
    </div>
  );
}

export function FeaturedProperties() {
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, margin: "-80px" });

  const { data, isLoading } = useQuery({
    queryKey: ["featured-properties"],
    queryFn: async () => {
      const res = await fetch("/api/properties?is_featured=true&status=active&limit=4");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      return json.data as PropertyWithRelations[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const properties = (data && data.length > 0 ? data : fallbackProperties) as PropertyWithRelations[];

  return (
    <section id="properties" className="py-20 bg-white">
      <div className="container mx-auto px-6 max-w-6xl">
        <div ref={headRef} className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-black leading-tight"
          >
            Explore Your Options
            <br />
            Find Your Perfect Match
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
            : properties.slice(0, 4).map((property, i) => (
                <PropertyCard key={property.id} property={property} delay={i * 0.1} />
              ))}
        </div>
      </div>
    </section>
  );
}
