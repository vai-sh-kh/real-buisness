"use client";

import { useState, useCallback } from "react";
import { Search, Trash2, Eye } from "lucide-react";
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
import { LeadSheet } from "@/components/admin/leads/LeadSheet";
import { useLeads, useDeleteLead } from "@/hooks/useLeads";
import type { Lead, LeadFilters, LeadWithProperty } from "@/types";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";

const statusConfig: Record<Lead["status"], { label: string; variant: "default" | "secondary" | "success" | "warning" | "destructive" | "outline" }> = {
  new: { label: "New", variant: "default" },
  contacted: { label: "Contacted", variant: "secondary" },
  qualified: { label: "Qualified", variant: "success" as "default" },
  converted: { label: "Converted", variant: "success" as "default" },
  lost: { label: "Lost", variant: "destructive" },
};

const sourceLabels: Record<Lead["source"], string> = {
  website: "Website",
  meta_ads: "Meta Ads",
  google_ads: "Google Ads",
  manual: "Manual",
};

export default function LeadsPage() {
  const [filters, setFilters] = useState<Partial<LeadFilters>>({
    page: 1,
    limit: 10,
    sort_by: "created_at",
    sort_order: "desc",
  });
  const [searchInput, setSearchInput] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadWithProperty | null>(null);

  const debouncedSearch = useDebounce(searchInput, 400);
  const activeFilters = { ...filters, search: debouncedSearch || undefined };

  const { data, isLoading, isError } = useLeads(activeFilters);
  const deleteMutation = useDeleteLead();

  const updateFilter = useCallback(
    (key: keyof LeadFilters, value: string | number | undefined) => {
      setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    },
    []
  );

  function openDetail(lead: LeadWithProperty) {
    setSelectedLead(lead);
    setSheetOpen(true);
  }

  const columns: ColumnDef<LeadWithProperty>[] = [
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
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-sm">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.email ?? row.original.phone ?? "—"}</p>
        </div>
      ),
    },
    {
      accessorKey: "source",
      header: "Source",
      cell: ({ getValue }) => (
        <Badge variant="outline" className="text-xs">
          {sourceLabels[getValue<Lead["source"]>()] ?? getValue<string>()}
        </Badge>
      ),
    },
    {
      accessorKey: "property",
      header: "Property",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground truncate max-w-[160px] block">
          {row.original.property_title ?? row.original.property?.title ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue<Lead["status"]>();
        const config = statusConfig[status] ?? { label: status, variant: "secondary" as const };
        return <Badge variant={config.variant as "default"}>{config.label}</Badge>;
      },
    },
    {
      accessorKey: "created_at",
      header: "Received",
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">
          {formatRelativeTime(getValue<string>())}
        </span>
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
              openDetail(row.original);
            }}
          >
            <Eye className="h-3.5 w-3.5" />
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
                <AlertDialogTitle>Delete Lead</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this lead from {row.original.name}? This cannot be
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
          <h1 className="text-xl font-bold text-black tracking-tight">Leads</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {data?.total ?? 0} leads total
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={filters.source as string ?? "all"}
          onValueChange={(v) => updateFilter("source", v === "all" ? undefined : v)}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="website">Website</SelectItem>
            <SelectItem value="meta_ads">Meta Ads</SelectItem>
            <SelectItem value="google_ads">Google Ads</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.status as string ?? "all"}
          onValueChange={(v) => updateFilter("status", v === "all" ? undefined : v)}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isError && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load leads. Please try again.
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          isLoading={isLoading}
          emptyMessage="No leads found."
          onRowClick={(row) => openDetail(row.original)}
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

      <LeadSheet open={sheetOpen} onOpenChange={setSheetOpen} lead={selectedLead} />
    </div>
  );
}
