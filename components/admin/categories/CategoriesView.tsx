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
  FolderOpen,
  Loader2,
  ToggleRight,
  ToggleLeft,
  X,
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
import { DataTable } from "@/components/admin/data-table/DataTable";
import { DataTablePagination } from "@/components/admin/data-table/DataTablePagination";
import { AdminListCard } from "@/components/admin/AdminListCard";
import { CategorySheet } from "./CategorySheet";
import {
  useCategories,
  useDeleteCategory,
  useUpdateCategory,
} from "@/hooks/useCategories";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDate, cn } from "@/lib/utils";
import type { Category } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  PageHeader,
  type BreadcrumbItem,
} from "@/components/admin/layout/PageHeader";

export interface CategoriesViewHeaderConfig {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export function CategoriesView({
  header,
}: {
  header?: CategoriesViewHeaderConfig;
} = {}) {
  const isMobile = useIsMobile();
  // ─── Local client-side state for filters, pagination, search ───
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [rawSearch, setRawSearch] = useState("");
  const search = useDebounce(rawSearch, 300);
  const [statusFilter, setStatusFilter] = useState<"all" | "true" | "false">(
    "all",
  );
  const [sortBy, setSortBy] = useState<"name" | "created_at">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toggleActive, setToggleActive] = useState<{
    category: Category;
    nextValue: boolean;
  } | null>(null);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const is_active =
    statusFilter === "all" ? undefined : statusFilter === "true";

  const { data, isLoading, isFetching } = useCategories({
    page,
    limit,
    search: search || undefined,
    is_active,
    sort_by: sortBy,
    sort_order: sortOrder,
  });
  const isTableLoading = isLoading || isFetching;
  const deleteCategory = useDeleteCategory();
  const updateCategory = useUpdateCategory();

  const hasFilters =
    rawSearch !== "" ||
    statusFilter !== "all" ||
    sortBy !== "name" ||
    sortOrder !== "asc";

  const clearFilters = () => {
    setRawSearch("");
    setStatusFilter("all");
    setSortBy("name");
    setSortOrder("asc");
    setPage(1);
  };

