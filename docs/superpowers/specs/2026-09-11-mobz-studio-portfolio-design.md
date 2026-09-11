# Mobz Studio portfolio — design

## Background

The workspace holds a studio landing (`mobz-studio`, formerly `creative-director`), a standalone Three.js Mirror Hall (`projects/mirror-hall.html`), and four separate Next.js project apps (`egypt`, `sodic`, `clothing`, `drape`). This spec is the first implementation slice: one Next.js 16 app that is the public portfolio, with Mirror Hall as the Work section and the four projects as real same-origin routes.

## Goal

Ship **Mobz Studio** at `/` with the existing landing chrome (hero, features, carousel, contact, bottom nav), replace the two glass portfolio cards with Mirror Hall as-is, and let a visitor click a live hall card, fly the camera through it, and land on that project unchanged.

## Decisions (locked)

- Single Next.js 16 app in `mobz-studio` (not four servers, not iframes).
- Landing name: **Mobz Studio**. Full chrome rebrand (hero title, nav logo, document title, contact placeholders).
- Mirror Hall **replaces** the “Crafting Digital Experiences” two-card block. Features, carousel, contact, and bottom nav stay.
- **Work** in the bottom nav scrolls to Mirror Hall (not the case-studies carousel).
- Eight-card ring: four live (Egypt, Sodic, Clothing, Drape) + four **Coming soon** (leftover demo art). Coming soon: hover only, click ignored.
- Live card art: screenshots / hero stills from each project, labeled with those names.
- Click live card: ~1–1.5s camera fly-through, then `router.push`. Back returns to `/` with the hall in view.
- Drape mounts in full under `/drape/*` (home, auth, dashboard, generate, results, APIs).
- Mirror Hall is a vanilla Three.js port wrapped in a React client component, not a React Three Fiber rewrite. Production build drops the HTML CONFIG debug panel.

## In scope

- Rebrand landing copy/metadata to Mobz Studio
- Port Mirror Hall into a full-viewport scroll section under the hero
- Project card config, stills, fly-through, navigation, Work anchor
- Port Egypt, Sodic, Clothing homes to `/egypt`, `/sodic`, `/clothing` with isolated layouts
- Nest Drape under `/drape` including nested pages, middleware, and APIs
- Hidden DOM fallback links for the four live projects
- `prefers-reduced-motion`: skip dolly, navigate immediately
- Pause hall WebGL when the section is off-screen

## Out of scope

- Rewriting Egypt / Sodic / Clothing / Drape internals except prefix, layout isolation, and colliding API paths
- Updating the dummy case-studies carousel titles/images
- New project case-study pages or a `/coming-soon` route
- React Three Fiber rewrite, Spline, or redesign of Mirror Hall
- Deploy/hosting setup, custom domains
- Committing secrets or Drape `.env` values

## Architecture

One Next.js App Router app (TypeScript, Tailwind 4) at `mobz-studio`. Three.js is added as a dependency and driven from a client section that mounts the existing scene graph.

Source folders `egypt`, `sodic`, `clothing`, `drape`, and `projects` remain the originals on disk. Implementation **copies/ports** into `mobz-studio`; it does not run those apps as separate `next dev` processes.

### Routes

| Path | Source | Chrome |
|------|--------|--------|
| `/` | Studio `HomeView` | Studio (preloader, lava, grain, bottom nav) |
| `/egypt` | Egypt home | Egypt layout only |
| `/sodic` | Sodic home | Sodic layout only |
| `/clothing` | Clothing home | Clothing layout only |
| `/drape` | Drape marketing home | Drape layout only |
| `/drape/sign-in`, `/drape/sign-up`, `/drape/dashboard`, `/drape/generate`, `/drape/results`, `/drape/results/[id]`, `/drape/pricing`, `/drape/invoice`, `/drape/terms`, `/drape/privacy` | Drape pages | Drape layout only |
| `/api/generate`, `/api/generations`, `/api/me`, `/api/billing/*`, `/api/auth/*` (Drape) | Unchanged Drape API paths when they do not collide with studio | n/a |
| `/api/contact` | Studio contact only | n/a |

Egypt / Sodic / Clothing each currently expose `/api/contact`. Do not copy those files over the studio route; omit them or place unused copies under `/api/egypt/contact` (etc.). Drape page links and middleware must use `/drape/sign-in` (not `/sign-in`). Drape `fetch('/api/...')` stays at root so the existing client keeps working.

Unknown paths use the existing studio 404.

### Landing section order

1. Preloader
2. Hero (`Mobz Studio`)
3. Mirror Hall (`id="work"`) — Work nav target
4. Features (`id="services"`)
5. Case-studies carousel (`id="cases"` — no longer `portfolio`)
6. Contact (`id="contact"`)
7. Bottom nav

