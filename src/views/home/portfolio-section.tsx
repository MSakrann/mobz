/**
 * "Crafting Digital Experiences" section (index.html .portfolio-section) —
 * scramble heading, filter tags, and two square glass cards whose imagery
 * reveals through a growing mask (left card from the top, right from the
 * bottom).
 */

import { HoverEl } from "@/components/ui/hover-el";
import { PortfolioCard, PortfolioSectionContent } from "@/data/mocks/home";

import { MaskReveal } from "./mask-reveal";
import { Multiline } from "./multiline";
import { ScrambleHeading } from "./scramble-heading";

export interface PortfolioSectionProps {
  content: PortfolioSectionContent;
}

const Card = ({ card }: { card: PortfolioCard }) => {
  const isLeft = card.variant === "left";
  return (
    <article className="relative flex aspect-square w-full flex-col overflow-hidden rounded-2xl border border-foreground/8 bg-foreground/10 p-4 backdrop-blur-[1.25rem] md:flex-1 md:p-6">
      <MaskReveal
        direction={isLeft ? "top" : "bottom"}
        className="flex flex-1"
        tag="div"
      >
        <div
          className={`relative flex flex-1 flex-col justify-between overflow-hidden rounded-md bg-cover bg-center p-6 [clip-path:inset(0_round_0.375rem)] md:p-10 ${isLeft ? "card-blur-top" : ""}`}
          style={{ backgroundImage: `url('${card.image}')` }}
          role="img"
          aria-label={card.imageAlt}
        >
          <div className="relative z-[2]">
            {card.badge && (
              <span className="inline-block rounded-full border border-foreground/30 px-3.75 py-1.5 text-[0.8rem] font-bold uppercase tracking-[-0.02em]">
                {card.badge}
              </span>
            )}
            {isLeft && (
              <h3 className="text-card-title mb-2.5 font-normal">
                <Multiline text={card.title} />
              </h3>
            )}
          </div>
          <div className="relative z-[2] mt-auto">
            {isLeft ? (
              <p className="max-w-[80%] text-base leading-[1.4] text-foreground/70">
                {card.description}
              </p>
            ) : (
              <h3 className="text-card-title font-normal">
                <Multiline text={card.title} />
              </h3>
            )}
          </div>
        </div>
      </MaskReveal>
    </article>
  );
};

export const PortfolioSection = ({ content }: PortfolioSectionProps) => (
  <section
    aria-labelledby="ps-heading"
    className="relative z-[1] flex w-full flex-col gap-10 px-4 pb-20 pt-40 text-foreground md:px-10 md:pb-40 md:pt-80"
  >
    <div className="flex flex-col items-start justify-between gap-8 border-b border-foreground/20 pb-15 lg:flex-row">
      <div className="flex-1 lg:pr-10">
        <ScrambleHeading
          id="ps-heading"
          className="font-display text-[2rem] font-[250] uppercase leading-[0.9] tracking-[-0.02em] md:text-display"
          parts={[
            { text: content.headingFaded, className: "opacity-70" },
            { text: content.headingBold, className: "font-normal" },
          ]}
        />
      </div>
      <div className="flex w-full flex-col items-start gap-5 lg:w-75">
        <p className="text-body-sm text-foreground/80">{content.description}</p>
        <HoverEl
          tag="button"
          type="button"
          className="flex cursor-pointer items-center justify-center rounded-sm bg-foreground px-6 py-3 text-[0.9rem] font-semibold text-background"
          from={{ opacity: 1 }}
          to={{ opacity: 0.8 }}
        >
          {content.cta}
        </HoverEl>
      </div>
    </div>

    <div className="flex flex-wrap items-center justify-between gap-4 text-[0.8rem] font-bold uppercase tracking-[-0.02em]">
      <ul className="flex gap-2.5" aria-label="Project filters">
        {content.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full border border-foreground/30 px-3.75 py-1.5"
          >
            {tag}
          </li>
        ))}
      </ul>
      <p className="hidden text-foreground/50 lg:block">{content.centerText}</p>
      <p className="hidden whitespace-pre text-foreground/50 md:block">
        {content.rightText}
      </p>
    </div>

    <div className="flex flex-col gap-2.5 md:flex-row">
      {content.cards.map((card) => (
        <Card key={card.title} card={card} />
      ))}
    </div>
  </section>
);
