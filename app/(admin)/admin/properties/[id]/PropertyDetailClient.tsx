"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Pencil,
  Trash2,
  Loader2,
  MapPin,
  LayoutGrid,
  FileText,
  ImageIcon,
  Calendar,
  PackageOpen,
  ExternalLink,
  Tag,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PageHeader,
  type BreadcrumbItem,
} from "@/components/admin/layout/PageHeader";
import { ProfileSectionLabel } from "@/components/admin/ProfileDetailModal";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PropertySheet } from "@/components/admin/properties/PropertySheet";
import {
  usePropertyByIdOrSlug,
  useDeleteProperty,
} from "@/hooks/useProperties";
import { formatDate } from "@/lib/utils";
import { toEmbedUrlSync } from "@/lib/map-url";
import type { PropertyWithRelations, PropertyStatus } from "@/types";
import { cn } from "@/lib/utils";
import { PropertyDetailSkeleton } from "@/components/admin/skeletons/AdminPageSkeleton";

const EMPTY_PLACEHOLDER = "__";

function formatDetailValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return EMPTY_PLACEHOLDER;
  if (typeof value === "string" && value.trim() === "")
    return EMPTY_PLACEHOLDER;
  return String(value);
}

const STATUS_COLORS: Record<
  PropertyStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  active: "default",
  draft: "secondary",
  sold: "outline",
  rented: "outline",
};

/** Distinct background + text colors for amenity badges (cycle by index). */
const AMENITY_BADGE_COLORS = [
  "bg-blue-100 text-blue-800 border-blue-200",
  "bg-emerald-100 text-emerald-800 border-emerald-200",
  "bg-amber-100 text-amber-800 border-amber-200",
  "bg-violet-100 text-violet-800 border-violet-200",
  "bg-rose-100 text-rose-800 border-rose-200",
  "bg-cyan-100 text-cyan-800 border-cyan-200",
  "bg-orange-100 text-orange-800 border-orange-200",
  "bg-teal-100 text-teal-800 border-teal-200",
  "bg-indigo-100 text-indigo-800 border-indigo-200",
  "bg-pink-100 text-pink-800 border-pink-200",
] as const;

const CARD_CLASS =
  "rounded-xl border border-admin-card-border bg-admin-card-bg p-3 shadow-sm sm:p-4 lg:p-6 min-w-0";
const SECTION_LABEL_CLASS =
  "text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground";
const FIELD_LABEL_CLASS = "text-xs sm:text-sm text-muted-foreground";
const VALUE_CLASS = "text-sm sm:text-base font-medium text-foreground";
const VALUE_MUTED_CLASS =
  "text-sm sm:text-base text-muted-foreground leading-relaxed";

interface PropertyDetailClientProps {
  /** Property ID (UUID) or slug - both work in the URL */
  identifier: string;
}

function PropertyDetailEmpty() {
  return (
    <div className="flex min-h-[calc(100dvh-6rem)] flex-col items-center justify-center px-4 py-8 sm:min-h-[60vh] sm:py-12">
      <div className="flex flex-col items-center justify-center gap-5 text-center sm:gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-admin-card-border bg-muted/50 sm:h-20 sm:w-20">
          <PackageOpen className="h-10 w-10 text-muted-foreground sm:h-10 sm:w-10" />
        </div>
        <div className="space-y-2 sm:space-y-1">
          <p className="text-xl font-semibold text-foreground sm:text-lg">
            No item available
          </p>
          <p className="text-base text-muted-foreground sm:text-sm">
            This property may have been removed or the link is invalid.
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="min-h-[48px] min-w-[44px] rounded-xl px-6 text-base sm:min-h-[44px] sm:text-sm"
        >
          <Link href="/admin/properties">Back to properties</Link>
        </Button>
      </div>
    </div>
  );
}

