"use client";

import { animated, type SpringValue } from "@react-spring/web";
import { useMemo, type RefObject } from "react";
import TextEngine from "spring-text-engine";

import type { HeroBlockContent, HeroSlot } from "@house/data/mocks/home";
import { HERO_INTRO, SCROLL_LETTER, SLIDE_BLUR } from "@house/lib/springs/presets";
import {
  PHASE,
  exitFilter,
  exitOpacity,
  exitTransform,
  heroDescriptionOpacity,
  heroThreeOpacity,
  heroVisibility,
} from "@house/utils/timeline/scene";

export interface HeroBlockProps {
  block: HeroBlockContent;
  index: 0 | 1 | 2;
  p: SpringValue<number>;
  /** Block one plays its entrance once the preloader lifts. */
  introReady: boolean;
  /** Blocks two and three scrub their letters against a phase marker. */
  trigger?: RefObject<HTMLElement>;
}

/**
 * Word positions. They go on a wrapper, never on the TextEngine itself: the
 * engine writes `position: relative` inline on its container, which beats an
 * `absolute` class and turns these offsets into nudges. Phones drop the top
 * words below the quote link and lift the bottom ones clear of the copy.
 */
const SLOT: Record<HeroSlot, string> = {
  "top-left": "left-10 top-10 max-md:left-6 max-md:top-24",
  "top-right": "right-10 top-10 max-md:right-6 max-md:top-24",
  "center-left": "left-10 top-1/2 -translate-y-1/2 max-md:left-6",
  "center-right": "right-10 top-1/2 -translate-y-1/2 max-md:right-6",
  center: "left-1/2 top-1/2 -translate-1/2",
  "bottom-left": "bottom-10 left-10 max-md:bottom-52 max-md:left-6",
  "bottom-right": "bottom-10 right-10 max-md:bottom-52 max-md:right-6",
};

const EXIT = [PHASE.heroOneExit, PHASE.heroTwoExit, null] as const;

const WORD_TYPE =
  "text-display-phone leading-hero tracking-display sm:text-display-tablet lg:text-display";

/**
 * One of the three statement blocks over the frame sequence. Letters enter
 * through TextEngine; the block leaves as a whole, sliding left into a blur on
 * the shared timeline.
 */
export const HeroBlock = ({ block, index, p, introReady, trigger }: HeroBlockProps) => {
  const exit = EXIT[index];
  const s = useMemo(
    () => ({
      visibility: p.to(heroVisibility(index)),
      opacity: index === 2 ? p.to(heroThreeOpacity) : 1,
      description: p.to(heroDescriptionOpacity[index]),
      exit: exit
        ? {
            opacity: p.to(exitOpacity(exit)),
            transform: p.to(exitTransform(exit)),
            filter: p.to(exitFilter(exit)),
          }
        : undefined,
    }),
    [p, index, exit],
  );
  const Heading = index === 0 ? "h1" : "h2";

  return (
    <animated.div
      className="pointer-events-none absolute inset-0 z-5"
      style={{ visibility: s.visibility, opacity: s.opacity }}
    >
      <Heading className="absolute inset-0">
        <span className="sr-only">{block.words.map((word) => word.text).join(" ")}</span>
        <animated.span aria-hidden className="absolute inset-0" style={s.exit}>
          {block.words.map((word) => (
            <span key={word.text} className={`absolute ${SLOT[word.slot]}`}>
              {index === 0 ? (
                <TextEngine
                  tag="span"
                  mode="once"
                  enabled={introReady}
                  seo={false}
                  {...SLIDE_BLUR}
                  letterStagger={HERO_INTRO.span / word.text.length}
                  letterConfig={HERO_INTRO.config}
                  className={WORD_TYPE}
                >
                  {word.text}
                </TextEngine>
              ) : (
                // `toggle`, not `interpolate`: see SCROLL_LETTER — every
                // letter is out at progress 0, so nothing shows early.
                <TextEngine
                  tag="span"
                  mode="progress"
                  type="toggle"
                  trigger={trigger}
                  start="top top"
                  end="bottom bottom"
                  seo={false}
                  {...SLIDE_BLUR}
                  letterConfig={SCROLL_LETTER}
                  className={WORD_TYPE}
                >
                  {word.text}
                </TextEngine>
              )}
            </span>
          ))}
        </animated.span>
      </Heading>

      <animated.p
        className={`absolute bottom-10 w-80 text-body-phone leading-copy tracking-copy text-foreground/70 sm:text-body max-md:inset-x-6 max-md:bottom-28 max-md:w-auto ${
          block.descriptionSide === "right"
            ? "right-10 text-right max-md:text-left"
            : "left-10 text-left"
        }`}
        style={{ opacity: s.description }}
      >
        {block.description}
      </animated.p>
    </animated.div>
  );
};
