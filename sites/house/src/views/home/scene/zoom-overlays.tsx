"use client";

import { animated, type SpringValue } from "@react-spring/web";
import { useMemo } from "react";

import { RevealLines } from "@house/components/ui/reveal-lines";
import type { DetailsContent } from "@house/data/mocks/home";
import {
  overlayAsideTransform,
  overlayLeadTransform,
  overlayOpacity,
  overlayVisibility,
} from "@house/utils/timeline/scene";

export interface ZoomOverlaysProps {
  content: Pick<DetailsContent, "zoomTitle" | "address" | "showroom">;
  p: SpringValue<number>;
  active: boolean;
}

/**
 * The copy that frames the showreel: fades in as it is uncovered, then parts
 * outward as it zooms. Too wide to survive a phone, so hidden below `md` — as
 * in the source. `visibility` follows opacity so hidden links leave the tab order.
 */
export const ZoomOverlays = ({ content, p, active }: ZoomOverlaysProps) => {
  const s = useMemo(
    () => ({
      opacity: p.to(overlayOpacity),
      visibility: p.to(overlayVisibility),
      lead: p.to(overlayLeadTransform),
      aside: p.to(overlayAsideTransform),
    }),
    [p],
  );

  return (
    <>
      <animated.div
        className="absolute left-10 top-1/2 z-45 w-overlay-lead max-md:hidden"
        style={{ opacity: s.opacity, visibility: s.visibility, transform: s.lead }}
      >
        <RevealLines
          tag="h3"
          lines={content.zoomTitle}
          active={active}
          timing="label"
          className="text-headline-phone uppercase leading-heading tracking-title sm:text-headline"
        />
      </animated.div>

      <animated.div
        className="absolute right-10 top-1/2 z-45 flex w-overlay-aside flex-col items-end max-md:hidden"
        style={{ opacity: s.opacity, visibility: s.visibility, transform: s.aside }}
      >
        <address className="flex flex-col items-end gap-2 text-right text-body not-italic leading-copy tracking-copy text-foreground/70">
          <span className="uppercase">{content.address.label}</span>
          <span>
            {content.address.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </span>
        </address>
      </animated.div>

      <animated.a
        href={content.showroom.href}
        target="_blank"
        rel="noopener"
        className="group absolute inset-x-10 top-10 z-45 flex items-center gap-3 border-t border-foreground/22 pt-4 text-body uppercase tracking-copy transition-[color,border-color,translate] duration-[var(--duration-normal)] ease-glide hover:-translate-y-0.5 hover:border-foreground/85 hover:text-foreground/85 focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-foreground max-md:hidden"
        style={{ opacity: s.opacity, visibility: s.visibility }}
      >
        <span
          aria-hidden
          className="inline-block leading-none transition-[rotate] duration-[var(--duration-normal)] ease-glide group-hover:rotate-90"
        >
          ✦
        </span>
        {content.showroom.label}
      </animated.a>
    </>
  );
};
