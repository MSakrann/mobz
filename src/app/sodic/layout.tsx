import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import {
  generateMetadata,
  generateViewport,
} from "@sodic/utils/seo/generate-page-metadata";
import { getSiteStructuredData } from "@sodic/utils/seo/structured-data";

import { LazyCookie } from "@sodic/components/common/Cookie";
import { AdaptiveGrid } from "@sodic/components/common/grid";
import { ReducedMotion } from "@sodic/components/common/reduced-motion";
import { ScrollLayout } from "@sodic/layouts/scroll-layout";

import "@sodic/app/globals.css";

const googleSansFlex = localFont({
  src: [
    {
      path: "../../../sites/sodic/src/app/fonts/GoogleSansFlex_24pt-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../../sites/sodic/src/app/fonts/GoogleSansFlex_24pt-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../../sites/sodic/src/app/fonts/GoogleSansFlex_24pt-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../sites/sodic/src/app/fonts/GoogleSansFlex_24pt-Medium.ttf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-google-sans-flex",
  display: "swap",
});

const googleSansFlexDisplay = localFont({
  src: "../../../sites/sodic/src/app/fonts/GoogleSansFlex-Variable-latin.woff2",
  variable: "--font-google-sans-flex-display",
  display: "swap",
  weight: "1 1000",
});

export const metadata: Metadata = generateMetadata();
export const viewport: Viewport = generateViewport();

export default function SodicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${googleSansFlex.variable} ${googleSansFlexDisplay.variable} font-sans antialiased`}
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
