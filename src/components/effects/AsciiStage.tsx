import { Suspense, lazy, useEffect, useRef, useState } from "react";

// three + AsciiEffect is by far the heaviest thing on the site. Splitting it
// out keeps it off the critical path: the chunk is only fetched once the
// footer actually scrolls into view.
const AsciiPlanet = lazy(() => import("./AsciiPlanet"));

/**
 * Holds the space for the ASCII planet and loads the WebGL renderer lazily.
 * The reserved square means the footer never shifts when the chunk lands.
 */
export function AsciiStage() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    // White glyphs on the accent blue, square — the whole tile is the artwork,
    // so it carries the colour rather than sitting in a neutral card.
    <div
      ref={ref}
      className="aspect-square w-full overflow-hidden rounded-lg bg-accent text-white"
    >
      {visible && (
        <Suspense fallback={null}>
          <AsciiPlanet />
        </Suspense>
      )}
    </div>
  );
}
