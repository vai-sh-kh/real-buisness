"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  propertySchema,
  type PropertyFormValues,
} from "@/lib/validations/property.schema";
import { useCreateProperty, useUpdateProperty } from "@/hooks/useProperties";
import { useScrollToFirstError } from "@/hooks/useScrollToFirstError";
import { useAllCategories } from "@/hooks/useCategories";
import { useAmenities } from "@/hooks/useAmenities";
import { slugify, cn } from "@/lib/utils";
import type { PropertyWithRelations } from "@/types";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/useIsMobile";
import { AmenitiesModal } from "./AmenitiesModal";
import { CoverImageDropzone } from "./CoverImageDropzone";
import { GalleryDropzone } from "./GalleryDropzone";

function RequiredStar() {
  return <span className="text-red-500">*</span>;
}

interface PropertySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property?: PropertyWithRelations | null;
  /** When set, sheet will open to this tab (e.g. "assets" to fix map link). */
  openToTab?: "general" | "assets" | "specs" | "seo";
}

const defaultValues: PropertyFormValues = {
  title: "",
  slug: "",
  description: null,
  short_description: null,
  type: "sale",
  status: "active",
  category_id: null,
  price: undefined as unknown as number,
  price_label: null,
  area_sqft: null,
  bedrooms: null,
  bathrooms: null,
  floors: null,
  facing: null,
  age_years: null,
  address: "",
  city: "",
  state: "",
  zip_code: null,
  country: "India",
  latitude: null,
  longitude: null,
  map_embed_url: null,
  cover_image_url: null,
  gallery_images: null,
  furnished: null,
  amenities: [],
  highlights: null,
  plot_number: null,
  plot_dimensions: null,
  meta_title: null,
  meta_description: null,
  meta_keywords: null,
  og_image_url: null,
};

