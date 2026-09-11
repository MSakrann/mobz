"use client";

/**
 * Fixed bottom navigation island (index.html .bottom-nav) — logo, anchor
 * links, and a contact CTA over a glass blur. Anchors scroll smoothly via the
 * Lenis-aware `scrollTo` util.
 */

import { MouseEvent } from "react";

import { HoverAction } from "@/components/ui/hover-action";
import { HoverEl } from "@/components/ui/hover-el";
import { NavContent } from "@/data/mocks/home";
import { scrollTo } from "@/utils/scroll-to";

export interface BottomNavProps {
  content: NavContent;
}

export const BottomNav = ({ content }: BottomNavProps) => {
  const onAnchorClick = (event: MouseEvent<HTMLElement>, target: string) => {
    event.preventDefault();
    scrollTo(target);
  };

  return (
    <header className="fixed bottom-5 left-1/2 z-[100] flex -translate-x-1/2 items-center justify-center gap-1 rounded-lg border border-foreground/8 bg-background/40 p-1.5 backdrop-blur-[1.25rem]">
      <p className="font-display hidden h-11 items-center px-3 text-[1.75rem] font-[250] leading-none text-foreground sm:flex md:px-4">
        {content.logo}
      </p>
      <nav aria-label="Primary" className="flex gap-1">
        {content.links.map((link) => (
          <HoverAction
            key={link.label}
            as="a"
            href={`#${link.href}`}
            onClick={(event: MouseEvent<HTMLElement>) =>
              onAnchorClick(event, link.href)
            }
            className="flex h-10 items-center justify-center rounded-sm border border-foreground/5 bg-foreground/10 px-2.5 text-xs font-medium text-foreground sm:h-11 sm:w-18 sm:px-0 sm:text-sm md:w-26"
            overlayClassName="-inset-px rounded-sm border border-foreground/10 bg-foreground/[0.11]"
          >
            {link.label}
          </HoverAction>
        ))}
      </nav>
      <HoverEl
        tag="a"
        href="#contact"
        onClick={(event: MouseEvent<HTMLElement>) =>
          onAnchorClick(event, "contact")
        }
        className="flex h-10 cursor-pointer items-center justify-center whitespace-nowrap rounded-sm bg-foreground px-3 text-xs font-semibold text-background sm:h-11 sm:px-4 sm:text-sm md:px-6"
        from={{ opacity: 1 }}
        to={{ opacity: 0.8 }}
      >
        {content.cta}
      </HoverEl>
    </header>
  );
};
