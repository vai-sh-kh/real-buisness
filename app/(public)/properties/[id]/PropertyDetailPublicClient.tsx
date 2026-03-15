"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  ArrowLeft,
  Building2,
} from "lucide-react";
import { usePublicPropertyByIdOrSlug } from "@/hooks/useProperties";
import { formatPrice, getPriceTypeLabel } from "@/lib/utils";
import { toEmbedUrlSync } from "@/lib/map-url";
import type { PropertyWithRelations } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { CONTACT, SOCIAL_LINKS } from "@/lib/constants/site";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { cn } from "@/lib/utils";

interface PropertyDetailPublicClientProps {
  identifier: string;
}

const AMENITY_COLORS = [
  "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
  "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200",
  "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200",
  "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-200",
  "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200",
  "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-200",
  "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200",
  "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200",
];

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-muted/20">
      <Skeleton className="aspect-[21/9] w-full rounded-none" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 lg:py-10">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-wrap gap-4">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-8 w-32 rounded-full" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-16 w-24 rounded-xl" />
              <Skeleton className="h-16 w-24 rounded-xl" />
              <Skeleton className="h-16 w-24 rounded-xl" />
            </div>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-40 w-full" />
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-14 w-full rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-12 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailEmpty() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 sm:py-24 bg-muted/20">
      <div className="rounded-2xl border border-border bg-white p-8 sm:p-10 text-center max-w-md shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-4">
          <Building2 className="h-7 w-7 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-semibold text-brand-charcoal mb-2">
          Property not found
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base mb-6">
          This listing may have been removed or the link is invalid.
        </p>
        <Link
          href="/properties"
          className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-xl bg-brand-charcoal text-white font-medium hover:bg-brand-charcoal/90 focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to properties
        </Link>
      </div>
    </div>
  );
}

