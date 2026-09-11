# Mobz Studio Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** One Next.js 16 app in `mobz-studio` branded Mobz Studio, with Mirror Hall as Work under the hero and Egypt, Sodic, Clothing, and Drape as real same-origin routes.

**Architecture:** Split the App Router into a minimal root layout plus `(studio)` vs per-project nested layouts. Port Mirror Hall as vanilla Three.js mounted from a client section. Copy the four project trees into `sites/*` with aliased imports (`@egypt/*`, `@sodic/*`, `@clothing/*`, `@drape/*`) so they do not overwrite studio `@/*`. After a live-card fly-through, hard-navigate (`window.location.assign`) so project CSS does not leak.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind 4, Three.js, Lenis (studio only), Drape Supabase deps.

## Global Constraints

- Landing chrome: hero title **Mobz Studio**, nav logo **MOBZ**, document/metadata **Mobz Studio**, contact email copy `hello@mobz.studio`.
- Mirror Hall replaces `PortfolioSection`; features, carousel, contact, bottom nav stay.
- Work nav target is `id="work"` on Mirror Hall; carousel id becomes `cases`.
- Eight cards: Egypt, Sodic, Clothing, Drape (live) + four Coming soon (demo webps). Coming soon: hover only, no click.
- Live art: project hero stills. Coming soon: leftover `projects/assets/mirror-hall/*.webp`.
- Fly-through ~1–1.5s then navigate; `prefers-reduced-motion` skips dolly.
- Drape pages under `/drape/*`; Drape APIs stay at unique `/api/*` paths; gated redirects use `/drape/sign-in`.
- Do not copy Egypt/Sodic/Clothing `/api/contact` over studio `/api/contact`.
- No CONFIG debug panel. Pause WebGL off-screen.
- Do not commit `.env` secrets. Skip git commits unless the user asks.

---

## File map

- Create: `src/data/work-projects.ts` — eight card slots
- Create: `src/views/home/mirror-hall/mirror-hall.tsx` — section + HUD + a11y links
- Create: `src/views/home/mirror-hall/mirror-hall.css` — HUD / canvas / labels (from HTML, no `#ui`)
- Create: `src/views/home/mirror-hall/mount-hall.ts` — Three.js port
- Create: `src/app/(studio)/layout.tsx`, `src/app/(studio)/page.tsx` — move studio chrome here
- Modify: `src/app/layout.tsx` — html/body passthrough only
- Modify: `src/views/home.tsx` — hall instead of portfolio; hall outside lava wrapper
- Modify: `src/data/mocks/home.ts`, `src/lib/site.ts`, `src/views/home/carousel-section.tsx`
- Create: `src/app/egypt/`, `sodic/`, `clothing/`, `drape/` nested layouts + pages
- Create: `sites/egypt`, `sites/sodic`, `sites/clothing`, `sites/drape` — copied sources
- Modify: `tsconfig.json` paths, `package.json` deps, `middleware.ts`
- Copy: stills + hall webps into `public/assets/work/` and `public/assets/mirror-hall/`

---

### Task 1: Work card config

**Files:**
- Create: `mobz-studio/src/data/work-projects.ts`
- Copy stills into `mobz-studio/public/assets/work/` and demo webps into `mobz-studio/public/assets/mirror-hall/`

**Interfaces:**
- Produces: `WorkCard` (`id`, `title`, `img`, `href?: string`, `comingSoon?: boolean`), `WORK_CARDS: WorkCard[]` length 8

- [ ] **Step 1:** Copy assets

```bash
mkdir -p public/assets/work public/assets/mirror-hall
cp ../projects/assets/mirror-hall/*.webp public/assets/mirror-hall/
cp ../egypt/public/assets/hero/hero-final-frame.jpg public/assets/work/egypt.jpg
cp ../sodic/public/assets/Hero/hero.png public/assets/work/sodic.png
cp ../clothing/public/open-graph.png public/assets/work/clothing.png
cp ../drape/public/samples/drape-1.jpg public/assets/work/drape.jpg
```

Live stills: Egypt `hero-final-frame.jpg`, Sodic `Hero/hero.png`, Clothing `open-graph.png`, Drape `samples/drape-1.jpg`. Coming soon webps: copper-vein, solar-tide, molten-drift, silver-storm unused by live slots (live uses project stills; coming soon uses ink-bloom, gilded-smoke, tide-pool, amber-flux).

- [ ] **Step 2:** Add `src/data/work-projects.ts` with four live cards then four coming soon.

