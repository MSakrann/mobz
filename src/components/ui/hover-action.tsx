"use client";

/**
 * Button / anchor whose hover state is a separate layer that spring-fades in
 * over the resting style.
 *
 * Why not animate `backgroundColor` / `borderColor` directly with `<Hover>`?
 * react-spring serializes color shorthands differently on the server
 * (longhand `border-*-color`) than on the client, causing hydration
 * mismatches. Animating only `opacity` of an overlay keeps SSR output stable
 * while looking identical to a color interpolation.
 */

import {
  ElementType,
  HTMLAttributes,
  ReactNode,
  RefObject,
  useRef,
} from "react";

import { Hover } from "@/components/animation/springs/hover";

export interface HoverActionProps extends HTMLAttributes<HTMLElement> {
  /** Element to render — a real `button` (default) or `a`. */
  as?: "button" | "a";
  href?: string;
  type?: "button" | "submit";
  /** Resting-state classes (position: relative is added automatically). */
  className?: string;
  /** Hover-state layer — positioned classes fading in above the resting style. */
  overlayClassName: string;
  children: ReactNode;
}

export const HoverAction = ({
  as = "button",
  href,
  type,
  className,
  overlayClassName,
  children,
  ...props
}: HoverActionProps) => {
  const ref = useRef<HTMLElement>(null);
  const El = as as ElementType;
  return (
    <El
      ref={ref}
      href={href}
      type={as === "button" ? (type ?? "button") : undefined}
      className={`relative ${className ?? ""}`}
      {...props}
    >
      <Hover
        tag="span"
        trigger={ref as RefObject<HTMLElement>}
        aria-hidden
        className={`pointer-events-none absolute ${overlayClassName}`}
        from={{ opacity: 0 }}
        to={{ opacity: 1 }}
      />
      <span className="relative z-[1] flex items-center justify-center">
        {children}
      </span>
    </El>
  );
};
