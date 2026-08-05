import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-gray-900 text-white border-gray-900 hover:bg-gray-800 hover:border-gray-800 active:bg-black",
  secondary:
    "bg-surface text-fg border-line-strong hover:border-gray-400 hover:bg-bg-subtle active:bg-gray-100",
  ghost:
    "bg-transparent text-fg-muted border-transparent hover:bg-gray-100 hover:text-fg active:bg-gray-200",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px] gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

export function Button({
  variant = "secondary",
  size = "md",
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-md border font-medium",
        "transition-[background-color,border-color,color,opacity] duration-150 ease-out",
        "disabled:pointer-events-none disabled:opacity-40",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
