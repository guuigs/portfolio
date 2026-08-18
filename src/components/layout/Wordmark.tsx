import svgPaths from "@/lib/logo-paths";

const PATHS = [
  svgPaths.p1c4fd000,
  svgPaths.p22e60c00,
  svgPaths.p15f0cf70,
  svgPaths.p3826780,
  svgPaths.p3a4ce2f0,
  svgPaths.p20470400,
  svgPaths.p24592a00,
  svgPaths.p2cce90f0,
  svgPaths.p1b366df0,
  svgPaths.p371c2700,
  svgPaths.p69ba300,
  svgPaths.p2cc78400,
  svgPaths.p313d4500,
  svgPaths.p2198fa80,
  svgPaths.p36e9af00,
  svgPaths.p38b60f80,
];

/** The real wordmark from the source repo, redrawn in `currentColor` so it
 *  inherits the monochrome palette instead of hard-coding the brand blue.
 *
 *  `src` overrides it with an uploaded file (a GIF, in practice). The vector
 *  stays the default because it is sharp at any density and follows the text
 *  colour; a bitmap can do neither, so it has to be opted into. */
export function Wordmark({ className, src }: { className?: string; src?: string }) {
  if (src) {
    return (
      <img
        src={src}
        alt="Guilhem Terrier"
        // The height comes from `className` (h-5); width follows the file's
        // own proportions instead of being squeezed into the SVG's 113:40.
        className={className}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 113 40"
      fill="none"
      role="img"
      aria-label="Guilhem Terrier"
      className={className}
    >
      <g fill="currentColor">
        {PATHS.map((d, index) => (
          <path key={index} d={d} />
        ))}
        <path d={svgPaths.p296b1c00} clipRule="evenodd" fillRule="evenodd" />
      </g>
    </svg>
  );
}
