"use client";

import { animated, useSpring } from "@react-spring/web";

import type { StatContent } from "@house/data/mocks/home";
import { COUNT_UP } from "@house/lib/springs/presets";

export interface StatCounterProps {
  stat: StatContent;
  /** Counts up while true; drops back to zero at once when it clears. */
  active: boolean;
}

/** Phones: the top stat drops under the section title, and the two bottom
 *  stats sit above the dock with room to wrap their labels. */
const SLOT: Record<StatContent["slot"], string> = {
  "top-right": "right-10 top-10 items-end text-right max-md:right-6 max-md:top-36",
  "bottom-left": "bottom-10 left-10 items-start max-md:bottom-32 max-md:left-6",
  "bottom-right": "bottom-10 right-10 items-end text-right max-md:bottom-32 max-md:right-6",
};

/** Blur and drop fall away as the number lands — the source's "spinning drum". */
const DRUM_BLUR_REM = 0.5;
const DRUM_DROP_REM = 1.25;

/**
 * One corner stat. The spoken value is the real one, always; the animated
 * digits are presentation and hidden from assistive tech and crawlers.
 */
export const StatCounter = ({ stat, active }: StatCounterProps) => {
  const { n } = useSpring({
    n: active ? stat.value : 0,
    config: COUNT_UP,
    immediate: !active,
  });
  const rest = (value: number) => 1 - value / stat.value;

  return (
    <div className={`absolute z-25 flex flex-col-reverse gap-3 max-md:max-w-[42%] max-md:gap-2 ${SLOT[stat.slot]}`}>
      <dt className="text-body-phone uppercase leading-copy tracking-copy text-foreground/70 sm:text-body">
        {stat.label}
      </dt>
      <dd className="text-stat-phone tabular-nums leading-hero tracking-display md:text-display-tablet lg:text-display">
        <span className="sr-only">{stat.value}</span>
        <animated.span
          aria-hidden
          className="inline-block"
          style={{
            filter: n.to((value) => `blur(${rest(value) * DRUM_BLUR_REM}rem)`),
            transform: n.to((value) => `translate3d(0, ${rest(value) * DRUM_DROP_REM}rem, 0)`),
          }}
        >
          {n.to((value) => Math.floor(value))}
        </animated.span>
      </dd>
    </div>
  );
};
