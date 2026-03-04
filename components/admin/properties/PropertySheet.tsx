"use client";

import { useEffect } from "react";
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
import { propertySchema, type PropertyFormValues } from "@/lib/validations/property.schema";
import { useCreateProperty, useUpdateProperty } from "@/hooks/useProperties";
import { useAllCategories } from "@/hooks/useCategories";
import { slugify } from "@/lib/utils";
import type { PropertyWithRelations } from "@/types";
import { Loader2 } from "lucide-react";

interface PropertySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property?: PropertyWithRelations | null;
}

const defaultValues: PropertyFormValues = {
  title: "",
  slug: "",
  description: null,
  short_description: null,
  type: "sale",
  status: "draft",
  category_id: null,
  price: 0,
  price_label: null,
  area_sqft: null,
  bedrooms: null,
  bathrooms: null,
  address: "",
  city: "",
  state: "",
  zip_code: null,
  country: "India",
  parking: false,
  is_featured: false,
};

export function PropertySheet({ open, onOpenChange, property }: PropertySheetProps) {
  const isEditing = !!property;
  const createMutation = useCreateProperty();
  const updateMutation = useUpdateProperty();
  const { data: categories = [] } = useAllCategories();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
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
        price: property.price,
        price_label: property.price_label,
        area_sqft: property.area_sqft,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        address: property.address,
        city: property.city,
        state: property.state,
        zip_code: property.zip_code,
        country: property.country,
        cover_image_url: property.cover_image_url,
        parking: property.parking,
        is_featured: property.is_featured,
        furnished: property.furnished ?? undefined,
      });
    } else {
      reset(defaultValues);
    }
  }, [property, reset]);

  // Auto-generate slug from title when creating
  useEffect(() => {
    if (!isEditing && titleValue) {
      setValue("slug", slugify(titleValue));
    }
  }, [titleValue, isEditing, setValue]);

  const isPending = createMutation.isPending || updateMutation.isPending;

  async function onSubmit(values: PropertyFormValues) {
    if (isEditing && property) {
      await updateMutation.mutateAsync({ id: property.id, values });
    } else {
      await createMutation.mutateAsync(values);
    }
    onOpenChange(false);
    reset(defaultValues);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit Property" : "Add Property"}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update the property details below."
              : "Fill in the details to create a new property listing."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Basic Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" {...register("title")} placeholder="e.g., Luxury Villa in Bandra" />
                {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" {...register("slug")} placeholder="auto-generated" />
              </div>

              <div className="space-y-1.5">
                <Label>Type *</Label>
                <Select
                  defaultValue={property?.type ?? "sale"}
                  onValueChange={(v) => setValue("type", v as "sale" | "rent")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">For Sale</SelectItem>
                    <SelectItem value="rent">For Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select
                  defaultValue={property?.status ?? "draft"}
                  onValueChange={(v) => setValue("status", v as PropertyFormValues["status"])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="rented">Rented</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select
                  defaultValue={property?.category_id || "none"}
                  onValueChange={(v) => setValue("category_id", v === "none" ? null : v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  {...register("price", { valueAsNumber: true })}
                  placeholder="5000000"
                />
                {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
              </div>

              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="short_description">Short Description</Label>
                <Input
                  id="short_description"
                  {...register("short_description")}
                  placeholder="Brief summary (max 160 chars)"
                />
              </div>

              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Detailed property description..."
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Location
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="address">Address *</Label>
                <Input id="address" {...register("address")} placeholder="Full address" />
                {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="city">City *</Label>
                <Input id="city" {...register("city")} placeholder="Mumbai" />
                {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="state">State *</Label>
                <Input id="state" {...register("state")} placeholder="Maharashtra" />
                {errors.state && <p className="text-xs text-destructive">{errors.state.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="zip_code">PIN Code</Label>
                <Input id="zip_code" {...register("zip_code")} placeholder="400001" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="country">Country</Label>
                <Input id="country" {...register("country")} defaultValue="India" />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Property Details
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="area_sqft">Area (sqft)</Label>
                <Input
                  id="area_sqft"
                  type="number"
                  {...register("area_sqft", { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  {...register("bedrooms", { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  {...register("bathrooms", { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cover_image_url">Cover Image URL</Label>
              <Input
                id="cover_image_url"
                type="url"
                {...register("cover_image_url")}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="parking"
                  checked={watch("parking")}
                  onCheckedChange={(v) => setValue("parking", Boolean(v))}
                />
                <Label htmlFor="parking" className="cursor-pointer">
                  Parking Available
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="is_featured"
                  checked={watch("is_featured")}
                  onCheckedChange={(v) => setValue("is_featured", Boolean(v))}
                />
                <Label htmlFor="is_featured" className="cursor-pointer">
                  Featured Property
                </Label>
              </div>
            </div>
          </div>

          <SheetFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                reset(defaultValues);
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Save Changes" : "Create Property"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
