import { cn } from "@/lib/utils";

export interface ChipProps {
  children: string;
  className?: string;
}

/** A tech-stack token. Mono type signals "technical / factual". */
export function Chip({ children, className }: ChipProps) {
  return (
    <span
      translate="no"
      className={cn(
        "inline-flex h-8 shrink-0 items-center whitespace-nowrap rounded-md border sm:h-7",
        "border-line bg-bg-subtle px-2.5",
        "font-mono text-[13px] leading-none tracking-tight text-fg-muted sm:text-[12px]",
        className,
      )}
    >
      {children}
    </span>
  );
}
