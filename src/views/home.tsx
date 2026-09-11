/**
 * Home view — 1:1 rebuild of the Girl Portfolio single-page site.
 *
 * Server Component: assembles the sections (client leaves handle animation)
 * and passes all content from `src/data/mocks/home.ts`. The content wrapper
 * hosts the WebGL lava backdrop, the film-grain overlay, and the seam
 * gradient that dissolves the hero edge into the lava sections.
 */

import {
  carouselContent,
  contactContent,
  featuresContent,
  heroContent,
  lavaConfig,
  navContent,
} from "@/data/mocks/home";

import { BottomNav } from "./home/bottom-nav";
import { CarouselSection } from "./home/carousel-section";
import { ContactSection } from "./home/contact-section";
import { FeaturesSection } from "./home/features-section";
import { GrainOverlay } from "./home/grain-overlay";
import { HeroSection } from "./home/hero-section";
import { LavaBackground } from "./home/lava-background";
import { MirrorHall } from "./home/mirror-hall";
import { Preloader } from "./home/preloader";

export const HomeView = () => {
  return (
    <>
      <Preloader />
      <main className="min-h-lvh">
        <HeroSection content={heroContent} />
        <MirrorHall />

        {/* content wrapper — lava canvas + grain live behind the sections */}
        <div className="relative w-full overflow-clip bg-background">
          <LavaBackground config={lavaConfig} />
          <GrainOverlay />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[80vh] bg-linear-to-b from-background to-transparent"
            aria-hidden
          />

          <FeaturesSection content={featuresContent} />
          <CarouselSection content={carouselContent} />
          <ContactSection content={contactContent} />
        </div>
      </main>

      {/* progressive blur pinned to the viewport bottom */}
      <div
        className="blur-fade-up pointer-events-none fixed bottom-0 left-0 z-[90] h-87.5 w-full"
        aria-hidden
      />
      <BottomNav content={navContent} />
    </>
  );
};
