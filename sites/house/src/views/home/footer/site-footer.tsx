"use client";

import { useSpring } from "@react-spring/web";
import Image from "next/image";
import { useRef, useState, type RefObject } from "react";

import { ProgressTrigger } from "@house/components/animation/springs/progress-trigger";
import { ArrowLink } from "@house/components/ui/arrow-link";
import { GridLines } from "@house/components/ui/grid-lines";
import { RevealLines } from "@house/components/ui/reveal-lines";
import type { FooterContent } from "@house/data/mocks/home";
import { useWindowWidth } from "@house/hooks/use-window-size";
import { FOOTER_FOLLOW } from "@house/lib/springs/presets";
import { FOOTER_CTA_AT } from "@house/utils/timeline/footer";

import { Wordmark } from "./wordmark";

export interface SiteFooterProps {
  content: FooterContent;
}

/** Below `md` the footer is an ordinary block — the source's own switch. */
const STACK_BELOW = 768;

/**
 * The reveal footer. On desktop it is fixed behind the page, and a transparent
 * spacer the same height (`h-footer-reveal`, one token for both) scrolls past
 * to uncover it — the spacer's progress drives the CTA and the wordmark.
 */
export const SiteFooter = ({ content }: SiteFooterProps) => {
  const spacerRef = useRef<HTMLDivElement>(null);
  const [{ f }, api] = useSpring(() => ({ f: 0, config: FOOTER_FOLLOW }));
  const [ctaActive, setCtaActive] = useState(false);
  const ctaRef = useRef(false);
  // Until the spacer starts uncovering it, the desktop footer sits fully
  // covered behind the page. Hidden, the browser neither paints a full-screen
  // photo under the scene nor picks that photo as the LCP element.
  const [revealed, setRevealed] = useState(false);
  const revealedRef = useRef(false);
  const width = useWindowWidth();
  const stacked = width > 0 && width < STACK_BELOW;

  return (
    <>
      <div ref={spacerRef} aria-hidden className="hidden h-footer-reveal md:block" />
      <ProgressTrigger
        tag="span"
        trigger={spacerRef as RefObject<HTMLElement>}
        start="top bottom"
        end="bottom bottom"
        frameInterval={0}
        className="hidden"
        onChange={({ progress }) => {
          api.start({ f: progress });
          const shown = progress > 0;
          if (shown !== revealedRef.current) {
            revealedRef.current = shown;
            setRevealed(shown);
          }
          const next = progress >= FOOTER_CTA_AT;
          if (next !== ctaRef.current) {
            ctaRef.current = next;
            setCtaActive(next);
          }
        }}
      />

      <footer className={`${revealed ? "" : "md:invisible"} z-10 flex overflow-hidden bg-surface-footer text-foreground max-md:relative max-md:flex-col max-md:items-center max-md:px-6 max-md:pt-20 md:fixed md:inset-x-0 md:bottom-0 md:h-footer-reveal`}>
        <Image
          src={content.background.src}
          alt={content.background.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-surface-footer/20" />
        <GridLines className="z-2 max-md:inset-x-6" />

        <div className="relative z-15 flex flex-col items-center gap-10 md:absolute md:inset-x-8 md:top-10 md:grid md:grid-cols-4 md:items-start">
          <div className="flex flex-col items-center gap-8 md:col-span-2 md:max-w-126 md:items-start md:pl-5">
            <RevealLines
              tag="h2"
              lines={content.cta}
              active={stacked || ctaActive}
              timing="cta"
              className="text-headline-phone uppercase leading-heading tracking-title sm:text-headline"
              engineClassName="justify-center text-center md:justify-start md:text-left"
            />
            <ArrowLink href={content.contact.href} label={content.contact.label} variant="glass" />
          </div>

          <nav aria-label={content.navLabel} className="md:col-start-4 md:pl-5">
            <ul className="flex flex-wrap justify-center gap-6 md:flex-col md:gap-4.5">
              {content.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-block text-lead font-medium uppercase tracking-copy transition-[opacity,translate] duration-[var(--duration-normal)] ease-glide hover:translate-x-1 hover:opacity-70 focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <Wordmark text={content.wordmark} f={f} still={stacked} />
      </footer>

      {/* `#contact` lands at the very end of the page: the footer fully
          uncovered on desktop, scrolled into view on a phone. */}
      <span id="contact" aria-hidden className="block h-px" />
    </>
  );
};
