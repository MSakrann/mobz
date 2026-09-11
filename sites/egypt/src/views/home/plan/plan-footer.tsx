"use client";

/**
 * The site footer — the frosted panel at the foot of block 5's scene.
 *
 * It lives inside the scene rather than under it, which is why every offset
 * here is `cqw` like the rest of the block: the panel is `position: relative`
 * but not a query container, so a `cqw` inside it is still a hundredth of the
 * scene's width and 24px is 1.6667cqw wherever it is measured from.
 *
 * 📖 Docs: obsidian/frontend/plan.md
 */

import { useRef } from "react";
import type { CSSProperties, RefObject } from "react";

import { Hover } from "@egypt/components/animation/springs/hover";
import { SegmentedText } from "@egypt/components/ui/segmented-text";
import { useFooterWatch } from "@egypt/components/common/site-chrome";

import { ARROW_SLIDE, CLASS, FOOTER } from "./plan.geometry";
import type { PlanContent, PlanMedia } from "./plan.types";

/**
 * The running arrow, shared by the button and the e-mail field.
 *
 * Two glyphs on a 24px track behind a 12px window: at rest the track sits at
 * −50% so the second one shows, and on hover it springs to 0, carrying that one
 * out to the right while the first arrives from the left. The movement only
 * reads forwards — see `ARROW_SLIDE`.
 *
 * The `window` class is set by the caller because the two placements size their
 * box differently; the track and the pair of glyphs are the same in both.
 *
 * `block` on the window is load-bearing: a `span` is inline by default, and
 * neither `width`/`height` nor a transform apply to a non-replaced inline box.
 */
export const ArrowTrack = ({
  media,
  window: windowClass,
  trigger,
  enabled,
}: {
  media: PlanMedia;
  window: string;
  trigger: RefObject<HTMLElement | null>;
  enabled: boolean;
}) => (
  <span className={windowClass} aria-hidden>
    <Hover
      tag="span"
      trigger={trigger}
      enabled={enabled}
      from={{ transform: ARROW_SLIDE.from }}
      to={{ transform: ARROW_SLIDE.to }}
      config={ARROW_SLIDE.config}
      className={CLASS.arrowTrack}
    >
      {/* A plain `img`, not `next/image`: the project does not enable
          `dangerouslyAllowSVG`, and there is nothing for the optimiser to do to
          a 12px vector anyway. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={media.src} alt="" className={CLASS.arrowMark} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={media.src} alt="" className={CLASS.arrowMark} />
    </Hover>
  </span>
);

export interface PlanFooterProps {
  content: PlanContent["footer"];
  arrow: PlanMedia;
  /** Off under `prefers-reduced-motion`, exactly as the scene's motion is. */
  animated: boolean;
}

export const PlanFooter = ({ content, arrow, animated }: PlanFooterProps) => {
  const fieldRef = useRef<HTMLDivElement>(null);

  /*
   * The panel tells the page when it is on screen, and the fixed chrome at the
   * top steps aside — the wordmark and the four links are printed right here,
   * larger, so keeping a second copy pinned over them is duplication.
   */
  const panelRef = useRef<HTMLElement>(null);
  useFooterWatch(panelRef);

  return (
    <footer ref={panelRef} className={FOOTER.panel}>
      <p className={FOOTER.wordmark}>
        <SegmentedText segments={content.wordmark} />
      </p>

      <nav className={FOOTER.columns} aria-label="Footer">
        {content.columns.map((column, index) => (
          <div
            key={column.title}
            className={`${FOOTER.column} ${FOOTER.columnBox}`}
            style={
              { "--b5-col": FOOTER.columnWidths[index] } as CSSProperties
            }
          >
            <h3 className={FOOTER.columnTitle}>{column.title}</h3>
            <ul className={FOOTER.columnList}>
              {column.links.map((link) => (
                <li key={link.label}>
                  <a className={FOOTER.columnLink} href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className={FOOTER.aside}>
        <p className={FOOTER.asideCopy}>{content.newsletter}</p>

        {/*
          A field does not jump. It lights up: the row rests at the 40% Figma
          draws it at and goes to full on hover *and on focus-within*, so a
          keyboard gets the same answer a cursor does. Its arrow runs the same
          track the button's does.
        */}
        <div ref={fieldRef} className={FOOTER.emailRow}>
          <input
            type="email"
            name="email"
            autoComplete="email"
            className={FOOTER.emailInput}
            placeholder={content.emailPlaceholder}
            aria-label={content.emailPlaceholder}
          />
          <button
            type="button"
            className={FOOTER.emailArrow}
            aria-label={content.emailAction}
          >
            <ArrowTrack
              media={arrow}
              window="block size-full overflow-hidden"
              trigger={fieldRef}
              enabled={animated}
            />
          </button>
        </div>
      </div>

      <ul className={FOOTER.social}>
        {/*
          Keyed by `src`, not by `href`: the account URLs are still placeholders
          and all three read `#`, which gave React three children with the same
          key. The file name is the one thing that is unique per mark today.
        */}
        {content.social.map((icon) => (
          <li key={icon.src}>
            <a className={FOOTER.socialIcon} href={icon.href}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={icon.src} alt={icon.alt} className="block size-full" />
            </a>
          </li>
        ))}
      </ul>

      <div className={FOOTER.divider} aria-hidden />
      <p className={FOOTER.copyright}>{content.copyright}</p>
    </footer>
  );
};
