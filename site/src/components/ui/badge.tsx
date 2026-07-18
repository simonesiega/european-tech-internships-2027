import type {HTMLAttributes} from "react";
import {cn} from "@/lib/cn";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "secondary" | "outline";
};

export function Badge({className, variant = "default", ...props}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-[22px] items-center rounded-full border border-transparent px-2 py-0.5 text-[11px] leading-[1.2] font-medium whitespace-nowrap",
        variant === "default" && "bg-[var(--text)] text-[var(--surface)]",
        variant === "secondary" &&
          "bg-[color-mix(in_srgb,var(--text)_7%,var(--surface))] text-[var(--text-soft)]",
        variant === "outline" && "border-[var(--border)] bg-transparent text-[var(--text-soft)]",
        className
      )}
      {...props}
    />
  );
}
