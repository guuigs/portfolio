import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required: the button shows no text, so this is its only accessible name. */
  label: string;
  children: ReactNode;
}

export function IconButton({
  label,
  className,
  children,
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        // 40px visual box clears the 24px desktop / 44px-with-padding mobile floor.
        "inline-flex size-11 shrink-0 items-center justify-center rounded-md border sm:size-10",
        "border-line-strong bg-surface text-fg-muted",
        "transition-[background-color,border-color,color] duration-150 ease-out",
        "hover:border-gray-400 hover:bg-bg-subtle hover:text-fg",
        "active:bg-gray-100",
        "disabled:pointer-events-none disabled:opacity-40",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
