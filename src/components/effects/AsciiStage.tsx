import { Suspense, lazy, useEffect, useRef, useState } from "react";

// three + AsciiEffect is by far the heaviest thing on the site. Splitting it
// out keeps it off the critical path: the chunk is only fetched once the
// footer actually scrolls into view.
const AsciiName = lazy(() => import("./AsciiName"));

/**
 * Holds the space for the ASCII name and loads the WebGL renderer lazily.
 * The reserved box means the footer never shifts when the chunk lands.
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
    <div
      ref={ref}
      className="
        aspect-4/3 w-full overflow-hidden rounded-lg border border-line
        bg-bg-subtle text-fg sm:aspect-3/2
      "
    >
      {visible && (
        <Suspense fallback={null}>
          <AsciiName />
        </Suspense>
      )}
    </div>
  );
}
