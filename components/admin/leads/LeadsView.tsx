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
  Loader2,
  UserCircle,
  Download,
  FileSpreadsheet,
  FileText,
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
import { AdminListCard } from "@/components/admin/AdminListCard";
import { LeadSheet } from "./LeadSheet";
import { useLeads, useDeleteLead } from "@/hooks/useLeads";
import { useDebounce } from "@/hooks/useDebounce";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useExportWorker } from "@/hooks/useExportWorker";
import { buildQueryString } from "@/lib/utils";
import { formatDate, cn } from "@/lib/utils";
import { toast } from "sonner";
import type { LeadWithProperty, LeadStatus, LeadSource } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  PageHeader,
  type BreadcrumbItem,
} from "@/components/admin/layout/PageHeader";

const SOURCE_LABELS: Record<LeadSource, string> = {
  website: "Website",
  meta_ads: "Meta Ads",
  google_ads: "Google Ads",
  manual: "Manual",
};

const SOURCE_STYLES: Record<LeadSource, string> = {
  website: "bg-indigo-50 text-indigo-700 border-indigo-100",
  meta_ads: "bg-blue-50 text-blue-700 border-blue-100",
  google_ads: "bg-red-50 text-red-700 border-red-100",
  manual: "bg-gray-100 text-gray-600 border-gray-200",
};

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: "bg-blue-50 text-blue-700 border-blue-100",
  contacted: "bg-amber-50 text-amber-700 border-amber-100",
  qualified: "bg-emerald-50 text-emerald-700 border-emerald-100",
  converted: "bg-green-50 text-green-700 border-green-100",
  lost: "bg-gray-100 text-gray-600 border-gray-200",
};

function leadsToExportRows(
  leads: LeadWithProperty[],
): Record<string, unknown>[] {
  return leads.map((l) => ({
    Name: l.name,
    Email: l.email ?? "",
    Phone: l.phone ?? "",
    Source: SOURCE_LABELS[l.source],
    Status: l.status,
    "Property Title": l.property?.title ?? "",
    "Property Price": l.property?.price != null ? l.property.price : "",
    Message: l.message ?? "",
    "Created At": l.created_at,
  }));
}

export interface LeadsViewHeaderConfig {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export function LeadsView({
  header,
}: {
  header?: LeadsViewHeaderConfig;
} = {}) {
  const isMobile = useIsMobile();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [rawSearch, setRawSearch] = useState("");
  const search = useDebounce(rawSearch, 300);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<LeadSource | "all">("all");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editLead, setEditLead] = useState<LeadWithProperty | undefined>();
  const [viewLead, setViewLead] = useState<LeadWithProperty | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [exporting, setExporting] = useState<"csv" | "xlsx" | null>(null);
  const [exportConfirmFormat, setExportConfirmFormat] = useState<
    "csv" | "xlsx" | null
  >(null);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const { exportToFile } = useExportWorker();
  const { data, isLoading } = useLeads({
    page,
    limit,
    search: search || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
    source: sourceFilter === "all" ? undefined : sourceFilter,
    sort_by: sortBy,
    sort_order: sortOrder,
  });
  const deleteLead = useDeleteLead();

  const hasFilters =
    rawSearch !== "" ||
    statusFilter !== "all" ||
    sourceFilter !== "all" ||
    sortBy !== "created_at" ||
    sortOrder !== "desc";

  const clearFilters = () => {
    setRawSearch("");
    setStatusFilter("all");
    setSourceFilter("all");
    setSortBy("created_at");
    setSortOrder("desc");
    setPage(1);
  };

