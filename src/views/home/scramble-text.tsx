"use client";

/**
 * Digital "scramble" reveal — characters cycle through a glyph set before
 * settling on the real text (ported from main.js `scrambleText`).
 *
 * This is a character-substitution effect, not motion, so it is driven by the
 * shared animation ticker (`useLoop`) rather than springs or the text engine —
 * see decisions-log ADR-0013. The real text is server-rendered and only
 * replaced after `play` flips true, so crawlers always see the content.
 */

import {
  ElementType,
  Fragment,
  ReactNode,
  useEffect,
  useState,
} from "react";

import { useLoop } from "@/hooks/animation/use-render-loop";
import { Tags } from "@/types/springs";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
/** Characters that restart the typewriter cadence (main.js quirk, kept 1:1). */
const RESET_CHARS = new Set(["C", "E", "O", "P"]);
/** ~30fps — matches the original setTimeout(20) + rAF throttle. */
const FRAME_MS = 35;

interface QueueItem {
  char: string;
  start: number;
  end: number;
}

export interface ScrambleTextProps {
  /** Text to reveal; `\n` renders as a line break. */
  text: string;
  /** Starts the scramble. Until then the plain text is rendered. */
  play: boolean;
  /** All characters scramble at once (hero) vs typewriter cadence (headings). */
  simultaneous?: boolean;
  tag?: Tags;
  className?: string;
}

const buildQueue = (text: string, simultaneous: boolean): QueueItem[] => {
  const queue: QueueItem[] = [];
  let typeIndex = 0;
  for (const char of text) {
    if (RESET_CHARS.has(char)) typeIndex = 0;
    const start = simultaneous
      ? 0
      : typeIndex * 3 + Math.floor(Math.random() * 2);
    const end = simultaneous
      ? start + Math.floor(Math.random() * 20) + 25
      : start + Math.floor(Math.random() * 6) + 8;
    queue.push({ char, start, end });
    typeIndex++;
  }
  return queue;
};

/** Deterministic pseudo-random glyph so render stays pure per frame. */
const glyphAt = (index: number, frame: number) =>
  CHARS[(index * 31 + frame * 17) % CHARS.length];

const renderPlain = (text: string): ReactNode =>
  text.split("\n").map((line, i, lines) => (
    <Fragment key={i}>
      {line}
      {i < lines.length - 1 && <br />}
    </Fragment>
  ));

export const ScrambleText = ({
  text,
  play,
  simultaneous = false,
  tag = "span",
  className,
}: ScrambleTextProps) => {
  const [queue, setQueue] = useState<QueueItem[] | null>(null);
  const [frame, setFrame] = useState(0);
  // SSR/crawlers get the plain text; once hydrated the pending text hides so
  // the scramble types in instead of flashing visible and restarting.
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    setArmed(true);
  }, []);

  useEffect(() => {
    if (play && queue === null) {
      setQueue(buildQueue(text, simultaneous));
      setFrame(0);
    }
  }, [play, queue, text, simultaneous]);

  const complete = queue !== null && queue.every((q) => frame >= q.end);

  useLoop(
    () => {
      if (queue === null || complete) return;
      setFrame((f) => f + 1);
    },
    { framerate: FRAME_MS },
  );

  let content: ReactNode;
  if (queue === null || complete) {
    content = renderPlain(text);
  } else {
    content = queue.map((q, i) => {
      if (q.char === "\n") return <br key={i} />;
      if (q.char === " ") return <Fragment key={i}> </Fragment>;
      if (frame < q.start) {
        // hold the space invisibly to prevent layout jumps
        return (
          <span key={i} className="invisible">
            {q.char}
          </span>
        );
      }
      if (frame >= q.end) return <Fragment key={i}>{q.char}</Fragment>;
      return <Fragment key={i}>{glyphAt(i, frame)}</Fragment>;
    });
  }

  const pending = armed && queue === null;
  const Tag = tag as ElementType;
  return (
    <Tag className={`${className ?? ""} ${pending ? "invisible" : ""}`}>
      {content}
    </Tag>
  );
};
