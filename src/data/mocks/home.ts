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
  infoLabels: ["Visual Identity", "Web & Interactive", "Backend Development"],
  description: "Building websites that make an impression",
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
    title: "Interactive Website Building",
    description:
      "We craft compelling brand narratives and visual systems that resonate with your target audience, ensuring a strong and memorable market presence.",
    specs: [
      { key: "Core Tools", value: "Three.js / Spline" },
      { key: "Deliverables", value: "fully working frontend and backend website" },
    ],
    cta: "Start Project",
  },
  sideCards: [
    {
      title: "Project Timelines",
      specs: [
        { key: "Minimum Duration", value: "1 week" },
        { key: "Average Timeline", value: "1-3 weeks" },
      ],
    },
    {
      title: "Our Impact",
      specs: [
        { key: "Successfully Delivered", value: "over 10 projects" },
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
      title: "Drape",
      category: "AI brand manager",
      year: "2026",
      image: "/assets/work/drape.jpg",
    },
    {
      title: "Artefakt",
      category: "E-commerce",
      year: "2026",
      image: "/assets/work/clothing.jpg",
    },
    {
      title: "Visit Egypt",
      category: "Art Direction",
      year: "2026",
      image: "/assets/work/egypt.jpg",
    },
    {
      title: "Sodic",
      category: "Brand Identity",
      year: "2026",
      image: "/assets/work/sodic.jpg",
    },
    {
      title: "House",
      category: "Architecture",
      year: "2026",
      image: "/assets/work/house.jpg",
    },
    {
      title: "Brewns",
      category: "F&B",
      year: "2026",
      image: "/assets/work/brewns.jpg",
    },
  ],
};

export const contactContent: ContactSectionContent = {
  title: "GET IN TOUCH",
  phone: { label: "+201289999530", href: "tel:+201289999530" },
  email: {
    label: "mohabelsakran@gmail.com",
    href: "mailto:mohabelsakran@gmail.com",
  },
  socialsLabel: "Our socials",
  socials: [
    {
      label: "Instagram",
      href: "https://www.instagram.com/mouhabelsakran?stkn=cTU0OGtoZzdsZGtr&utm_source=qr",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/mouhab-mahmoud-76a131161?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    },
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
