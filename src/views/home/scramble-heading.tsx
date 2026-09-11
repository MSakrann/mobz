"use client";

/**
 * Section heading that plays the scramble effect once when ~30% of it enters
 * the viewport (main.js `scrambleObserver`, threshold 0.3). Multi-part
 * headings (faded + bold lines) scramble all parts at the same time, each
 * with the typewriter cadence — matching the original per-span behaviour.
 */

import { ElementType, Fragment, useEffect, useRef, useState } from "react";

import { Tags } from "@/types/springs";

import { ScrambleText } from "./scramble-text";

export interface ScrambleHeadingPart {
  /** Part text; `\n` renders as a line break. */
  text: string;
  className?: string;
}

export interface ScrambleHeadingProps {
  tag?: Tags;
  className?: string;
  id?: string;
  parts: ScrambleHeadingPart[];
}

const IN_VIEW_THRESHOLD = 0.3;

export const ScrambleHeading = ({
  tag = "h2",
  className,
  id,
  parts,
}: ScrambleHeadingProps) => {
  const ref = useRef<HTMLElement>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPlay(true);
          observer.disconnect();
        }
      },
      { threshold: IN_VIEW_THRESHOLD },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const Tag = tag as ElementType;
  return (
    <Tag ref={ref} className={className} id={id}>
      {parts.map((part, i) => (
        <Fragment key={i}>
          <ScrambleText
            text={part.text}
            play={play}
            className={part.className}
          />
          {i < parts.length - 1 && <br />}
        </Fragment>
      ))}
    </Tag>
  );
};
