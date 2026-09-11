import type { Metadata, Viewport } from "next";
import { Bitcount_Single, Inter } from "next/font/google";

import {
  generateMetadata,
  generateViewport,
} from "@/utils/seo/generate-page-metadata";
import { getSiteStructuredData } from "@/utils/seo/structured-data";

import { LazyCookie } from "@/components/common/Cookie";
import { AdaptiveGrid } from "@/components/common/grid";
import { ReducedMotion } from "@/components/common/reduced-motion";
import { ScrollLayout } from "@/layouts/scroll-layout";
import { ReloadOnBack } from "@/views/home/reload-on-back";

import "@/app/globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const bitcount = Bitcount_Single({
  variable: "--font-bitcount",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = generateMetadata();
export const viewport: Viewport = generateViewport();

export default function StudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${inter.variable} ${bitcount.variable}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getSiteStructuredData()),
        }}
      />
      <ScrollLayout>
        <ReloadOnBack />
        <AdaptiveGrid />
        <ReducedMotion />
        <LazyCookie />
        {children}
      </ScrollLayout>
    </div>
  );
}
