"use client";

/**
 * Card reveal that grows a solid mask from the top or bottom edge — the
 * spring-driven version of the original `mask-size` transitions
 * (style.css .ps-card / .pc-item reveals, 1.4s cubic-bezier(0.2,0.8,0.2,1)).
 */

import { easings } from "@react-spring/web";
import { ReactNode, RefObject } from "react";

import { Inview } from "@/components/animation/springs/in-view";
import { Tags } from "@/types/springs";

export interface MaskRevealProps {
  children: ReactNode;
  /** Edge the mask grows from. */
  direction?: "top" | "bottom";
  tag?: Tags;
  className?: string;
  style?: React.CSSProperties;
  /** Stagger delay in ms. */
  delayIn?: number;
  /** Optional external element that triggers the reveal instead of self. */
  trigger?: RefObject<HTMLElement>;
}

const DURATION = 1400;

export const MaskReveal = ({
  children,
  direction = "top",
  tag = "div",
  className,
  style,
  delayIn = 0,
  trigger,
}: MaskRevealProps) => (
  <Inview
    tag={tag}
    mode="once"
    trigger={trigger}
    delayIn={delayIn}
    from={{ WebkitMaskSize: "100% 0%", maskSize: "100% 0%" }}
    to={{ WebkitMaskSize: "100% 100%", maskSize: "100% 100%" }}
    config={{ duration: DURATION, easing: easings.easeOutCubic }}
    className={`${direction === "top" ? "mask-reveal-top" : "mask-reveal-bottom"} ${className ?? ""}`}
    style={style}
  >
    {children}
  </Inview>
);
