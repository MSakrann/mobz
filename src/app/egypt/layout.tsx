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

const instrumentSerif = localFont({
  variable: "--font-instrument-serif",
  display: "swap",
  src: [
    {
      path: "../../../sites/egypt/src/fonts/InstrumentSerif-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../sites/egypt/src/fonts/InstrumentSerif-Italic.ttf",
      weight: "400",
      style: "italic",
    },
  ],
});

const interTight = localFont({
  variable: "--font-inter-tight",
  display: "swap",
  src: [
    {
      path: "../../../sites/egypt/src/fonts/InterTight-Medium.ttf",
      weight: "500",
      style: "normal",
    },
  ],
});

const caveat = localFont({
  variable: "--font-caveat",
  display: "swap",
  src: [
    {
      path: "../../../sites/egypt/src/fonts/Caveat-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../sites/egypt/src/fonts/Caveat-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = generateMetadata();
export const viewport: Viewport = generateViewport();

export default function EgyptLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${onest.variable} ${instrumentSerif.variable} ${interTight.variable} ${caveat.variable}`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getSiteStructuredData()),
        }}
      />
      <ScrollLayout>
        <AdaptiveGrid coef={1} />
        <ReducedMotion />
        <LazyCookie />
        {children}
      </ScrollLayout>
    </div>
  );
}
