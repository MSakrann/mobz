"use client";

/**
 * Plan a Journey — the page's last block: an invitation on a photograph, with
 * the site footer frosted into the foot of it.
 *
 * Two kinds of motion, and neither is scroll-driven — this is the one block on
 * the page that answers the reader rather than the scrollbar:
 *
 *   the pointer   three layers lean away from the cursor by 8 / 16 / 28px, on
 *                 one spring, which is what turns a flat photograph into depth
 *   the steam     two loops of different length over a still plate, so it
 *                 breathes without ever repeating a frame you recognise
 *
 * 📖 Docs: obsidian/frontend/plan.md
 */

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import {
  animated,
  SpringValue,
  to,
  useInView,
  useSpring,
} from "@react-spring/web";

import { subscribeToTicker } from "@egypt/lib/animation/ticker";
import { Hover } from "@egypt/components/animation/springs/hover";
import { RevealTitle } from "@egypt/components/ui/reveal-text";
import { SegmentedText } from "@egypt/components/ui/segmented-text";
import {
  CARD_HOVER,
  TOUCH_PRESS,
  TOUCH_TARGET,
} from "@egypt/views/home/destinations/destinations.geometry";

import { ArrowTrack, PlanFooter } from "./plan-footer";
import {
  CLASS,
  HOVER_QUERY,
  NOTE_SIZES,
  NOTE_TILT,
  SCENE_SIZES,
  WRITE,
  WRITE_EPSILON,
  WRITE_LERP,
  WRITE_WINDOW,
  writeEase,
} from "./plan.geometry";
import type { PlanContent, PlanMedia } from "./plan.types";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * SSR-safe read of a media query. Declared here rather than imported from
 * block 3 or 4, which each keep their own copy private for the same reason: a
 * four-line hook is not worth coupling two sections over.
 */
const useMediaQuery = (query: string): boolean =>
  useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );

export interface PlanProps {
  content: PlanContent;
}

