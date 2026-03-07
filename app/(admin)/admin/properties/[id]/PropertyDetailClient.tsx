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
  Eye,
  PackageOpen,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PageHeader,
  type BreadcrumbItem,
} from "@/components/admin/layout/PageHeader";
import {
  ProfileSectionLabel,
  ProfileFieldLabel,
} from "@/components/admin/ProfileDetailModal";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertySheet } from "@/components/admin/properties/PropertySheet";
import { usePropertyByIdOrSlug, useDeleteProperty } from "@/hooks/useProperties";
import { formatDate } from "@/lib/utils";
import type {
  PropertyWithRelations,
  PropertyStatus,
} from "@/types";
import { cn } from "@/lib/utils";

const STATUS_COLORS: Record<
  PropertyStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  active: "default",
  draft: "secondary",
  sold: "outline",
  rented: "outline",
};

const CARD_CLASS =
  "rounded-xl border border-admin-card-border bg-admin-card-bg p-3 shadow-sm sm:p-4 lg:p-6";

const SECTION_LABEL_CLASS = "text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground";
const FIELD_LABEL_CLASS = "text-xs sm:text-sm text-muted-foreground";
const VALUE_CLASS = "text-sm sm:text-base font-medium text-foreground";
const VALUE_MUTED_CLASS = "text-sm sm:text-base text-muted-foreground leading-relaxed";

interface PropertyDetailClientProps {
  /** Property ID (UUID) or slug - both work in the URL */
  identifier: string;
}

function PropertyDetailSkeleton() {
  return (
    <div className="space-y-4 px-2 pt-4 pb-8 sm:space-y-6 sm:px-4 sm:pt-5 sm:pb-10 lg:px-8 lg:pt-6">
      {/* Overview */}
      <div className={CARD_CLASS}>
        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-start">
          <Skeleton className="h-32 w-full rounded-lg sm:h-44 sm:w-52 lg:h-48 lg:w-64" />
          <div className="min-w-0 flex-1 space-y-2 sm:space-y-3">
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
            <Skeleton className="h-7 w-28 rounded sm:h-8" />
            <Skeleton className="h-4 w-full max-w-md rounded" />
            <Skeleton className="h-4 w-[90%] max-w-md rounded" />
          </div>
        </div>
      </div>

      {/* Location + Specifications grid */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <div className={CARD_CLASS}>
          <Skeleton className="h-4 w-24 rounded" />
          <div className="mt-2 sm:mt-3 space-y-1 sm:space-y-2">
            <Skeleton className="h-3 w-14 rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-[85%] max-w-full rounded" />
          </div>
          <div className="mt-3 sm:mt-4">
            <Skeleton className="h-3 w-10 rounded" />
            <Skeleton className="mt-1 aspect-video w-full min-h-[140px] sm:min-h-[160px] rounded-lg" />
          </div>
        </div>
        <div className={CARD_CLASS}>
          <Skeleton className="h-4 w-28 rounded" />
          <div className="mt-2 sm:mt-3 grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <Skeleton key={i} className="h-14 rounded-lg sm:h-16" />
            ))}
          </div>
          <div className="mt-3 sm:mt-4">
            <Skeleton className="h-3 w-16 rounded" />
            <div className="mt-1 flex flex-wrap gap-1.5 sm:gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-5 w-14 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className={CARD_CLASS}>
        <Skeleton className="h-4 w-24 rounded" />
        <div className="mt-2 sm:mt-3 space-y-2">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-[95%] max-w-full rounded" />
          <Skeleton className="h-4 w-[70%] max-w-full rounded" />
        </div>
      </div>

      {/* Assets */}
      <div className={CARD_CLASS}>
        <Skeleton className="h-4 w-16 rounded" />
        <div className="mt-2 sm:mt-3 space-y-3 sm:space-y-4">
          <div>
            <Skeleton className="h-3 w-24 rounded" />
            <Skeleton className="mt-1 h-40 w-full max-w-md rounded-lg sm:h-48" />
          </div>
          <div>
            <Skeleton className="h-3 w-14 rounded" />
            <div className="mt-1.5 sm:mt-2 grid grid-cols-2 gap-1.5 sm:gap-2 sm:grid-cols-3 md:grid-cols-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SEO & Meta */}
      <div className={CARD_CLASS}>
        <Skeleton className="h-4 w-24 rounded" />
        <div className="mt-2 sm:mt-3 space-y-2 sm:space-y-3">
          <div>
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="mt-0.5 h-4 w-full rounded" />
          </div>
          <div>
            <Skeleton className="h-3 w-28 rounded" />
            <Skeleton className="mt-0.5 h-4 w-full rounded" />
          </div>
          <div>
            <Skeleton className="h-3 w-24 rounded" />
            <Skeleton className="mt-1 h-20 w-full max-w-xs rounded-lg" />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className={CARD_CLASS}>
        <Skeleton className="h-4 w-20 rounded" />
        <div className="mt-2 sm:mt-3 grid grid-cols-1 gap-2 sm:gap-3 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border border-admin-card-border bg-muted/30 p-3 sm:p-4">
              <Skeleton className="h-3 w-14 rounded" />
              <Skeleton className="mt-0.5 h-4 w-20 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
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
        <Button asChild variant="outline" size="sm" className="min-h-[48px] rounded-xl px-6 text-base sm:min-h-[44px] sm:text-sm">
          <Link href="/admin/properties">Back to properties</Link>
        </Button>
      </div>
    </div>
  );
}

