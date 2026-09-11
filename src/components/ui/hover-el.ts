/**
 * Typed alias for the vendored `<Hover>` spring component. `Hover` already
 * spreads arbitrary HTML attributes onto the rendered element at runtime, but
 * its prop type only covers `HTMLAttributes` — this alias widens it so
 * anchors (`href`) and buttons (`type`) typecheck without modifying the
 * protected animation engine.
 */

import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ComponentProps,
  FC,
} from "react";

import { Hover } from "@/components/animation/springs/hover";

export type HoverElProps = ComponentProps<typeof Hover> &
  Omit<AnchorHTMLAttributes<HTMLElement>, "type"> &
  Pick<ButtonHTMLAttributes<HTMLElement>, "type" | "disabled">;

export const HoverEl = Hover as unknown as FC<HoverElProps>;