export function PropertySheet({
  open,
  onOpenChange,
  property,
  openToTab,
}: PropertySheetProps) {
  const isMobile = useIsMobile();
  const isEditing = !!property;
  const [activeTab, setActiveTab] = useState<
    "general" | "assets" | "specs" | "seo"
  >("general");
  const [createdPropertyId, setCreatedPropertyId] = useState<string | null>(
    null,
  );
  const [assetsStepCompleted, setAssetsStepCompleted] = useState(false);
  const [specsStepCompleted, setSpecsStepCompleted] = useState(false);
  const [amenitiesModalOpen, setAmenitiesModalOpen] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [coverUploading, setCoverUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const assetsUploading = coverUploading || galleryUploading;
  const uploadAbortRef = useRef<AbortController | null>(null);
  const [uploadAbortSignal, setUploadAbortSignal] =
    useState<AbortSignal | null>(null);
  const prevActiveTabRef = useRef(activeTab);

  // When sheet opens with openToTab, switch to that tab
  useEffect(() => {
    if (open && openToTab) {
      setActiveTab(openToTab);
    }
  }, [open, openToTab]);

  // Abort uploads when sheet closes
  useEffect(() => {
    if (!open) {
      uploadAbortRef.current?.abort();
      uploadAbortRef.current = null;
      setUploadAbortSignal(null);
      return;
    }
    const ctrl = new AbortController();
    uploadAbortRef.current = ctrl;
    setUploadAbortSignal(ctrl.signal);
    return () => {
      ctrl.abort();
      uploadAbortRef.current = null;
      setUploadAbortSignal(null);
    };
  }, [open]);

  // Abort uploads when user changes tab (e.g. away from Assets)
  useEffect(() => {
    if (!open) return;
    if (prevActiveTabRef.current === activeTab) return;
    uploadAbortRef.current?.abort();
    const ctrl = new AbortController();
    uploadAbortRef.current = ctrl;
    setUploadAbortSignal(ctrl.signal);
    prevActiveTabRef.current = activeTab;
  }, [open, activeTab]);
  const createMutation = useCreateProperty();
  const updateMutation = useUpdateProperty();
  const effectivePropertyId = property?.id ?? createdPropertyId ?? null;
  const { data: categories = [] } = useAllCategories();
  const { data: amenitiesList = [] } = useAmenities();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    trigger,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues,
  });

  const titleValue = watch("title");

  useEffect(() => {
    if (property) {
      reset({
        title: property.title,
        slug: property.slug,
        description: property.description,
        short_description: property.short_description,
        type: property.type,
        status: property.status,
        category_id: property.category_id,
        price: Number(property.price),
        price_label: property.price_label,
        area_sqft:
          property.area_sqft != null ? Number(property.area_sqft) : null,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        floors: property.floors,
        facing: property.facing,
        age_years: property.age_years,
        address: property.address,
        city: property.city,
        state: property.state,
        zip_code: property.zip_code,
        country: property.country,
        latitude: property.latitude != null ? Number(property.latitude) : null,
        longitude:
          property.longitude != null ? Number(property.longitude) : null,
        map_embed_url: property.map_embed_url,
        cover_image_url: property.cover_image_url,
        gallery_images: property.gallery_images ?? null,
        furnished: property.furnished ?? undefined,
        amenities: property.amenities ?? [],
        highlights: property.highlights ?? undefined,
        plot_number: property.plot_number,
        plot_dimensions: property.plot_dimensions,
        meta_title: property.meta_title,
        meta_description: property.meta_description,
        meta_keywords: property.meta_keywords,
        og_image_url: property.og_image_url,
      });
    } else {
      reset(defaultValues);
    }
    setCoverFile(null);
    setGalleryFiles([]);
    setCoverUploading(false);
    setGalleryUploading(false);
    setCreatedPropertyId(null);
    setActiveTab("general");
    if (property) {
      setAssetsStepCompleted(true);
      setSpecsStepCompleted(true);
      if (property.map_embed_url?.trim()) {
        trigger("map_embed_url").catch(() => {});
      }
    } else {
      setAssetsStepCompleted(false);
      setSpecsStepCompleted(false);
    }
  }, [property, reset, open, trigger]);

  // Auto-generate slug from title when creating
  useEffect(() => {
    if (!isEditing && titleValue) {
      setValue("slug", slugify(titleValue));
    }
  }, [titleValue, isEditing, setValue]);

  const isPending = createMutation.isPending || updateMutation.isPending;

  const generalComplete = isEditing || createdPropertyId !== null;
  const assetsTabEnabled = generalComplete;
  const specsTabEnabled =
    assetsTabEnabled && (isEditing || assetsStepCompleted);
  const seoTabEnabled = specsTabEnabled && (isEditing || specsStepCompleted);

  const GENERAL_FIELDS = new Set([
    "title",
    "slug",
    "type",
    "status",
    "category_id",
    "price",
    "price_label",
    "cover_image_url",
    "short_description",
    "description",
    "address",
    "city",
    "state",
    "zip_code",
    "country",
    "latitude",
    "longitude",
  ]);
  const ASSETS_FIELDS = new Set(["gallery_images", "map_embed_url"]);
  const SPECS_FIELDS = new Set([
    "area_sqft",
    "bedrooms",
    "bathrooms",
    "floors",
    "facing",
    "age_years",
    "furnished",
    "amenities",
    "plot_number",
    "plot_dimensions",
    "highlights",
  ]);
  const SEO_FIELDS = new Set([
    "meta_title",
    "meta_description",
    "meta_keywords",
    "og_image_url",
  ]);

  useScrollToFirstError(errors, {
    onFirstError: (field) => {
      if (GENERAL_FIELDS.has(field)) setActiveTab("general");
      else if (ASSETS_FIELDS.has(field)) setActiveTab("assets");
      else if (SPECS_FIELDS.has(field)) setActiveTab("specs");
      else if (SEO_FIELDS.has(field)) setActiveTab("seo");
    },
  });

  const GENERAL_REQUIRED_FIELDS = [
    "title",
    "type",
    "price",
    "cover_image_url",
    "address",
    "city",
    "state",
  ] as const;

  async function buildPayload(): Promise<PropertyFormValues> {
    const v = getValues();
    const payload = { ...v } as PropertyFormValues;
    if (!payload.cover_image_url?.trim()) payload.cover_image_url = null;
    if (!payload.og_image_url?.trim()) payload.og_image_url = null;
    if (!payload.map_embed_url?.trim()) payload.map_embed_url = null;
    if (!payload.gallery_images?.length) payload.gallery_images = null;
    return payload;
  }

  async function uploadPendingFiles(
    propertyId: string,
    payload: PropertyFormValues,
  ): Promise<PropertyFormValues> {
    const signal = uploadAbortRef.current?.signal;
    let result = { ...payload };
    if (coverFile) {
      const fd = new FormData();
      fd.set("propertyId", propertyId);
      fd.set("type", "cover");
      fd.set("file", coverFile);
      const res = await fetch("/api/admin/properties/upload", {
        method: "POST",
        credentials: "include",
        body: fd,
        signal: signal ?? undefined,
      });
      if (res.headers.get("content-type")?.includes("application/json")) {
        const json = await res.json();
        if (res.ok && json.url) {
          result.cover_image_url = json.url;
        } else if (!signal?.aborted) {
          toast.error(json.error || "Cover image upload failed");
        }
      }
    }
    if (galleryFiles.length > 0) {
      const fd = new FormData();
      fd.set("propertyId", propertyId);
      fd.set("type", "gallery");
      galleryFiles.forEach((f) => fd.append("files", f));
      const res = await fetch("/api/admin/properties/upload", {
        method: "POST",
        credentials: "include",
        body: fd,
        signal: signal ?? undefined,
      });
      if (res.headers.get("content-type")?.includes("application/json")) {
        const json = await res.json();
        if (res.ok && json.urls?.length) {
          const existing = result.gallery_images ?? [];
          result.gallery_images = [...existing, ...json.urls];
        } else if (!res.ok && !signal?.aborted) {
          toast.error(json.error || "Gallery upload failed");
        }
      }
    }
    return result;
  }

  async function handleSaveAndNext(nextTab: "assets" | "specs" | "seo") {
    const payload = await buildPayload();
    const id = effectivePropertyId;

    if (activeTab === "general") {
      const valid = await trigger(GENERAL_REQUIRED_FIELDS);
      if (!valid) return;
      if (isEditing && property) {
        await updateMutation.mutateAsync({ id: property.id, values: payload });
      } else {
        const slugToCheck =
          (payload.slug && payload.slug.trim()) || slugify(payload.title);
        const checkRes = await fetch(
          `/api/admin/properties/check-slug?slug=${encodeURIComponent(slugToCheck)}`,
          { credentials: "include" },
        );
        const checkJson = (await checkRes.json()) as { exists?: boolean };
        if (checkJson.exists) {
          setError("slug", {
            type: "manual",
            message: "A property with this URL slug already exists.",
          });
          return;
        }
        const created = await createMutation.mutateAsync(payload);
        const newId = (created as { id: string }).id;
        setCreatedPropertyId(newId);
      }
      setActiveTab("assets");
      return;
    }

    if (activeTab === "assets") {
      if (!id) {
        toast.error("Please complete the General & Location tab first");
        return;
      }
      const hasCoverUrl = !!payload.cover_image_url?.trim();
      const hasCoverFile = !!coverFile;
      if (!hasCoverUrl && !hasCoverFile) {
        toast.error("Please add a cover image");
        setActiveTab("assets");
        return;
      }
      let finalPayload = payload;
      if (coverFile || galleryFiles.length > 0) {
        try {
          finalPayload = await uploadPendingFiles(id, payload);
          if (coverFile && !finalPayload.cover_image_url?.trim()) {
            toast.error("Cover image upload failed");
            return;
          }
          setCoverFile(null);
          setGalleryFiles([]);
          setValue("cover_image_url", finalPayload.cover_image_url);
          setValue("gallery_images", finalPayload.gallery_images);
        } catch (e) {
          if (e instanceof Error && e.name === "AbortError") return;
          toast.error(e instanceof Error ? e.message : "Upload failed");
          return;
        }
      }
      await updateMutation.mutateAsync({
        id,
        values: {
          cover_image_url: finalPayload.cover_image_url,
          gallery_images: finalPayload.gallery_images,
          map_embed_url: finalPayload.map_embed_url,
        },
      });
      setAssetsStepCompleted(true);
      setActiveTab("specs");
      return;
    }

    if (activeTab === "specs") {
      if (!id) {
        toast.error("Please complete the previous tab first");
        return;
      }
      await updateMutation.mutateAsync({
        id,
        values: {
          area_sqft: payload.area_sqft,
          bedrooms: payload.bedrooms,
          bathrooms: payload.bathrooms,
          floors: payload.floors,
          facing: payload.facing,
          age_years: payload.age_years,
          furnished: payload.furnished,
          amenities: payload.amenities,
          plot_number: payload.plot_number,
          plot_dimensions: payload.plot_dimensions,
          highlights: payload.highlights,
        },
      });
      setSpecsStepCompleted(true);
      setActiveTab("seo");
    }
  }

  async function onSubmit(values: PropertyFormValues) {
    const payload = await buildPayload();
    const id = effectivePropertyId;

    if (!id) {
      toast.error("Please complete the previous tabs first");
      return;
    }

    const hasCover = !!payload.cover_image_url?.trim() || !!coverFile;
    if (!hasCover) {
      toast.error("Please add a cover image");
      setActiveTab("assets");
      return;
    }

    // Upload pending files if we have any
    if (coverFile || galleryFiles.length > 0) {
      try {
        const finalPayload = await uploadPendingFiles(id, payload);
        await updateMutation.mutateAsync({ id, values: finalPayload });
      } catch (e) {
        if (e instanceof Error && e.name === "AbortError") return;
        console.error("Upload failed:", e);
        toast.error(e instanceof Error ? e.message : "Upload failed");
        return;
      }
    } else {
      await updateMutation.mutateAsync({
        id,
        values: {
          meta_title: payload.meta_title,
          meta_description: payload.meta_description,
          meta_keywords: payload.meta_keywords,
          og_image_url: payload.og_image_url,
        },
      });
    }

    onOpenChange(false);
    reset(defaultValues);
    setCoverFile(null);
    setGalleryFiles([]);
    setCreatedPropertyId(null);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={cn(
          "w-full p-0 overflow-hidden bg-white/95 backdrop-blur-xl flex flex-col max-h-[100dvh]",
          isMobile
            ? "max-h-[90vh] rounded-t-2xl border-t border-gray-100"
            : "sm:max-w-4xl border-l border-gray-100 h-full max-h-[100dvh]",
        )}
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-6 lg:p-8 text-white relative overflow-hidden shrink-0">
          <div className="relative z-10">
            <div className="mb-4">
              <SheetTitle className="text-xl font-bold text-white leading-tight">
                {isEditing ? "Modify Listing" : "New Property"}
              </SheetTitle>
              <SheetDescription className="text-gray-400 text-xs mt-1">
                {isEditing
                  ? "Complete control over property data"
                  : "Start your next successful listing"}
              </SheetDescription>
            </div>
          </div>
          {/* Decorative shapes */}
          <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl shrink-0" />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 min-h-0 overflow-hidden"
        >
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 pb-6">
            <Tabs
              value={activeTab}
              onValueChange={(v) => {
                const next = v as "general" | "assets" | "specs" | "seo";
                if (next === "assets" && !assetsTabEnabled) return;
                if (next === "specs" && !specsTabEnabled) return;
                if (next === "seo" && !seoTabEnabled) return;
                setActiveTab(next);
              }}
              className="w-full"
            >
              <TabsList className="mb-8 flex h-11 w-full flex-nowrap justify-start overflow-x-auto rounded-xl bg-muted/60 p-1.5 gap-1">
                <TabsTrigger
                  type="button"
                  value="general"
                  className={cn(
                    "shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                    "text-muted-foreground hover:text-foreground/80",
                    "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-none",
                    "data-[state=active]:border-2 data-[state=active]:border-amber-200/90 data-[state=active]:ring-0",
                  )}
                >
                  General & Location
                </TabsTrigger>
                <TabsTrigger
                  type="button"
                  value="assets"
                  disabled={!assetsTabEnabled}
                  title={
                    !assetsTabEnabled
                      ? "Add the property in General tab"
                      : undefined
                  }
                  className={cn(
                    "shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                    "text-muted-foreground hover:text-foreground/80",
                    "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-none",
                    "data-[state=active]:border-2 data-[state=active]:border-amber-200/90 data-[state=active]:ring-0",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                  )}
                >
                  Assets
                </TabsTrigger>
                <TabsTrigger
                  type="button"
                  value="specs"
                  disabled={!specsTabEnabled}
                  title={
                    !specsTabEnabled
                      ? "Add the property in General tab"
                      : undefined
                  }
                  className={cn(
                    "shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                    "text-muted-foreground hover:text-foreground/80",
                    "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-none",
                    "data-[state=active]:border-2 data-[state=active]:border-amber-200/90 data-[state=active]:ring-0",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                  )}
                >
                  Specifications
                </TabsTrigger>
                <TabsTrigger
                  type="button"
                  value="seo"
                  disabled={!seoTabEnabled}
                  title={
                    !seoTabEnabled
                      ? "Add the property in General tab"
                      : undefined
                  }
                  className={cn(
                    "shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                    "text-muted-foreground hover:text-foreground/80",
                    "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-none",
                    "data-[state=active]:border-2 data-[state=active]:border-amber-200/90 data-[state=active]:ring-0",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                  )}
                >
                  SEO Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="mt-0 space-y-12">
                {/* Basic Info Section */}
                <section className="space-y-6 mb-10">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="h-1 w-6 bg-indigo-500 rounded-full" />
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 block">
                      General Information
                    </Label>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2" data-error-field="title">
                      <Label
                        htmlFor="title"
                        className="text-xs font-bold text-gray-700 ml-1 flex items-center gap-1"
                      >
                        Listing Title <RequiredStar />
                      </Label>
                      <Input
                        id="title"
                        {...register("title")}
                        placeholder="e.g., Luxury Villa in Bandra"
                        className="h-12 rounded-xl border-gray-200 focus:ring-indigo-500 text-base font-medium shadow-sm"
                      />
                      {errors.title && (
                        <p className="text-xs text-destructive font-medium ml-1">
                          {errors.title.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2" data-error-field="slug">
                      <Label
                        htmlFor="slug"
                        className="text-xs font-bold text-gray-700 ml-1"
                      >
                        URL slug
                      </Label>
                      <Input
                        id="slug"
                        {...register("slug")}
                        placeholder="auto-generated from title"
                        className="h-11 rounded-xl border-gray-200 focus:ring-indigo-500 text-sm font-mono"
                      />
                      {errors.slug && (
                        <p className="text-xs text-destructive font-medium ml-1">
                          {errors.slug.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 items-start">
                      <div
                        className="flex flex-col gap-2"
                        data-error-field="type"
                      >
                        <Label className="text-xs font-bold text-gray-700 ml-1 min-h-[1.25rem] flex items-center gap-1">
                          Type <RequiredStar />
                        </Label>
                        <Select
                          value={watch("type")}
                          onValueChange={(v) =>
                            setValue("type", v as "sale" | "rent")
                          }
                        >
                          <SelectTrigger className="h-12 w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl shadow-2xl">
                            <SelectItem value="sale" className="rounded-lg">
                              For Sale
                            </SelectItem>
                            <SelectItem value="rent" className="rounded-lg">
                              For Rent
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div
                        className="flex flex-col gap-2"
                        data-error-field="status"
                      >
                        <Label className="text-xs font-bold text-gray-700 ml-1 min-h-[1.25rem] flex items-center">
                          Status
                        </Label>
                        <Select
                          value={watch("status")}
                          onValueChange={(v) =>
                            setValue(
                              "status",
                              v as PropertyFormValues["status"],
                            )
                          }
                        >
                          <SelectTrigger className="h-12 w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl shadow-2xl">
                            <SelectItem value="active" className="rounded-lg">
                              Active
                            </SelectItem>
                            <SelectItem value="draft" className="rounded-lg">
                              Draft
                            </SelectItem>
                            <SelectItem value="sold" className="rounded-lg">
                              Sold
                            </SelectItem>
                            <SelectItem value="rented" className="rounded-lg">
                              Rented
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 items-start">
                      <div
                        className="flex flex-col gap-2"
                        data-error-field="category_id"
                      >
                        <Label className="text-xs font-bold text-gray-700 ml-1 min-h-[1.25rem] flex items-center">
                          Category
                        </Label>
                        <Select
                          value={watch("category_id") || "none"}
                          onValueChange={(v) =>
                            setValue("category_id", v === "none" ? null : v)
                          }
                        >
                          <SelectTrigger className="h-12 w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl shadow-2xl">
                            <SelectItem
                              value="none"
                              className="rounded-lg text-gray-400"
                            >
                              None
                            </SelectItem>
                            {categories.map((cat) => (
                              <SelectItem
                                key={cat.id}
                                value={cat.id}
                                className="rounded-lg"
                              >
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div
                        className="flex flex-col gap-2"
                        data-error-field="price"
                      >
                        <Label
                          htmlFor="price"
                          className="text-xs font-bold text-gray-700 ml-1 min-h-[1.25rem] flex items-center gap-1"
                        >
                          Price (₹) <RequiredStar />
                        </Label>
                        <div className="relative w-full">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">
                            ₹
                          </span>
                          <Input
                            id="price"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            {...register("price", {
                              setValueAs: (v) => {
                                if (v === "" || v == null) return undefined;
                                const digits = String(v).replace(/\D/g, "");
                                return digits === ""
                                  ? undefined
                                  : Number(digits);
                              },
                            })}
                            onKeyDown={(e) => {
                              if (
                                !/[\d]/.test(e.key) &&
                                ![
                                  "Backspace",
                                  "Tab",
                                  "ArrowLeft",
                                  "ArrowRight",
                                  "Delete",
                                ].includes(e.key)
                              ) {
                                e.preventDefault();
                              }
                            }}
                            onPaste={(e) => {
                              e.preventDefault();
                              const digits = e.clipboardData
                                .getData("text")
                                .replace(/\D/g, "");
                              setValue(
                                "price",
                                digits === "" ? 0 : Number(digits),
                              );
                            }}
                            placeholder="5000000"
                            className="h-12 w-full rounded-xl border-gray-200 focus:ring-indigo-500 pl-8 font-bold"
                          />
                        </div>
                        {errors.price && (
                          <p className="text-xs text-destructive font-medium ml-1">
                            {errors.price.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div
                      className="flex flex-col gap-2"
                      data-error-field="cover_image_url"
                    >
                      <Label className="text-xs font-bold text-gray-700 ml-1 flex items-center gap-1">
                        Cover Image <RequiredStar />
                      </Label>
                      <CoverImageDropzone
                        value={watch("cover_image_url") ?? null}
                        onValueChange={(v) => setValue("cover_image_url", v)}
                        onFileSelect={setCoverFile}
                        propertyId={effectivePropertyId}
                        pendingFile={coverFile}
                        disabled={isPending}
                        onUploadingChange={setCoverUploading}
                        onValidationError={(msg) =>
                          msg
                            ? setError("cover_image_url", {
                                type: "manual",
                                message: msg,
                              })
                            : clearErrors("cover_image_url")
                        }
                        onErrorClear={() => clearErrors("cover_image_url")}
                        uploadAbortSignal={uploadAbortSignal}
                      />
                      {errors.cover_image_url && (
                        <p className="text-xs text-destructive font-medium ml-1">
                          {errors.cover_image_url.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="short_description"
                        className="text-xs font-bold text-gray-700 ml-1"
                      >
                        Short Description (max 160 chars)
                      </Label>
                      <Textarea
                        id="short_description"
                        {...register("short_description")}
                        placeholder="Brief summary for cards and listings..."
                        className="min-h-[80px] rounded-2xl border-gray-200 focus:ring-indigo-500 p-4 leading-relaxed text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="description"
                        className="text-xs font-bold text-gray-700 ml-1"
                      >
                        Exhaustive Description
                      </Label>
                      <Textarea
                        id="description"
                        {...register("description")}
                        placeholder="Provide a detailed overview of the property..."
                        className="min-h-[160px] rounded-2xl border-gray-200 focus:ring-indigo-500 p-4 leading-relaxed text-sm"
                      />
                    </div>
                  </div>
                </section>

                {/* Location Section */}
                <section className="space-y-6 mb-8">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="h-1 w-6 bg-emerald-500 rounded-full" />
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 block">
                      Location Details
                    </Label>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2" data-error-field="address">
                      <Label
                        htmlFor="address"
                        className="text-xs font-bold text-gray-700 ml-1 flex items-center gap-1"
                      >
                        Physical Address <RequiredStar />
                      </Label>
                      <Textarea
                        id="address"
                        {...register("address")}
                        placeholder="House/Plot No, Street name, Locality..."
                        className="min-h-[100px] rounded-2xl border-gray-200 focus:ring-indigo-500 p-4 leading-relaxed text-sm"
                      />
                      {errors.address && (
                        <p className="text-xs text-destructive font-medium ml-1">
                          {errors.address.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 items-start">
                      <div
                        className="flex flex-col gap-2"
                        data-error-field="city"
                      >
                        <Label
                          htmlFor="city"
                          className="text-xs font-bold text-gray-700 ml-1 min-h-[1.25rem] flex items-center gap-1"
                        >
                          City <RequiredStar />
                        </Label>
                        <Input
                          id="city"
                          {...register("city")}
                          placeholder="Kochi"
                          className="h-12 w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                        />
                        {errors.city && (
                          <p className="text-xs text-destructive font-medium ml-1">
                            {errors.city.message}
                          </p>
                        )}
                      </div>
                      <div
                        className="flex flex-col gap-2"
                        data-error-field="state"
                      >
                        <Label
                          htmlFor="state"
                          className="text-xs font-bold text-gray-700 ml-1 min-h-[1.25rem] flex items-center gap-1"
                        >
                          State <RequiredStar />
                        </Label>
                        <Input
                          id="state"
                          {...register("state")}
                          placeholder="Kerala"
                          className="h-12 w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                        />
                        {errors.state && (
                          <p className="text-xs text-destructive font-medium ml-1">
                            {errors.state.message}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="zip_code"
                          className="text-xs font-bold text-gray-700 ml-1 min-h-[1.25rem] flex items-center"
                        >
                          Zip / PIN Code
                        </Label>
                        <Input
                          id="zip_code"
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={20}
                          {...register("zip_code")}
                          onKeyDown={(e) => {
                            if (
                              !/[\d]/.test(e.key) &&
                              ![
                                "Backspace",
                                "Tab",
                                "ArrowLeft",
                                "ArrowRight",
                                "Delete",
                              ].includes(e.key)
                            ) {
                              e.preventDefault();
                            }
                          }}
                          onPaste={(e) => {
                            e.preventDefault();
                            const digits = e.clipboardData
                              .getData("text")
                              .replace(/\D/g, "")
                              .slice(0, 20);
                            setValue("zip_code", digits);
                          }}
                          placeholder="400001"
                          className="h-12 w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                        />
                      </div>
                    </div>
                  </div>
                </section>
              </TabsContent>

              <TabsContent value="assets" className="mt-0 space-y-12">
                <section className="space-y-6">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="h-1 w-6 bg-cyan-500 rounded-full" />
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 block">
                      Property Assets
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6 ml-1">
                    Upload gallery images (max 10) and add map embed.
                  </p>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="flex flex-col gap-2">
                      <Label className="text-xs font-bold text-gray-700 ml-1 min-h-[1.25rem] flex items-center">
                        Gallery Images
                      </Label>
                      <GalleryDropzone
                        value={watch("gallery_images") ?? []}
                        onValueChange={(v) => setValue("gallery_images", v)}
                        onFilesSelect={setGalleryFiles}
                        propertyId={effectivePropertyId}
                        pendingFiles={galleryFiles}
                        disabled={isPending}
                        onUploadingChange={setGalleryUploading}
                        uploadAbortSignal={uploadAbortSignal}
                      />
                    </div>

                    <div
                      className="flex flex-col gap-2"
                      data-error-field="map_embed_url"
                    >
                      <Label
                        htmlFor="map_embed_url"
                        className="text-xs font-bold text-gray-700 ml-1 min-h-[1.25rem] flex items-center"
                      >
                        Map Embed URL
                      </Label>
                      <Input
                        id="map_embed_url"
                        {...register("map_embed_url")}
                        placeholder="https://www.google.com/maps/embed?pb=..."
                        className={cn(
                          "h-12 w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0",
                          errors.map_embed_url &&
                            "border-destructive focus:ring-destructive",
                        )}
                      />
                      {errors.map_embed_url && (
                        <p className="text-xs text-destructive font-medium ml-1">
                          {errors.map_embed_url.message}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground ml-1">
                        Paste a Google Maps URL (embed or share link, e.g.
                        maps.app.goo.gl or Share → Embed a map)
                      </p>
                    </div>
                  </div>
                </section>
              </TabsContent>

              <TabsContent value="specs" className="mt-0">
                {/* Property Specifications */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="h-1 w-6 bg-amber-500 rounded-full" />
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 block">
                      Property Specifications
                    </Label>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-start">
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="area_sqft"
                        className="text-xs font-bold text-gray-700 ml-1 min-h-[1.25rem] text-center block"
                      >
                        Area (sqft)
                      </Label>
                      <Input
                        id="area_sqft"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*\.?[0-9]*"
                        {...register("area_sqft", {
                          setValueAs: (v) => (v === "" ? undefined : Number(v)),
                        })}
                        placeholder="0"
                        className="h-12 w-full rounded-xl text-center font-bold"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="bedrooms"
                        className="text-xs font-bold text-gray-700 ml-1 min-h-[1.25rem] text-center block"
                      >
                        Beds
                      </Label>
                      <Input
                        id="bedrooms"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        {...register("bedrooms", {
                          setValueAs: (v) => (v === "" ? undefined : Number(v)),
                        })}
                        placeholder="0"
                        className="h-12 w-full rounded-xl text-center font-bold"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="bathrooms"
                        className="text-xs font-bold text-gray-700 ml-1 min-h-[1.25rem] text-center block"
                      >
                        Baths
                      </Label>
                      <Input
                        id="bathrooms"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        {...register("bathrooms", {
                          setValueAs: (v) => (v === "" ? undefined : Number(v)),
                        })}
                        placeholder="0"
                        className="h-12 w-full rounded-xl text-center font-bold"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="floors"
                        className="text-xs font-bold text-gray-700 ml-1 min-h-[1.25rem] text-center block"
                      >
                        Floors
                      </Label>
                      <Input
                        id="floors"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        {...register("floors", {
                          setValueAs: (v) => (v === "" ? undefined : Number(v)),
                        })}
                        placeholder="0"
                        className="h-12 w-full rounded-xl text-center font-bold"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="age_years"
                        className="text-xs font-bold text-gray-700 ml-1 min-h-[1.25rem] text-center block"
                      >
                        Age (years)
                      </Label>
                      <Input
                        id="age_years"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        {...register("age_years", {
                          setValueAs: (v) => (v === "" ? undefined : Number(v)),
                        })}
                        placeholder="0"
                        className="h-12 w-full rounded-xl text-center font-bold"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="facing"
                        className="text-xs font-bold text-gray-700 ml-1 min-h-[1.25rem] text-center block"
                      >
                        Facing
                      </Label>
                      <Select
                        value={watch("facing") || "none"}
                        onValueChange={(v) =>
                          setValue("facing", v === "none" ? null : v)
                        }
                      >
                        <SelectTrigger className="h-12 w-full rounded-xl border-gray-200">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl shadow-2xl">
                          <SelectItem
                            value="none"
                            className="rounded-lg text-gray-400"
                          >
                            None
                          </SelectItem>
                          <SelectItem value="North" className="rounded-lg">
                            North
                          </SelectItem>
                          <SelectItem value="South" className="rounded-lg">
                            South
                          </SelectItem>
                          <SelectItem value="East" className="rounded-lg">
                            East
                          </SelectItem>
                          <SelectItem value="West" className="rounded-lg">
                            West
                          </SelectItem>
                          <SelectItem value="North-East" className="rounded-lg">
                            North-East
                          </SelectItem>
                          <SelectItem value="North-West" className="rounded-lg">
                            North-West
                          </SelectItem>
                          <SelectItem value="South-East" className="rounded-lg">
                            South-East
                          </SelectItem>
                          <SelectItem value="South-West" className="rounded-lg">
                            South-West
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="plot_number"
                        className="text-xs font-bold text-gray-700 ml-1"
                      >
                        Plot Number
                      </Label>
                      <Input
                        id="plot_number"
                        {...register("plot_number")}
                        placeholder="e.g., Survey No. 123"
                        className="h-12 rounded-xl border-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="plot_dimensions"
                        className="text-xs font-bold text-gray-700 ml-1"
                      >
                        Plot Dimensions
                      </Label>
                      <Input
                        id="plot_dimensions"
                        {...register("plot_dimensions")}
                        placeholder="e.g., 40x60 ft"
                        className="h-12 rounded-xl border-gray-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="furnished"
                      className="text-xs font-bold text-gray-700 ml-1"
                    >
                      Furnished
                    </Label>
                    <Select
                      value={watch("furnished") || "none"}
                      onValueChange={(v) =>
                        setValue(
                          "furnished",
                          v === "none"
                            ? null
                            : (v as
                                | "furnished"
                                | "semi-furnished"
                                | "unfurnished"),
                        )
                      }
                    >
                      <SelectTrigger className="h-12 rounded-xl border-gray-200">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl shadow-2xl">
                        <SelectItem
                          value="none"
                          className="rounded-lg text-gray-400"
                        >
                          None
                        </SelectItem>
                        <SelectItem value="furnished" className="rounded-lg">
                          Furnished
                        </SelectItem>
                        <SelectItem
                          value="semi-furnished"
                          className="rounded-lg"
                        >
                          Semi-Furnished
                        </SelectItem>
                        <SelectItem value="unfurnished" className="rounded-lg">
                          Unfurnished
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 block">
                        Amenities
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setAmenitiesModalOpen(true)}
                        className="h-8 rounded-lg text-xs font-medium border-gray-200"
                      >
                        <Plus className="h-3.5 w-3 mr-1.5" />
                        Add Amenities
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-3xl bg-gray-50 border border-gray-100">
                      {amenitiesList.length > 0 ? (
                        amenitiesList.map((a) => {
                          const selected = (watch("amenities") ?? []).includes(
                            a.name,
                          );
                          return (
                            <div
                              key={a.id}
                              className="flex items-center gap-3 mb-3"
                            >
                              <Checkbox
                                id={`amenity-${a.id}`}
                                checked={selected}
                                onCheckedChange={(v) => {
                                  const current = watch("amenities") ?? [];
                                  if (v) {
                                    setValue("amenities", [...current, a.name]);
                                  } else {
                                    setValue(
                                      "amenities",
                                      current.filter((x) => x !== a.name),
                                    );
                                  }
                                }}
                                className="h-5 w-5 rounded-md border-gray-300 text-indigo-600"
                              />
                              <Label
                                htmlFor={`amenity-${a.id}`}
                                className="text-sm font-bold text-gray-700 cursor-pointer flex items-center gap-2"
                              >
                                {a.icon && <span>{a.icon}</span>}
                                {a.name}
                              </Label>
                            </div>
                          );
                        })
                      ) : (
                        <p className="col-span-full text-sm text-gray-400 italic">
                          No amenities configured. Run the migration to seed
                          amenities.
                        </p>
                      )}
                    </div>
                  </div>
                </section>
              </TabsContent>

              <TabsContent value="seo" className="mt-0 space-y-12">
                <section className="space-y-6">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="h-1 w-6 bg-violet-500 rounded-full" />
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 block">
                      SEO Settings
                    </Label>
                  </div>
                  <p className="text-sm text-gray-500 -mt-2">
                    Optimize how this property appears in search results.
                  </p>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="meta_title"
                        className="text-xs font-bold text-gray-700 ml-1"
                      >
                        Meta Title (max 70 chars)
                      </Label>
                      <Input
                        id="meta_title"
                        {...register("meta_title")}
                        placeholder="e.g., Luxury 3BHK Villa in Bandra | TheRealBusiness"
                        className="h-12 rounded-xl border-gray-200 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="meta_description"
                        className="text-xs font-bold text-gray-700 ml-1"
                      >
                        Meta Description (max 160 chars)
                      </Label>
                      <Textarea
                        id="meta_description"
                        {...register("meta_description")}
                        placeholder="Brief description for search engine snippets..."
                        className="min-h-[100px] rounded-2xl border-gray-200 focus:ring-indigo-500 p-4 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="meta_keywords"
                        className="text-xs font-bold text-gray-700 ml-1"
                      >
                        Meta Keywords (comma-separated)
                      </Label>
                      <Input
                        id="meta_keywords"
                        {...register("meta_keywords")}
                        placeholder="villa, bandra, luxury, 3bhk, mumbai"
                        className="h-12 rounded-xl border-gray-200 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </section>
              </TabsContent>
            </Tabs>
          </div>

          <div className="shrink-0 p-4 sm:p-6 pb-[max(1rem,env(safe-area-inset-bottom))] bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] flex gap-3 touch-manipulation">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                reset(defaultValues);
                setCoverFile(null);
                setGalleryFiles([]);
                setCoverUploading(false);
                setGalleryUploading(false);
                setCreatedPropertyId(null);
                setActiveTab("general");
              }}
              disabled={isPending}
              className="flex-1 rounded-xl min-h-[44px] h-10 font-medium text-gray-600 bg-white border-gray-200 hover:bg-gray-50 touch-manipulation"
            >
              Cancel
            </Button>
            {activeTab === "general" ? (
              <Button
                type="button"
                onClick={() => handleSaveAndNext("assets")}
                disabled={isPending || assetsUploading}
                className="flex-1 rounded-xl min-h-[44px] h-10 bg-gray-900 hover:bg-gray-800 text-white font-medium text-sm shadow-sm transition-all active:scale-[0.98] touch-manipulation"
              >
                {(isPending || assetsUploading) && (
                  <Loader2 className="mr-2 h-4 w-4 shrink-0 animate-spin" />
                )}
                {assetsUploading ? "Uploading…" : "Save and Next"}
              </Button>
            ) : activeTab === "assets" ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("general")}
                  className="flex-1 rounded-xl min-h-[44px] h-10 font-medium text-gray-600 bg-white border-gray-200 hover:bg-gray-50 touch-manipulation"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={() => handleSaveAndNext("specs")}
                  disabled={isPending || assetsUploading}
                  className="flex-1 rounded-xl min-h-[44px] h-10 bg-gray-900 hover:bg-gray-800 text-white font-medium text-sm shadow-sm transition-all active:scale-[0.98] touch-manipulation"
                >
                  {(isPending || assetsUploading) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save and Next
                </Button>
              </>
            ) : activeTab === "specs" ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("assets")}
                  className="flex-1 rounded-xl min-h-[44px] h-10 font-medium text-gray-600 bg-white border-gray-200 hover:bg-gray-50 touch-manipulation"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={() => handleSaveAndNext("seo")}
                  disabled={isPending || assetsUploading}
                  className="flex-1 rounded-xl min-h-[44px] h-10 bg-gray-900 hover:bg-gray-800 text-white font-medium text-sm shadow-sm transition-all active:scale-[0.98] touch-manipulation"
                >
                  {isPending || assetsUploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Save and Next
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("specs")}
                  className="flex-1 rounded-xl min-h-[44px] h-10 font-medium text-gray-600 bg-white border-gray-200 hover:bg-gray-50 touch-manipulation"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isPending || assetsUploading}
                  className="flex-1 rounded-xl min-h-[44px] h-10 bg-gray-900 hover:bg-gray-800 text-white font-medium text-sm shadow-sm transition-all active:scale-[0.98] touch-manipulation"
                >
                  {isPending || assetsUploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {isEditing ? "Apply Adjustments" : "Publicly List Listing"}
                </Button>
              </>
            )}
          </div>
        </form>
      </SheetContent>
      <AmenitiesModal
        open={amenitiesModalOpen}
        onOpenChange={setAmenitiesModalOpen}
      />
    </Sheet>
  );
}
