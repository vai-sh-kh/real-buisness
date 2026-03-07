"use client";

import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Plus,
  Pencil,
  Trash2,
  MoreHorizontal,
  Search,
  Filter,
  Building2,
  Loader2,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import {
  ProfileDetailModal,
  ProfileSectionLabel,
  ProfileFieldLabel,
} from "@/components/admin/ProfileDetailModal";
import { DataTable } from "@/components/admin/data-table/DataTable";
import { DataTablePagination } from "@/components/admin/data-table/DataTablePagination";
import { PropertySheet } from "./PropertySheet";
import { useProperties, useDeleteProperty } from "@/hooks/useProperties";
import { useDebounce } from "@/hooks/useDebounce";
import { useIsMobile } from "@/hooks/useIsMobile";
import { formatDate, cn } from "@/lib/utils";
import type {
  PropertyWithRelations,
  PropertyStatus,
  PropertyType,
} from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  PageHeader,
  type BreadcrumbItem,
} from "@/components/admin/layout/PageHeader";

const STATUS_COLORS: Record<
  PropertyStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  active: "default",
  draft: "secondary",
  sold: "outline",
  rented: "outline",
};

export interface PropertiesViewHeaderConfig {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export function PropertiesView({
  header,
}: {
  header?: PropertiesViewHeaderConfig;
} = {}) {
  const isMobile = useIsMobile();
  // ─── Local client-side state for filters, pagination, search ───
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [rawSearch, setRawSearch] = useState("");
  const search = useDebounce(rawSearch, 300);
  const [statusFilter, setStatusFilter] = useState<"all" | PropertyStatus>(
    "all",
  );
  const [typeFilter, setTypeFilter] = useState<"all" | PropertyType>("all");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editProperty, setEditProperty] = useState<
    PropertyWithRelations | undefined
  >();
  const [viewProperty, setViewProperty] =
    useState<PropertyWithRelations | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const { data, isLoading } = useProperties({
    page,
    limit,
    search: search || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
    type: typeFilter === "all" ? undefined : typeFilter,
    sort_by: sortBy,
    sort_order: sortOrder,
  });
  const deleteProperty = useDeleteProperty();

  const hasFilters =
    rawSearch !== "" ||
    statusFilter !== "all" ||
    typeFilter !== "all" ||
    sortBy !== "created_at" ||
    sortOrder !== "desc";

  const clearFilters = () => {
    setRawSearch("");
    setStatusFilter("all");
    setTypeFilter("all");
    setSortBy("created_at");
    setSortOrder("desc");
    setPage(1);
  };

