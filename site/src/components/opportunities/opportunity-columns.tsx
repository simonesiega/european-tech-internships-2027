"use client";

import type {CSSProperties} from "react";
import type {Column, ColumnDef} from "@tanstack/react-table";
import {ArrowUpDown, ArrowUpRight} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
  formatCategory,
  formatPublishedDate,
  getCategoryHue,
  getEmploymentTypeHue,
  getWorkModeHue,
} from "@/lib/opportunity-presentation";
import type {Internship} from "@/types/internship";

function SortableHeader({column, label}: {column: Column<Internship>; label: string}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="column-sort-button"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <ArrowUpDown aria-hidden="true" />
    </Button>
  );
}

export const opportunityColumns: ColumnDef<Internship>[] = [
  {
    id: "open",
    enableSorting: false,
    cell: ({row}) => (
      <Button
        variant="ghost"
        size="icon"
        className="open-role-button"
        onClick={() => window.open(row.original.link, "_blank", "noopener,noreferrer")}
        aria-label={`Open ${row.original.title} at ${row.original.company}`}
      >
        <ArrowUpRight aria-hidden="true" />
      </Button>
    ),
  },
  {
    accessorKey: "company",
    header: ({column}) => <SortableHeader column={column} label="Company" />,
    cell: ({row}) => <span className="company-name">{row.original.company}</span>,
  },
  {
    accessorKey: "title",
    header: ({column}) => <SortableHeader column={column} label="Role" />,
    cell: ({row}) => (
      <a className="role-link" href={row.original.link} target="_blank" rel="noreferrer">
        {row.original.title}
      </a>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({row}) => (
      <Badge
        className="colored-badge"
        variant="secondary"
        style={{"--badge-hue": getCategoryHue(row.original.category)} as CSSProperties}
      >
        {formatCategory(row.original.category)}
      </Badge>
    ),
  },
  {
    accessorKey: "workMode",
    header: "Work mode",
    cell: ({row}) => (
      <Badge
        className={row.original.workMode ? "colored-badge" : "unspecified-badge"}
        variant="outline"
        style={
          row.original.workMode
            ? ({"--badge-hue": getWorkModeHue(row.original.workMode)} as CSSProperties)
            : undefined
        }
      >
        {row.original.workMode ? formatCategory(row.original.workMode) : "Not specified"}
      </Badge>
    ),
  },
  {
    accessorKey: "employmentType",
    header: "Employment type",
    cell: ({row}) => (
      <Badge
        className={row.original.employmentType ? "colored-badge" : "unspecified-badge"}
        variant="outline"
        style={
          row.original.employmentType
            ? ({
                "--badge-hue": getEmploymentTypeHue(row.original.employmentType),
              } as CSSProperties)
            : undefined
        }
      >
        {row.original.employmentType
          ? formatCategory(row.original.employmentType)
          : "Not specified"}
      </Badge>
    ),
  },
  {
    accessorKey: "location",
    header: ({column}) => <SortableHeader column={column} label="Location" />,
    cell: ({row}) => <span className="muted-cell">{row.original.location}</span>,
  },
  {
    accessorKey: "startDate",
    header: "Start date",
    cell: ({row}) => (
      <span className={`muted-cell nowrap-cell${row.original.startDate ? "" : "empty-date-cell"}`}>
        {row.original.startDate ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "firstSeenAt",
    header: ({column}) => <SortableHeader column={column} label="First seen" />,
    cell: ({row}) => (
      <time className="muted-cell nowrap-cell" dateTime={row.original.firstSeenAt}>
        {formatPublishedDate(row.original.firstSeenAt)}
      </time>
    ),
  },
];
