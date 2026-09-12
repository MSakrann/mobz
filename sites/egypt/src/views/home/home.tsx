/**
 * Home view — a Server Component. Both sections are client leaves: the hero
 * because it is scroll-driven, the destinations block because hovering a
 * country swaps its pile. Each takes all of its copy and media through props.
 */

import { Preloader } from "@egypt/components/common/preloader";
import {
  destinationsContent,
  heroContent,
  philosophyContent,
  planContent,
  travelContent,
} from "@egypt/data/mocks/home";

import { Destinations } from "./destinations";
import { Hero } from "./hero";
import { Philosophy } from "./philosophy";
import { Plan } from "./plan";
import { Travel } from "./travel";

/**
 * What the preloader waits for.
 *
 * The hero opens on a video now rather than on two photographs, so this is the
 * clip — and the wait is for it to have *frames*, not to be downloaded (see
 * `use-media-ready`). The thumbnails arrive much later in the section's own
 * timeline and are left to load on their own.
 */
const CRITICAL_MEDIA = ["egypt-hero.jpg"] as const;

export const HomeView = () => {
  return (
    <>
      <Preloader wordmark={heroContent.wordmark} assets={CRITICAL_MEDIA} />
      <main>
        <Hero content={heroContent} />
        <Destinations content={destinationsContent} />
        <Philosophy content={philosophyContent} />
        <Travel content={travelContent} />
        <Plan content={planContent} />
      </main>
    </>
  );
};