  const columns: ColumnDef<Category>[] = [
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
      accessorKey: "name",
      header: "Name",
      size: 350,
      cell: ({ row }) => (
        <span className="font-medium text-foreground">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "slug",
      header: "Slug",
      size: 250,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.slug}
        </span>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      size: 280,
      cell: ({ row }) => {
        const d = row.original.description;
        if (!d) return <span className="text-sm text-muted-foreground">—</span>;
        return (
          <span
            className="block max-w-[260px] truncate text-sm text-muted-foreground"
            title={d}
          >
            {d}
          </span>
        );
      },
    },
    {
      accessorKey: "is_active",
      header: "Active",
      size: 100,
      cell: ({ row }) => (
        <Badge variant={row.original.is_active ? "default" : "secondary"}>
          {row.original.is_active ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created",
      size: 180,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.original.created_at)}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      size: 80,
      cell: ({ row }) => {
        const category = row.original;
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
                    setToggleActive({
                      category,
                      nextValue: !category.is_active,
                    });
                  }}
                >
                  {category.is_active ? (
                    <>
                      <ToggleLeft className="h-3.5 w-3.5 mr-2" />
                      Set Inactive
                    </>
                  ) : (
                    <>
                      <ToggleRight className="h-3.5 w-3.5 mr-2" />
                      Set Active
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditCategory(category);
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
                    setDeleteId(category.id);
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
    setEditCategory(undefined);
    setSheetOpen(true);
  };

  const handleSheetOpenChange = (open: boolean) => {
    setSheetOpen(open);
    if (!open) setEditCategory(undefined);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    await deleteCategory.mutateAsync(deleteId);
    setDeleteId(null);
  };

  const handleToggleActiveConfirm = async () => {
    if (!toggleActive) return;
    await updateCategory.mutateAsync({
      id: toggleActive.category.id,
      values: { is_active: toggleActive.nextValue },
    });
    setToggleActive(null);
  };

  const list = data?.data ?? [];
  const total = data?.total ?? 0;

  return (
    <>
      {header ? (
        <PageHeader
          title={header.title}
          subtitle={header.subtitle}
          breadcrumbs={header.breadcrumbs}
          actions={
            <Button
              onClick={handleAdd}
              className="min-h-[44px] gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Add category
            </Button>
          }
        />
      ) : (
        <div className="flex justify-end">
          <Button
            onClick={handleAdd}
            className="min-h-[44px] gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add category
          </Button>
        </div>
      )}

      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col gap-4 rounded-xl border border-admin-card-border bg-admin-card-bg p-4 shadow-sm sm:flex-row sm:items-start sm:justify-between lg:p-6">
          {isMobile ? (
            <>
              <div className="flex w-full items-center gap-2">
                <div className="relative flex-1">
                  {isFetching ? (
                    <Loader2 className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-muted-foreground" />
                  ) : (
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                  )}
                  <Input
                    placeholder="Search categories..."
                    value={rawSearch}
                    onChange={(e) => {
                      setRawSearch(e.target.value);
                      setPage(1);
                    }}
                    className={cn("h-10 rounded-xl pl-9", isFetching && "pr-9")}
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
                          setStatusFilter(v as "all" | "true" | "false");
                          setPage(1);
                        }}
                      >
                        <SelectTrigger className="h-10 w-full rounded-xl">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="all">All statuses</SelectItem>
                          <SelectItem value="true">Active</SelectItem>
                          <SelectItem value="false">Inactive</SelectItem>
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
                          setSortBy(sb as "name" | "created_at");
                          setSortOrder(so as "asc" | "desc");
                          setPage(1);
                        }}
                      >
                        <SelectTrigger className="h-10 w-full rounded-xl">
                          <SelectValue placeholder="Sort" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="name:asc">Name A-Z</SelectItem>
                          <SelectItem value="name:desc">Name Z-A</SelectItem>
                          <SelectItem value="created_at:desc">
                            Latest
                          </SelectItem>
                          <SelectItem value="created_at:asc">Oldest</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 pt-2">
                      {hasFilters && (
                        <Button
                          variant="outline"
                          onClick={clearFilters}
                          className="flex-1 rounded-xl border-border gap-1.5"
                        >
                          <X className="h-4 w-4 shrink-0" />
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
                {isFetching ? (
                  <Loader2 className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-muted-foreground" />
                ) : (
                  <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                )}
                <Input
                  placeholder="Search categories..."
                  value={rawSearch}
                  onChange={(e) => {
                    setRawSearch(e.target.value);
                    setPage(1);
                  }}
                  className={cn("h-10 rounded-xl pl-9", isFetching && "pr-9")}
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(v) => {
                  setStatusFilter(v as "all" | "true" | "false");
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-10 w-full rounded-xl sm:w-36">
                  <Filter className="mr-1 h-3.5 w-3.5 text-gray-400" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={`${sortBy}:${sortOrder}`}
                onValueChange={(v) => {
                  const [sb, so] = v.split(":");
                  setSortBy(sb as "name" | "created_at");
                  setSortOrder(so as "asc" | "desc");
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-10 w-full rounded-xl sm:w-40">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="created_at:desc">Latest</SelectItem>
                  <SelectItem value="created_at:asc">Oldest</SelectItem>
                  <SelectItem value="name:asc">Name A-Z</SelectItem>
                  <SelectItem value="name:desc">Name Z-A</SelectItem>
                </SelectContent>
              </Select>
              {hasFilters && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="h-10 w-full rounded-xl border-border gap-1.5 text-muted-foreground hover:text-foreground sm:w-auto"
                >
                  <X className="h-4 w-4 shrink-0" />
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
                {isTableLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-16 animate-pulse rounded-xl bg-muted/50"
                    />
                  ))
                ) : list.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FolderOpen className="mb-4 h-10 w-10 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      No categories found.
                    </p>
                  </div>
                ) : (
                  list.map((category) => (
                    <AdminListCard
                      key={category.id}
                      title={category.name}
                      subtitle={category.description ?? category.slug}
                      badge={
                        <Badge
                          variant={category.is_active ? "default" : "secondary"}
                          className="shrink-0"
                        >
                          {category.is_active ? "Active" : "Inactive"}
                        </Badge>
                      }
                      onClick={() => {
                        setEditCategory(category);
                        setSheetOpen(true);
                      }}
                      right={
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
                          <DropdownMenuContent
                            align="end"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <DropdownMenuItem
                              onClick={() =>
                                setToggleActive({
                                  category,
                                  nextValue: !category.is_active,
                                })
                              }
                            >
                              {category.is_active ? (
                                <>
                                  <ToggleLeft className="mr-2 h-3.5 w-3.5" />
                                  Set Inactive
                                </>
                              ) : (
                                <>
                                  <ToggleRight className="mr-2 h-3.5 w-3.5" />
                                  Set Active
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setEditCategory(category);
                                setSheetOpen(true);
                              }}
                            >
                              <Pencil className="mr-2 h-3.5 w-3.5" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-500 focus:text-red-500"
                              onClick={() => setDeleteId(category.id)}
                            >
                              <Trash2 className="mr-2 h-3.5 w-3.5" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      }
                    />
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
                  isLoading={isTableLoading}
                />
              </div>
            </>
          ) : (
            <>
              <div className="py-4">
                <DataTable
                  columns={columns}
                  data={list}
                  isLoading={isTableLoading}
                  emptyMessage="No categories found."
                  emptyIcon={
                    <FolderOpen className="mb-4 h-10 w-10 text-muted-foreground/50" />
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
                  isLoading={isTableLoading}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <CategorySheet
        open={sheetOpen}
        onOpenChange={handleSheetOpenChange}
        category={editCategory}
      />

      <AlertDialog
        open={!!toggleActive}
        onOpenChange={(open) => !open && setToggleActive(null)}
      >
        <AlertDialogContent className="rounded-xl border border-border bg-card shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {toggleActive?.nextValue
                ? "Set category to Active?"
                : "Set category to Inactive?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {toggleActive?.nextValue
                ? `"${toggleActive?.category.name}" will be visible to users.`
                : `"${toggleActive?.category.name}" will be hidden from users.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 mt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              onClick={handleToggleActiveConfirm}
              disabled={updateCategory.isPending}
              className="min-w-[100px]"
            >
              {updateCategory.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating…
                </>
              ) : toggleActive?.nextValue ? (
                "Set Active"
              ) : (
                "Set Inactive"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent className="rounded-xl border border-border bg-card shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Properties using this category will
              have their category set to none.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 mt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              onClick={handleDeleteConfirm}
              disabled={deleteCategory.isPending}
              variant="destructive"
              className="min-w-[100px]"
            >
              {deleteCategory.isPending ? (
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
