"use client";

import {useState} from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {opportunityColumns} from "@/components/opportunities/opportunity-columns";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import type {Internship} from "@/types/internship";

type OpportunityListProps = {
  internships: Internship[];
  onReset: () => void;
};

export function OpportunityList({internships, onReset}: OpportunityListProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  // TanStack Table intentionally returns non-memoizable functions as part of its API.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: internships,
    columns: opportunityColumns,
    state: {sorting},
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {pagination: {pageIndex: 0, pageSize: 10}},
  });

  return (
    <div className="data-table-section">
      <div className="data-table-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="table-empty-cell" colSpan={opportunityColumns.length}>
                  <div className="table-empty-state">
                    <strong>No opportunities found</strong>
                    <span>Try changing or clearing your filters.</span>
                    <Button variant="outline" size="sm" onClick={onReset}>
                      Reset filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="table-pagination">
        <label className="rows-per-page">
          <span>Rows:</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(event) => table.setPageSize(Number(event.target.value))}
            aria-label="Rows per page"
          >
            {[10, 20, 30, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </label>
        <div className="pagination-actions">
          <span>
            Page {table.getState().pagination.pageIndex + 1} of {Math.max(table.getPageCount(), 1)}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Previous page"
          >
            <ChevronLeft aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Next page"
          >
            <ChevronRight aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