Lava + grain remain behind sections 4–6. Hall is its own dark WebGL viewport between hero and lava content; a short seam (existing hero bottom gradient / background) is enough. Do not paint studio lava through the hall canvas.

### Navigation

Bottom nav **Work** `href` / `scrollTo` target is `work`. **Services** → `services`. **About** / CTA → `contact`. After Back from a project, home mounts and scrolls to `#work` (via hash `/#work` or a `?from=work` flag applied once).

### Components (studio)

| Unit | Responsibility | Depends on |
|------|----------------|------------|
| `HomeView` | Compose landing; swap portfolio block for hall | Section views, mocks |
| `MirrorHall` | Three.js scene, drag, hover, pause off-screen, fly-through | `projects` config, Three.js, Next router |
| `projects` config | Eight slots: image, title, `href` or `comingSoon: true` | Public stills |
| `home.ts` mocks | Rebranded copy; Work link target | Bottom nav, hero, contact |
| Project `layout.tsx` files | Isolate CSS/fonts; no studio nav/lava | Per-project globals |

`MirrorHall` is the only WebGL owner. Home does not import project page components.

### Mirror Hall behaviour

- Port `projects/mirror-hall.html` (Three.js r143-era scene: ring, water reflection, grass, CSS3D labels, bloom/composer as in source). Assets from `projects/assets/`.
- Section height: one viewport (`h-lvh`). Not `position: fixed` over the whole page.
- Strip the CONFIG GUI for production.
- Eight meshes. Live four: stills + titles Egypt, Sodic, Clothing, Drape; `userData.href` set. Coming soon four: original leftover webps; label **Coming soon**; no `href`.
- Drag / inertia / hover scale: unchanged. Raycast click on a live card that was not a drag: lock pointer, tween camera through that card (~1–1.5s), then `router.push(href)`.
- Click coming soon: no-op (hover still allowed).
- `prefers-reduced-motion: reduce`: no tween; `router.push` immediately on live click.
- Off-screen: pause rAF / renderer (match hero video pause).
- Accessibility: visually hidden (or visually quiet) list of four `Link`s to live projects so the work is reachable without the canvas.

### Project stills

Capture a hero-frame still from each of Egypt, Sodic, Clothing, Drape during implementation. Store under `mobz-studio/public/assets/work/`. Coming-soon cards keep `projects/assets/mirror-hall/*.webp` files that are not used by the live four.

### Drape nest

Copy Drape’s `app/` tree under `src/app/drape/` (or equivalent). Update internal `Link`/`redirect`/`middleware` paths with a `/drape` prefix. Merge Drape dependencies into `mobz-studio/package.json`. Env vars stay in `.env.local` (Supabase keys, etc.). Drape CSS/fonts load only from the Drape layout.

### CSS isolation

Studio `globals.css` must not wrap project routes. Use separate root layouts: route group `(studio)` for `/` vs ungrouped project segments with their own `layout.tsx` importing that project’s styles. If a single root `layout.tsx` remains, it must be a passthrough (no studio body classes that break Drape).

## Visual / copy

- Hero H1: **Mobz Studio**
- Nav logo: **MOBZ** (short mark in the island)
- Document title / metadata: Mobz Studio
- Contact email placeholder: a Mobz Studio address (e.g. `hello@mobz.studio` as copy only; no mail server required)
- Hall HUD: keep the Mirror Hall overlay as in the source (masthead, focus caption, vignette). Change card titles/stills only. Home document title is Mobz Studio, not “Section · Mirror Hall”.

## Error handling

- Coming soon click: ignore
- Fly-through interrupted (unmount): do not navigate
- `router.push` failure: stay on home, unlock input
- Missing card texture: Three.js default; card still labels correctly
- Drape auth/API errors: unchanged Drape behaviour

## Testing

- Home: hall is the first section under the hero; two glass cards gone
- Work nav scrolls to hall; Services/Contact unchanged
- Four live labels + four Coming soon
- Coming soon click does not change route
- Live click (with motion) flies then opens the matching path
- Reduced-motion: live click navigates with no dolly
- Back from `/egypt` (etc.) returns home with hall in view
- `/drape/sign-in` (and at least one gated Drape page) render without studio nav
- `/egypt`, `/sodic`, `/clothing` render without studio nav
- `next build` succeeds

## File touch map (expected)

- `src/views/home.tsx` — mount hall, drop `PortfolioSection`
- `src/views/home/mirror-hall/` — ported scene
- `src/data/mocks/home.ts` — rebrand + nav ids
- `src/views/home/carousel-section.tsx` — `id="cases"`
- `src/app/(studio)/page.tsx` or existing `src/app/page.tsx` — landing
- `src/app/egypt/`, `sodic/`, `clothing/`, `drape/` — ported trees
- `public/assets/work/` — live stills
- `package.json` — `three`, Drape deps
