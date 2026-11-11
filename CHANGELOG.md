# Changelog

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
