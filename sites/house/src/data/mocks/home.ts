/**
 * Home page content — Mobz Studio.
 *
 * The copy is carried over verbatim from the source site
 * (github.com/textura-agency/getlayers-house, `index.html`); only alt text was
 * rewritten to describe the images. The view passes it down through props — no
 * component imports this file.
 */

import { FRAME_POSTER, FRAME_TIERS } from "@house/lib/scene/frames";
import { SCENE_ANCHOR } from "@house/utils/timeline/scene";

export interface ImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface LinkItem {
  label: string;
  href: string;
}

export type HeroSlot =
  | "top-left"
  | "top-right"
  | "center-left"
  | "center-right"
  | "center"
  | "bottom-left"
  | "bottom-right";

export interface HeroWord {
  text: string;
  slot: HeroSlot;
}

export interface HeroBlockContent {
  words: readonly [HeroWord, HeroWord, HeroWord];
  description: string;
  descriptionSide: "left" | "right";
}

export interface EchoContent {
  eyebrow: readonly string[];
  title: string;
  mark: string;
  description: string;
  footer: readonly string[];
  image: ImageAsset;
}

export interface StatContent {
  value: number;
  label: string;
  slot: "top-right" | "bottom-left" | "bottom-right";
}

export interface ShowreelContent {
  src: string;
  poster: string;
  label: string;
  badge: string;
}

export interface DetailsContent {
  title: readonly string[];
  stats: readonly StatContent[];
  zoomTitle: readonly string[];
  address: { label: string; lines: readonly string[] };
  showroom: LinkItem;
  image: ImageAsset;
  showreel: ShowreelContent;
}

export interface TestimonialContent {
  quote: string;
  author: string;
  role: string;
  portrait: ImageAsset;
}

export interface ReviewsContent {
  title: string;
  previousLabel: string;
  nextLabel: string;
  items: readonly TestimonialContent[];
}

export interface FooterContent {
  cta: readonly string[];
  contact: LinkItem;
  navLabel: string;
  links: readonly LinkItem[];
  wordmark: string;
  background: ImageAsset;
}

export interface DockContent {
  title: string;
  homeLabel: string;
  navLabel: string;
  openLabel: string;
  closeLabel: string;
  links: readonly LinkItem[];
}

export interface HomeContent {
  preloader: { label: string };
  /** Accessible name of the pinned scroll scene. */
  sceneLabel: string;
  poster: ImageAsset;
  quoteCta: LinkItem;
  hero: readonly [HeroBlockContent, HeroBlockContent, HeroBlockContent];
  echo: EchoContent;
  details: DetailsContent;
  reviews: ReviewsContent;
  footer: FooterContent;
  dock: DockContent;
}

const NAV_LINKS: readonly LinkItem[] = [
  { label: "Home", href: `#${SCENE_ANCHOR.top}` },
  { label: "Echo", href: `#${SCENE_ANCHOR.echo}` },
  { label: "Details", href: `#${SCENE_ANCHOR.details}` },
  { label: "Reviews", href: "#reviews" },
];

export const homeContent: HomeContent = {
  preloader: { label: "Mobz Studio" },
  sceneLabel: "House showcase",
  poster: {
    src: FRAME_POSTER,
    alt: "",
    width: FRAME_TIERS.desktop.width,
    height: FRAME_TIERS.desktop.height,
  },
  quoteCta: { label: "Get a quote", href: "#contact" },
  hero: [
    {
      words: [
        { text: "Harmony", slot: "top-left" },
        { text: "in", slot: "center-right" },
        { text: "House", slot: "bottom-left" },
      ],
      description:
        "A cinematic journey through premium architectural forms, exquisite glass craft, and bespoke minimalist living spaces.",
      descriptionSide: "right",
    },
    {
      words: [
        { text: "Precision", slot: "top-right" },
        { text: "through", slot: "center-left" },
        { text: "Detail", slot: "bottom-right" },
      ],
      description:
        "Exploring the delicate balance between structural transparency, premium framing, and high-performance bespoke glass panels.",
      descriptionSide: "left",
    },
    {
      words: [
        { text: "Exquisite", slot: "top-left" },
        { text: "by", slot: "center" },
        { text: "Nature", slot: "bottom-right" },
      ],
      description:
        "Bringing the surrounding landscape inside, blurring visual boundaries, and creating light-filled sanctuaries of calm.",
      descriptionSide: "left",
    },
  ],
  echo: {
    eyebrow: ["Award winning", "Project 2026"],
    title: "Echo",
    mark: "®",
    description:
      "Step back in time with our latest architectural showcase, a homage to the vibrant and eclectic era of modern glass.",
    footer: ["Portfolio", "Arch.Mono"],
    image: {
      src: "/assets/house/scene/interior-echo.webp",
      alt: "Sunlit open-plan living space behind floor-to-ceiling glazing, with oak lounge chairs and a timber kitchen island",
      width: 1075,
      height: 565,
    },
  },
  details: {
    title: ["Realization of your", "imagination in space"],
    stats: [
      { value: 300, label: "Projects completed", slot: "top-right" },
      { value: 10, label: "Years of experience", slot: "bottom-left" },
      { value: 32, label: "Successful partnerships", slot: "bottom-right" },
    ],
    zoomTitle: ["A place where precision", "and creativity connect"],
    address: {
      label: "Address",
      lines: ["Orbital 25 Business Park, Unit 11", "Watford WD18 9DA, UK"],
    },
    showroom: {
      label: "Showroom",
      href: "https://www.google.com/maps/search/?api=1&query=Orbital+25+Business+Park+Unit+11+Watford+WD18+9DA",
    },
    image: {
      src: "/assets/house/scene/interior-details.webp",
      alt: "Dusk-lit lounge with walnut-panelled walls, a grey sectional sofa and a glowing paper floor lamp",
      width: 1200,
      height: 800,
    },
    showreel: {
      src: "/assets/house/scene/showreel.mp4",
      poster: "/assets/house/scene/showreel-poster.webp",
      label: "Mobz Studio showreel",
      badge: "Play",
    },
  },
  reviews: {
    title: "Client stories",
    previousLabel: "Previous story",
    nextLabel: "Next story",
    items: [
      {
        quote:
          "Unrivaled customer service, cutting edge design and quality. Fluid Glass is firmly lodged in our list of preferred suppliers of glazing products.",
        author: "Vaidas Vileikis",
        role: "Founder, Name Architects",
        portrait: {
          src: "/assets/house/testimonials/founder.webp",
          alt: "Vaidas Vileikis at a drafting table with site plans, in black and white",
          width: 1024,
          height: 1024,
        },
      },
    ],
  },
  footer: {
    cta: ["Ready to shape", "your vision in space?"],
    contact: { label: "Contact", href: "#contact" },
    navLabel: "Footer",
    links: NAV_LINKS,
    wordmark: "Mobz Studio",
    background: {
      src: "/assets/house/footer/footer-bg.webp",
      alt: "",
      width: 2560,
      height: 1429,
    },
  },
  dock: {
    title: "Home",
    homeLabel: "Mobz Studio — back to top",
    navLabel: "Primary",
    openLabel: "Open menu",
    closeLabel: "Close menu",
    links: [...NAV_LINKS, { label: "Contact", href: "#contact" }],
  },
};
