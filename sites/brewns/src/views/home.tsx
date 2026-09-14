/**
 * Home view — a Server Component that assembles the page's sections.
 *
 * Content comes in as data (src/data/mocks/home.ts) until a CMS exists; the
 * sections themselves are client leaves, so this view stays a Server Component.
 * The top bar is not here — it is one fixed `<SiteHeader>` in the root layout.
 */
import { Hero } from "@brewns/components/hero";
import { Locations } from "@brewns/components/locations";
import { Menu } from "@brewns/components/menu";
import { Order } from "@brewns/components/order";
import { Philosophy } from "@brewns/components/philosophy";
import {
  heroContent,
  locationsContent,
  menuContent,
  orderContent,
  philosophyContent,
} from "@brewns/data/mocks/home";

export const HomeView = () => {
  return (
    <main>
      <Hero {...heroContent} />
      <Menu {...menuContent} />
      <Locations {...locationsContent} />
      <Philosophy {...philosophyContent} />
      <Order {...orderContent} />
    </main>
  );
};
