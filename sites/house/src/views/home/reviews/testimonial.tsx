"use client";

import Image from "next/image";

import { Hover } from "@house/components/animation/springs/hover";
import { RevealLines } from "@house/components/ui/reveal-lines";
import type { TestimonialContent } from "@house/data/mocks/home";
import { PORTRAIT_HOVER } from "@house/lib/springs/presets";

export interface TestimonialProps {
  item: TestimonialContent;
}

/**
 * One client story — a grayscale portrait and the quote, laid so the quote's
 * foot lines up with the photograph's (the source nudged both by hand).
 */
export const Testimonial = ({ item }: TestimonialProps) => (
  <figure className="grid h-full items-center gap-10 md:grid-cols-[12.5rem_1fr] lg:grid-cols-[23.75rem_1fr]">
    <div className="relative aspect-3/4 w-full overflow-hidden bg-surface-inverse-sunken max-md:max-w-60 md:-translate-y-17.5">
      <Hover
        tag="span"
        from={{ scale: 1 }}
        to={{ scale: 1.05 }}
        config={PORTRAIT_HOVER}
        className="absolute inset-0 block"
      >
        <Image
          src={item.portrait.src}
          alt={item.portrait.alt}
          fill
          sizes="(min-width: 1024px) 24rem, (min-width: 768px) 13rem, 15rem"
          className="object-cover grayscale"
        />
      </Hover>
    </div>

    <div className="flex flex-col md:translate-y-18">
      <span
        aria-hidden
        className="mb-4 text-quote-mark-phone font-light leading-[0.5] md:mb-10 md:-translate-x-5 md:-translate-y-40 md:text-quote-mark"
      >
        “
      </span>
      <blockquote className="mb-10">
        <RevealLines
          tag="p"
          lines={[item.quote]}
          active
          clip={false}
          timing="quote"
          rootMargin="0px 0px -15% 0px"
          className="text-headline-phone uppercase leading-heading tracking-title sm:text-headline"
        />
      </blockquote>
      <figcaption className="md:translate-y-10">
        <p className="text-lead font-medium uppercase tracking-copy">{item.author}</p>
        <p className="mt-2 text-body leading-copy tracking-copy text-foreground-inverse/70">
          {item.role}
        </p>
      </figcaption>
    </div>
  </figure>
);
