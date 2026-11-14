# Changelog

## 2026-11 shaders, TypeScript, static pages

### Backgrounds
- All shader backgrounds rewritten on a new runner, `shader-bg.tsx` (replaces `gl-canvas.js`). They now render at device resolution (was 0.6x), dither their output so dark gradients do not band, and take their ink and paper from `--tx` and `--bg`, so each one works in light and dark mode and follows a theme switch.
- Seven new: **Silk**, **Liquid Chrome**, **Horizon**, **Light Rays**, **Strands**, **Dither Clouds**, **Warp**. Topo Lines and Halftone Tide moved from 2D canvas to shaders. 18 backgrounds, 101 components in total.
- **Breaking:** shader props are now `color`, `color2`, `speed`, `intensity`, `scale`, `interactive` (was `from` / `to`). Reinstall the file to get the new version.
- The backgrounds page shows the live shaders above the CSS gradients; three are in the home showcase.

### TypeScript
- The 14 shader backgrounds and their runner are `.tsx` with exported prop types. `npm run typecheck` checks them.
- TypeScript files ship in the registry as `registry:component`, which is the type the shadcn CLI strips types from for JavaScript projects: a `"tsx": false` project gets `.jsx`, a TypeScript project gets `.tsx`. Verified against the CLI in both modes.
- The catalog, registry generator, checks and tests accept `.jsx` or `.tsx` per component, so the rest can move one file at a time.

### Static pages and share images
- `scripts/prerender.mjs` runs after `vite build`: every route gets its own HTML file with its own title, description, canonical and Open Graph tags, plus a plain HTML version of the page (install command, usage, full source) for agents and crawlers that do not run JavaScript. React replaces it on load.
- Every component gets its own 1200x630 share image at `/og/<slug>.png`, generated at build time.
- The default meta description no longer describes the pre-redesign library.

### Works in your app, tested
- `npm run test:install` installs every component with the shadcn CLI into a fresh Vite + React 19 + Tailwind v4 app, then type-checks and builds it (TypeScript and JavaScript modes). Runs in CI.
- New unit tests over every catalog component: server render with default props, no requests to other servers, no `innerHTML`/`eval`, `noopener` on new-tab links, `'use client'` on line 1, only declared imports.
- **Fixed:** `dropzone` was missing `'use client'` and crashed in the Next.js app router.
- **Fixed:** `waitlist-form` loaded twelve default avatars from randomuser.me. Defaults are initials now; photos you pass must be https, a path on your site or a `data:image` URL.

### Customize panel
- Text fields are capped relative to their default (a `$` currency allows 8 characters, a label about 4x its length), so a preview cannot be pushed out of shape.
- **Fixed:** `pricing-morph` cards spilled out of their grid with a long currency; price, billing line and features now wrap. `product-hero` and `globe-cta` headlines wrap long unbroken words. The sections preview frame clips its content.
- Component pages have a Customize panel built from the component's own props: sliders, toggles, text and colour pickers. The preview updates live and the Usage code contains exactly the props you set.

### For contributors
- `npm run new -- <slug> --family <id>` scaffolds a component (TypeScript by default, `--js`, `--shader`) and its catalog entry. Everything else, tests included, picks it up from the catalog.
- `npm run clip -- <slug>` records a post-ready MP4 (and optional WebP) of any component's preview.
- README hero animation, sponsors section, tested house rules. Launch drafts in `docs/launch-kit.md`.

### Site
- Layout: the header is solid and full width; the catalog sidebar is pinned to the left edge with its own scroll and keeps the current page's link in view. Before, the half-transparent header showed content through it and the footer pushed the sidebar up near the bottom of long pages.
- The footer is on the home page only.
- Removed the "Registry JSON" button from component pages. The JSON files are still served at `/r/<slug>.json` for the shadcn CLI and coding agents; people use the install command or the Code tab.
- Sponsor wall on the home page: six tiles driven by `src/data/sponsors.json`. Empty tiles open a pre-filled email to shaikhmdaseel@gmail.com (or `VITE_SPONSOR_URL` if set).
- Copy buttons report which component or command was copied (`src/lib/track.js`). Set `VITE_POSTHOG_KEY` to record them on the free tier.

