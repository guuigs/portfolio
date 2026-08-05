import { flushSync } from "react-dom";

type StartViewTransition = (callback: () => void) => { finished: Promise<void> };

/**
 * Runs a state update inside a native view transition.
 *
 * React's `<ViewTransition>` component is canary-only, and this app is on
 * stable React — so we drive `document.startViewTransition` directly and let
 * the CSS in `index.css` decide how each named group animates. Browsers
 * without the API (and users who asked for reduced motion) just get the
 * instant update, which is the correct fallback.
 */
export function withViewTransition(update: () => void): void {
  const start = (document as Document & { startViewTransition?: StartViewTransition })
    .startViewTransition;

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (typeof start !== "function" || prefersReducedMotion) {
    update();
    return;
  }

  start.call(document, () => {
    // The transition snapshots the DOM when this callback returns, so the
    // update has to be committed synchronously rather than batched.
    flushSync(update);
  });
}
