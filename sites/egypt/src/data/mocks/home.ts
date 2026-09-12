/**
 * Placeholder content for the home page.
 *
 * Every string here is transcribed from the Get Layers file — the hero from
 * frame "Hero 2" (774:254), the destinations block from "Hero 2 (Block 2:
 * Destinations)" (1600:34461), the philosophy block from "Hero 2 (Block 3:
 * Philosophy)" (1653:964 and 1653:1003), the travel block from the five
 * "Hero 2 (Block 4: How We Travel)" frames. Swap this module for real data without
 * touching the components — they take it all through props.
 */

import type {
  Destination,
  DestinationsContent,
  InkMetrics,
} from "@egypt/views/home/destinations/destinations.types";
import type { HeroContent } from "@egypt/views/home/hero/hero.types";
import type { PhilosophyContent } from "@egypt/views/home/philosophy/philosophy.types";
import type { PlanContent } from "@egypt/views/home/plan/plan.types";
import type { TravelContent } from "@egypt/views/home/travel/travel.types";

export const heroContent: HeroContent = {
  // Node 854:950 — italic leading capitals, roman remainder.
  wordmark: [
    { text: "V", italic: true },
    { text: "isit " },
    { text: "E", italic: true },
    { text: "gypt" },
  ],

  // Node 881:9
  nav: [
    { label: "JOURNAL.", href: "/journal" },
    { label: "EXPERIENCES.", href: "/experiences" },
    { label: "ABOUT.", href: "/about" },
    { label: "CONTACT.", href: "/contact" },
  ],

  // Node 881:3 / 856:958 — lowercase in Figma, uppercased in CSS.
  explore: { label: "explore Destinations", href: "/destinations" },

  // Node 854:953
  titleStart: [
    { text: "B", italic: true },
    { text: "eyond " },
    { text: "P", italic: true },
    { text: "laces" },
  ],

  // Node 854:954 — two lines.
  titleEnd: [
    [{ text: "I", italic: true }, { text: "nto" }],
    [{ text: "M", italic: true }, { text: "oments" }],
  ],

  cardCaptionTop: ["TRAVEL STORIES", "JOURNAL"], // 857:998
  cardCaptionBottom: ["01.", "REAL JOURNEYS", "42."], // 857:997

  destinationsLabel: "",
  destinations: [],

  // Node 856:988
  viewModes: [
    { label: "SLIDER", active: true },
    { label: "LIST", active: false },
  ],

  media: {
    video: {
      src: "/assets/egypt-assets/egypt-hero.jpg",
      alt: "Visit Egypt — aerial view across the landscape",
      width: 1104,
      height: 736,
    },
    still: {
      src: "/assets/egypt-assets/egypt-hero.jpg",
    },
    thumbnail: {
      src: "/assets/egypt-assets/egypt-hero.jpg",
      alt: "Visit Egypt landscape",
      width: 1104,
      height: 736,
    },
  },
};

/* ---------------------------------------------------------------------------
   BLOCK 2 — Destinations (frame 1784:1916)
   --------------------------------------------------------------------------- */

/**
 * Sixteen countries, one card each, every card on the scene at once.
 *
 * `cx`/`cy` are the centre of the card's **ink** in frame coordinates, and
 * `width` is that ink's width. No height: it comes from the photograph's own
 * proportions through `INK`, so a card can never be drawn to a shape its file
 * does not have. No rotation either — every export is already turned.
 *
 * `z` is the paint order the frame draws them in, 1 at the bottom. It is not
 * the reading order: Portugal is drawn first and numbered eighth.
 *
 * > [!warning] These centres were corrected against a render of the frame
 * > The table they were entered from carried the rotated-leaf error the block's
 * > docs are about: for a rotated leaf `get_metadata` reports the x of the
 * > rotated rectangle's own corner rather than the left edge of the box it
 * > occupies, and the two differ by `height × sin θ`. Card by card that came to
 * > **22px** for eight of them, 19 for Morocco, 12 for Italy and Japan, and 0 for
 * > Switzerland and Norway — which is exactly the pattern of their rotations.
 * >
 * > Every centre here is the offset that minimises the pixel difference against
 * > a 1440×687 render of 1784:1916, searched ±30px. Fourteen of the sixteen land
 * > at **0,0** residual; the whole scene came from MAD 30.89 to **7.43**.
 * >
 * > Greece and New Zealand are the two that cannot be pinned this way — their
 * > drawn heights disagree with their photographs, see destinations.md — so
 * > theirs are the best alignment available for the shape they have.
 *
 * The alt text names the caption printed on the card rather than describing the
 * photograph, which is the one thing about these files that can be stated
 * without seeing them.
 */
