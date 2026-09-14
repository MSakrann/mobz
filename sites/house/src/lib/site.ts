/**
 * Site-wide configuration — the single source of truth for SEO.
 *
 * Consumed by the metadata generator, `robots.ts`, `sitemap.ts`, and the
 * JSON-LD structured-data helper.
 */
import { publicEnv } from "@house/env";

export const siteConfig = {
  name: "Keld Studio",
  /** Default document title — the brand plus the page's own h1. */
  title: "Keld Studio — Harmony in House",
  description:
    "A cinematic journey through premium architectural forms, exquisite glass craft, and bespoke minimalist living spaces.",
  /**
   * Public origin, no trailing slash. Drives canonical URLs, OG tags, the
   * sitemap, and JSON-LD. Set `NEXT_PUBLIC_SITE_URL` in production.
   */
  url: publicEnv.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** Default Open Graph / Twitter share image (path under `public/`). */
  ogImage: "/assets/house/open-graph.png",
  /** No handle is known for the studio; empty omits the Twitter site/creator tags. */
  twitterHandle: "",
  author: "Keld Studio",
  /** Browser theme-color (address bar / PWA). */
  themeColor: "#000000",
} as const;
