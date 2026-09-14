"use client";

import { animated, type SpringValue } from "@react-spring/web";
import Image from "next/image";
import { useMemo, type RefObject } from "react";
import TextEngine from "spring-text-engine";

import { GlobeIcon, PlayCircleIcon, PlusCircleIcon } from "@house/components/ui/icons";
import { RevealLines } from "@house/components/ui/reveal-lines";
import type { EchoContent } from "@house/data/mocks/home";
import { SCROLL_LETTER, SLIDE_BLUR } from "@house/lib/springs/presets";
import { PHASE, echoTransform, interiorScale } from "@house/utils/timeline/scene";

export interface EchoPanelProps {
  content: EchoContent;
  p: SpringValue<number>;
  leadActive: boolean;
  footActive: boolean;
  /** Phase marker the ECHO letters scrub against. */
  trigger: RefObject<HTMLElement>;
}

const ICONS = [PlusCircleIcon, GlobeIcon, PlayCircleIcon] as const;

const LABEL_TYPE =
  "text-title-phone uppercase tracking-title text-foreground/95 sm:text-title";

/**
 * Interior one — slides up over the dimming sequence with a frosted panel
 * carrying the ECHO® showcase.
 */
export const EchoPanel = ({ content, p, leadActive, footActive, trigger }: EchoPanelProps) => {
  const s = useMemo(
    () => ({
      layer: p.to(echoTransform),
      image: p.to(interiorScale(PHASE.echo)),
    }),
    [p],
  );

  return (
    <animated.div
      className="absolute inset-0 z-10 overflow-hidden"
      style={{ transform: s.layer }}
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

      <article
        aria-labelledby="echo-title"
        className="absolute inset-y-0 left-0 z-15 flex w-1/2 flex-col justify-between border-r border-foreground/8 bg-surface-glass-raised/45 px-14 py-14 backdrop-blur-2xl max-md:w-full max-md:px-8 max-md:pb-32 max-md:pt-12"
      >
        <RevealLines tag="p" lines={content.eyebrow} active={leadActive} timing="label" className={LABEL_TYPE} />

        <div className="mt-10 flex grow flex-col justify-center">
          <h2
            id="echo-title"
            className="mb-6 flex items-start text-display-phone uppercase leading-hero tracking-display sm:text-display-tablet lg:text-display"
          >
            <span className="sr-only">{`${content.title}${content.mark}`}</span>
            <span aria-hidden>
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
              >
                {content.title}
              </TextEngine>
            </span>
            <sup aria-hidden className="ml-1 mt-[0.12em] text-[0.35em] leading-none">
              {content.mark}
            </sup>
          </h2>
          <p className="max-w-[85%] text-body-phone leading-copy tracking-copy text-foreground/70 sm:text-body max-md:max-w-none">
            {content.description}
          </p>
        </div>

        <footer className="mt-8 flex flex-col gap-3">
          <span className="flex gap-4">
            {ICONS.map((Icon, index) => (
              <Icon
                key={index}
                className="size-6 transition-transform duration-[var(--duration-fast)] ease-glide hover:scale-110"
              />
            ))}
          </span>
          <RevealLines tag="p" lines={content.footer} active={footActive} timing="label" className={LABEL_TYPE} />
        </footer>
      </article>
    </animated.div>
  );
};
