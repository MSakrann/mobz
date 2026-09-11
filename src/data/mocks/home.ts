/**
 * Home page content — ported 1:1 from the Girl Portfolio static site
 * (index.html). All copy, project entries, and contact details live here and
 * reach components via props (component-conventions: no hardcoded content).
 */

export interface HeroContent {
  videoSrc: string;
  infoLabels: [string, string, string];
  description: string;
  title: string;
}

export interface PortfolioCard {
  variant: "left" | "right";
  image: string;
  imageAlt: string;
  badge?: string;
  title: string;
  description?: string;
}

export interface PortfolioSectionContent {
  headingFaded: string;
  headingBold: string;
  description: string;
  cta: string;
  tags: string[];
  centerText: string;
  rightText: string;
  cards: PortfolioCard[];
}

export interface SpecRow {
  key: string;
  value: string;
}

export interface FeaturesSectionContent {
  headingFaded: string;
  headingBold: string;
  lead: string;
  listTitle: string;
  list: string[];
  optimizationTitle: string;
  optimizationText: string;
  mainCard: {
    title: string;
    description: string;
    specs: SpecRow[];
    cta: string;
  };
  sideCards: { title: string; specs: SpecRow[] }[];
}

export interface CarouselProject {
  title: string;
  category: string;
  year: string;
  image: string;
}

export interface CarouselSectionContent {
  label: string;
  headingFaded: string;
  headingBold: string;
  description: string[];
  projects: CarouselProject[];
}

export interface ContactSectionContent {
  title: string;
  phone: { label: string; href: string };
  email: { label: string; href: string };
  socialsLabel: string;
  socials: { label: string; href: string }[];
}

export interface NavContent {
  logo: string;
  links: { label: string; href: string }[];
  cta: string;
}

/** Lava-lamp shader parameters (lava.js UI control defaults). */
export interface LavaConfig {
  speed: number;
  blend: number;
  colors: [string, string, string, string, string];
}

export const heroContent: HeroContent = {
  videoSrc: "/assets/home/hero.mp4",
  infoLabels: ["Visual Identity", "Web & Interactive", "Brand Strategy"],
  description:
    "Independent Art Director & Designer specializing\nin digital experiences and high-end visual solutions.",
  title: "Mobz Studio",
};

export const portfolioContent: PortfolioSectionContent = {
  headingFaded: "Crafting Digital Experiences:",
  headingBold: "One Idea, Infinite Possibilities",
  description:
    "Partnering with visionary brands to create immersive digital experiences and timeless visual identities.",
  cta: "View projects",
  tags: ["Web Design", "Branding", "More +"],
  centerText: "NO COMPROMISES. JUST PURE DESIGN.",
  rightText: "LATEST CASE STUDIES     VIEW ALL +",
  cards: [
    {
      variant: "left",
      image: "/assets/home/art-direction.webp",
      imageAlt: "E-commerce art direction case study visual",
      title: "E-Commerce Experience &\nArt Direction",
      description:
        "Redefining digital storefronts with seamless interactions and bold aesthetics.",
    },
    {
      variant: "right",
      image: "/assets/home/packaging.webp",
      imageAlt: "Brand identity packaging case study visual",
      badge: "Brand Identity",
      title: "Transforming brand visions into\ncompelling digital realities",
    },
  ],
};

export const featuresContent: FeaturesSectionContent = {
  headingFaded: "Comprehensive",
  headingBold: "Design Solutions",
  lead: "We provide a full range of creative services to meet your brand's unique needs. From brand identity and web design to interactive experiences, we ensure high-quality, engaging, and timeless visual solutions.",
  listTitle: "Features",
  list: [
    "Art Direction & Strategy",
    "Brand Identity Design",
    "UI/UX & Web Design",
    "Motion Graphics",
    "3D Visualizations",
    "Interactive Experiences",
  ],
  optimizationTitle: "Optimization",
  optimizationText:
    "We combine aesthetic vision with technical expertise to create designs that are not only beautiful but also perform seamlessly across all platforms.",
  mainCard: {
    title: "Digital Branding",
    description:
      "We craft compelling brand narratives and visual systems that resonate with your target audience, ensuring a strong and memorable market presence.",
    specs: [
      { key: "Core Tools", value: "Figma / After Effects" },
      { key: "Deliverables", value: "UI/UX / Brand Guidelines" },
    ],
    cta: "Start Project",
  },
  sideCards: [
    {
      title: "Project Timelines",
      specs: [
        { key: "Minimum Duration", value: "2 weeks" },
        { key: "Average Timeline", value: "4-8 weeks" },
      ],
    },
    {
      title: "Our Impact",
      specs: [
        { key: "Successfully Delivered", value: "over 50 projects" },
        { key: "Global Clients", value: "across 15 countries" },
      ],
    },
  ],
};

export const carouselContent: CarouselSectionContent = {
  label: "Portfolio",
  headingFaded: "EXPLORE\nOUR LATEST",
  headingBold: "CASE STUDIES AND PROJECTS",
  description: [
    "Make your brand an extension of your unique vision.",
    "Choose from a range of high-end design services.",
    "",
    "Customize every detail to suit your audience's preferences.",
  ],
  projects: [
    {
      title: "Lumina X-M",
      category: "Brand Identity",
      year: "2026",
      image: "/assets/home/1.webp",
    },
    {
      title: "Nexus 43-M",
      category: "E-Commerce",
      year: "2026",
      image: "/assets/home/2.webp",
    },
    {
      title: "MC80 FT-6",
      category: "Interactive",
      year: "2025",
      image: "/assets/home/1.webp",
    },
    {
      title: "Aero Vision",
      category: "Art Direction",
      year: "2025",
      image: "/assets/home/2.webp",
    },
  ],
};

export const contactContent: ContactSectionContent = {
  title: "GET IN TOUCH",
  phone: { label: "+82 10-7722-8976", href: "tel:+821077228976" },
  email: { label: "hello@mobz.studio", href: "mailto:hello@mobz.studio" },
  socialsLabel: "Our socials",
  socials: [
    { label: "Instagram", href: "#" },
    { label: "Behance", href: "#" },
    { label: "LinkedIn", href: "#" },
  ],
};

export const navContent: NavContent = {
  logo: "MOBZ",
  links: [
    { label: "Services", href: "services" },
    { label: "Work", href: "work" },
    { label: "About", href: "contact" },
  ],
  cta: "Contact Us",
};

export const lavaConfig: LavaConfig = {
  speed: 0.15,
  blend: 1.0,
  colors: ["#ff1a00", "#ff1a00", "#ff1a00", "#ffefcc", "#0040ff"],
};
