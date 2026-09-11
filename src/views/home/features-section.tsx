/**
 * "Comprehensive Design Solutions" section (index.html .features-section) —
 * scramble heading, services list, and a staggered blur-reveal card grid
 * (main card + two side cards, 0/150/300ms delays).
 */

import { HoverAction } from "@/components/ui/hover-action";
import { FeaturesSectionContent, SpecRow } from "@/data/mocks/home";

import { BlurReveal } from "./blur-reveal";
import { ScrambleHeading } from "./scramble-heading";

export interface FeaturesSectionProps {
  content: FeaturesSectionContent;
}

const Specs = ({ specs }: { specs: SpecRow[] }) => (
  <dl className="flex w-full flex-col gap-3.75">
    {specs.map((spec) => (
      <div
        key={spec.key}
        className="flex justify-between border-b border-foreground/10 pb-2.5"
      >
        <dt className="text-base text-foreground/60">{spec.key}</dt>
        <dd className="text-right text-base font-normal text-foreground">
          {spec.value}
        </dd>
      </div>
    ))}
  </dl>
);

export const FeaturesSection = ({ content }: FeaturesSectionProps) => (
  <section
    id="services"
    aria-labelledby="fs-heading"
    className="relative z-[1] flex w-full flex-col px-4 pb-40 pt-20 text-foreground md:px-10 md:pb-80 md:pt-40"
  >
    <div className="mb-15 border-b border-foreground/20 pb-15">
      <ScrambleHeading
        id="fs-heading"
        className="font-display text-[2rem] font-[250] uppercase leading-[0.9] tracking-[-0.02em] md:text-display"
        parts={[
          { text: content.headingFaded, className: "opacity-70" },
          { text: content.headingBold, className: "font-normal" },
        ]}
      />
    </div>

    <div className="mb-20 flex flex-col gap-10 lg:flex-row lg:gap-15">
      <div className="flex-1">
        <p className="text-lead">{content.lead}</p>
      </div>
      <div className="flex flex-1 flex-col gap-10 lg:pl-47.5">
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
          <h3 className="w-30 shrink-0 text-[0.9rem] font-normal text-foreground/50">
            {content.listTitle}
          </h3>
          <ul className="text-[0.9rem] leading-[1.6] text-foreground">
            {content.list.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
          <h3 className="w-30 shrink-0 text-[0.9rem] font-normal text-foreground/50">
            {content.optimizationTitle}
          </h3>
          <p className="max-w-100 text-[0.9rem] leading-[1.6]">
            {content.optimizationText}
          </p>
        </div>
      </div>
    </div>

    <div className="flex min-h-125 flex-col gap-2.5 lg:flex-row">
      <BlurReveal
        tag="article"
        variant="card"
        className="flex flex-col gap-10 rounded-2xl border border-foreground/8 bg-foreground/10 p-6 backdrop-blur-[1.25rem] md:flex-row md:p-10 lg:flex-2"
      >
        <div className="flex flex-1 flex-col">
          <h3 className="mb-5 text-[2rem] font-normal tracking-[-0.02em] md:text-[2.5rem]">
            {content.mainCard.title}
          </h3>
          <p className="mb-10 text-[0.9rem] leading-[1.5] text-foreground/70">
            {content.mainCard.description}
          </p>
          <div className="mt-auto">
            <Specs specs={content.mainCard.specs} />
          </div>
        </div>
        <HoverAction
          className="text-circle-btn mx-auto flex aspect-square w-3/5 cursor-pointer items-center justify-center self-center rounded-full border-[0.125rem] border-dotted border-foreground/60 bg-foreground/[0.02] font-light text-foreground md:w-auto md:flex-1"
          overlayClassName="-inset-[0.125rem] rounded-full border-[0.125rem] border-dotted border-foreground bg-foreground/[0.06]"
        >
          {content.mainCard.cta}
        </HoverAction>
      </BlurReveal>

      <div className="flex flex-1 flex-col gap-2.5">
        {content.sideCards.map((card, i) => (
          <BlurReveal
            key={card.title}
            tag="article"
            variant="card"
            delayIn={(i + 1) * 150}
            className="flex flex-1 flex-col justify-between gap-10 rounded-2xl border border-foreground/8 bg-foreground/10 p-6 text-foreground backdrop-blur-[1.25rem] md:p-10"
          >
            <h4 className="text-[2rem] font-normal tracking-[-0.02em] md:text-[2.5rem]">
              {card.title}
            </h4>
            <Specs specs={card.specs} />
          </BlurReveal>
        ))}
      </div>
    </div>
  </section>
);