const EGYPT = "/assets/egypt-assets";

/** Tight photograph — no polaroid margin in the new city files. */
const photoInk = (width: number, height: number): InkMetrics => ({
  box: 1,
  boxY: 1,
  fx: 0.5,
  fy: 0.5,
  ratio: width / height,
});

const INK_TALL = photoInk(736, 1307);
const INK_MID = photoInk(736, 1104);
const INK_FAYOUM = photoInk(736, 981);

/**
 * Ten Egyptian cities: five names in the left column, five in the right.
 */
const destinations: Destination[] = [
  {
    id: "siwa-oasis",
    name: "SIWA OASIS",
    card: {
      src: `${EGYPT}/siwa.jpg`,
      alt: "Siwa Oasis",
      cx: 900,
      cy: 250,
      width: 200,
      z: 7,
      ink: INK_TALL,
    },
  },
  {
    id: "cairo",
    name: "CAIRO",
    card: {
      src: `${EGYPT}/nile.jpg`,
      alt: "Cairo on the Nile",
      cx: 260,
      cy: 290,
      width: 200,
      z: 11,
      ink: INK_TALL,
    },
  },
  {
    id: "aswan",
    name: "ASWAN",
    card: {
      src: `${EGYPT}/aswan.jpg`,
      alt: "Aswan",
      cx: 470,
      cy: 200,
      width: 210,
      z: 15,
      ink: INK_MID,
    },
  },
  {
    id: "luxor",
    name: "LUXOR",
    card: {
      src: `${EGYPT}/luxor.jpg`,
      alt: "Luxor",
      cx: 500,
      cy: 500,
      width: 210,
      z: 16,
      ink: INK_MID,
    },
  },
  {
    id: "el-gouna",
    name: "EL GOUNA",
    card: {
      src: `${EGYPT}/gouna.jpg`,
      alt: "El Gouna",
      cx: 200,
      cy: 110,
      width: 205,
      z: 13,
      ink: INK_MID,
    },
  },
  {
    id: "dahab",
    name: "DAHAB",
    card: {
      src: `${EGYPT}/dahab.jpg`,
      alt: "Dahab",
      cx: 330,
      cy: 470,
      width: 195,
      z: 10,
      ink: INK_MID,
    },
  },
  {
    id: "al-fayoum",
    name: "AL FAYOUM",
    card: {
      src: `${EGYPT}/fayoum.jpg`,
      alt: "Al Fayoum",
      cx: 720,
      cy: 455,
      width: 205,
      z: 4,
      ink: INK_FAYOUM,
    },
  },
  {
    id: "hurghada",
    name: "HURGHADA",
    card: {
      src: `${EGYPT}/hurghada.jpg`,
      alt: "Hurghada",
      cx: 1140,
      cy: 490,
      width: 210,
      z: 1,
      ink: INK_MID,
    },
  },
  {
    id: "marsa-alam",
    name: "MARSA ALAM",
    card: {
      src: `${EGYPT}/marsa-alam.jpg`,
      alt: "Marsa Alam",
      cx: 1020,
      cy: 380,
      width: 195,
      z: 8,
      ink: INK_MID,
    },
  },
  {
    id: "sharm-el-sheikh",
    name: "SHARM EL SHEIKH",
    card: {
      src: `${EGYPT}/sharm.jpg`,
      alt: "Sharm El Sheikh",
      cx: 1220,
      cy: 160,
      width: 210,
      z: 14,
      ink: INK_MID,
    },
  },
];

