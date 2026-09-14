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

// The source loaded three families but set every visible glyph in Instrument
// Sans; Outfit and Plus Jakarta Sans were dead weight and are not carried over.
const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = generateMetadata();
export const viewport: Viewport = generateViewport();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={instrumentSans.variable}>
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
      </body>
    </html>
  );
}
