import type { Ref } from "react";

import type { Range } from "@house/utils/timeline/range";
import { trackOffset, triggerBox } from "@house/utils/timeline/scene";

export interface TrackMarkerProps {
  range: Range;
  ref?: Ref<HTMLDivElement>;
}

/**
 * An invisible box laid over one phase of the track — the scroll reference for
 * a TextEngine `progress` reveal. Its geometry comes from the timeline, so the
 * inline style is data, not decoration.
 */
export const TrackMarker = ({ range, ref }: TrackMarkerProps) => (
  <div
    ref={ref}
    aria-hidden
    className="pointer-events-none invisible absolute inset-x-0"
    style={triggerBox(range)}
  />
);

export interface TrackAnchorProps {
  id: string;
  /** Fraction of the track's travel the anchor lands on. */
  at: number;
}

/** A hash target part-way down the pinned track (`#echo`, `#details`). */
export const TrackAnchor = ({ id, at }: TrackAnchorProps) => (
  <span
    id={id}
    aria-hidden
    className="pointer-events-none absolute inset-x-0 h-px"
    style={{ top: trackOffset(at) }}
  />
);
