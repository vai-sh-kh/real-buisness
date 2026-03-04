"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  propertySchema,
  type PropertyFormValues,
} from "@/lib/validations/property.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { slugify } from "@/lib/utils";
import type { Category } from "@/types";
import { toast } from "sonner";

interface PropertyFormSimpleProps {
  categories: Category[];
  initialData?: Partial<PropertyFormValues>;
  propertyId?: string;
}

const defaultValues: Partial<PropertyFormValues> = {
  type: "sale",
  status: "draft",
  country: "India",
  parking: false,
  is_featured: false,
};

export function PropertyFormSimple({
  categories,
  initialData,
  propertyId,
}: PropertyFormSimpleProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema) as never,
    defaultValues: { ...defaultValues, ...initialData },
  });

  const title = form.watch("title");
  useEffect(() => {
    if (title && !form.getValues("slug")) {
      form.setValue("slug", slugify(title));
    }
  }, [title, form]);

  async function onSubmit(values: PropertyFormValues) {
    setLoading(true);
    try {
      const url = propertyId
        ? `/api/properties/${propertyId}`
        : "/api/properties";
      const method = propertyId ? "PUT" : "POST";
      const body = {
        ...values,
        slug: (values.slug && values.slug.trim()) || slugify(values.title),
      };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to save");
      toast.success(propertyId ? "Property updated." : "Property created.");
      if (!propertyId && data.data?.id) {
        router.push(`/admin/properties/${data.data.id}/edit`);
        return;
      } else {
        router.refresh();
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input {...form.register("title")} className="mt-1" />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>
          <div>
            <Label>Slug</Label>
            <Input
              {...form.register("slug")}
              className="mt-1"
              placeholder="Auto from title"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Type</Label>
              <Select
                value={form.watch("type")}
                onValueChange={(v) =>
                  form.setValue("type", v as "sale" | "rent")
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Category</Label>
              <Select
                value={form.watch("category_id") || "none"}
                onValueChange={(v) => form.setValue("category_id", v === "none" ? null : v)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Status</Label>
              <Select
                value={form.watch("status")}
                onValueChange={(v) =>
                  form.setValue("status", v as PropertyFormValues["status"])
                }
              >
                <SelectTrigger className="mt-1">
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
            <div>
              <Label>Price</Label>
              <Input
                type="number"
                {...form.register("price", {
                  valueAsNumber: true,
                  setValueAs: (v) =>
                    v === "" || isNaN(Number(v)) ? undefined : Number(v),
                })}
                className="mt-1"
              />
              {form.formState.errors.price && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.price.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <Label>Short description (max 160 chars)</Label>
            <Input
              {...form.register("short_description")}
              className="mt-1"
              placeholder="Brief summary for listings"
              maxLength={160}
            />
          </div>
          <div>
            <Label>Description</Label>
            <textarea
              {...form.register("description")}
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Full property description"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Address</Label>
            <Input {...form.register("address")} className="mt-1" />
            {form.formState.errors.address && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.address.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>City</Label>
              <Input {...form.register("city")} className="mt-1" />
              {form.formState.errors.city && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.city.message}
                </p>
              )}
            </div>
            <div>
              <Label>State</Label>
              <Input {...form.register("state")} className="mt-1" />
              {form.formState.errors.state && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.state.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>ZIP / Postal code</Label>
              <Input {...form.register("zip_code")} className="mt-1" />
            </div>
            <div>
              <Label>Country</Label>
              <Input {...form.register("country")} className="mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Property details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <Label>Area (sq ft)</Label>
              <Input
                type="number"
                {...form.register("area_sqft", {
                  setValueAs: (v) =>
                    v === "" || isNaN(Number(v)) ? undefined : Number(v),
                })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Bedrooms</Label>
              <Input
                type="number"
                {...form.register("bedrooms", {
                  setValueAs: (v) =>
                    v === "" || isNaN(Number(v)) ? undefined : Number(v),
                })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Bathrooms</Label>
              <Input
                type="number"
                {...form.register("bathrooms", {
                  setValueAs: (v) =>
                    v === "" || isNaN(Number(v)) ? undefined : Number(v),
                })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Price label</Label>
              <Input
                {...form.register("price_label")}
                className="mt-1"
                placeholder="e.g. /month"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Furnished</Label>
              <Select
                value={form.watch("furnished") || "none"}
                onValueChange={(v) =>
                  form.setValue(
                    "furnished",
                    v === "none"
                      ? null
                      : (v as "furnished" | "semi-furnished" | "unfurnished"),
                  )
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="furnished">Furnished</SelectItem>
                  <SelectItem value="semi-furnished">Semi-furnished</SelectItem>
                  <SelectItem value="unfurnished">Unfurnished</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4 pt-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.watch("parking")}
                  onChange={(e) => form.setValue("parking", e.target.checked)}
                  className="rounded border-input"
                />
                <span className="text-sm font-medium">Parking</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.watch("is_featured")}
                  onChange={(e) =>
                    form.setValue("is_featured", e.target.checked)
                  }
                  className="rounded border-input"
                />
                <span className="text-sm font-medium">Featured</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : propertyId ? "Update" : "Create"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
