"use client";

import { useMemo, useState, type ReactNode } from "react";

import { Handle } from "@house/components/animation/springs/handle";
import { ArrowLeftIcon, ArrowRightIcon } from "@house/components/ui/icons";
import type { ReviewsContent } from "@house/data/mocks/home";
import { DockSentinel } from "@house/views/home/dock/dock-sentinel";

import { Testimonial } from "./testimonial";

export interface ReviewsProps {
  content: ReviewsContent;
}

const pad = (value: number) => String(value).padStart(2, "0");

const NavButton = ({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) => (
  <button
    type="button"
    aria-label={label}
    disabled={disabled}
    onClick={onClick}
    className="flex size-11 items-center justify-center border border-foreground-inverse-muted/20 transition-[background-color,border-color] duration-[var(--duration-normal)] ease-glide hover:border-foreground-inverse hover:bg-foreground-inverse-muted/5 focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-foreground-inverse disabled:pointer-events-none disabled:opacity-40"
  >
    {children}
  </button>
);

/**
 * Client stories. The pager is driven by the data: the source hard-coded
 * "01 / 05" over a single story and wired its arrows to nothing, so here the
 * count is real and the arrows stay disabled until there is a second story.
 */
export const Reviews = ({ content }: ReviewsProps) => {
  const [index, setIndex] = useState(0);
  const total = content.items.length;
  const step = (delta: number) =>
    setIndex((current) => (current + delta + total) % total);
  const story = useMemo(
    () => <Testimonial key={index} item={content.items[index]} />,
    [content.items, index],
  );

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-title"
      className="relative z-50 flex flex-col bg-surface-inverse p-10 text-foreground-inverse md:h-dvh max-md:px-6 max-md:py-20"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-foreground-inverse/18 pt-4">
        <h2
          id="reviews-title"
          className="flex items-center gap-2 whitespace-nowrap text-caption font-medium uppercase tracking-caps"
        >
          <span aria-hidden className="text-foreground-inverse-muted">
            ✦
          </span>
          {content.title}
        </h2>
        <p
          aria-live="polite"
          className="whitespace-nowrap text-caption font-medium uppercase tracking-caps text-foreground-inverse-muted"
        >
          {pad(index + 1)} / {pad(total)}
        </p>
        <div className="flex gap-3">
          <NavButton label={content.previousLabel} disabled={total < 2} onClick={() => step(-1)}>
            <ArrowLeftIcon className="size-4" />
          </NavButton>
          <NavButton label={content.nextLabel} disabled={total < 2} onClick={() => step(1)}>
            <ArrowRightIcon className="size-4" />
          </NavButton>
        </div>
      </div>

      <Handle className="mt-10 grow">{story}</Handle>
      <DockSentinel />
    </section>
  );
};