export function PropertyDetailClient({ identifier }: PropertyDetailClientProps) {
  const router = useRouter();
  const { data: property, isLoading, isError } = usePropertyByIdOrSlug(identifier);
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

  const subtitle = [property.city, property.status, property.type]
    .filter(Boolean)
    .join(" · ");

  const viewOnSiteHref = property.slug ? `/properties/${property.slug}` : null;

  const headerActions = (
    <div className="flex flex-wrap items-center gap-2">
      {viewOnSiteHref && (
        <Button
          variant="outline"
          size="sm"
          className="min-h-[44px] gap-1.5 rounded-xl text-sm sm:text-base"
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
        size="sm"
        className="min-h-[44px] gap-1.5 rounded-xl text-sm sm:text-base"
        onClick={() => setEditSheetOpen(true)}
      >
        <Pencil className="h-4 w-4 shrink-0" />
        Edit
      </Button>
      <Button
        variant="destructive"
        size="sm"
        className="min-h-[44px] gap-1.5 rounded-xl text-sm sm:text-base"
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

  return (
    <>
      <PageHeader
        title={property.title.length > 40 ? "Property details" : property.title}
        subtitle={property.title.length > 40 ? property.title : subtitle}
        breadcrumbs={breadcrumbs}
        actions={headerActions}
      />

      <div className="space-y-4 px-2 pt-4 pb-8 sm:space-y-6 sm:px-4 sm:pt-5 sm:pb-10 lg:px-8 lg:pt-6">
        {/* Overview */}
        <section className={CARD_CLASS}>
          <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-start">
            <div className="h-32 w-full shrink-0 overflow-hidden rounded-lg border border-admin-card-border bg-muted sm:h-44 sm:w-52 lg:h-48 lg:w-64">
              {property.cover_image_url ? (
                <img
                  src={property.cover_image_url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Building2 className="h-10 w-10 text-muted-foreground sm:h-12 sm:w-12" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-2 sm:space-y-3">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <Badge variant={STATUS_COLORS[property.status]} className="text-xs sm:text-sm">
                  {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                </Badge>
                <Badge variant="outline" className="capitalize text-xs sm:text-sm">
                  {property.type}
                </Badge>
                {property.category &&
                  typeof property.category === "object" &&
                  "name" in property.category && (
                    <span className={cn(FIELD_LABEL_CLASS, "hidden sm:inline")}>
                      {(property.category as { name: string }).name}
                    </span>
                  )}
              </div>
              <p className={cn("text-xl sm:text-2xl font-semibold text-foreground", VALUE_CLASS)}>
                ₹{Number(property.price).toLocaleString("en-IN")}
                {property.price_label && (
                  <span className="ml-1.5 text-sm font-normal text-muted-foreground sm:ml-2">
                    {property.price_label}
                  </span>
                )}
              </p>
              {property.short_description && (
                <p className={VALUE_MUTED_CLASS}>
                  {property.short_description}
                </p>
              )}
            </div>
          </div>
        </section>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Location */}
          <section className={CARD_CLASS}>
            <ProfileSectionLabel className={cn("flex items-center gap-1.5 sm:gap-2", SECTION_LABEL_CLASS)}>
              <MapPin className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
              Location
            </ProfileSectionLabel>
            <div className="mt-2 sm:mt-3 space-y-1 sm:space-y-2">
              <span className={FIELD_LABEL_CLASS}>Address</span>
              <p className={VALUE_CLASS}>
                {locationParts.length > 0 ? locationParts.join(", ") : "—"}
              </p>
            </div>
            {property.map_embed_url && (
              <div className="mt-3 sm:mt-4">
                <span className={FIELD_LABEL_CLASS}>Map</span>
                <div className="mt-1 aspect-video w-full overflow-hidden rounded-lg border border-admin-card-border min-h-[140px] sm:min-h-[160px]">
                  <iframe
                    title="Location map"
                    src={property.map_embed_url}
                    className="h-full w-full"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            )}
          </section>

          {/* Specifications */}
          <section className={CARD_CLASS}>
            <ProfileSectionLabel className={cn("flex items-center gap-1.5 sm:gap-2", SECTION_LABEL_CLASS)}>
              <LayoutGrid className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
              Specifications
            </ProfileSectionLabel>
            <div className="mt-2 sm:mt-3 grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-3">
              {[
                { label: "Area", value: property.area_sqft ? `${property.area_sqft} sqft` : null },
                { label: "Bedrooms", value: property.bedrooms },
                { label: "Bathrooms", value: property.bathrooms },
                { label: "Floors", value: property.floors },
                { label: "Facing", value: property.facing },
                { label: "Age", value: property.age_years != null ? `${property.age_years} yrs` : null },
                { label: "Furnished", value: property.furnished },
                { label: "Plot no.", value: property.plot_number },
                { label: "Plot dims", value: property.plot_dimensions },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-lg border border-admin-card-border bg-muted/30 p-2.5 sm:p-3"
                >
                  <ProfileFieldLabel className={FIELD_LABEL_CLASS}>{label}</ProfileFieldLabel>
                  <p className={cn("mt-0.5", VALUE_CLASS)}>{value ?? "—"}</p>
                </div>
              ))}
            </div>
            {property.amenities && property.amenities.length > 0 && (
              <div className="mt-3 sm:mt-4">
                <ProfileFieldLabel className={FIELD_LABEL_CLASS}>Amenities</ProfileFieldLabel>
                <div className="mt-1 flex flex-wrap gap-1.5 sm:gap-2">
                  {property.amenities.map((a) => (
                    <Badge key={a} variant="secondary" className="rounded-lg text-xs sm:text-sm">
                      {a}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {property.highlights && property.highlights.length > 0 && (
              <div className="mt-3 sm:mt-4">
                <ProfileFieldLabel className={FIELD_LABEL_CLASS}>Highlights</ProfileFieldLabel>
                <ul className={cn("mt-1 list-inside list-disc", VALUE_CLASS)}>
                  {property.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>

        {/* Description */}
        <section className={CARD_CLASS}>
          <ProfileSectionLabel className={cn("flex items-center gap-1.5 sm:gap-2", SECTION_LABEL_CLASS)}>
            <FileText className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            Description
          </ProfileSectionLabel>
          <p className={cn("mt-2 sm:mt-3 whitespace-pre-wrap", VALUE_MUTED_CLASS)}>
            {property.description || "No description provided."}
          </p>
        </section>

        {/* Assets */}
        <section className={CARD_CLASS}>
          <ProfileSectionLabel className={cn("flex items-center gap-1.5 sm:gap-2", SECTION_LABEL_CLASS)}>
            <ImageIcon className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            Assets
          </ProfileSectionLabel>
          <div className="mt-2 sm:mt-3 space-y-3 sm:space-y-4">
            {property.cover_image_url && (
              <div>
                <span className={FIELD_LABEL_CLASS}>Cover image</span>
                <div className="mt-1 max-w-full overflow-hidden rounded-lg border border-admin-card-border sm:max-w-md">
                  <img
                    src={property.cover_image_url}
                    alt="Cover"
                    className="h-auto w-full object-cover"
                  />
                </div>
              </div>
            )}
            {property.gallery_images && property.gallery_images.length > 0 && (
              <div>
                <span className={FIELD_LABEL_CLASS}>Gallery</span>
                <div className="mt-1.5 sm:mt-2 grid grid-cols-2 gap-1.5 sm:gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {property.gallery_images.map((url, i) => (
                    <div
                      key={i}
                      className="aspect-square overflow-hidden rounded-lg border border-admin-card-border"
                    >
                      <img
                        src={url}
                        alt={`Gallery ${i + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!property.cover_image_url &&
              (!property.gallery_images || property.gallery_images.length === 0) && (
                <p className={VALUE_MUTED_CLASS}>No images.</p>
              )}
          </div>
        </section>

        {/* SEO / Meta (optional) */}
        {(property.meta_title ||
          property.meta_description ||
          property.meta_keywords ||
          property.og_image_url) && (
          <section className={CARD_CLASS}>
            <ProfileSectionLabel className={SECTION_LABEL_CLASS}>SEO & Meta</ProfileSectionLabel>
            <div className="mt-2 sm:mt-3 space-y-2 sm:space-y-3">
              {property.meta_title && (
                <div>
                  <span className={FIELD_LABEL_CLASS}>Meta title</span>
                  <p className={cn("mt-0.5", VALUE_CLASS)}>{property.meta_title}</p>
                </div>
              )}
              {property.meta_description && (
                <div>
                  <span className={FIELD_LABEL_CLASS}>Meta description</span>
                  <p className={cn("mt-0.5", VALUE_MUTED_CLASS)}>{property.meta_description}</p>
                </div>
              )}
              {property.meta_keywords && (
                <div>
                  <span className={FIELD_LABEL_CLASS}>Meta keywords</span>
                  <p className={cn("mt-0.5", VALUE_MUTED_CLASS)}>{property.meta_keywords}</p>
                </div>
              )}
              {property.og_image_url && (
                <div>
                  <span className={FIELD_LABEL_CLASS}>OG image</span>
                  <div className="mt-1 max-w-full overflow-hidden rounded-lg border border-admin-card-border sm:max-w-xs">
                    <img
                      src={property.og_image_url}
                      alt="OG preview"
                      className="h-auto w-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Timeline */}
        <section className={CARD_CLASS}>
          <ProfileSectionLabel className={cn("flex items-center gap-1.5 sm:gap-2", SECTION_LABEL_CLASS)}>
            <Calendar className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            Timeline
          </ProfileSectionLabel>
          <div className="mt-2 sm:mt-3 grid grid-cols-1 gap-2 sm:gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-admin-card-border bg-muted/30 p-3 sm:p-4">
              <ProfileFieldLabel className={FIELD_LABEL_CLASS}>Created</ProfileFieldLabel>
              <p className={cn("mt-0.5", VALUE_CLASS)}>{formatDate(property.created_at)}</p>
            </div>
            <div className="rounded-lg border border-admin-card-border bg-muted/30 p-3 sm:p-4">
              <ProfileFieldLabel className={FIELD_LABEL_CLASS}>Updated</ProfileFieldLabel>
              <p className={cn("mt-0.5", VALUE_CLASS)}>{formatDate(property.updated_at)}</p>
            </div>
            <div className="rounded-lg border border-admin-card-border bg-muted/30 p-3 sm:p-4">
              <ProfileFieldLabel className={cn("flex items-center gap-1", FIELD_LABEL_CLASS)}>
                <Eye className="h-3.5 w-3.5 shrink-0" />
                Views
              </ProfileFieldLabel>
              <p className={cn("mt-0.5", VALUE_CLASS)}>{property.views ?? 0}</p>
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
              className="min-w-[100px]"
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