```ts
export type WorkCard = {
  id: string;
  title: string;
  img: string;
  href?: `/${string}`;
  comingSoon?: boolean;
};

export const WORK_CARDS: WorkCard[] = [
  { id: "egypt", title: "Egypt", img: "/assets/work/egypt.jpg", href: "/egypt" },
  { id: "sodic", title: "Sodic", img: "/assets/work/sodic.png", href: "/sodic" },
  { id: "clothing", title: "Clothing", img: "/assets/work/clothing.png", href: "/clothing" },
  { id: "drape", title: "Drape", img: "/assets/work/drape.jpg", href: "/drape" },
  { id: "soon-1", title: "Coming soon", img: "/assets/mirror-hall/ink-bloom.webp", comingSoon: true },
  { id: "soon-2", title: "Coming soon", img: "/assets/mirror-hall/gilded-smoke.webp", comingSoon: true },
  { id: "soon-3", title: "Coming soon", img: "/assets/mirror-hall/tide-pool.webp", comingSoon: true },
  { id: "soon-4", title: "Coming soon", img: "/assets/mirror-hall/amber-flux.webp", comingSoon: true },
];

export const LIVE_WORK_CARDS = WORK_CARDS.filter((c) => !c.comingSoon);
```

- [ ] **Step 3:** Confirm eight entries, exactly four with `href`, four with `comingSoon: true`.

---

### Task 2: Rebrand landing + Work anchor + layout split

**Files:**
- Modify: `src/lib/site.ts`, `src/data/mocks/home.ts`, `src/views/home/carousel-section.tsx`
- Create: `src/app/(studio)/layout.tsx`, `src/app/(studio)/page.tsx`
- Modify: `src/app/layout.tsx`, `src/app/page.tsx` (delete after move)
- Modify: `src/views/home.tsx` (hall mount in Task 4; this task only drops portfolio import if hall not ready — keep structure ready)

**Interfaces:**
- Consumes: existing `navContent.links`
- Produces: Work `href: "work"`; carousel `id="cases"`; root layout without studio fonts/scroll

- [ ] **Step 1:** `siteConfig.name` / description / author / twitter → Mobz Studio.

- [ ] **Step 2:** `heroContent.title = "Mobz Studio"`; `navContent.logo = "MOBZ"`; Work link `href: "work"`; `contactContent.email` → `hello@mobz.studio`.

- [ ] **Step 3:** Carousel section `id="cases"`.

- [ ] **Step 4:** Move current root layout body (fonts, ScrollLayout, cookies, grid, structured data, globals.css) into `src/app/(studio)/layout.tsx`. Root `layout.tsx` is:

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
```

Move `src/app/page.tsx` to `src/app/(studio)/page.tsx`.

---

### Task 3: Port Mirror Hall (Three.js)

**Files:**
- Create: `src/views/home/mirror-hall/mount-hall.ts`
- Create: `src/views/home/mirror-hall/mirror-hall.css`
- Create: `src/views/home/mirror-hall/mirror-hall.tsx`
- Create: `src/views/home/mirror-hall/index.ts`
- Modify: `package.json` — add `three` and `@types/three` (same major as clothing: `^0.185.1`)

**Interfaces:**
- Consumes: `WORK_CARDS`
- Produces: `mountMirrorHall(el: HTMLElement, opts: { cards: WorkCard[]; onNavigate: (href: string) => void; reducedMotion: boolean }): () => void`

Port from `projects/mirror-hall.html`: scene, sky, stars, curved cards, CSS3D labels, water reflection, drag/inertia/hover. Skip CONFIG panel. Skip grass (`grassCount` is 0). Bloom is 0 — `renderer.render(scene, camera)` instead of EffectComposer.

Use `WebGLRenderer` (not WebGL1). `texture.colorSpace = THREE.SRGBColorSpace`. Size from the container (`clientWidth/Height` + ResizeObserver), not `window`.

Click: if pointer movement since down is under 6px and card has `href`, lock input, tween camera through the card world position (1.2s, ease-in), then `onNavigate(href)`. Coming soon: no navigate. Reduced motion: navigate immediately.

Pause rAF when `IntersectionObserver` says the section is off-screen.

HUD markup from the HTML (mast, focus, dots, hint, vignette, frame) with class `-ready` / `-nudged` on the section, not `document.body`.

Visually hidden list of `LIVE_WORK_CARDS` links in the React tree.

- [ ] **Step 1:** `npm install three@^0.185.1` and `@types/three`.

- [ ] **Step 2:** Implement `mount-hall.ts` from the HTML script (P defaults copied verbatim).

- [ ] **Step 3:** CSS from HTML (canvas, labels, HUD); scope under `.mirror-hall`.

- [ ] **Step 4:** `MirrorHall` client component: `id="work"`, `h-lvh`, dynamic mount `ssr: false` via useEffect calling `mountMirrorHall`.

---

### Task 4: Wire hall into HomeView

**Files:**
- Modify: `src/views/home.tsx`

Hall sits **between** `HeroSection` and the lava content wrapper. Remove `PortfolioSection`. Keep lava gradient for features/carousel, not over the hall.

```tsx
<HeroSection content={heroContent} />
<MirrorHall />
<div className="relative w-full overflow-clip bg-background">
  <LavaBackground />
  ...
  <FeaturesSection />
  <CarouselSection />
  <ContactSection />