  const columns: ColumnDef<LeadWithProperty>[] = [
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
      size: 180,
      cell: ({ row }) => (
        <span className="font-medium text-foreground">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      size: 220,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground truncate max-w-[200px] block">
          {row.original.email ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      size: 160,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.phone ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "source",
      header: "Source",
      size: 120,
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={cn("text-xs", SOURCE_STYLES[row.original.source])}
        >
          {SOURCE_LABELS[row.original.source]}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 120,
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={cn(
            "text-xs capitalize",
            STATUS_STYLES[row.original.status],
          )}
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "property",
      header: "Property",
      size: 180,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground truncate max-w-[160px] block">
          {row.original.property?.title ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created",
      size: 140,
      cell: ({ row }) => (
        <span className="text-sm text-gray-500">
          {formatDate(row.original.created_at)}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      size: 80,
      cell: ({ row }) => {
        const lead = row.original;
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
                    setEditLead(lead);
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
                    setDeleteId(lead.id);
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
    setEditLead(undefined);
    setSheetOpen(true);
  };

  const handleSheetOpenChange = (open: boolean) => {
    setSheetOpen(open);
    if (!open) setEditLead(undefined);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    await deleteLead.mutateAsync(deleteId);
    setDeleteId(null);
  };

  async function handleExport(format: "csv" | "xlsx") {
    setExportConfirmFormat(null);
    setExporting(format);
    try {
      const qs = buildQueryString({
        page: 1,
        limit: 10000,
        search: search || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
        source: sourceFilter === "all" ? undefined : sourceFilter,
        sort_by: sortBy,
        sort_order: sortOrder,
      });
      const res = await fetch(`/api/admin/leads?${qs}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch leads");
      const json = await res.json();
      const leads = (json.data ?? []) as LeadWithProperty[];
      const rows = leadsToExportRows(leads);
      if (rows.length === 0) {
        toast.error("No leads to export");
        return;
      }
      const filename = `leads-${new Date().toISOString().slice(0, 10)}`;
      await exportToFile({
        data: rows,
        format,
        filename,
        sheetName: "Leads",
      });
    } catch (err) {
      console.error("Export failed:", err);
      toast.error("Export failed. Please try again.");
    } finally {
      setExporting(null);
    }
  }

  const list = data?.data ?? [];
  const total = data?.total ?? 0;

  const headerActions = (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 rounded-lg"
            disabled={!!exporting}
          >
            {exporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => setExportConfirmFormat("csv")}
            disabled={!!exporting}
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            Export to CSV
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setExportConfirmFormat("xlsx")}
            disabled={!!exporting}
            className="gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Export to Excel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        onClick={handleAdd}
        size="sm"
        className="min-h-[44px] h-9 gap-1.5 rounded-lg bg-primary px-4 text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="h-4 w-4" />
        Add lead
      </Button>
    </>
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
        <div className="flex justify-end gap-2 px-2 pt-6 sm:px-6 lg:px-8">
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
                    placeholder="Search leads..."
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
                          setStatusFilter(v as LeadStatus | "all");
                          setPage(1);
                        }}
                      >
                        <SelectTrigger className="h-10 w-full rounded-xl">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="all">All statuses</SelectItem>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="qualified">Qualified</SelectItem>
                          <SelectItem value="converted">Converted</SelectItem>
                          <SelectItem value="lost">Lost</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">
                        Source
                      </label>
                      <Select
                        value={sourceFilter}
                        onValueChange={(v) => {
                          setSourceFilter(v as LeadSource | "all");
                          setPage(1);
                        }}
                      >
                        <SelectTrigger className="h-10 w-full rounded-xl">
                          <SelectValue placeholder="Source" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="all">All sources</SelectItem>
                          <SelectItem value="website">Website</SelectItem>
                          <SelectItem value="meta_ads">Meta Ads</SelectItem>
                          <SelectItem value="google_ads">Google Ads</SelectItem>
                          <SelectItem value="manual">Manual</SelectItem>
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
                            Latest
                          </SelectItem>
                          <SelectItem value="created_at:asc">Oldest</SelectItem>
                          <SelectItem value="name:asc">Name A-Z</SelectItem>
                          <SelectItem value="name:desc">Name Z-A</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 pt-2">
                      {hasFilters && (
                        <Button
                          variant="ghost"
                          onClick={clearFilters}
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
                  placeholder="Search leads..."
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
                  setStatusFilter(v as LeadStatus | "all");
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-10 w-full rounded-xl sm:w-36">
                  <Filter className="mr-1 h-3.5 w-3.5 text-gray-400" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={sourceFilter}
                onValueChange={(v) => {
                  setSourceFilter(v as LeadSource | "all");
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-10 w-full rounded-xl sm:w-36">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All sources</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="meta_ads">Meta Ads</SelectItem>
                  <SelectItem value="google_ads">Google Ads</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
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
                  <SelectItem value="created_at:desc">Latest</SelectItem>
                  <SelectItem value="created_at:asc">Oldest</SelectItem>
                  <SelectItem value="name:asc">Name A-Z</SelectItem>
                  <SelectItem value="name:desc">Name Z-A</SelectItem>
                </SelectContent>
              </Select>
              {hasFilters && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="h-10 w-full rounded-xl text-gray-500 hover:text-gray-900 sm:w-auto"
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
                    <UserCircle className="mb-4 h-10 w-10 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      No leads found.
                    </p>
                  </div>
                ) : (
                  list.map((lead) => (
                    <AdminListCard
                      key={lead.id}
                      title={lead.name}
                      subtitle={
                        [lead.email, lead.phone].filter(Boolean).join(" · ") ||
                        SOURCE_LABELS[lead.source]
                      }
                      badge={
                        <Badge
                          variant="outline"
                          className={cn(
                            "shrink-0 text-xs capitalize",
                            STATUS_STYLES[lead.status],
                          )}
                        >
                          {lead.status}
                        </Badge>
                      }
                      onClick={() => {
                        setEditLead(lead);
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
                              onClick={() => {
                                setEditLead(lead);
                                setSheetOpen(true);
                              }}
                            >
                              <Pencil className="mr-2 h-3.5 w-3.5" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-500 focus:text-red-500"
                              onClick={() => setDeleteId(lead.id)}
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
                  emptyMessage="No leads found."
                  emptyIcon={
                    <UserCircle className="mb-4 h-10 w-10 text-muted-foreground/50" />
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

      <LeadSheet
        open={sheetOpen}
        onOpenChange={handleSheetOpenChange}
        lead={editLead ?? null}
      />

      <ProfileDetailModal
        open={!!viewLead}
        onOpenChange={(open) => !open && setViewLead(null)}
        title="Lead Profile"
        subtitle="Contact details and inquiry information"
        icon={<UserCircle className="h-10 w-10 text-indigo-300" />}
        onEdit={
          viewLead
            ? () => {
                setViewLead(null);
                setEditLead(viewLead);
                setSheetOpen(true);
              }
            : undefined
        }
        editLabel="Edit Lead"
        dismissLabel="Dismiss Profile"
      >
        {viewLead && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <ProfileSectionLabel>Contact Information</ProfileSectionLabel>
                <div className="space-y-3">
                  <div>
                    <ProfileFieldLabel>Name</ProfileFieldLabel>
                    <p className="text-xl font-semibold text-foreground">
                      {viewLead.name}
                    </p>
                  </div>
                  <div>
                    <ProfileFieldLabel>Email</ProfileFieldLabel>
                    <p className="text-sm text-foreground">
                      {viewLead.email ?? "—"}
                    </p>
                  </div>
                  <div>
                    <ProfileFieldLabel>Phone</ProfileFieldLabel>
                    <p className="text-sm text-foreground">
                      {viewLead.phone ?? "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <ProfileSectionLabel>Source & Status</ProfileSectionLabel>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="rounded-lg">
                    {SOURCE_LABELS[viewLead.source]}
                  </Badge>
                  <Badge
                    className={cn(
                      "rounded-lg capitalize border-none",
                      STATUS_STYLES[viewLead.status],
                    )}
                  >
                    {viewLead.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-6 text-left">
              <div>
                <ProfileSectionLabel>Interested Property</ProfileSectionLabel>
                <p className="text-sm font-medium text-foreground">
                  {viewLead.property?.title ?? "—"}
                </p>
                {viewLead.property?.price != null && (
                  <p className="text-sm text-primary font-semibold mt-1">
                    ₹{viewLead.property.price.toLocaleString("en-IN")}
                  </p>
                )}
              </div>

              <div>
                <ProfileSectionLabel>Timeline</ProfileSectionLabel>
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">
                    Created
                  </span>
                  <p className="text-sm font-medium text-foreground">
                    {formatDate(viewLead.created_at)}
                  </p>
                </div>
              </div>

              {viewLead.message && (
                <div>
                  <ProfileSectionLabel>Message</ProfileSectionLabel>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {viewLead.message}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </ProfileDetailModal>

      <AlertDialog
        open={!!exportConfirmFormat}
        onOpenChange={(open) => !open && setExportConfirmFormat(null)}
      >
        <AlertDialogContent className="rounded-xl border border-border bg-card shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Export leads as {exportConfirmFormat === "csv" ? "CSV" : "Excel"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will export up to 10,000 leads based on current filters. The
              file will download when ready.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              onClick={() =>
                exportConfirmFormat && handleExport(exportConfirmFormat)
              }
              disabled={!!exporting}
              className="min-w-[100px]"
            >
              {exporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting…
                </>
              ) : (
                "Export"
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
            <AlertDialogTitle>Delete lead?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              lead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 mt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              onClick={handleDeleteConfirm}
              disabled={deleteLead.isPending}
              variant="destructive"
              className="min-w-[100px]"
            >
              {deleteLead.isPending ? (
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
