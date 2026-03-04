"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Bed, Bath, Maximize2, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import type { PropertyWithRelations } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const TYPE_TABS = [
  { label: "All", value: "all" },
  { label: "Buy", value: "buy" },
  { label: "Rent", value: "rent" },
  { label: "New Developments", value: "new" },
  { label: "Commercial", value: "commercial" },
] as const;

const CITIES = ["All Cities", "Los Angeles", "New York", "Miami", "Chicago", "Austin", "Seattle"];
const PRICE_RANGES = [
  { label: "Any Price", min: undefined, max: undefined },
  { label: "Under $200K", min: undefined, max: 200000 },
  { label: "$200K–$500K", min: 200000, max: 500000 },
  { label: "$500K–$1M", min: 500000, max: 1000000 },
  { label: "Over $1M", min: 1000000, max: undefined },
];
const BEDROOMS = ["Any", "1+", "2+", "3+", "4+", "5+"];

const fallback: Partial<PropertyWithRelations>[] = [
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
  {
    id: "7",
    title: "Downtown Penthouse",
    city: "New York",
    state: "New York",
    price: 1200000,
    bedrooms: 3,
    bathrooms: 2,
    area_sqft: 180,
    type: "sale",
    cover_image_url:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=700&q=80",
    slug: "",
  },
  {
    id: "8",
    title: "Garden Villa",
    city: "Miami",
    state: "Florida",
    price: 380000,
    bedrooms: 4,
    bathrooms: 3,
    area_sqft: 320,
    type: "rent",
    cover_image_url:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=700&q=80",
    slug: "",
  },
  {
    id: "9",
    title: "Lakeside Cottage",
    city: "Chicago",
    state: "Illinois",
    price: 260000,
    bedrooms: 2,
    bathrooms: 1,
    area_sqft: 110,
    type: "sale",
    cover_image_url:
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=700&q=80",
    slug: "",
  },
];

function PropertyCard({ property, index }: { property: Partial<PropertyWithRelations>; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: (index % 9) * 0.06 }}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-gray-100">
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
        <div className="absolute top-3 left-3">
          <span className="bg-black/80 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
            {property.type === "sale" ? "For Sale" : "For Rent"}
          </span>
        </div>
        <div className="absolute bottom-3 right-3">
          <span className="bg-white text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
            {formatPrice(property.price ?? 0)}
          </span>
        </div>
      </div>
      <div className="flex items-start justify-between mb-1">
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
      <div className="flex items-center gap-4 text-xs text-gray-400 pt-3 border-t border-gray-100">
        {property.area_sqft != null && (
          <span className="flex items-center gap-1">
            <Maximize2 className="h-3.5 w-3.5" /> {property.area_sqft} m²
          </span>
        )}
        {property.bedrooms != null && (
          <span className="flex items-center gap-1">
            <Bed className="h-3.5 w-3.5" /> {property.bedrooms} beds
          </span>
        )}
        {property.bathrooms != null && (
          <span className="flex items-center gap-1">
            <Bath className="h-3.5 w-3.5" /> {property.bathrooms} baths
          </span>
        )}
      </div>
    </motion.div>
  );
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

export function PropertiesClient() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>(
    searchParams.get("type") === "rent" ? "rent" : "all"
  );
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [city, setCity] = useState("All Cities");
  const [priceIndex, setPriceIndex] = useState(0);
  const [bedrooms, setBedrooms] = useState("Any");
  const [showFilters, setShowFilters] = useState(false);

  const priceRange = PRICE_RANGES[priceIndex];

  const apiType =
    activeTab === "buy" || activeTab === "sale"
      ? "sale"
      : activeTab === "rent"
      ? "rent"
      : undefined;

  const queryString = new URLSearchParams({
    limit: "12",
    status: "active",
    ...(apiType && { type: apiType }),
    ...(search && { search }),
    ...(city !== "All Cities" && { city }),
    ...(priceRange.min !== undefined && { min_price: String(priceRange.min) }),
    ...(priceRange.max !== undefined && { max_price: String(priceRange.max) }),
    ...(bedrooms !== "Any" && {
      bedrooms: bedrooms.replace("+", ""),
    }),
  }).toString();

  const { data, isLoading } = useQuery({
    queryKey: ["properties", queryString],
    queryFn: async () => {
      const res = await fetch(`/api/properties?${queryString}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      return json.data as PropertyWithRelations[];
    },
    staleTime: 2 * 60 * 1000,
  });

  const properties =
    data && data.length > 0 ? data : (fallback as Partial<PropertyWithRelations>[]);

  return (
    <>
      {/* Page hero */}
      <div className="bg-[#f8f8f6] pt-12 pb-10 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-gray-400 tracking-widest mb-2">/Properties</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black leading-tight mb-3">
            Find the home
            <br />
            that will be yours
          </h1>
          <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
            Our curated listings include photos, 3D tours, and offline viewings — everything
            you need to explore and buy with confidence.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-3">
          {/* Tab row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Type tabs */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 shrink-0">
              {TYPE_TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={cn(
                    "px-4 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap",
                    activeTab === tab.value
                      ? "bg-black text-white shadow-sm"
                      : "text-gray-500 hover:text-black"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
              <Search className="h-4 w-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search property or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400 bg-transparent min-w-0"
              />
              {search && (
                <button onClick={() => setSearch("")}>
                  <X className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            {/* Filters toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors shrink-0",
                showFilters
                  ? "bg-black text-white border-black"
                  : "border-gray-200 text-gray-600 hover:border-gray-400"
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
          </div>

          {/* Expanded filter row */}
          {showFilters && (
            <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-gray-100">
              {/* City */}
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none text-gray-700 bg-white hover:border-gray-400 transition-colors cursor-pointer"
              >
                {CITIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              {/* Price range */}
              <select
                value={priceIndex}
                onChange={(e) => setPriceIndex(Number(e.target.value))}
                className="text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none text-gray-700 bg-white hover:border-gray-400 transition-colors cursor-pointer"
              >
                {PRICE_RANGES.map((pr, i) => (
                  <option key={pr.label} value={i}>
                    {pr.label}
                  </option>
                ))}
              </select>

              {/* Bedrooms */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                {BEDROOMS.map((b) => (
                  <button
                    key={b}
                    onClick={() => setBedrooms(b)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                      bedrooms === b
                        ? "bg-black text-white"
                        : "text-gray-500 hover:text-black"
                    )}
                  >
                    {b}
                  </button>
                ))}
              </div>

              {/* Clear */}
              <button
                onClick={() => {
                  setCity("All Cities");
                  setPriceIndex(0);
                  setBedrooms("Any");
                  setSearch("");
                  setActiveTab("all");
                }}
                className="text-xs text-gray-400 hover:text-black transition-colors flex items-center gap-1 px-3 py-2.5"
              >
                <X className="h-3 w-3" /> Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        {/* Results count */}
        <p className="text-sm text-gray-400 mb-8">
          {isLoading ? "Loading..." : `${properties.length} properties found`}
        </p>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {isLoading
            ? Array.from({ length: 9 }).map((_, i) => <CardSkeleton key={i} />)
            : properties.map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i} />
              ))}
        </div>

        {!isLoading && properties.length === 0 && (
          <div className="text-center py-24">
            <p className="text-gray-400 text-sm">No properties found for your criteria.</p>
          </div>
        )}
      </div>
    </>
  );
}
