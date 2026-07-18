import type {HTMLAttributes, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes} from "react";
import {cn} from "@/lib/cn";

export function Table({className, ...props}: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={cn(
          "w-full min-w-[1240px] caption-bottom border-collapse text-[13px] max-[600px]:min-w-[1180px]",
          className
        )}
        {...props}
      />
    </div>
  );
}

export function TableHeader({className, ...props}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        "bg-[color-mix(in_srgb,var(--surface)_96%,var(--bg))] [&_tr]:border-b [&_tr]:border-[var(--border)]",
        className
      )}
      {...props}
    />
  );
}

export function TableBody({className, ...props}: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("[&_tr:last-child]:border-b-0", className)} {...props} />;
}

export function TableRow({className, ...props}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "border-b border-[var(--border)] transition-colors duration-150 hover:bg-[color-mix(in_srgb,var(--text)_2.5%,var(--surface))]",
        className
      )}
      {...props}
    />
  );
}

export function TableHead({className, ...props}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "h-[42px] px-3 text-center text-[11px] font-[550] whitespace-nowrap text-[var(--text-soft)]",
        className
      )}
      {...props}
    />
  );
}

export function TableCell({className, ...props}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn("h-[58px] max-w-[260px] px-3 py-2 align-middle", className)} {...props} />
  );
}
