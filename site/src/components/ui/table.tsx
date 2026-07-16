import type {HTMLAttributes, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes} from "react";

export function Table({className = "", ...props}: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="ui-table-container">
      <table className={`ui-table ${className}`.trim()} {...props} />
    </div>
  );
}

export function TableHeader(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead {...props} />;
}

export function TableBody(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} />;
}

export function TableRow({className = "", ...props}: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={`ui-table-row ${className}`.trim()} {...props} />;
}

export function TableHead({className = "", ...props}: ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={`ui-table-head ${className}`.trim()} {...props} />;
}

export function TableCell({className = "", ...props}: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={`ui-table-cell ${className}`.trim()} {...props} />;
}