</div>
```

On mount, if `window.location.hash === "#work"` or `searchParams` `from=work`, `scrollTo("work")`.

Fly-through `onNavigate`: `window.location.assign(href)` (full load for CSS isolation).

- [ ] **Step 1:** Swap sections as above.
- [ ] **Step 2:** Hash scroll after preloader if needed.

---

### Task 5: Port Egypt, Sodic, Clothing

**Files:**
- Create: `sites/egypt`, `sites/sodic`, `sites/clothing` (copy `src/` + fonts + needed public)
- Modify: `tsconfig.json` paths `@egypt/*`, `@sodic/*`, `@clothing/*`
- Create: `src/app/egypt/layout.tsx`, `page.tsx` (same for sodic, clothing)
- Merge public assets into `public/` avoiding collisions (`/assets/home` stays studio)

For each site:

```bash
rsync -a --exclude node_modules --exclude .next ../egypt/src/ sites/egypt/src/
# rewrite imports
find sites/egypt/src -name '*.ts' -o -name '*.tsx' | xargs sed -i '' 's|from "@/|from "@egypt/|g; s|from '\''@/|from '\''@egypt/|g'
```

Nested layout: no `<html>`/`<body>`. Import that site’s `globals.css`, fonts on a wrapper `div`, `ScrollLayout` + site `HomeView`. Do not import studio cookies/grid if the site has its own.

`src/app/egypt/page.tsx`:

```tsx
import { HomeView } from "@egypt/views/home";
export default function EgyptPage() { return <HomeView />; }
```

Do **not** copy `app/api/contact/route.ts` into `src/app/api/contact`.

- [ ] **Step 1:** Copy + alias rewrite Egypt.
- [ ] **Step 2:** Copy + alias rewrite Sodic.
- [ ] **Step 3:** Copy + alias rewrite Clothing.
- [ ] **Step 4:** Nested layouts/pages. Merge `public/` assets (egypt Block*, sodic Hero, clothing assets).

---

### Task 6: Nest Drape under `/drape`

**Files:**
- Create: `sites/drape` (copy app, components, lib, fonts, public samples, supabase not required at runtime beyond env)
- Paths: `@drape/*` → `sites/drape/*`
- Create: `src/app/drape/**` re-exporting pages (or `src/app/drape/[[...]]` not — explicit pages)
- Move Drape API routes to `src/app/api/**` only if those filenames do not exist (generate, generations, me, billing, auth)
- Create: `middleware.ts` wrapping Drape session **only** when `pathname.startsWith("/drape")` or Drape API paths
- Prefix Drape `Link` hrefs and middleware `GATED_PATHS` / `AUTH_PATHS` with `/drape`

`sites/drape/lib/supabase/middleware.ts`:

```ts
const GATED_PATHS = ["/drape/dashboard", "/drape/generate", "/drape/results"];
const AUTH_PATHS = ["/drape/sign-in", "/drape/sign-up"];
// redirects to /drape/sign-in and /drape/dashboard
```

Header/footer `href="/pricing"` → `/drape/pricing`, etc.

`src/app/drape/page.tsx`: redirect to `/drape/pricing` (Drape has no `app/page.tsx` today).

Merge Drape `package.json` deps into studio (`@supabase/ssr`, `@supabase/supabase-js`, `@imgly/background-removal`, `sharp`).

Copy `drape/public/*` into studio `public/` (samples, favicon.svg, fonts if referenced as `/fonts`).

- [ ] **Step 1:** Copy tree, add `@drape/*`, rewrite `@/` → `@drape/`.
- [ ] **Step 2:** Prefix internal routes.
- [ ] **Step 3:** Wire `src/app/drape/...` pages and API routes.
- [ ] **Step 4:** Studio `middleware.ts` delegates to Drape `updateSession` for `/drape` and Drape `/api` paths only.

---

### Task 7: Verify

- [ ] `npm run build` in `mobz-studio` succeeds.
- [ ] Browser: home hall under hero; Work scrolls to hall; four live + four coming soon; coming soon click stays; live click flies then opens project; project pages have no studio bottom nav; `/drape/pricing` loads.

---

## Spec coverage

| Spec item | Task |
|-----------|------|
| Mobz Studio rebrand | 2 |
| Hall replaces two cards | 4 |
| Work → hall | 2, 4 |
| Eight cards / coming soon no-op | 1, 3 |
| Fly-through then navigate | 3, 4 |
| Reduced motion | 3 |
| Pause off-screen | 3 |
| DOM fallback links | 3 |
| Egypt/Sodic/Clothing routes | 5 |
| Drape nested + APIs | 6 |
| No contact API clobber | 5 |
| Build | 7 |