  const columns: ColumnDef<PropertyWithRelations>[] = [
    {
      id: "index",
      header: "No.",
      size: 70,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {(page - 1) * limit + row.index + 1}
        </span>
      ),
    },
    {
      id: "cover",
      header: "Cover",
      size: 80,
      cell: ({ row }) => {
        const url = row.original.cover_image_url;
        return (
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-admin-card-border bg-muted">
            {url ? (
              <img src={url} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Building2 className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Title",
      size: 400,
      cell: ({ row }) => (
        <span className="font-medium text-foreground line-clamp-2">
          {row.original.title}
        </span>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      size: 90,
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 100,
      cell: ({ row }) => (
        <Badge variant={STATUS_COLORS[row.original.status]}>
          {row.original.status.charAt(0).toUpperCase() +
            row.original.status.slice(1)}
        </Badge>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      size: 160,
      cell: ({ row }) => (
        <span className="text-sm text-foreground font-medium">
          ₹{Number(row.original.price).toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      accessorKey: "city",
      header: "City",
      size: 140,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.city}
        </span>
      ),
    },
    {
      id: "category",
      header: "Category",
      size: 160,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.category &&
          typeof row.original.category === "object" &&
          "name" in row.original.category
            ? (row.original.category as { name: string }).name
            : "—"}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      size: 80,
      cell: ({ row }) => {
        const property = row.original;
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditProperty(property);
                    setSheetOpen(true);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-500 focus:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteId(property.id);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const handleAdd = () => {
    setEditProperty(undefined);
    setSheetOpen(true);
  };

  const handleSheetOpenChange = (open: boolean) => {
    setSheetOpen(open);
    if (!open) setEditProperty(undefined);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    await deleteProperty.mutateAsync(deleteId);
    setDeleteId(null);
  };

  const list = data?.data ?? [];
  const total = data?.total ?? 0;

  const headerActions = (
    <Button
      onClick={handleAdd}
      size="sm"
      className="min-h-[44px] h-9 gap-1.5 rounded-lg bg-primary px-4 text-primary-foreground hover:bg-primary/90"
    >
      <Plus className="h-4 w-4" />
      Add property
    </Button>
  );

  return (
    <>
      {header ? (
        <PageHeader
          title={header.title}
          subtitle={header.subtitle}
          breadcrumbs={header.breadcrumbs}
          actions={headerActions}
        />
      ) : (
        <div className="flex justify-end px-2 pt-6 sm:px-6 lg:px-8">
          {headerActions}
        </div>
      )}

      <div className="space-y-8 px-2 pt-6 pb-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
        <div className="flex flex-col gap-4 rounded-xl border border-admin-card-border bg-admin-card-bg p-4 shadow-sm sm:flex-row sm:items-start sm:justify-between lg:p-6">
          {isMobile ? (
            <>
              <div className="flex w-full items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search properties..."
                    value={rawSearch}
                    onChange={(e) => {
                      setRawSearch(e.target.value);
                      setPage(1);
                    }}
                    className="h-10 rounded-xl pl-9"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 shrink-0 gap-1.5 rounded-xl"
                  onClick={() => setFilterSheetOpen(true)}
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {hasFilters && (
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                      •
                    </span>
                  )}
                </Button>
              </div>
              <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
                <SheetContent side="bottom" className="rounded-t-2xl">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">
                        Status
                      </label>
                      <Select
                        value={statusFilter}
                        onValueChange={(v) => {
                          setStatusFilter(v as "all" | PropertyStatus);
                          setPage(1);
                        }}
                      >
                        <SelectTrigger className="h-10 w-full rounded-xl">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="all">All statuses</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="sold">Sold</SelectItem>
                          <SelectItem value="rented">Rented</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">
                        Type
                      </label>
                      <Select
                        value={typeFilter}
                        onValueChange={(v) => {
                          setTypeFilter(v as "all" | PropertyType);
                          setPage(1);
                        }}
                      >
                        <SelectTrigger className="h-10 w-full rounded-xl">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="all">All types</SelectItem>
                          <SelectItem value="sale">Sale</SelectItem>
                          <SelectItem value="rent">Rent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">
                        Sort
                      </label>
                      <Select
                        value={`${sortBy}:${sortOrder}`}
                        onValueChange={(v) => {
                          const [sb, so] = v.split(":");
                          setSortBy(sb);
                          setSortOrder(so as "asc" | "desc");
                          setPage(1);
                        }}
                      >
                        <SelectTrigger className="h-10 w-full rounded-xl">
                          <SelectValue placeholder="Sort" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="created_at:desc">
                            Newest
                          </SelectItem>
                          <SelectItem value="created_at:asc">Oldest</SelectItem>
                          <SelectItem value="price:asc">Price (low)</SelectItem>
                          <SelectItem value="price:desc">
                            Price (high)
                          </SelectItem>
                          <SelectItem value="title:asc">Name A-Z</SelectItem>
                          <SelectItem value="title:desc">Name Z-A</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 pt-2">
                      {hasFilters && (
                        <Button
                          variant="ghost"
                          onClick={() => {
                            clearFilters();
                          }}
                          className="flex-1 rounded-xl"
                        >
                          Clear
                        </Button>
                      )}
                      <Button
                        className="min-h-[44px] flex-1 rounded-xl"
                        onClick={() => setFilterSheetOpen(false)}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <div className="flex w-full flex-col items-center gap-3 sm:flex-row">
              <div className="relative w-full sm:flex-1">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search properties..."
                  value={rawSearch}
                  onChange={(e) => {
                    setRawSearch(e.target.value);
                    setPage(1);
                  }}
                  className="h-10 rounded-xl pl-9"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(v) => {
                  setStatusFilter(v as "all" | PropertyStatus);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-10 w-full rounded-xl sm:w-36">
                  <Filter className="mr-1 h-3.5 w-3.5 text-gray-400" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={typeFilter}
                onValueChange={(v) => {
                  setTypeFilter(v as "all" | PropertyType);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-10 w-full rounded-xl sm:w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={`${sortBy}:${sortOrder}`}
                onValueChange={(v) => {
                  const [sb, so] = v.split(":");
                  setSortBy(sb);
                  setSortOrder(so as "asc" | "desc");
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-10 w-full rounded-xl sm:w-40">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="created_at:desc">Newest</SelectItem>
                  <SelectItem value="created_at:asc">Oldest</SelectItem>
                  <SelectItem value="price:asc">Price (low)</SelectItem>
                  <SelectItem value="price:desc">Price (high)</SelectItem>
                  <SelectItem value="title:asc">Name A-Z</SelectItem>
                  <SelectItem value="title:desc">Name Z-A</SelectItem>
                </SelectContent>
              </Select>
              {hasFilters && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="h-10 w-full rounded-lg text-muted-foreground hover:text-foreground sm:w-auto"
                >
                  Clear
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col overflow-hidden rounded-xl border border-admin-card-border bg-admin-card-bg shadow-sm">
          {isMobile ? (
            <>
              <div className="space-y-2 p-4">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-16 animate-pulse rounded-xl bg-muted/50"
                    />
                  ))
                ) : list.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Building2 className="mb-4 h-10 w-10 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      No properties found.
                    </p>
                  </div>
                ) : (
                  list.map((property) => (
                    <div
                      key={property.id}
                      className="flex flex-col overflow-hidden rounded-xl border border-admin-card-border bg-admin-card-bg shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="flex gap-3 p-2 sm:p-4">
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-admin-card-border bg-muted">
                          {property.cover_image_url ? (
                            <img
                              src={property.cover_image_url}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Building2 className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-sm font-semibold text-foreground">
                            {property.title}
                          </h3>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {property.price
                              ? `₹${Number(property.price).toLocaleString("en-IN")}`
                              : "—"}
                            {property.city ? ` · ${property.city}` : ""}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <Badge
                              variant={STATUS_COLORS[property.status]}
                              className="text-xs"
                            >
                              {property.status.charAt(0).toUpperCase() +
                                property.status.slice(1)}
                            </Badge>
                            {property.type && (
                              <span className="text-xs text-muted-foreground capitalize">
                                {property.type}
                              </span>
                            )}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 shrink-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditProperty(property);
                                setSheetOpen(true);
                              }}
                            >
                              <Pencil className="mr-2 h-3.5 w-3.5" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-500 focus:text-red-500"
                              onClick={() => setDeleteId(property.id)}
                            >
                              <Trash2 className="mr-2 h-3.5 w-3.5" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="border-t border-admin-card-border px-2 py-2 sm:px-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full min-h-[44px] gap-2 rounded-lg"
                          onClick={() => setViewProperty(property)}
                        >
                          <Eye className="h-4 w-4" />
                          View details
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="border-t border-admin-card-border bg-muted/30 p-4">
                <DataTablePagination
                  page={page}
                  limit={limit}
                  total={total}
                  onPageChange={(p) => setPage(p)}
                  onLimitChange={(l) => {
                    setLimit(l);
                    setPage(1);
                  }}
                  isLoading={isLoading}
                />
              </div>
            </>
          ) : (
            <>
              <div className="px-2 py-4">
                <DataTable
                  columns={columns}
                  data={list}
                  isLoading={isLoading}
                  emptyMessage="No properties found."
                  emptyIcon={
                    <Building2 className="mb-4 h-10 w-10 text-muted-foreground/50" />
                  }
                />
              </div>
              <div className="border-t border-admin-card-border bg-muted/30 p-4">
                <DataTablePagination
                  page={page}
                  limit={limit}
                  total={total}
                  onPageChange={(p) => setPage(p)}
                  onLimitChange={(l) => {
                    setLimit(l);
                    setPage(1);
                  }}
                  isLoading={isLoading}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <PropertySheet
        open={sheetOpen}
        onOpenChange={handleSheetOpenChange}
        property={editProperty}
      />

      <ProfileDetailModal
        open={!!viewProperty}
        onOpenChange={(open) => !open && setViewProperty(null)}
        title="Property Profile"
        subtitle="Full breakdown of listing information and status"
        icon={<Building2 className="h-10 w-10 text-indigo-300" />}
        onEdit={
          viewProperty
            ? () => {
                setEditProperty(viewProperty);
                setSheetOpen(true);
                setViewProperty(null);
              }
            : undefined
        }
        editLabel="Edit Listing"
        dismissLabel="Dismiss Profile"
      >
        {viewProperty && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <ProfileSectionLabel>Property</ProfileSectionLabel>
                <p className="text-xl font-semibold text-foreground">
                  {viewProperty.title}
                </p>
                <div className="mt-3 p-4 rounded-xl bg-muted/50 border border-border">
                  <ProfileFieldLabel>Location</ProfileFieldLabel>
                  <p className="text-sm text-foreground">
                    {[
                      viewProperty.address,
                      viewProperty.city,
                      viewProperty.state,
                      viewProperty.zip_code,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              </div>

              <div>
                <ProfileSectionLabel>Specifications</ProfileSectionLabel>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-muted/50 border border-border">
                    <ProfileFieldLabel>Area</ProfileFieldLabel>
                    <p className="text-sm font-medium text-foreground">
                      {viewProperty.area_sqft
                        ? `${viewProperty.area_sqft} sqft`
                        : "—"}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/50 border border-border">
                    <ProfileFieldLabel>Bedrooms</ProfileFieldLabel>
                    <p className="text-sm font-medium text-foreground">
                      {viewProperty.bedrooms ?? "—"}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/50 border border-border">
                    <ProfileFieldLabel>Bathrooms</ProfileFieldLabel>
                    <p className="text-sm font-medium text-foreground">
                      {viewProperty.bathrooms ?? "—"}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/50 border border-border">
                    <ProfileFieldLabel>Floors</ProfileFieldLabel>
                    <p className="text-sm font-medium text-foreground">
                      {viewProperty.floors ?? "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <ProfileSectionLabel>Description</ProfileSectionLabel>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {viewProperty.description ||
                    "No description provided for this listing."}
                </p>
              </div>
            </div>

            <div className="space-y-6 text-left">
              <div>
                <ProfileSectionLabel>Pricing & Status</ProfileSectionLabel>
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-muted/50 border border-border">
                    <ProfileFieldLabel>Price</ProfileFieldLabel>
                    <p className="text-xl font-semibold text-foreground">
                      ₹{Number(viewProperty.price).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant={STATUS_COLORS[viewProperty.status]}
                      className="rounded-lg"
                    >
                      {viewProperty.status}
                    </Badge>
                    <Badge variant="outline" className="rounded-lg capitalize">
                      {viewProperty.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Category:{" "}
                    {viewProperty.category &&
                    typeof viewProperty.category === "object" &&
                    "name" in viewProperty.category
                      ? (viewProperty.category as { name: string }).name
                      : "—"}
                  </p>
                </div>
              </div>

              <div>
                <ProfileSectionLabel>Timeline</ProfileSectionLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-muted/50 border border-border">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">
                      Created
                    </span>
                    <p className="text-sm font-medium text-foreground">
                      {formatDate(viewProperty.created_at)}
                    </p>
                  </div>
                  {viewProperty.updated_at && (
                    <div className="p-4 rounded-xl bg-muted/50 border border-border">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">
                        Updated
                      </span>
                      <p className="text-sm font-medium text-foreground">
                        {formatDate(viewProperty.updated_at)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </ProfileDetailModal>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent className="rounded-xl border border-border bg-card shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete property?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              property listing including all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 mt-4">
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
