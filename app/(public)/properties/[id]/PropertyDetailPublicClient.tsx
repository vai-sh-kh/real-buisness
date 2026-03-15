"use client";

import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  ArrowLeft,
  Building2,
  ChevronRight,
} from "lucide-react";
import { usePublicPropertyByIdOrSlug } from "@/hooks/useProperties";
import { formatPrice, getPriceTypeLabel } from "@/lib/utils";
import { toEmbedUrlSync } from "@/lib/map-url";
import type { PropertyWithRelations } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface PropertyDetailPublicClientProps {
  identifier: string;
}

function DetailSkeleton() {
  return (
    <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-16 xl:px-24 py-6 sm:py-8">
      <Skeleton className="h-8 w-48 mb-6" />
      <Skeleton className="aspect-[21/9] w-full rounded-2xl mb-8" />
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function DetailEmpty() {
  return (
    <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-16 xl:px-24 py-16 sm:py-24 text-center">
      <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
      <h1 className="text-xl font-semibold text-brand-charcoal mb-2">
        Property not found
      </h1>
      <p className="text-muted-foreground mb-6">
        This listing may have been removed or the link is invalid.
      </p>
      <Link
        href="/properties"
        className="inline-flex items-center gap-2 min-h-[44px] px-6 py-3 rounded-lg bg-brand-charcoal text-white font-medium hover:bg-brand-charcoal/90"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to properties
      </Link>
    </div>
  );
}

export function PropertyDetailPublicClient({
  identifier,
}: PropertyDetailPublicClientProps) {
  const {
    data: property,
    isLoading,
    isError,
  } = usePublicPropertyByIdOrSlug(identifier);

  if (isLoading) return <DetailSkeleton />;
  if (isError || !property) return <DetailEmpty />;

  const coverUrl = property.cover_image_url ?? "";
  const gallery = property.gallery_images?.filter(Boolean) ?? [];
  const allImages = coverUrl
    ? [coverUrl, ...gallery.filter((u) => u !== coverUrl)]
    : gallery;

  return (
    <>
      {/* Breadcrumb + back */}
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-16 xl:px-24 pt-4 sm:pt-6">
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-brand-charcoal mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Properties
        </Link>
      </div>

      {/* Hero: priority banner image */}
      <section className="relative w-full aspect-[21/9] min-h-[240px] sm:min-h-[280px] md:min-h-[320px] max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-16 xl:px-24 mb-6 sm:mb-8 overflow-hidden rounded-2xl">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={property.title}
            fill
            className="object-cover"
            priority
            sizes="(min-width: 1024px) 80vw, 100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <Building2 className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-brand-charcoal/40 rounded-2xl" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:px-16 xl:px-24 text-white">
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            {property.title}
          </h1>
          {(property.city || property.state) && (
            <p className="mt-1 flex items-center gap-1.5 text-white/90 text-sm sm:text-base">
              <MapPin className="h-4 w-4 shrink-0" />
              {[property.city, property.state].filter(Boolean).join(", ")}
            </p>
          )}
        </div>
      </section>

      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-16 xl:px-24 pb-12 sm:pb-16">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Price & quick specs */}
            <div className="flex flex-wrap items-center gap-4 border-b border-border pb-6">
              <p className="text-2xl sm:text-3xl font-bold text-brand-charcoal">
                {formatPrice(property.price)}
              </p>
              <span className="text-sm text-muted-foreground">
                {getPriceTypeLabel(property.price_type)}
                {property.price_label ? ` · ${property.price_label}` : ""}
              </span>
              {property.type && (
                <span className="rounded-full bg-brand-gold/15 text-brand-charcoal px-3 py-1 text-sm font-medium capitalize">
                  {property.type}
                </span>
              )}
            </div>

            {(property.bedrooms != null ||
              property.bathrooms != null ||
              property.area_sqft != null) && (
              <div className="flex flex-wrap gap-6 text-muted-foreground">
                {property.bedrooms != null && (
                  <span className="flex items-center gap-2">
                    <Bed className="h-5 w-5" />
                    {property.bedrooms} Beds
                  </span>
                )}
                {property.bathrooms != null && (
                  <span className="flex items-center gap-2">
                    <Bath className="h-5 w-5" />
                    {property.bathrooms} Baths
                  </span>
                )}
                {property.area_sqft != null && (
                  <span className="flex items-center gap-2">
                    <Maximize2 className="h-5 w-5" />
                    {property.area_sqft} sqft
                  </span>
                )}
              </div>
            )}

            {property.short_description && (
              <p className="text-muted-foreground leading-relaxed">
                {property.short_description}
              </p>
            )}

            {property.description && (
              <div className="prose prose-brand-charcoal max-w-none">
                <h3 className="text-lg font-semibold text-brand-charcoal mb-2">
                  Description
                </h3>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {property.description}
                </p>
              </div>
            )}

            {/* Gallery */}
            {allImages.length > 1 && (
              <div>
                <h3 className="text-lg font-semibold text-brand-charcoal mb-4">
                  Gallery
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {allImages.slice(0, 6).map((url, i) => (
                    <div
                      key={i}
                      className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted"
                    >
                      <Image
                        src={url}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-brand-charcoal mb-3">
                  Amenities
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {property.amenities.map((a, i) => (
                    <li
                      key={i}
                      className="rounded-lg bg-muted px-3 py-1.5 text-sm text-muted-foreground"
                    >
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Map */}
            {property.map_embed_url && (
              <div>
                <h3 className="text-lg font-semibold text-brand-charcoal mb-3">
                  Location
                </h3>
                <div className="aspect-video w-full rounded-xl overflow-hidden border border-border">
                  <iframe
                    title="Location map"
                    src={
                      toEmbedUrlSync(property.map_embed_url) ??
                      property.map_embed_url
                    }
                    className="h-full w-full"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar CTA */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-border bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-brand-charcoal mb-2">
                Interested?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get in touch for viewings or more details.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 w-full min-h-[48px] rounded-xl bg-brand-gold text-white font-semibold hover:bg-brand-gold/90 transition-colors"
              >
                Contact us
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="/properties"
                className="mt-3 inline-flex items-center justify-center gap-2 w-full min-h-[44px] rounded-xl border border-border text-brand-charcoal font-medium hover:bg-muted/50 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to properties
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
