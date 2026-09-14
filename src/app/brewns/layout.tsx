import type { Metadata, Viewport } from "next";
import { Geist, Onest } from "next/font/google";
import localFont from "next/font/local";

import {
  generateMetadata,
  generateViewport,
} from "@brewns/utils/seo/generate-page-metadata";
import { getSiteStructuredData } from "@brewns/utils/seo/structured-data";

import { LazyCookie } from "@brewns/components/common/Cookie";
import { SiteFooter } from "@brewns/components/common/footer";
import { SiteHeader } from "@brewns/components/common/header";
import { AdaptiveGrid } from "@brewns/components/common/grid";
import { SitePreloader } from "@brewns/components/common/preloader";
import { ReducedMotion } from "@brewns/components/common/reduced-motion";
import { ScrollLayout } from "@brewns/layouts/scroll-layout";
import { siteFooter } from "@brewns/data/mocks/footer";
import { siteNavigation } from "@brewns/data/mocks/navigation";

import "@brewns/app/globals.css";

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
  display: "swap",
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const spaceMono = localFont({
  src: "../../../sites/brewns/src/fonts/SpaceMono-Regular.ttf",
  variable: "--font-space-mono",
  weight: "400",
  display: "swap",
});

const allura = localFont({
  src: "../../../sites/brewns/src/fonts/Allura-Regular.ttf",
  variable: "--font-allura",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = generateMetadata({ url: "/brewns" });
export const viewport: Viewport = generateViewport();

export default function BrewnsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${onest.variable} ${geist.variable} ${spaceMono.variable} ${allura.variable}`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getSiteStructuredData()),
        }}
      />
      <ScrollLayout>
        <SitePreloader
          logoMask={siteNavigation.logoMask}
          brand={siteNavigation.brand}
        />
        <AdaptiveGrid />
        <ReducedMotion />
        <LazyCookie />
        <SiteHeader {...siteNavigation} />
        {children}
        <SiteFooter {...siteFooter} />
      </ScrollLayout>
    </div>
  );
}
