import { useEffect, useRef } from "react";

interface Square {
  x: number;
  y: number;
  born: number;
  size: number;
  spin: number;
}

const LIFE = 720; // ms a square stays visible
const SPACING = 15; // px of travel between two spawns
const MAX = 90; // hard cap, so a fast sweep can't flood the buffer

/**
 * A trail of small blue squares that follows the pointer and fades out once
 * it stops moving.
 *
 * Canvas rather than DOM nodes: this spawns dozens of short-lived marks a
 * second, and creating/removing that many elements would thrash layout. The
 * canvas is `pointer-events: none` and sits above everything, so it never
 * intercepts a click.
 */
export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Only for pointer users who haven't asked for less motion. A touch
    // device has no hovering cursor to trail, so the effect is meaningless.
    const finePointer = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reduced.matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const squares: Square[] = [];
    let last: { x: number; y: number } | null = null;
    let frame = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const { clientX: x, clientY: y } = event;

      if (last) {
        const dx = x - last.x;
        const dy = y - last.y;
        if (Math.hypot(dx, dy) < SPACING) return;
      }
      last = { x, y };

      squares.push({
        x,
        y,
        born: performance.now(),
        // A little size variance keeps the trail from reading as a dotted rule.
        size: 5 + Math.random() * 4,
        spin: (Math.random() - 0.5) * 0.9,
      });
      if (squares.length > MAX) squares.splice(0, squares.length - MAX);
    };

    const draw = () => {
      frame = requestAnimationFrame(draw);
      const now = performance.now();

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = squares.length - 1; i >= 0; i -= 1) {
        const square = squares[i];
        const age = (now - square.born) / LIFE;

        if (age >= 1) {
          squares.splice(i, 1);
          continue;
        }

        // Ease-out so the square holds its colour, then leaves quickly.
        const alpha = (1 - age) ** 2;
        const size = square.size * (1 - age * 0.45);

        ctx.save();
        ctx.translate(square.x, square.y);
        ctx.rotate(square.spin * age);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "#1823ee";
        ctx.fillRect(-size / 2, -size / 2, size, size);
        ctx.restore();
      }
    };

    resize();
    frame = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-effect="cursor-trail"
      className="pointer-events-none fixed inset-0 z-[150]"
    />
  );
}
