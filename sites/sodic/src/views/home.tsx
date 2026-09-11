import { Preloader } from "@sodic/components/common/preloader";
import { homeContent } from "@sodic/data/mocks/home";
import { AboutSection } from "@sodic/views/home/about-section";
import { AudienceSection } from "@sodic/views/home/audience-section";
import { ContactSection } from "@sodic/views/home/contact-section";
import { HeroSection } from "@sodic/views/home/hero-section";
import { LocationSection } from "@sodic/views/home/location-section";
import { NumbersSection } from "@sodic/views/home/numbers-section";
import { SiteNav } from "@sodic/views/home/site-nav";

/**
 * Home view — the AERRA landing page, ported from the Figma frame
 * "Concept 3" (1469:1302), laid out at a 1440 px base width.
 *
 * Every section keeps its Figma height and places children at their Figma
 * coordinates, expressed through the rem-based spacing scale (1 Figma px =
 * 0.0625rem). The adaptive grid scales the root font-size with the viewport,
 * so the whole composition stays proportional at any width.
 *
 * A Server Component — the animation primitives are the client leaves.
 */
export const HomeView = () => {
  return (
    <>
      <Preloader />

      {/* Navigation precedes <main>, so it needs a skip link — see
          obsidian/frontend/html-semantics.md. */}
      <a
        href="#main"
        className="sr-only z-50 rounded-button bg-action-primary px-6 py-3 text-body font-medium text-action-primary-foreground focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        Skip to content
      </a>

      <SiteNav links={homeContent.nav.links} cta={homeContent.nav.cta} />

      <main id="main" className="w-full overflow-x-clip">
        <HeroSection content={homeContent.hero} />
        <AboutSection content={homeContent.about} />
        <NumbersSection content={homeContent.numbers} />
        <LocationSection content={homeContent.location} />
        <AudienceSection content={homeContent.audience} />
        <ContactSection content={homeContent.contact} />
      </main>
    </>
  );
};