## 2026-11 home page

- Rebuilt the home page centered: new headline, a "New" pill and install command for the latest component, then live components straight away in a tabbed showcase.
- Removed the "Everything, by job" list.
- The home page is now driven entirely by `catalog.json` (`featured`, `new` + `added`, `kit`); see "Adding a component" in the README.
- Avatar Upload demo photo is `public/avatars/pfp.jpg` (an original 512px monochrome image): replace that file to change it.
- The hero shows one site-wide command, `npx shadcn@latest registry add @kavynui=…`, instead of a single component's; the closing section covers connecting a coding agent (`npx shadcn@latest mcp init`). No command appears twice.
- Agents: the site now publishes `/r/registry.json`, the index shadcn search and its MCP server read. Before this, agents could install a component by name but could not discover any.
- Catalog sidebar: group counts sit at the right edge in the same font as the group name.
- Catalog tiles keep the full component name visible; the use case truncates instead.

## 2026-11 redesign

### Design
- Monochrome theme in iOS system grays: true black / white backgrounds, no blue, no orange. New `--acc-fg` token (text on the accent), so 10 tokens.
- SF Pro on Apple devices, Inter elsewhere (replaces Geist sans). Rounded, continuous-feeling corners throughout.
- New home page: live component mosaic, **Assemble a page** (toggle sections, see them stack, copy one install command and `page.jsx`), category index, backgrounds strip, agent endpoints.
- Wider layouts (1600px), 21st.dev-style catalog tiles, iOS segmented controls. Navbar layout unchanged.
- 16 new CSS backgrounds, each named for a use case (Copper Dusk for fintech, Saffron Sweep for food apps, and so on).

### Components
- Curated from 140 to 94, regrouped by what you build: Sections, Buttons, Forms & inputs, Navigation, Text, Cards & layout, Social proof, Interactive, Maps & data, Loaders, Scroll & cursor, Backgrounds.
- New: **Avatar Upload** (profile photo with crop preview, progress ring, replace/remove, errors).
- Dropzone: spring-smooth progress, animated bar collapse, sizes in KB under 1 MB (was "0.0 of 0.0 MB").
- Canvas components (traffic map, globe, halftone, topo lines, share sheet) read the theme from the `--bg` token, so they draw correctly in a standard shadcn project (`.dark` class). Previously they drew white on white in light mode once installed.
- Removed (47): split-flap-button, stamp-button, fuse-button, shutter-button, pixel-melt-button, ink-write, redact-reveal, kerning-breath, echo-headline, scan-line-text, dial-text, swarm-words, deck-shuffle, vinyl-deck, globe-pins, palette-fan, route-draw, polaroid-drop, waveform-scrubber, paper-fold-reveal, apple-keyboard, turntable-viewer, cube-metrics, paper-plane-path, server-rack, swipe-stack, ring-carousel, kanban-flow, ticker-tape, footnote-pop, badge-rain, ribbon-rows, reaction-burst, block-builder, hourglass-flip, night-transit, rain-glass, dune-ridges, tile-flip-wall, shader-molten, depth-story, tether-tag, cloth-banner, jelly-grid, toss-deck, iron-filings, comet-trail. Their registry URLs now 404.

### Agents
- `llms.txt` / `llms-full.txt` grouped by family with an install command per component.
- Copy for AI on every component page; Registry JSON link.

### Fixes
- Props of the form `onX` are typed as functions in docs and AI specs.
- Home stage could show one block under another block's caption.
- Mobile home page rendered 465px wide on a 390px screen.
- Static backgrounds emitted a pointless reduced-motion rule.
- Dead code removed (unused exports, a stale migration script that would have corrupted the catalog).

### Tooling
- ESLint, Vitest unit tests (43), Puppeteer end-to-end tests (16), offline registry validation with shadcn's own schema, all wired into CI.
