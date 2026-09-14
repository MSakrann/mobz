/**
 * Site-wide navigation content.
 *
 * Transcribed from the Figma boards (`1312:276` / `2149:11`) — both draw the
 * same bar, so it is data for the header rather than for any one section.
 */
import type { SiteHeaderProps } from "@brewns/components/common/header";

export const siteNavigation: SiteHeaderProps = {
  links: [
    { label: "Shop", href: "#shop" },
    { label: "Menu", href: "#menu" },
    { label: "Our Story", href: "#story" },
    { label: "Locations", href: "#locations" },
  ],
  order: { label: "ORDER ONLINE", href: "#order" },
  logoMask: "/assets/brewns/shared/wordmark-mask.webp",
  brand: "brewns",
};
