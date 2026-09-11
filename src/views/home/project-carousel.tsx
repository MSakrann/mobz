"use client";

/**
 * Horizontal project carousel (index.html .pc-bottom). Cards reveal through a
 * top-down mask, staggered 150ms apart, when the strip scrolls into view.
 * The arrows drive the native horizontal scroll with a spring (no CSS
 * smooth-scroll — hard rule: all motion is spring-based).
 */

import { useSpring } from "@react-spring/web";
import { useRef } from "react";

import { HoverAction } from "@/components/ui/hover-action";
import { CarouselProject } from "@/data/mocks/home";

import { MaskReveal } from "./mask-reveal";

export interface ProjectCarouselProps {
  projects: CarouselProject[];
}

const STAGGER_MS = 150;

export const ProjectCarousel = ({ projects }: ProjectCarouselProps) => {
  const trackRef = useRef<HTMLUListElement>(null);
  const [, api] = useSpring(() => ({ x: 0 }));

  const scrollByItem = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const item = track.querySelector("li");
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = (item ? item.getBoundingClientRect().width : 0) + gap;
    const target = Math.max(
      0,
      Math.min(
        track.scrollLeft + direction * step,
        track.scrollWidth - track.clientWidth,
      ),
    );
    api.start({
      from: { x: track.scrollLeft },
      to: { x: target },
      onChange: ({ value }) => {
        track.scrollLeft = value.x;
      },
    });
  };

  return (
    <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[1fr_4fr] lg:items-end lg:gap-10">
      <div className="flex gap-2.5 lg:pb-5">
        <HoverAction
          aria-label="Previous projects"
          onClick={() => scrollByItem(-1)}
          className="flex h-15 w-22.5 cursor-pointer items-center justify-center rounded-md border border-foreground/10 bg-background/30 text-[1.8rem] text-foreground backdrop-blur-[1.25rem]"
          overlayClassName="-inset-px rounded-md border border-foreground/10 bg-background/30"
        >
          ←
        </HoverAction>
        <HoverAction
          aria-label="Next projects"
          onClick={() => scrollByItem(1)}
          className="flex h-15 w-22.5 cursor-pointer items-center justify-center rounded-md border border-foreground/10 bg-background/30 text-[1.8rem] text-foreground backdrop-blur-[1.25rem]"
          overlayClassName="-inset-px rounded-md border border-foreground/10 bg-background/30"
        >
          →
        </HoverAction>
      </div>

      <ul
        ref={trackRef}
        className="scrollbar-none -mr-4 flex gap-2.5 overflow-x-auto pb-5 pr-4 md:-mr-10 md:pr-10"
      >
        {projects.map((project, i) => (
          <li
            key={project.title}
            className="flex min-w-[85vw] shrink-0 flex-col gap-5 sm:min-w-112.5 lg:min-w-150"
          >
            <div className="flex aspect-square w-full rounded-2xl border border-foreground/8 bg-foreground/10 p-4 backdrop-blur-[1.25rem] md:p-6">
              <MaskReveal
                direction="top"
                tag="div"
                className="flex flex-1"
                trigger={trackRef as React.RefObject<HTMLElement>}
                delayIn={i * STAGGER_MS}
              >
                <div
                  className="relative flex flex-1 items-center justify-center rounded-md bg-cover bg-center"
                  style={{ backgroundImage: `url('${project.image}')` }}
                  role="img"
                  aria-label={`${project.title} — ${project.category}, ${project.year}`}
                >
                  <h3 className="relative z-[2] text-center text-[1.75rem] font-normal tracking-[-0.02em] text-foreground md:text-[2.5rem]">
                    {project.title}
                  </h3>
                  <p className="absolute inset-x-6 bottom-6 z-[2] flex items-end justify-between text-base text-foreground/70 md:inset-x-10 md:bottom-10">
                    <span>{project.category}</span>
                    <time dateTime={project.year}>{project.year}</time>
                  </p>
                </div>
              </MaskReveal>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
