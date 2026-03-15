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

  return (
    <>
      {/* Hero: full-bleed image, no rounded corners; native back button with tap feedback */}
      <section className="relative w-full aspect-[21/9] min-h-[240px] sm:min-h-[280px] md:min-h-[320px] max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-16 xl:px-24 pt-4 sm:pt-6 mb-6 sm:mb-8 overflow-hidden">
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
        {/* Dark gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
        {/* Back button: no bg, white icon only */}
        <button
          type="button"
          onClick={() => router.push("/properties")}
          className="absolute left-4 sm:left-6 lg:left-16 xl:left-24 top-4 sm:top-6 z-10 flex items-center justify-center size-11 rounded-none border-0 bg-transparent text-white hover:text-white/90 active:text-white/80 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent touch-manipulation"
          aria-label="Back to properties"
        >
          <ArrowLeft className="h-5 w-5 shrink-0" aria-hidden />
        </button>
        {/* Title + location at bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:px-16 xl:px-24 pb-6 sm:pb-8 text-white">
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight drop-shadow-md">
            {property.title}
          </h1>
          {(property.city || property.state) && (
            <p className="mt-1 flex items-center gap-1.5 text-white/95 text-sm sm:text-base drop-shadow-sm">
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
                  {property.amenities.map((a, i) => {
                    const colors = [
                      "bg-blue-100 text-blue-800",
                      "bg-emerald-100 text-emerald-800",
                      "bg-amber-100 text-amber-800",
                      "bg-violet-100 text-violet-800",
                      "bg-rose-100 text-rose-800",
                      "bg-teal-100 text-teal-800",
                      "bg-orange-100 text-orange-800",
                      "bg-indigo-100 text-indigo-800",
                    ];
                    const style = colors[i % colors.length];
                    return (
                      <li
                        key={i}
                        className={`rounded-lg px-3 py-1.5 text-sm font-medium ${style}`}
                      >
                        {a}
                      </li>
                    );
                  })}
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

          {/* Sidebar — WhatsApp only (logo color + white text), then social + back */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-border bg-white p-6 shadow-lg shadow-black/5">
              {/* WhatsApp button: gold background, white icon + text (from constant) */}
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 w-full min-h-[48px] rounded-xl bg-brand-gold text-white font-semibold hover:bg-brand-gold/90 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2"
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
              {/* Social icons — Instagram, etc. from constant */}
              <div className="mt-5 pt-5 border-t border-border">
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
                className="mt-4 inline-flex items-center justify-center gap-2 w-full min-h-[44px] rounded-xl border border-border text-brand-charcoal font-medium hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Back to properties
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
