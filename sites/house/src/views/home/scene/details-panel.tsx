"use client";

import { animated, type SpringValue } from "@react-spring/web";
import Image from "next/image";
import { useMemo } from "react";

import type { DetailsContent } from "@house/data/mocks/home";
import type { SceneFlags } from "@house/utils/timeline/scene";
import {
  PHASE,
  detailsClip,
  interiorScale,
  starTint,
  starTransform,
} from "@house/utils/timeline/scene";

import { Showreel } from "./showreel";
import { StatCounter } from "./stat-counter";
import { ZoomOverlays } from "./zoom-overlays";

export interface DetailsPanelProps {
  content: DetailsContent;
  p: SpringValue<number>;
  flags: Pick<SceneFlags, "details" | "showreel" | "zoom">;
}

const STAR_PATH =
  "M0 12C6 12 12 6 12 0C12 6 18 12 24 12C18 12 12 18 12 24C12 18 6 12 0 12Z";

/**
 * Interior two — unmasked bottom-up over ECHO. Stats hold the corners around a
 * hairline cross; then the centre star warps out to fill the screen and the
 * showreel is uncovered on top of it.
 */
export const DetailsPanel = ({ content, p, flags }: DetailsPanelProps) => {
  const s = useMemo(
    () => ({
      clip: p.to(detailsClip),
      image: p.to(interiorScale(PHASE.details)),
      star: p.to(starTransform),
      tint: p.to(starTint),
    }),
    [p],
  );

  return (
    <animated.div
      className="absolute inset-0 z-20 overflow-hidden"
      style={{ clipPath: s.clip }}
    >
      <animated.div className="absolute inset-0" style={{ transform: s.image }}>
        <Image
          src={content.image.src}
          alt={content.image.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </animated.div>

      <div aria-hidden className="pointer-events-none absolute inset-0 z-22">
        <span className="absolute inset-x-0 top-1/2 h-px bg-foreground/18" />
        <span className="absolute inset-y-0 left-1/2 w-px bg-foreground/18" />
      </div>

      <h2 className="absolute left-10 top-10 z-25 flex flex-col text-title-phone uppercase leading-display tracking-title sm:text-title">
        {content.title.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </h2>

      <dl className="contents">
        {content.stats.map((stat) => (
          <StatCounter key={stat.label} stat={stat} active={flags.details} />
        ))}
      </dl>

      <ZoomOverlays content={content} p={p} active={flags.zoom} />

      <animated.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-30 aspect-square w-star -translate-1/2"
        style={{ transform: s.star }}
      >
        {/* White star, with a sage copy fading in over it as it warps.
            Compositing at opacity t is the linear sRGB mix of the two, so the
            blend matches the source while both colours stay tokens. */}
        <svg viewBox="0 0 24 24" className="size-full" focusable={false}>
          <path d={STAR_PATH} className="fill-foreground" />
          <animated.path
            d={STAR_PATH}
            className="fill-foreground-inverse-muted"
            style={{ opacity: s.tint }}
          />
        </svg>
      </animated.div>

      <Showreel content={content.showreel} p={p} active={flags.showreel} />
    </animated.div>
  );
};
