/**
 * "Explore our latest case studies" section (index.html
 * .portfolio-carousel-section) — label / scramble heading / description grid
 * on top, arrow-driven project carousel below.
 */

import { CarouselSectionContent } from "@/data/mocks/home";

import { Multiline } from "./multiline";
import { ProjectCarousel } from "./project-carousel";
import { ScrambleHeading } from "./scramble-heading";

export interface CarouselSectionProps {
  content: CarouselSectionContent;
}

export const CarouselSection = ({ content }: CarouselSectionProps) => (
  <section
    id="cases"
    aria-labelledby="pc-heading"
    className="relative z-[1] flex w-full flex-col border-t border-foreground/20 px-4 py-40 text-foreground md:px-10 md:py-80"
  >
    <div className="mb-10 flex flex-col gap-6 md:mb-20 lg:grid lg:grid-cols-[1fr_3fr_1fr] lg:gap-10">
      <p className="text-base text-foreground/60">{content.label}</p>
      <ScrambleHeading
        id="pc-heading"
        className="font-display text-[2rem] font-[250] uppercase leading-[0.9] tracking-[-0.02em] md:text-display"
        parts={[
          { text: content.headingFaded, className: "opacity-70" },
          { text: content.headingBold, className: "font-normal" },
        ]}
      />
      <p className="mt-2.5 text-sm leading-[1.4375rem] lg:-ml-50">
        <Multiline text={content.description.join("\n")} />
      </p>
    </div>

    <ProjectCarousel projects={content.projects} />
  </section>
);