export function PropertyDetailPublicClient({
  identifier,
}: PropertyDetailPublicClientProps) {
  const router = useRouter();
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

  const hasSpecs =
    property.bedrooms != null ||
    property.bathrooms != null ||
    property.area_sqft != null;

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Hero: full-bleed, overlay, back + title */}
      <section className="relative w-full aspect-[21/9] min-h-[220px] sm:min-h-[280px] md:min-h-[340px] lg:min-h-[380px] overflow-hidden bg-brand-charcoal">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={property.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Building2 className="h-20 w-20 text-white/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent lg:from-black/50" />

        <div className="absolute inset-0 flex flex-col max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-start justify-between pt-4 sm:pt-6">
            <button
              type="button"
              onClick={() => router.push("/properties")}
              className="flex items-center justify-center size-11 rounded-xl bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 active:bg-white/25 border border-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
              aria-label="Back to properties"
            >
              <ArrowLeft className="h-5 w-5 shrink-0" />
            </button>
            {allImages.length > 1 && (
              <span className="rounded-full bg-black/40 backdrop-blur-sm text-white/90 text-xs font-medium px-3 py-1.5 border border-white/20">
                {allImages.length} photos
              </span>
            )}
          </div>
          <div className="mt-auto pb-6 sm:pb-8 lg:pb-10">
            <span className="inline-block rounded-full bg-brand-gold/90 text-white text-xs font-semibold px-3 py-1 uppercase tracking-wide mb-3">
              {property.type === "sale" ? "For Sale" : "For Rent"}
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight drop-shadow-lg max-w-3xl">
              {property.title}
            </h1>
            {(property.city || property.state) && (
              <p className="mt-2 flex items-center gap-2 text-white/90 text-sm sm:text-base">
                <MapPin className="h-4 w-4 shrink-0" />
                {[property.city, property.state].filter(Boolean).join(", ")}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 lg:py-10">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            {/* Price & meta */}
            <div className="rounded-2xl border border-border bg-white p-5 sm:p-6 shadow-sm">
              <div className="flex flex-wrap items-baseline gap-3 gap-y-1">
                <p className="text-2xl sm:text-3xl font-bold text-brand-charcoal">
                  {formatPrice(property.price ?? 0)}
                </p>
                <span className="text-sm text-muted-foreground">
                  {getPriceTypeLabel(property.price_type)}
                  {property.price_label ? ` · ${property.price_label}` : ""}
                </span>
              </div>
            </div>

            {/* Specs row */}
            {hasSpecs && (
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {property.bedrooms != null && (
                  <div className="rounded-xl border border-border bg-white p-4 flex flex-col items-center gap-1 text-center shadow-sm">
                    <Bed className="h-5 w-5 text-brand-gold" aria-hidden />
                    <span className="text-lg font-bold text-brand-charcoal tabular-nums">
                      {property.bedrooms}
                    </span>
                    <span className="text-xs text-muted-foreground">Beds</span>
                  </div>
                )}
                {property.bathrooms != null && (
                  <div className="rounded-xl border border-border bg-white p-4 flex flex-col items-center gap-1 text-center shadow-sm">
                    <Bath className="h-5 w-5 text-brand-gold" aria-hidden />
                    <span className="text-lg font-bold text-brand-charcoal tabular-nums">
                      {property.bathrooms}
                    </span>
                    <span className="text-xs text-muted-foreground">Baths</span>
                  </div>
                )}
                {property.area_sqft != null && (
                  <div className="rounded-xl border border-border bg-white p-4 flex flex-col items-center gap-1 text-center shadow-sm">
                    <Maximize2 className="h-5 w-5 text-brand-gold" aria-hidden />
                    <span className="text-lg font-bold text-brand-charcoal tabular-nums">
                      {property.area_sqft}
                    </span>
                    <span className="text-xs text-muted-foreground">sqft</span>
                  </div>
                )}
              </div>
            )}

            {/* Short description */}
            {property.short_description && (
              <div className="rounded-2xl border border-border bg-white p-5 sm:p-6 shadow-sm">
                <p className="text-muted-foreground leading-relaxed">
                  {property.short_description}
                </p>
              </div>
            )}

            {/* Full description */}
            {property.description && (
              <div className="rounded-2xl border border-border bg-white p-5 sm:p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-brand-charcoal mb-3">
                  Description
                </h2>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {property.description}
                </p>
              </div>
            )}

            {/* Gallery */}
            {allImages.length > 1 && (
              <div className="rounded-2xl border border-border bg-white p-5 sm:p-6 shadow-sm overflow-hidden">
                <h2 className="text-lg font-semibold text-brand-charcoal mb-4">
                  Gallery
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {allImages.slice(0, 6).map((url, i) => (
                    <div
                      key={i}
                      className={cn(
                        "relative aspect-[4/3] rounded-xl overflow-hidden bg-muted",
                        i === 0 && "sm:col-span-2 sm:row-span-2 sm:aspect-auto sm:min-h-[200px]"
                      )}
                    >
                      <Image
                        src={url}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="rounded-2xl border border-border bg-white p-5 sm:p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-brand-charcoal mb-4">
                  Amenities
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {property.amenities.map((a, i) => (
                    <li
                      key={i}
                      className={cn(
                        "rounded-lg px-3 py-1.5 text-sm font-medium",
                        AMENITY_COLORS[i % AMENITY_COLORS.length]
                      )}
                    >
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Map */}
            {property.map_embed_url && (
              <div className="rounded-2xl border border-border bg-white p-5 sm:p-6 shadow-sm overflow-hidden">
                <h2 className="text-lg font-semibold text-brand-charcoal mb-4">
                  Location
                </h2>
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

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-border bg-white p-6 shadow-lg shadow-black/5 space-y-5">
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 w-full min-h-[52px] rounded-xl bg-brand-gold text-white font-semibold hover:bg-brand-gold/90 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2"
                aria-label={CONTACT.whatsappLabel}
              >
                <svg
                  className="h-5 w-5 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>{CONTACT.whatsappLabel}</span>
              </a>
              <div className="pt-5 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground mb-3">
                  Follow us
                </p>
                <div className="flex flex-wrap gap-2">
                  {SOCIAL_LINKS.map((social) => (
                    <a
                      key={social.platform}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.ariaLabel}
                      className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-brand-charcoal hover:border-brand-gold/50 hover:bg-brand-gold/5 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2"
                    >
                      <SocialIcon
                        platform={social.platform}
                        className="h-4 w-4"
                      />
                    </a>
                  ))}
                </div>
              </div>
              <Link
                href="/properties"
                className="inline-flex items-center justify-center gap-2 w-full min-h-[48px] rounded-xl border-2 border-border text-brand-charcoal font-medium hover:bg-muted/50 hover:border-brand-charcoal/70 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Back to properties
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
