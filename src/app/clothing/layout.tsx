import type { Metadata, Viewport } from "next";
import { Onest } from "next/font/google";
import localFont from "next/font/local";

import {
  generateMetadata,
  generateViewport,
} from "@clothing/utils/seo/generate-page-metadata";
import { getSiteStructuredData } from "@clothing/utils/seo/structured-data";

import { LazyCookie } from "@clothing/components/common/Cookie";
import { Preloader } from "@clothing/components/common/preloader";
import { ReducedMotion } from "@clothing/components/common/reduced-motion";
import { ScrollLayout } from "@clothing/layouts/scroll-layout";

import "@clothing/app/globals.css";

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
  display: "swap",
});

const ibm3270 = localFont({
  src: "../../../sites/clothing/src/app/fonts/3270-Regular.otf",
  variable: "--font-3270",
  weight: "400",
  style: "normal",
  display: "swap",
});

export const metadata: Metadata = generateMetadata();
export const viewport: Viewport = generateViewport();

export default function ClothingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${onest.variable} ${ibm3270.variable}`}>
      <noscript>
        <style>{`[data-preloader]{display:none!important}`}</style>
      </noscript>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getSiteStructuredData()),
        }}
      />
      <ScrollLayout>
        <ReducedMotion />
        <Preloader />
        <LazyCookie />
        {children}
      </ScrollLayout>
    </div>
  );
}
