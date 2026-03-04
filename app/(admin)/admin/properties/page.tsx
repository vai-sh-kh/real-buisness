"use client";

import { useState, useCallback } from "react";
import { Plus, Search, SlidersHorizontal, Pencil, Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DataTable } from "@/components/admin/data-table/DataTable";
import { DataTablePagination } from "@/components/admin/data-table/DataTablePagination";
import { PropertySheet } from "@/components/admin/properties/PropertySheet";
import { useProperties, useDeleteProperty } from "@/hooks/useProperties";
import type { PropertyWithRelations, PropertyFilters } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  active: { label: "Active", variant: "default" },
  draft: { label: "Draft", variant: "secondary" },
  sold: { label: "Sold", variant: "outline" },
  rented: { label: "Sold", variant: "outline" },
};

export default function PropertiesPage() {
  const [filters, setFilters] = useState<Partial<PropertyFilters>>({
    page: 1,
    limit: 10,
    sort_by: "created_at",
    sort_order: "desc",
  });
  const [searchInput, setSearchInput] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyWithRelations | null>(null);

  const debouncedSearch = useDebounce(searchInput, 400);
  const activeFilters = { ...filters, search: debouncedSearch || undefined };

  const { data, isLoading, isError } = useProperties(activeFilters);
  const deleteMutation = useDeleteProperty();

  const updateFilter = useCallback(
    (key: keyof PropertyFilters, value: string | number | undefined) => {
      setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    },
    []
  );

  function openCreate() {
    setSelectedProperty(null);
    setSheetOpen(true);
  }

  function openEdit(property: PropertyWithRelations) {
    setSelectedProperty(property);
    setSheetOpen(true);
  }

  const columns: ColumnDef<PropertyWithRelations>[] = [
    {
      id: "no",
      header: "No",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {((filters.page ?? 1) - 1) * (filters.limit ?? 10) + row.index + 1}
        </span>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-sm line-clamp-1">{row.original.title}</p>
          <p className="text-xs text-muted-foreground">
            {row.original.city}, {row.original.state}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ getValue }) => (
        <Badge variant="outline" className="capitalize text-xs">
          {getValue<string>() === "sale" ? "For Sale" : "For Rent"}
        </Badge>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ getValue }) => (
        <span className="font-semibold text-sm">{formatPrice(getValue<number>())}</span>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.category?.name ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue<string>();
        const config = statusConfig[status] ?? { label: status, variant: "secondary" as const };
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">{formatDate(getValue<string>())}</span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              openEdit(row.original);
            }}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Property</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &quot;{row.original.title}&quot;? This action cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => deleteMutation.mutate(row.original.id)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-black tracking-tight">Properties</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {data?.total ?? 0} properties total
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Property
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or location..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={filters.status as string ?? "all"}
          onValueChange={(v) => updateFilter("status", v === "all" ? undefined : v)}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
            <SelectItem value="rented">Rented</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.type as string ?? "all"}
          onValueChange={(v) => updateFilter("type", v === "all" ? undefined : v)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="sale">For Sale</SelectItem>
            <SelectItem value="rent">For Rent</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={`${filters.sort_by ?? "created_at"}_${filters.sort_order ?? "desc"}`}
          onValueChange={(v) => {
            const [sort_by, sort_order] = v.split("_") as [string, "asc" | "desc"];
            setFilters((prev) => ({ ...prev, sort_by, sort_order, page: 1 }));
          }}
        >
          <SelectTrigger className="w-44 gap-1">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at_desc">Newest First</SelectItem>
            <SelectItem value="created_at_asc">Oldest First</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Error */}
      {isError && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load properties. Please try again.
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          isLoading={isLoading}
          emptyMessage="No properties found. Create your first property."
          onRowClick={(row) => openEdit(row.original)}
        />
        <DataTablePagination
          page={filters.page ?? 1}
          limit={filters.limit ?? 10}
          total={data?.total ?? 0}
          onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          onLimitChange={(limit) => setFilters((prev) => ({ ...prev, limit, page: 1 }))}
          isLoading={isLoading}
        />
      </div>

      {/* Sheet */}
      <PropertySheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        property={selectedProperty}
      />
    </div>
  );
}