export function PropertyDetailClient({
  identifier,
}: PropertyDetailClientProps) {
  const router = useRouter();
  const {
    data: property,
    isLoading,
    isError,
  } = usePropertyByIdOrSlug(identifier);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const deleteProperty = useDeleteProperty();

  const handleDeleteConfirm = async () => {
    if (!property) return;
    await deleteProperty.mutateAsync(property.id);
    setDeleteDialogOpen(false);
    router.push("/admin/properties");
  };

  if (isLoading) {
    return <PropertyDetailSkeleton />;
  }

  if (isError || !property) {
    return <PropertyDetailEmpty />;
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Admin", href: "/admin/dashboard" },
    { label: "Properties", href: "/admin/properties" },
    { label: property.title.length > 28 ? "Details" : property.title },
  ];

  const subtitle = (
    <span className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
      {property.city && (
        <span className="font-medium text-amber-800">{property.city}</span>
      )}
      {property.city && (property.status || property.type) && (
        <span className="text-muted-foreground">·</span>
      )}
      {property.status && (
        <Badge
          variant={STATUS_COLORS[property.status]}
          className="text-xs font-medium"
        >
          {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
        </Badge>
      )}
      {property.status && property.type && (
        <span className="text-muted-foreground">·</span>
      )}
      {property.type && (
        <Badge
          variant="outline"
          className="text-xs font-medium capitalize border-amber-200 bg-amber-50 text-amber-800"
        >
          {property.type}
        </Badge>
      )}
    </span>
  );

  const viewOnSiteHref = property.slug ? `/properties/${property.slug}` : null;

  const headerActions = (
    <div className="flex flex-wrap items-center gap-3">
      {viewOnSiteHref && (
        <Button
          variant="outline"
          className="min-h-[44px] min-w-[44px] gap-2 rounded-xl px-5 py-2.5 text-sm font-medium"
          asChild
        >
          <Link href={viewOnSiteHref} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 shrink-0" />
            View on site
          </Link>
        </Button>
      )}
      <Button
        variant="outline"
        className="min-h-[44px] min-w-[44px] gap-2 rounded-xl px-5 py-2.5 text-sm font-medium"
        onClick={() => setEditSheetOpen(true)}
      >
        <Pencil className="h-4 w-4 shrink-0" />
        Edit
      </Button>
      <Button
        variant="destructive"
        className="min-h-[44px] min-w-[44px] gap-2 rounded-xl px-5 py-2.5 text-sm font-medium"
        onClick={() => setDeleteDialogOpen(true)}
      >
        <Trash2 className="h-4 w-4 shrink-0" />
        Delete
      </Button>
    </div>
  );

  const locationParts = [
    property.address,
    property.city,
    property.state,
    property.zip_code,
    property.country,
  ].filter(Boolean);
  const addressLine =
    locationParts.length > 0 ? locationParts.join(", ") : EMPTY_PLACEHOLDER;

  const hasLatLong =
    property.latitude != null &&
    property.longitude != null &&
    !Number.isNaN(Number(property.latitude)) &&
    !Number.isNaN(Number(property.longitude));
  const latLongDisplay = hasLatLong
    ? `${Number(property.latitude).toFixed(5)}, ${Number(property.longitude).toFixed(5)}`
    : EMPTY_PLACEHOLDER;

  const categoryName =
    property.category &&
    typeof property.category === "object" &&
    "name" in property.category
      ? (property.category as { name: string }).name
      : EMPTY_PLACEHOLDER;

  const specItems = [
    {
      label: "Area",
      value: property.area_sqft != null ? `${property.area_sqft} sqft` : null,
    },
    { label: "Bedrooms", value: property.bedrooms },
    { label: "Bathrooms", value: property.bathrooms },
    { label: "Floors", value: property.floors },
    { label: "Facing", value: property.facing },
    {
      label: "Age",
      value: property.age_years != null ? `${property.age_years} yrs` : null,
    },
    { label: "Furnished", value: property.furnished },
    { label: "Plot no.", value: property.plot_number },
    { label: "Plot dims", value: property.plot_dimensions },
  ];

  return (
    <>
      <PageHeader
        title={property.title.length > 40 ? "Property details" : property.title}
        subtitle={property.title.length > 40 ? property.title : subtitle}
        breadcrumbs={breadcrumbs}
        actions={headerActions}
      />

      <div className="min-w-0 space-y-4 pt-4 pb-8 sm:space-y-6 sm:pt-5 sm:pb-10 lg:space-y-8 lg:pt-6">
        {/* Hero / Overview */}
        <section className={CARD_CLASS}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
            <div className="h-32 w-full max-w-full shrink-0 overflow-hidden rounded-lg border border-admin-card-border bg-muted sm:h-44 sm:w-52 lg:h-48 lg:w-64 min-w-0">
              {property.cover_image_url ? (
                <img
                  src={property.cover_image_url}
                  alt=""
                  className="h-full w-full max-w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Building2 className="h-10 w-10 text-muted-foreground sm:h-12 sm:w-12" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-2 sm:space-y-3">
              <h1 className="text-xl font-semibold text-foreground sm:text-2xl leading-tight">
                {formatDetailValue(property.title)}
              </h1>
              <p className="text-sm">
                <span className={FIELD_LABEL_CLASS}>Slug: </span>
                <span className={VALUE_CLASS}>
                  {formatDetailValue(property.slug)}
                </span>
              </p>
              <p className="text-sm">
                <span className={FIELD_LABEL_CLASS}>Status: </span>
                <Badge
                  variant={STATUS_COLORS[property.status]}
                  className="text-xs sm:text-sm align-middle"
                >
                  {property.status.charAt(0).toUpperCase() +
                    property.status.slice(1)}
                </Badge>
              </p>
              <p className="text-sm">
                <span className={FIELD_LABEL_CLASS}>Type: </span>
                <Badge
                  variant="outline"
                  className="capitalize text-xs sm:text-sm align-middle"
                >
                  {property.type}
                </Badge>
              </p>
              <p className="text-sm">
                <span className={FIELD_LABEL_CLASS}>Category: </span>
                <span className={VALUE_CLASS}>{categoryName}</span>
              </p>
              <p className="text-sm">
                <span className={FIELD_LABEL_CLASS}>Price: </span>
                <span
                  className={cn(
                    "text-lg sm:text-xl font-semibold",
                    VALUE_CLASS,
                  )}
                >
                  ₹{Number(property.price).toLocaleString("en-IN")}
                </span>
                <span className="ml-1.5 text-sm text-muted-foreground">
                  (
                  {property.price_type === "percent"
                    ? "Per cent"
                    : "Total amount"}
                  {property.price_label
                    ? ` · ${formatDetailValue(property.price_label)}`
                    : ""}
                  )
                </span>
              </p>
              <p className="text-sm">
                <span className={FIELD_LABEL_CLASS}>Short description: </span>
                <span className={VALUE_MUTED_CLASS}>
                  {formatDetailValue(property.short_description)}
                </span>
              </p>
            </div>
          </div>
        </section>

        <div className="grid min-w-0 gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Location */}
          <section className={CARD_CLASS}>
            <ProfileSectionLabel
              className={cn(
                "flex items-center gap-1.5 sm:gap-2",
                SECTION_LABEL_CLASS,
              )}
            >
              <MapPin className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
              Location
            </ProfileSectionLabel>
            <div className="mt-2 space-y-1.5 sm:mt-3 sm:space-y-2">
              <p className="text-sm">
                <span className={FIELD_LABEL_CLASS}>Address: </span>
                <span className={VALUE_CLASS}>{addressLine}</span>
              </p>
              <p className="text-sm">
                <span className={FIELD_LABEL_CLASS}>Latitude, Longitude: </span>
                <span className={VALUE_CLASS}>{latLongDisplay}</span>
              </p>
            </div>
            {property.map_embed_url ? (
              <div className="mt-3 sm:mt-4">
                <span className={FIELD_LABEL_CLASS}>Map: </span>
                <div className="mt-1 aspect-video w-full max-w-full min-w-0 overflow-hidden rounded-lg border border-admin-card-border min-h-[140px] sm:min-h-[160px]">
                  <iframe
                    title="Location map"
                    src={
                      toEmbedUrlSync(property.map_embed_url) ??
                      property.map_embed_url
                    }
                    className="h-full w-full max-w-full"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allow="geolocation"
                  />
                </div>
              </div>
            ) : null}
          </section>

          {/* Specifications */}
          <section className={cn(CARD_CLASS, "border-l-4 border-l-amber-500")}>
            <ProfileSectionLabel
              className={cn(
                "flex items-center gap-1.5 sm:gap-2",
                SECTION_LABEL_CLASS,
                "text-amber-800",
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4 text-amber-600" />
              Specifications
            </ProfileSectionLabel>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:mt-3 sm:gap-3 sm:grid-cols-3">
              {specItems.map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-lg border border-amber-200/80 bg-amber-50/60 p-2.5 sm:p-3 min-w-0"
                >
                  <p className="text-sm">
                    <span className="text-xs sm:text-sm text-amber-900/80 font-medium">
                      {label}:{" "}
                    </span>
                    <span
                      className={cn(
                        "text-sm sm:text-base font-semibold",
                        VALUE_CLASS,
                      )}
                    >
                      {formatDetailValue(value)}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Amenities & Highlights */}
        <section className={CARD_CLASS}>
          <ProfileSectionLabel
            className={cn(
              "flex items-center gap-1.5 sm:gap-2",
              SECTION_LABEL_CLASS,
            )}
          >
            <Tag className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            Amenities & Highlights
          </ProfileSectionLabel>
          <div className="mt-2 space-y-3 sm:mt-3 sm:space-y-4">
            <div>
              <p className="text-sm mb-1">
                <span className={FIELD_LABEL_CLASS}>Amenities: </span>
              </p>
              {property.amenities && property.amenities.length > 0 ? (
                <div className="mt-1 flex flex-wrap gap-1.5 sm:gap-2">
                  {property.amenities.map((a, i) => (
                    <Badge
                      key={`${String(a)}-${i}`}
                      variant="outline"
                      className={cn(
                        "rounded-lg border text-xs sm:text-sm font-medium",
                        AMENITY_BADGE_COLORS[i % AMENITY_BADGE_COLORS.length],
                      )}
                    >
                      {a}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className={cn("mt-0.5 text-muted-foreground", VALUE_CLASS)}>
                  {EMPTY_PLACEHOLDER}
                </p>
              )}
            </div>
            <div>
              <p className="text-sm mb-1">
                <span className={FIELD_LABEL_CLASS}>Highlights: </span>
              </p>
              {property.highlights && property.highlights.length > 0 ? (
                <ul className={cn("mt-1 list-inside list-disc", VALUE_CLASS)}>
                  {property.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              ) : (
                <p className={cn("mt-0.5", VALUE_CLASS)}>{EMPTY_PLACEHOLDER}</p>
              )}
            </div>
          </div>
        </section>

        {/* Description */}
        <section className={CARD_CLASS}>
          <ProfileSectionLabel
            className={cn(
              "flex items-center gap-1.5 sm:gap-2",
              SECTION_LABEL_CLASS,
            )}
          >
            <FileText className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            Description
          </ProfileSectionLabel>
          <p className="mt-2 sm:mt-3 text-sm">
            <span className={FIELD_LABEL_CLASS}>Description: </span>
          </p>
          <p className={cn("mt-0.5 whitespace-pre-wrap", VALUE_MUTED_CLASS)}>
            {formatDetailValue(property.description)}
          </p>
        </section>

        {/* Assets / Media */}
        <section className={CARD_CLASS}>
          <ProfileSectionLabel
            className={cn(
              "flex items-center gap-1.5 sm:gap-2",
              SECTION_LABEL_CLASS,
            )}
          >
            <ImageIcon className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            Assets
          </ProfileSectionLabel>
          <div className="mt-2 space-y-3 sm:mt-3 sm:space-y-4">
            <div className="min-w-0">
              <p className="text-sm mb-1">
                <span className={FIELD_LABEL_CLASS}>Gallery: </span>
              </p>
              {property.gallery_images && property.gallery_images.length > 0 ? (
                <div className="mt-1.5 grid grid-cols-2 gap-1.5 sm:mt-2 sm:gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {property.gallery_images.map((url, i) => (
                    <div
                      key={i}
                      className="aspect-square min-w-0 overflow-hidden rounded-lg border border-admin-card-border"
                    >
                      <img
                        src={url}
                        alt={`Gallery ${i + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className={cn("mt-0.5", VALUE_MUTED_CLASS)}>
                  {EMPTY_PLACEHOLDER}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* SEO & Meta - always visible */}
        <section className={CARD_CLASS}>
          <ProfileSectionLabel
            className={cn(
              "flex items-center gap-1.5 sm:gap-2",
              SECTION_LABEL_CLASS,
            )}
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            SEO & Meta
          </ProfileSectionLabel>
          <div className="mt-2 space-y-2 sm:mt-3 sm:space-y-3">
            <p className="text-sm">
              <span className={FIELD_LABEL_CLASS}>Meta title: </span>
              <span className={VALUE_CLASS}>
                {formatDetailValue(property.meta_title)}
              </span>
            </p>
            <p className="text-sm">
              <span className={FIELD_LABEL_CLASS}>Meta description: </span>
              <span className={VALUE_MUTED_CLASS}>
                {formatDetailValue(property.meta_description)}
              </span>
            </p>
            <p className="text-sm">
              <span className={FIELD_LABEL_CLASS}>Meta keywords: </span>
              <span className={VALUE_MUTED_CLASS}>
                {formatDetailValue(property.meta_keywords)}
              </span>
            </p>
            <div>
              <p className="text-sm">
                <span className={FIELD_LABEL_CLASS}>OG image: </span>
              </p>
              {property.og_image_url ? (
                <div className="mt-1 max-w-full overflow-hidden rounded-lg border border-admin-card-border sm:max-w-xs min-w-0">
                  <img
                    src={property.og_image_url}
                    alt="OG preview"
                    className="h-auto w-full max-w-full object-cover"
                  />
                </div>
              ) : (
                <p className={cn("mt-0.5", VALUE_CLASS)}>{EMPTY_PLACEHOLDER}</p>
              )}
            </div>
          </div>
        </section>

        {/* Timeline - always visible */}
        <section className={CARD_CLASS}>
          <ProfileSectionLabel
            className={cn(
              "flex items-center gap-1.5 sm:gap-2",
              SECTION_LABEL_CLASS,
            )}
          >
            <Calendar className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            Timeline
          </ProfileSectionLabel>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:mt-3 sm:gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-admin-card-border bg-muted/30 p-3 sm:p-4">
              <p className="text-sm">
                <span className={FIELD_LABEL_CLASS}>Created: </span>
                <span className={VALUE_CLASS}>
                  {formatDate(property.created_at)}
                </span>
              </p>
            </div>
            <div className="rounded-lg border border-admin-card-border bg-muted/30 p-3 sm:p-4">
              <p className="text-sm">
                <span className={FIELD_LABEL_CLASS}>Updated: </span>
                <span className={VALUE_CLASS}>
                  {formatDate(property.updated_at)}
                </span>
              </p>
            </div>
            <div className="rounded-lg border border-admin-card-border bg-muted/30 p-3 sm:p-4">
              <p className="text-sm">
                <span className={FIELD_LABEL_CLASS}>Status: </span>
                <Badge
                  variant={STATUS_COLORS[property.status]}
                  className="font-medium align-middle"
                >
                  {property.status.charAt(0).toUpperCase() +
                    property.status.slice(1)}
                </Badge>
              </p>
            </div>
          </div>
        </section>
      </div>

      <PropertySheet
        open={editSheetOpen}
        onOpenChange={setEditSheetOpen}
        property={property}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-xl border border-border bg-card shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete property?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              property listing including all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              onClick={handleDeleteConfirm}
              disabled={deleteProperty.isPending}
              variant="destructive"
              className="min-w-[100px] min-h-[44px]"
            >
              {deleteProperty.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting…
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
