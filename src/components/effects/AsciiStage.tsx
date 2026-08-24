import { Component, Suspense, lazy, useEffect, useRef, useState, type ReactNode } from "react";

// three + AsciiEffect is by far the heaviest thing on the site. Splitting it
// out keeps it off the critical path: the chunk is only fetched once the
// footer actually scrolls into view.
const AsciiPlanet = lazy(() => import("./AsciiPlanet"));

/** The glyph shown when the planet cannot be drawn, whatever the reason. */
function StaticGlyph() {
  return (
    <div className="flex size-full items-center justify-center">
      <span aria-hidden="true" className="font-mono text-6xl opacity-80">
        ◍
      </span>
    </div>
  );
}

/**
 * Catches a failure to load or run the planet.
 *
 * Without this, a rejected `import()` — a purged chunk, a flaky connection, an
 * extension blocking the request — propagates out of `Suspense` to the root,
 * and React 19 unmounts the whole tree: a blank page for a decorative tile in
 * the footer. The boundary keeps the failure the size of the thing that failed.
 */
class PlanetBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? <StaticGlyph /> : this.props.children;
  }
}

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
        <PlanetBoundary>
          <Suspense fallback={null}>
            <AsciiPlanet />
          </Suspense>
        </PlanetBoundary>
      )}
    </div>
  );
}
