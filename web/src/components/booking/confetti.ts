"use client";

import * as React from "react";

/**
 * Fires the original site's confetti burst once, unless the visitor asked for reduced motion.
 * The library is imported lazily so it never lands in the initial bundle.
 */
export function useConfetti(active: boolean) {
  const fired = React.useRef(false);

  React.useEffect(() => {
    if (!active || fired.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    fired.current = true;

    let cancelled = false;
    void import("canvas-confetti").then(({ default: confetti }) => {
      if (cancelled) return;
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.4 },
        disableForReducedMotion: true,
      });
    });
    return () => {
      cancelled = true;
    };
  }, [active]);
}
