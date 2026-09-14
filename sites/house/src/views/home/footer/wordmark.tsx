"use client";

import { animated, type SpringValue } from "@react-spring/web";
import { Fragment, useMemo } from "react";

import { wordmarkShift } from "@house/utils/timeline/footer";

export interface WordmarkProps {
  text: string;
  /** Footer reveal progress, 0–1. */
  f: SpringValue<number>;
  /** Phones scroll the footer normally — no reveal, so no rise. */
  still: boolean;
}

/**
 * The giant "Keld Studio" seated on the footer's bottom edge. Its letters rise
 * as the footer is uncovered, in two voices (see `utils/timeline/footer.ts`).
 *
 * The one letter animation here that is not TextEngine: its letters follow two
 * different progress windows by parity, which TextEngine's single stagger
 * cannot express (ADR-0024). The word itself is read once from the `sr-only` copy.
 */
export const Wordmark = ({ text, f, still }: WordmarkProps) => {
  const words = text.split(" ");
  const longest = Math.max(...words.map((word) => word.length));
  const shifts = useMemo(
    () =>
      Array.from({ length: longest }, (_, index) =>
        f.to((value) => wordmarkShift(value, index)),
      ),
    [f, longest],
  );

  return (
    <p className="relative z-5 flex w-full justify-center max-md:mt-16 md:h-full md:items-end">
      <span className="sr-only">{text}</span>
      <span
        aria-hidden
        className="text-center text-wordmark-phone leading-wordmark tracking-display md:translate-y-wordmark-drop md:whitespace-nowrap md:text-wordmark"
      >
        {words.map((word, wordIndex) => (
          <Fragment key={word}>
            {wordIndex > 0 && " "}
            <span className="inline-block whitespace-nowrap">
              {[...word].map((letter, index) => (
                <animated.span
                  key={index}
                  className="inline-block"
                  style={still ? undefined : { transform: shifts[index] }}
                >
                  {letter}
                </animated.span>
              ))}
            </span>
          </Fragment>
        ))}
      </span>
    </p>
  );
};
