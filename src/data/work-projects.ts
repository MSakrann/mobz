export type WorkCard = {
  id: string;
  title: string;
  img: string;
  href?: `/${string}`;
  comingSoon?: boolean;
};

export const WORK_CARDS: WorkCard[] = [
  {
    id: "egypt",
    title: "Egypt",
    img: "/assets/work/egypt.jpg",
    href: "/egypt",
  },
  {
    id: "sodic",
    title: "Sodic",
    img: "/assets/work/sodic.jpg",
    href: "/sodic",
  },
  {
    id: "clothing",
    title: "Clothing",
    img: "/assets/work/clothing.jpg",
    href: "/clothing",
  },
  {
    id: "drape",
    title: "Drape",
    img: "/assets/work/drape.jpg",
    href: "/drape",
  },
  {
    id: "house",
    title: "House",
    img: "/assets/work/house.jpg",
    href: "/house",
  },
  {
    id: "brewns",
    title: "Brewns",
    img: "/assets/work/brewns.jpg",
    href: "/brewns",
  },
  {
    id: "soon-3",
    title: "Coming soon",
    img: "/assets/mirror-hall/tide-pool.webp",
    comingSoon: true,
  },
  {
    id: "soon-4",
    title: "Coming soon",
    img: "/assets/mirror-hall/amber-flux.webp",
    comingSoon: true,
  },
];

export const LIVE_WORK_CARDS = WORK_CARDS.filter((card) => !card.comingSoon);