export const Plan = ({ content }: PlanProps) => {
  const actionRef = useRef<HTMLAnchorElement>(null);

  const prefersReducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);
  const hasPointer = useMediaQuery(HOVER_QUERY);
  const animate = !prefersReducedMotion;

  /**
   * The writing, as a **function of where the section is** — not of a clock.
   *
   * Five passes were spent tuning a timer, and every setting of it was wrong in
   * one of two directions, because a timer and a reader are two clocks that
   * never agree. Armed late, the note was blank when the reader got there. Armed
   * early, the write finished off screen and the note simply existed — "it
   * appears abruptly". Between the two, the write *began* on arrival and ran for
   * seconds afterwards — "too late". One bug all three times: the writing and
   * the looking were not the same event.
   *
   * So the pen is driven by the section's own rise, `WRITE_WINDOW` (see there
   * for why the window stops short of the top). Scroll fast and it races you and
   * is done as you land; scroll slowly and you watch every line; arrive from a
   * deep link and the rise is already past the window, so the note is written.
   * Nothing to arm, nothing to outrun, and nothing to insure against — the end
   * state is a position, and the position is where the reader has to be.
   *
   * **The one departure from the page's scrub-anywhere rule: it never runs
   * backwards.** Everything else in this codebase is a pure function of scroll,
   * so scrolling up plays it in reverse, and that is right — a photograph
   * un-parallaxing is still a photograph. A sentence un-writing itself is not a
   * sentence, so the target keeps its high-water mark.
   *
   * And the ink **trails** that mark rather than matching it (`WRITE_LERP`). A
   * pure function of scroll is only ever as smooth as the scroll is, and a wheel
   * arrives in notches; lerping gives the pen its own momentum, so it glides
   * through them and keeps moving for a beat after the wheel stops. The lag
   * costs nothing at the end, because the reader has to stop at the bottom of
   * the page — where the target is 1 and the pen has as long as it needs.
   */
  const sectionRef = useRef<HTMLElement>(null);
  const [noteRef, noteInView] = useInView();
  const written = useMemo(() => new SpringValue(0), []);

  useEffect(() => {
    if (!animate) {
      written.set(1);
      return;
    }
    const el = sectionRef.current;
    if (!el) return;

    const [from, to] = WRITE_WINDOW;
    /* The target's high-water mark, and the ink trailing it. */
    let peak = 0;
    let ink = 0;

    return subscribeToTicker(
      () => {
        const { innerHeight } = window;
        /* How far the section's top edge has risen, in viewports. */
        const risen = (innerHeight - el.getBoundingClientRect().top) / innerHeight;
        const target = Math.min(1, Math.max(0, (risen - from) / (to - from)));
        if (target > peak) peak = target;

        const gap = peak - ink;
        if (gap < WRITE_EPSILON) return;
        ink += gap * WRITE_LERP;
        written.set(ink);
      },
      () => 0,
    );
  }, [animate, written]);

  /**
   * The note's own swing.
   *
   * It arrives turned and settles onto its pin as the writing starts, and takes
   * a smaller turn the other way while the pointer is on it. One spring: the
   * three states are one number, so a pointer landing mid-arrival redirects the
   * same movement rather than starting a second one over it.
   *
   * Only where a pointer exists — `hasPointer` is the same read the parallax
   * uses, and a coarse pointer would leave the note turned wherever the last tap
   * happened to land.
   */
  const [noteHover, setNoteHover] = useState(false);
  const landed = !animate || noteInView;
  const { tilt, drop, lit } = useSpring({
    tilt: !landed
      ? NOTE_TILT.enter
      : noteHover && hasPointer
        ? NOTE_TILT.hover
        : NOTE_TILT.rest,
    /* The fall onto the pin, and the fade with it — both spent on arrival, so
       hovering later turns the sheet without lifting it again. */
    drop: landed ? 0 : NOTE_TILT.drop,
    lit: landed ? 1 : 0,
    config: NOTE_TILT.config,
    immediate: !animate,
  });

  /**
   * The pen, as a clip: the mark is uncovered from its left end and nothing
   * moves, because `clip-path` does not reflow. A centred line therefore stays
   * exactly where it was drawn while it is being revealed.
   *
   * **Only the right edge closes in; top and bottom open outwards by a whole
   * box.** `inset()` clips to the border box, and ink routinely leaves it: this
   * paragraph is `text-box-trim`-ed to cap height and baseline, so Caveat's
   * ascenders and its apostrophes stand above the line box and were being shaved
   * flat. The two rules have the same problem from their own side — each is a
   * traced pen mark that bleeds about 27% past the path box it is placed in.
   *
   * A negative inset grows the rectangle instead of shrinking it, so −100% on
   * both axes of the vertical is a full box-height of headroom above and below —
   * far more than any glyph or stroke needs, and nothing else is painted there
   * to leak in.
   */
  const pen = (window: readonly [number, number]) =>
    written.to(
      (value) =>
        `inset(-100% ${(100 * (1 - writeEase(value, window))).toFixed(2)}% -100% 0)`,
    );

  /**
   * The four plates are drawn full-bleed, so they all ask for the same widths.
   *
   * The note is the exception and passes its own: it is 23.75cqw of the scene —
   * under a quarter of it — and the scene is the viewport now that the 1600 cap
   * is gone, so `100vw` would have it fetch four times the pixels it draws.
   */
  const layer = (
    media: PlanMedia,
    className: string,
    priority = false,
    sizes: string = SCENE_SIZES,
  ) => (
    <Image
      src={media.src}
      alt={media.alt}
      fill
      sizes={sizes}
      className={className}
      priority={priority}
    />
  );

  return (
    <section
      aria-label="Plan a Journey"
      className={CLASS.section}
      ref={sectionRef}
    >
      {/*
        The photograph, on a layer of its own that **covers** the screen while
        the composition below **fits inside** it. A fixed-ratio picture cannot do
        both on a window that is a different shape, and the two halves want
        opposite answers: a photograph is cropped without complaint, a
        composition is not. See `CLASS.picture` / `CLASS.scene`.
      */}
      <div className={CLASS.picture} aria-hidden>
        <div className={CLASS.backdrop}>
          {layer(content.media.backdrop, "object-cover")}
        </div>

        <div className={CLASS.wash} />
      </div>

      <div className={CLASS.scene}>
        <h2 className={CLASS.title}>
          {content.title.map((line, index) => (
            <span
              key={index}
              className={`block ${index === 0 ? "text-white" : "text-foreground-ink"}`}
            >
              <RevealTitle segments={line} animate={animate} />
            </span>
          ))}
        </h2>

        {/*
          The note is a container of its own, so everything written on it is
          placed in `cqw` of its 342 rather than of the scene's 1440 — one width
          to choose per breakpoint instead of five coordinates to re-derive. The
          observer rides it, because it is what the writing is on.
        */}
        <animated.div
          className={CLASS.note}
          data-note
          ref={noteRef}
          onPointerEnter={hasPointer ? () => setNoteHover(true) : undefined}
          onPointerLeave={hasPointer ? () => setNoteHover(false) : undefined}
          style={{
            transformOrigin: NOTE_TILT.origin,
            opacity: lit,
            transform: to(
              [drop, tilt],
              (y, deg) =>
                `translate3d(0, ${(y as number).toFixed(3)}%, 0) rotate(${(deg as number).toFixed(3)}deg)`,
            ),
          }}
        >
          {/*
            Without scripting nothing ever advances the pen, and the clip is
            written into the markup at its start value — so the note would be a
            blank sheet rather than an unanimated one. The reveal is a flourish;
            the copy is the content. Same rule the preloader keeps for itself.
          */}
          <noscript>
            <style>{`[data-note] *{clip-path:none!important}`}</style>
          </noscript>

          <div className={CLASS.notePaper}>
            {layer(content.media.note, "object-contain", true, NOTE_SIZES)}
          </div>

          <p className={CLASS.notePromise}>
            {content.note.map((line, index) => (
              <animated.span
                key={line}
                className={CLASS.noteLine}
                style={{ clipPath: pen(WRITE.lines[index]) }}
              >
                {line}
              </animated.span>
            ))}
          </p>

          {/*
            The two hand-drawn rules. Each span is the *path's* box off the file;
            the image inside bleeds past it by exactly the stroke's overflow, so
            the ink lands on the line instead of being squashed into it.
          */}
          <animated.span
            className={CLASS.underlineOne}
            style={{ clipPath: pen(WRITE.underlines[0]) }}
            aria-hidden
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.media.underlines[0].src}
              alt=""
              className={CLASS.underlineOneInk}
            />
          </animated.span>
          <animated.span
            className={CLASS.underlineTwo}
            style={{ clipPath: pen(WRITE.underlines[1]) }}
            aria-hidden
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.media.underlines[1].src}
              alt=""
              className={CLASS.underlineTwoInk}
            />
          </animated.span>

          {content.noteAside ? (
            <animated.p
              className={CLASS.noteAside}
              style={{ clipPath: pen(WRITE.aside) }}
            >
              {content.noteAside}
            </animated.p>
          ) : null}
        </animated.div>

        {/*
          Two gestures on one control, and they are the site's, not this block's:
          the arrow runs through the pill, and the pill takes the same lift the
          country cards take — `CARD_HOVER` and `TOUCH_PRESS` imported from
          block 2 rather than restated here, so the two can never drift apart.

          The anchor owns the box and the ref so `<Hover>` attaches its listener
          natively rather than through React's synthesis, and `group` is what
          `TOUCH_PRESS` reads on a device with no hover to give.
        */}
        <a
          ref={actionRef}
          href={content.action.href}
          className={`group ${CLASS.action} ${TOUCH_TARGET}`}
        >
          <Hover
            tag="span"
            trigger={actionRef}
            enabled={animate}
            from={{ transform: CARD_HOVER.from }}
            to={{ transform: CARD_HOVER.to }}
            config={CARD_HOVER.config}
            className={`${CLASS.actionPill} ${TOUCH_PRESS}`}
          >
            <ArrowTrack
              media={content.media.arrow}
              window={CLASS.arrowWindow}
              trigger={actionRef}
              enabled={animate}
            />
            <span className={CLASS.actionLabel}>{content.action.label}</span>
          </Hover>
        </a>
      </div>
      {/*
        The footer panel is a **child of the section, not of the composition**.
        The composition is sized to fit the screen's height, which on a window
        wider than 1.337:1 makes it narrower than the window — and a footer that
        stops short of both edges is the one thing this panel must not do. Out
        here it spans the section at the site's own `page` inset, and its own
        `container-type` means every `cqw` inside it is a share of the panel
        rather than of a composition it no longer belongs to.
      */}
      <PlanFooter
          content={content.footer}
          arrow={content.media.arrow}
          animated={animate}
        />
    </section>
  );
};
