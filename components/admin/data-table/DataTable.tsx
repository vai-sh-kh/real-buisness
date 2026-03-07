"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  onRowClick?: (row: Row<TData>) => void;
  className?: string;
}

export function DataTable<TData>({
  columns,
  data,
  isLoading,
  emptyMessage = "No results found.",
  emptyIcon,
  onRowClick,
  className,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={cn("", className)}>
      <Table className="table-fixed">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  style={{ width: header.column.columnDef.size }}
                  className={cn(header.id === "actions" && "text-right")}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="animate-pulse">
                {columns.map((_, j) => {
                  // Vary skeleton widths per column for a realistic look
                  const widths = [
                    "w-8",
                    "w-3/4",
                    "w-2/3",
                    "w-16",
                    "w-24",
                    "w-10",
                  ];
                  const w = widths[j % widths.length];
                  // Vary skeleton heights
                  const isFirst = j === 0;
                  const isLast = j === columns.length - 1;
                  return (
                    <TableCell key={j}>
                      <div className="flex items-center gap-2">
                        {isFirst ? (
                          <Skeleton className="h-4 w-6 rounded" />
                        ) : isLast ? (
                          <div className="flex justify-end w-full">
                            <Skeleton className="h-7 w-7 rounded-md" />
                          </div>
                        ) : (
                          <Skeleton
                            className={cn("h-4 rounded", w)}
                            style={{ animationDelay: `${i * 75 + j * 50}ms` }}
                          />
                        )}
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className={cn(onRowClick && "cursor-pointer")}
                onClick={() => onRowClick?.(row)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-48 text-center text-muted-foreground p-8"
              >
                <div className="flex flex-col items-center justify-center">
                  {emptyIcon}
                  <p className="text-base text-muted-foreground font-medium">
                    {emptyMessage}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
