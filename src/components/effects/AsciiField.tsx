import { useEffect, useRef } from "react";

const GLYPHS = ".:-+=*/\\|<>~^'`,;";
const CELL = 15; // px between cells; also drives the font size
const FPS = 12; // ASCII reads better stepped, and this keeps the cost low
const THRESHOLD = 1.15; // wave value a cell must clear before it appears

/**
 * A slow field of ASCII characters drifting across the page background.
 *
 * Three sine waves at different frequencies are summed per cell; only cells
 * above a threshold are drawn, so characters surface in bands and fade out
 * again as the waves move through. Nothing here is random per frame — the
 * glyphs are picked once and only a handful are swapped each tick, which is
 * what keeps it from reading as television static.
 *
 * Cheap by construction: capped at 12fps, and only the ~15% of cells that
 * clear the threshold are ever painted.
 */
export function AsciiField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let cols = 0;
    let rows = 0;
    let glyphs: string[] = [];
    let accents: boolean[] = [];
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      cols = Math.ceil(w / CELL) + 1;
      rows = Math.ceil(h / CELL) + 1;

      glyphs = Array.from(
        { length: cols * rows },
        () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
      );
      // Roughly one cell in fourteen carries the accent colour, so the field
      // stays neutral overall with just a bit of blue in it.
      accents = Array.from({ length: cols * rows }, () => Math.random() < 0.07);
    };

    const paint = (time: number) => {
      const t = time / 1000;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.font = `${CELL - 4}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textBaseline = "top";

      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < cols; x += 1) {
          const wave =
            Math.sin(x * 0.15 + t * 0.42) +
            Math.sin(y * 0.21 - t * 0.31) +
            Math.sin((x + y) * 0.09 + t * 0.23);

          if (wave < THRESHOLD) continue;

          const index = y * cols + x;
          // Fade in over the top of the threshold rather than snapping on.
          const alpha = Math.min((wave - THRESHOLD) / 1.3, 1) * 0.42;

          ctx.globalAlpha = alpha;
          ctx.fillStyle = accents[index] ? "#1823ee" : "#9a9790";
          ctx.fillText(glyphs[index], x * CELL, y * CELL);
        }
      }
      ctx.globalAlpha = 1;
    };

    resize();

    if (reduced.matches) {
      // One static frame: the texture is part of the page, the motion isn't.
      paint(0);
      const onResize = () => {
        resize();
        paint(0);
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    let frame = 0;
    let last = 0;
    const interval = 1000 / FPS;

    const tick = (time: number) => {
      frame = requestAnimationFrame(tick);
      if (time - last < interval) return;
      last = time;

      // Swap a few glyphs each tick so the field shimmers without churning.
      for (let i = 0; i < 6; i += 1) {
        const at = Math.floor(Math.random() * glyphs.length);
        glyphs[at] = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }

      paint(time);
    };

    frame = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-effect="ascii-field"
      // Behind everything: a negative z-index still paints above the root
      // background, but below every positioned and in-flow element.
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: -1 }}
    />
  );
}
