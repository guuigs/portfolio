import { cn } from "@/lib/utils";

export interface SignatureProps {
  className?: string;
  /** Draw the stroke on mount instead of showing it complete. */
  animate?: boolean;
}

/**
 * Guilhem's paraph, redrawn as vector strokes.
 *
 * Kept as inline SVG rather than the source PNG on purpose: it inherits
 * `currentColor` (so it survives a dark theme without a filter hack), it
 * stays sharp at any size, and `stroke-dasharray` lets it draw itself.
 *
 * To swap in the original artwork instead, drop the file at
 * `public/signature.svg` and replace this component's body with an <img>.
 */
export function Signature({ className, animate = true }: SignatureProps) {
  return (
    <svg
      viewBox="0 0 1546 594"
      fill="none"
      role="img"
      aria-label="Signature de Guilhem Terrier"
      className={cn("h-auto w-full text-fg", animate && "signature-draw", className)}
    >
      <g
        stroke="currentColor"
        strokeWidth={9}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      >
        {/* Main gesture: top sweep → descent → big lower loop → inner lens. */}
        <path pathLength={1} d="M1012 8C856 2 688 26 606 66c-48 24-66 66-57 111 8 39 25 76 49 112 50 85 106 189 196 254 80 57 184 63 268 27 72-31 126-76 145-118 9-21-11-33-57-34-70-1-160 3-220 8-58-14-114-40-140-69-18-20 16-29 70-17 40 9 68 45 78 100" />
        {/* Flourish: long rising line, cusp at the far left, return stroke. */}
        <path pathLength={1} d="M1540 141c-233 30-536 84-742 122-140 26-296 40-424 33-46-3-72-9-64-17 9-9 63-22 148-30 122-11 254-4 344 12" />
        <path pathLength={1} d="M14 299c60 8 190 8 320 3 96-4 178-9 234-13" />
      </g>
    </svg>
  );
}
