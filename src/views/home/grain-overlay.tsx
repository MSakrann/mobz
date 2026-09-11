"use client";

/**
 * Cinematic film-grain overlay (style.css .grain-overlay). A sticky
 * viewport-sized layer whose noise tile jumps between five offsets every
 * 80ms — the stepped `noiseAnimation` keyframes re-implemented on the shared
 * ticker (transform-only, compositor-cheap).
 */

import { useRef } from "react";

import { useLoop } from "@/hooks/animation/use-render-loop";

/** Offsets in rem (3.125rem amplitude), matching the original keyframes. */
const STEPS: [number, number][] = [
  [0, 0],
  [3.125, 3.125],
  [-3.125, 3.125],
  [3.125, -3.125],
  [-3.125, -3.125],
];
const STEP_MS = 80;

export const GrainOverlay = () => {
  const layerRef = useRef<HTMLDivElement>(null);
  const step = useRef(0);

  useLoop(
    () => {
      const layer = layerRef.current;
      if (!layer) return;
      step.current = (step.current + 1) % STEPS.length;
      const [x, y] = STEPS[step.current];
      layer.style.transform = `translate3d(${x}rem, ${y}rem, 0)`;
    },
    { framerate: STEP_MS },
  );

  return (
    <div
      className="pointer-events-none sticky top-0 z-0 -mb-[100vh] h-lvh overflow-hidden mix-blend-overlay"
      aria-hidden
    >
      <div
        ref={layerRef}
        className="bg-grain absolute -inset-12.5 opacity-35 will-change-transform"
      />
    </div>
  );
};