export const destinationsContent: DestinationsContent = {
  // Two lines, italic leading capitals. Unchanged by the redraw.
  heading: [
    [{ text: "D", italic: true }, { text: "estinations" }],
    [
      { text: "W", italic: true },
      { text: "orth " },
      { text: "W", italic: true },
      { text: "andering" },
    ],
  ],

  // 01–05 fill the left column, 06–10 the right.
  countries: destinations,
  stickers: [],
};

/* ---------------------------------------------------------------------------
   BLOCK 3 — Philosophy (frames 1653:964 and 1653:1003)
   --------------------------------------------------------------------------- */

/**
 * The heading, segmented so the leading capital of every word takes the italic
 * cut: G, S, T, S, W, Y. Same alternation as the hero's display type, which is
 * why it reuses `SegmentedText` rather than growing its own renderer.
 */
const philosophyTitle: PhilosophyContent["title"] = [
  [
    { text: "G", italic: true },
    { text: "o " },
    { text: "S", italic: true },
    { text: "omewhere " },
    { text: "T", italic: true },
    { text: "hat " },
  ],
  [
    { text: "S", italic: true },
    { text: "tays " },
  ],
  [
    { text: "W", italic: true },
    { text: "ith " },
    { text: "Y", italic: true },
    { text: "ou" },
  ],
];

export const philosophyContent: PhilosophyContent = {
  title: philosophyTitle,

  asideLeft: ["Various activities and unforgettable destinations"],
  asideRight: [
    "The quiet mornings, the unexpected turns, ",
    "the places you almost didn't find.",
  ],

  signOff: ["Less ticking places off a list.", "More actually being there."],

  media: {
    backdrop: {
      src: "/assets/egypt-assets/egypt-wallpaper.jpg",
      alt: "Egypt landscape backdrop",
      width: 1200,
      height: 670,
    },
    collage: {
      src: "/assets/egypt-assets/egypt-card.jpg",
      alt: "Visit Egypt still",
      width: 736,
      height: 1104,
    },
  },
};

/* ---------------------------------------------------------------------------
   BLOCK 4 — How We Travel (frames 1678:1116, 1680:1248, 1680:1323,
   1686:1365, 1686:1393)
   --------------------------------------------------------------------------- */

/**
 * Each panel's heading, segmented so the leading capital of every word takes the
 * italic cut — S·G·T, R·T, H·S, L·E. Same alternation as the hero and block 3,
 * which is why they all reuse `SegmentedText`.
 *
 * `bodyWidth` is Figma's own measure for the body column, and it differs per
 * panel because each width is the one that breaks its sentence into the four
 * lines the file draws.
 */
export const travelContent: TravelContent = {
  // Node 1680:1329 — italic H, W, T.
  title: [
    { text: "V", italic: true },
    { text: "arious " },
    { text: "a", italic: true },
    { text: "ctivities" },
  ],

  // Node 1680:1334
  subtitle: "Different trips, same intention.",

  panels: [
    {
      id: "desert-glamping",
      title: [
        { text: "D", italic: true },
        { text: "esert " },
        { text: "G", italic: true },
        { text: "lamping" },
      ],
      body: "",
      signOff: "",
      bodyWidth: 390,
      media: {
        src: `${EGYPT}/glamping.jpg`,
        alt: "Desert glamping",
      },
    },
    {
      id: "ancient-history",
      title: [
        { text: "A", italic: true },
        { text: "ncient " },
        { text: "H", italic: true },
        { text: "istory" },
      ],
      body: "",
      signOff: "",
      bodyWidth: 420,
      media: {
        src: `${EGYPT}/musuem.jpg`,
        alt: "Ancient history",
      },
    },
    {
      id: "cultural-souvenirs",
      title: [
        { text: "C", italic: true },
        { text: "ultural " },
        { text: "S", italic: true },
        { text: "ouvenirs" },
      ],
      body: "",
      signOff: "",
      bodyWidth: 400,
      media: {
        src: `${EGYPT}/souvenirs.jpg`,
        alt: "Cultural souvenirs",
      },
    },
    {
      id: "red-sea",
      title: [
        { text: "C", italic: true },
        { text: "olourful " },
        { text: "e", italic: true },
        { text: "xperience in the " },
        { text: "R", italic: true },
        { text: "ed " },
        { text: "S", italic: true },
        { text: "ea" },
      ],
      body: "",
      signOff: "",
      bodyWidth: 490,
      media: {
        src: `${EGYPT}/red-sea.jpg`,
        alt: "Colourful experience in the Red Sea",
      },
    },
  ],
};

