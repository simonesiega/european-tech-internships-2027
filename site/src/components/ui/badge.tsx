import type {HTMLAttributes} from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "secondary" | "outline";
};

export function Badge({className = "", variant = "default", ...props}: BadgeProps) {
  return <span className={`ui-badge ui-badge--${variant} ${className}`.trim()} {...props} />;
}
