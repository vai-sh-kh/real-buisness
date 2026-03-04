"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  propertySchema,
  type PropertyFormValues,
} from "@/lib/validations/property.schema";
import {
  getPropertiesListAction,
  getPropertyByIdAction,
  createProperty,
  updateProperty,
  deleteProperty,
} from "@/lib/actions/properties";
import type { PropertyWithRelations } from "@/types";
import type { Category } from "@/types";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const defaultFormValues: Partial<PropertyFormValues> = {
  type: "sale",
  status: "draft",
  country: "India",
  parking: false,
  is_featured: false,
  description: null,
  short_description: null,
  category_id: null,
  price_label: null,
  area_sqft: null,
  bedrooms: null,
  bathrooms: null,
  furnished: null,
  zip_code: null,
};

function propertyToFormValues(
  p: PropertyWithRelations,
): Partial<PropertyFormValues> {
  return {
    title: p.title,
    slug: p.slug,
    description: p.description ?? undefined,
    short_description: p.short_description ?? undefined,
    type: p.type,
    status: p.status,
    category_id: p.category_id ?? undefined,
    price: Number(p.price),
    price_label: p.price_label ?? undefined,
    area_sqft: p.area_sqft != null ? Number(p.area_sqft) : undefined,
    bedrooms: p.bedrooms ?? undefined,
    bathrooms: p.bathrooms ?? undefined,
    floors: p.floors ?? undefined,
    facing: p.facing ?? undefined,
    age_years: p.age_years ?? undefined,
    parking: p.parking ?? false,
    furnished: p.furnished ?? undefined,
    address: p.address,
    city: p.city,
    state: p.state,
    zip_code: p.zip_code ?? undefined,
    country: p.country ?? "India",
    latitude: p.latitude ?? undefined,
    longitude: p.longitude ?? undefined,
    map_embed_url: p.map_embed_url ?? undefined,
    cover_image_url: p.cover_image_url ?? undefined,
    amenities: p.amenities ?? undefined,
    highlights: p.highlights ?? undefined,
    plot_number: p.plot_number ?? undefined,
    plot_dimensions: p.plot_dimensions ?? undefined,
    is_featured: p.is_featured ?? false,
    meta_title: p.meta_title ?? undefined,
    meta_description: p.meta_description ?? undefined,
    meta_keywords: p.meta_keywords ?? undefined,
    og_image_url: p.og_image_url ?? undefined,
  };
}

type SortOption = "newest" | "price_asc" | "price_desc" | "views";
const PAGE_SIZES = [10, 25, 50];
const STATUS_ALL = "__all__";
const CATEGORY_NONE = "__none__";

interface PropertiesTableProps {
  categories: Category[];
}

export function PropertiesTable({ categories }: PropertiesTableProps) {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState<string>(STATUS_ALL);
  const [sort, setSort] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [data, setData] = useState<PropertyWithRelations[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const sortMap: Record<SortOption, { sort_by: string; sort_order: "asc" | "desc" }> = {
        newest: { sort_by: "created_at", sort_order: "desc" },
        price_asc: { sort_by: "price", sort_order: "asc" },
        price_desc: { sort_by: "price", sort_order: "desc" },
        views: { sort_by: "views", sort_order: "desc" },
      };
      const result = await getPropertiesListAction({
        search: search || undefined,
        status: status === STATUS_ALL ? undefined : status,
        ...sortMap[sort],
        page,
        limit,
      });
      setData(result.data);
      setTotal(result.total);
    } catch {
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  }, [search, status, sort, page, limit]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema) as never,
    defaultValues: { ...defaultFormValues },
  });

  const title = form.watch("title");
  useEffect(() => {
    if (title && !form.getValues("slug")) {
      form.setValue("slug", slugify(title));
    }
  }, [title, form]);

  const openAdd = () => {
    setEditingId(null);
    form.reset({ ...defaultFormValues });
    setSheetOpen(true);
  };

  const openEdit = async (id: string) => {
    setEditingId(id);
    const prop = await getPropertyByIdAction(id);
    if (!prop) {
      toast.error("Property not found.");
      return;
    }
    form.reset(propertyToFormValues(prop) as PropertyFormValues);
    setSheetOpen(true);
  };

  const onSheetOpenChange = (open: boolean) => {
    if (!open) setEditingId(null);
    setSheetOpen(open);
  };

  const onSubmit = async (values: PropertyFormValues) => {
    setFormLoading(true);
    try {
      const payload = { ...values, slug: values.slug || slugify(values.title) };
      if (editingId) {
        const res = await updateProperty(editingId, payload);
        if (res.success) {
          toast.success("Property updated.");
          setSheetOpen(false);
          fetchList();
        } else toast.error(res.error);
      } else {
        const res = await createProperty(payload);
        if (res.success) {
          toast.success("Property created.");
          setSheetOpen(false);
          fetchList();
        } else toast.error(res.error);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setFormLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      const res = await deleteProperty(deleteId);
      if (res.success) {
        toast.success("Property deleted.");
        setDeleteId(null);
        fetchList();
      } else toast.error(res.error);
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleteLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Properties</h1>
        <Button onClick={openAdd} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Search by title or city..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="max-w-xs"
          />
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>
        <Select
          value={status || STATUS_ALL}
          onValueChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={STATUS_ALL}>All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
            <SelectItem value="rented">Rented</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={sort}
          onValueChange={(v) => {
            setSort(v as SortOption);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price_asc">Price (low)</SelectItem>
            <SelectItem value="price_desc">Price (high)</SelectItem>
            <SelectItem value="views">Views</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  Loading…
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No properties found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.title}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{Number(row.price).toLocaleString()}</TableCell>
                  <TableCell>{row.city}</TableCell>
                  <TableCell>
                    {row.category &&
                      typeof row.category === "object" &&
                      "name" in row.category
                      ? (row.category as { name: string }).name
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(row.id)}
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(row.id)}
                        aria-label="Delete"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            {total === 0 ? "0" : `${from}–${to}`} of {total}
          </span>
          <Select
            value={String(limit)}
            onValueChange={(v) => {
              setLimit(Number(v));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[70px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>per page</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      <Sheet open={sheetOpen} onOpenChange={onSheetOpenChange}>
        <SheetContent className="overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>
              {editingId ? "Edit property" : "Add property"}
            </SheetTitle>
          </SheetHeader>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-6"
          >
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
                value={form.watch("category_id") ?? CATEGORY_NONE}
                onValueChange={(v) =>
                  form.setValue("category_id", v === CATEGORY_NONE ? null : v)
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CATEGORY_NONE}>None</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
            <div>
              <Label>Address</Label>
              <Input {...form.register("address")} className="mt-1" />
            </div>
            <div>
              <Label>City</Label>
              <Input {...form.register("city")} className="mt-1" />
            </div>
            <div>
              <Label>State</Label>
              <Input {...form.register("state")} className="mt-1" />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={formLoading}>
                {formLoading ? "Saving…" : editingId ? "Update" : "Create"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSheetOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete property?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              property.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteLoading ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
