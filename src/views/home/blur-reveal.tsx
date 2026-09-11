"use client";

/**
 * In-view blur reveals. Client wrapper so the easing functions stay on the
 * client side of the RSC boundary (functions are not serializable props).
 *
 * - `card`: features-grid cards — 0.9s fade + 0.625rem blur + 1.875rem rise
 *   (style.css .fs-main-card / .fs-side-card)
 * - `panel`: GET IN TOUCH glass panel — 1.4s fade + 1.875rem blur + rise +
 *   scale (style.css .btn-blur-reveal)
 */

import { easings } from "@react-spring/web";
import { ReactNode } from "react";

import { Inview } from "@/components/animation/springs/in-view";
import { Tags } from "@/types/springs";

export interface BlurRevealProps {
  children: ReactNode;
  variant?: "card" | "panel";
  tag?: Tags;
  className?: string;
  /** Stagger delay in ms. */
  delayIn?: number;
}

const PRESETS = {
  card: {
    from: { opacity: 0, filter: "blur(0.625rem)", y: 30 },
    to: { opacity: 1, filter: "blur(0rem)", y: 0 },
    config: { duration: 900, easing: easings.easeOutCubic },
  },
  panel: {
    from: { opacity: 0, filter: "blur(1.875rem)", y: 60, scale: 0.98 },
    to: { opacity: 1, filter: "blur(0rem)", y: 0, scale: 1 },
    config: { duration: 1400, easing: easings.easeOutExpo },
  },
} as const;

export const BlurReveal = ({
  children,
  variant = "card",
  tag = "div",
  className,
  delayIn = 0,
}: BlurRevealProps) => {
  const preset = PRESETS[variant];
  return (
    <Inview
      tag={tag}
      mode="once"
      from={preset.from}
      to={preset.to}
      config={preset.config}
      delayIn={delayIn}
      className={className}
    >
      {children}
    </Inview>
  );
};
