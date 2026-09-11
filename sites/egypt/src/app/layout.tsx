import type { Metadata, Viewport } from "next";
import { Onest } from "next/font/google";
import localFont from "next/font/local";

import {
  generateMetadata,
  generateViewport,
} from "@egypt/utils/seo/generate-page-metadata";
import { getSiteStructuredData } from "@egypt/utils/seo/structured-data";

import { LazyCookie } from "@egypt/components/common/Cookie";
import { AdaptiveGrid } from "@egypt/components/common/grid";
import { ReducedMotion } from "@egypt/components/common/reduced-motion";
import { ScrollLayout } from "@egypt/layouts/scroll-layout";

import "@egypt/app/globals.css";

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Hero typefaces. Both are the real families from the Figma file and both ship
 * in `src/fonts/`, so they are self-hosted rather than pulled from Google —
 * no third-party request on first paint, which matters for a hero that must be
 * correct on the very first frame.
 */
const instrumentSerif = localFont({
  variable: "--font-instrument-serif",
  display: "swap",
  src: [
    { path: "../fonts/InstrumentSerif-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/InstrumentSerif-Italic.ttf", weight: "400", style: "italic" },
  ],
});

const interTight = localFont({
  variable: "--font-inter-tight",
  display: "swap",
  src: [{ path: "../fonts/InterTight-Medium.ttf", weight: "500", style: "normal" }],
});

/**
 * The handwriting in block 3's sign-off. Self-hosted from `src/fonts/` like the
 * other two — no Google Fonts request. Bold ships alongside Regular because the
 * family is only useful with both weights available to the browser's synthesis
 * fallback; the block itself asks for 400.
 */
const caveat = localFont({
  variable: "--font-caveat",
  display: "swap",
  src: [
    { path: "../fonts/Caveat-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/Caveat-Bold.ttf", weight: "700", style: "normal" },
  ],
});

export const metadata: Metadata = generateMetadata();
export const viewport: Viewport = generateViewport();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /* The font variables go on <html>, not <body>: the Tier 2 typeface tokens
       in globals.css are declared in `:root`, and a custom property whose
       value references an undefined variable computes to invalid *there* — so
       a font variable scoped to <body> would never reach them. */
    <html
      lang="en"
      className={`${onest.variable} ${instrumentSerif.variable} ${interTight.variable} ${caveat.variable}`}
    >
      {/*
        Browser extensions write their own attributes onto <body> before React
        hydrates — ColorZilla's `cz-shortcut-listen`, Grammarly's `data-gr-*`
        and so on — and React reports every one as a hydration mismatch it
        "won't patch up". The markup is ours and correct; the difference is
        injected by software we do not control, which is the case React added
        this attribute for.

        It is deliberately on <body> and nowhere else: `suppressHydrationWarning`
        covers that element's own attributes and text, not its subtree, so a real
        mismatch anywhere inside the app is still reported.
      */}
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getSiteStructuredData()),
          }}
        />
        <ScrollLayout>
          {/* coef 1 — the 1440 design scales fully proportionally above 1440
              rather than being damped. See grid.config.ts. */}
          <AdaptiveGrid coef={1} />
          <ReducedMotion />
          <LazyCookie />
          {children}
        </ScrollLayout>
      </body>
    </html>
  );
}
