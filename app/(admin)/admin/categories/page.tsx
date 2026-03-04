"use client";

import { useState, useCallback } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { CategorySheet } from "@/components/admin/categories/CategorySheet";
import { useCategories, useDeleteCategory } from "@/hooks/useCategories";
import type { Category, CategoryFilters } from "@/types";
import { formatDate } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";

export default function CategoriesPage() {
  const [filters, setFilters] = useState<Partial<CategoryFilters>>({
    page: 1,
    limit: 10,
    sort_by: "name",
    sort_order: "asc",
  });
  const [searchInput, setSearchInput] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const debouncedSearch = useDebounce(searchInput, 400);
  const activeFilters = { ...filters, search: debouncedSearch || undefined };

  const { data, isLoading, isError } = useCategories(activeFilters);
  const deleteMutation = useDeleteCategory();

  function openCreate() {
    setSelectedCategory(null);
    setSheetOpen(true);
  }

  function openEdit(category: Category) {
    setSelectedCategory(category);
    setSheetOpen(true);
  }

  const columns: ColumnDef<Category>[] = [
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
      accessorKey: "icon",
      header: "",
      cell: ({ getValue }) => (
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-lg">
          {getValue<string>() ?? "📁"}
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-sm">{row.original.name}</p>
          <p className="text-xs text-muted-foreground font-mono">{row.original.slug}</p>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground line-clamp-1">
          {getValue<string>() ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ getValue }) =>
        getValue<boolean>() ? (
          <Badge variant="default" className="text-xs">Active</Badge>
        ) : (
          <Badge variant="secondary" className="text-xs">Inactive</Badge>
        ),
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
                <AlertDialogTitle>Delete Category</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &quot;{row.original.name}&quot;? Properties in this
                  category will have their category removed.
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
          <h1 className="text-xl font-bold text-black tracking-tight">Categories</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {data?.total ?? 0} categories total
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Search */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {isError && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load categories. Please try again.
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          isLoading={isLoading}
          emptyMessage="No categories found. Create your first category."
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

      <CategorySheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        category={selectedCategory}
      />
    </div>
  );
}
