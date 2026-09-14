import type { Metadata, Viewport } from "next";
import { Instrument_Sans } from "next/font/google";

import {
  generateMetadata,
  generateViewport,
} from "@house/utils/seo/generate-page-metadata";
import { getSiteStructuredData } from "@house/utils/seo/structured-data";

import { LazyCookie } from "@house/components/common/Cookie";
import { AdaptiveGrid } from "@house/components/common/grid";
import { ReducedMotion } from "@house/components/common/reduced-motion";
import { ScrollLayout } from "@house/layouts/scroll-layout";

import "@house/app/globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = generateMetadata({ url: "/house" });
export const viewport: Viewport = generateViewport();

export default function HouseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={instrumentSans.variable}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getSiteStructuredData()),
        }}
      />
      <ScrollLayout>
        <AdaptiveGrid />
        <ReducedMotion />
        <LazyCookie />
        {children}
      </ScrollLayout>
    </div>
  );
}
