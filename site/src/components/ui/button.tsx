import type {ButtonHTMLAttributes} from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "icon";
};

export function Button({
  className = "",
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`ui-button ui-button--${variant} ui-button--${size} ${className}`.trim()}
      {...props}
    />
  );
}
