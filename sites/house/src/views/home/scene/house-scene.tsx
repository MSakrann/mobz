"use client";

import { animated, useSpring } from "@react-spring/web";
import { useMemo, useRef, useState, type RefObject } from "react";

import { ProgressTrigger } from "@house/components/animation/springs/progress-trigger";
import { Spring } from "@house/components/animation/springs/spring";
import { ArrowLink } from "@house/components/ui/arrow-link";
import { GridLines } from "@house/components/ui/grid-lines";
import type {
  DetailsContent,
  EchoContent,
  HomeContent,
  ImageAsset,
  LinkItem,
} from "@house/data/mocks/home";
import { useSceneStore } from "@house/hooks/scene/use-scene-store";
import { GRID_INTRO, TIMELINE_FOLLOW } from "@house/lib/springs/presets";
import {
  ANCHOR_AT,
  PHASE,
  SCENE_ANCHOR,
  TRACK_VH,
  gridOpacity,
  gridVisibility,
  sameFlags,
  sceneFlags,
} from "@house/utils/timeline/scene";

import { DetailsPanel } from "./details-panel";
import { EchoPanel } from "./echo-panel";
import { HeroBlock } from "./hero-block";
import { SequenceCanvas } from "./sequence-canvas";
import { TrackAnchor, TrackMarker } from "./track-marker";

export interface HouseSceneProps {
  label: string;
  poster: ImageAsset;
  quoteCta: LinkItem;
  hero: HomeContent["hero"];
  echo: EchoContent;
  details: DetailsContent;
}

/**
 * The pinned cinematic scene: a 1400vh track holding a sticky stage.
 *
 * ONE spring (`p`, 0 → 1) is scrubbed by a single `ProgressTrigger` off the
 * track; every layer reads a memoised `p.to(selector)` from the timeline in
 * `utils/timeline/scene.ts` (ADR-0024). The track is on screen for the whole
 * scene, so its trigger never stalls out of view the way per-phase triggers
 * would, and the spring's damping is the source's "cinematic inertia".
 */
export const HouseScene = ({ label, poster, quoteCta, hero, echo, details }: HouseSceneProps) => {
  const trackRef = useRef<HTMLElement>(null);
  const heroTwoRef = useRef<HTMLDivElement>(null);
  const heroThreeRef = useRef<HTMLDivElement>(null);
  const echoRef = useRef<HTMLDivElement>(null);
  const introReady = useSceneStore((state) => state.introReady);

  const [{ p }, api] = useSpring(() => ({ p: 0, config: TIMELINE_FOLLOW }));
  const grid = useMemo(
    () => ({ opacity: p.to(gridOpacity), visibility: p.to(gridVisibility) }),
    [p],
  );

  // Switched, not scrubbed: recomputed every scroll frame, committed only on a
  // flip — a handful of renders across the whole scene.
  const [flags, setFlags] = useState(() => sceneFlags(0));
  const flagsRef = useRef(flags);

  const triggers = [
    undefined,
    heroTwoRef as RefObject<HTMLElement>,
    heroThreeRef as RefObject<HTMLElement>,
  ] as const;

  return (
    <section
      id={SCENE_ANCHOR.top}
      ref={trackRef}
      aria-label={label}
      className="relative z-50 bg-background"
      style={{ height: `${TRACK_VH}vh` }}
    >
      <TrackMarker ref={heroTwoRef} range={PHASE.heroTwoEnter} />
      <TrackMarker ref={heroThreeRef} range={PHASE.heroThreeEnter} />
      <TrackMarker ref={echoRef} range={PHASE.echo} />
      <TrackAnchor id={SCENE_ANCHOR.echo} at={ANCHOR_AT.echo} />
      <TrackAnchor id={SCENE_ANCHOR.details} at={ANCHOR_AT.details} />

      <div className="sticky top-0 h-dvh w-full overflow-hidden">
        <SequenceCanvas p={p} active={flags.canvas} poster={poster} />

        <ArrowLink
          href={quoteCta.href}
          label={quoteCta.label}
          className="absolute right-10 top-10 z-10 max-md:right-6 max-md:top-6"
        />

        <Spring
          enabled={introReady}
          from={{ opacity: 0 }}
          to={{ opacity: 1 }}
          config={GRID_INTRO}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-2"
        >
          <animated.div className="absolute inset-0" style={grid}>
            <GridLines />
          </animated.div>
        </Spring>

        {hero.map((block, index) => (
          <HeroBlock
            key={block.words[0].text}
            block={block}
            index={index as 0 | 1 | 2}
            p={p}
            introReady={introReady}
            trigger={triggers[index]}
          />
        ))}

        <EchoPanel
          content={echo}
          p={p}
          leadActive={flags.echoLead}
          footActive={flags.echoFoot}
          trigger={echoRef as RefObject<HTMLElement>}
        />
        <DetailsPanel content={details} p={p} flags={flags} />
      </div>

      {/* `frameInterval={0}`: read the scroll every frame. The default 10 ms
          throttle halves the update rate on a 120 Hz panel while Lenis runs at
          full rate, which reads as judder. */}
      <ProgressTrigger
        tag="span"
        trigger={trackRef as RefObject<HTMLElement>}
        start="top top"
        end="bottom bottom"
        frameInterval={0}
        className="hidden"
        onChange={({ progress }) => {
          api.start({ p: progress });
          const next = sceneFlags(progress);
          if (!sameFlags(next, flagsRef.current)) {
            flagsRef.current = next;
            setFlags(next);
          }
        }}
      />
    </section>
  );
};