/* ---------------------------------------------------------------------------
   BLOCK 5 — Plan a Journey + footer (frame 1705:253)
   --------------------------------------------------------------------------- */

/** The asset folder, spelled the way it sits on disk — with the space. */
const BLOCK_5 = "/assets/Block 5";

export const planContent: PlanContent = {
  // Node 1705:258 — italic P and J, black rather than cream.
  title: [
    [
      { text: "W", italic: true },
      { text: "e " },
      { text: "w", italic: true },
      { text: "ill " },
      { text: "b", italic: true },
      { text: "e " },
      { text: "w", italic: true },
      { text: "aiting " },
      { text: "f", italic: true },
      { text: "or" },
    ],
    [
      { text: "y", italic: true },
      { text: "ou" },
    ],
  ],

  // Node 1705:263 / 1705:261 — both uppercased in CSS, not in the copy.
  note: [
    "Whatever you're",
    "dreaming of. Egypt",
    "has it.",
  ],
  noteAside: "",

  // Node 1705:270
  action: { label: "Start planning", href: "/plan" },

  footer: {
    // The hero's wordmark, same segmentation.
    wordmark: [
      { text: "V", italic: true },
      { text: "isit " },
      { text: "E", italic: true },
      { text: "gypt" },
    ],

    columns: [
      {
        title: "EXPERIENCES",
        links: [
          { label: "Adventure", href: "/experiences/adventure" },
          { label: "Nature", href: "/experiences/nature" },
          { label: "Culture", href: "/experiences/culture" },
          { label: "Slow Travel", href: "/experiences/slow-travel" },
        ],
      },
      {
        title: "COMPANY",
        links: [
          { label: "About Us", href: "/about" },
          { label: "Journal", href: "/journal" },
          { label: "Testimonials", href: "/testimonials" },
          { label: "Contact", href: "/contact" },
        ],
      },
    ],

    // Node 1705:299 / 1705:301
    newsletter: "Stories, guides & ideas for wherever you're headed next.",
    emailPlaceholder: "Your e-mail",
    emailAction: "Subscribe",

    // Nodes 1705:305 / 310 / 313 — Instagram, Facebook, YouTube, read off the
    // marks themselves. TODO: the account URLs are placeholders.
    social: [
      { src: `${BLOCK_5}/SocialMedia1.svg`, alt: "Visit Egypt on Instagram", href: "#" },
      { src: `${BLOCK_5}/SocialMedia2.svg`, alt: "Visit Egypt on Facebook", href: "#" },
      { src: `${BLOCK_5}/SocialMedia3.png`, alt: "Visit Egypt on YouTube", href: "#" },
    ],

    // Node 1705:274
    copyright: "© 2026 Visit Egypt. All rights reserved.",
  },

  media: {
    backdrop: {
      src: `${EGYPT}/wallpaper-2.jpg`,
      alt: "Egypt landscape",
    },
    far: {
      src: `${BLOCK_5}/03_mountains_midground 1.png`,
      alt: "A ridge of mountains behind low cloud",
    },
    steam: {
      src: `${BLOCK_5}/02_steam_screen_blend 1.png`,
      alt: "",
    },
    foreground: {
      src: `${BLOCK_5}/01_foreground 1.png`,
      alt: "",
    },
    note: {
      src: `${BLOCK_5}/Pin.png`,
      alt: "A handwritten note pinned to the view",
    },
    underlines: [
      { src: `${BLOCK_5}/Vector1.svg`, alt: "" },
      { src: `${BLOCK_5}/Vector2.svg`, alt: "" },
    ],
    arrow: { src: `${BLOCK_5}/Icon1.svg`, alt: "" },
  },
};
