# Contributing to kavynUI

Thanks for wanting to help. kavynUI is a library of animated React components and page sections, shipped as source through a shadcn registry. Contributions of every size are welcome: bug reports, fixes, docs, and new components.

This guide matches how the repo actually works. If something here is out of date, that's a bug too: open an issue or a PR.

## Ways to help

- **Report a bug.** A component that breaks in light mode, stutters, ignores reduced motion, or fails to install.
- **Fix something.** Small, focused PRs are the easiest to review and merge.
- **Add a component.** Please open an issue first describing the job it does (its `useCase`), so we can agree it fits before you build it.
- **Improve the docs.** The README, the docs site (`src/docs/`), or this file.

## Setup

You need **Node 22** (what CI runs) and npm.

```bash
git clone https://github.com/Aseel012/kavynui.git
cd kavynui
npm install
npm run dev
```

The site runs at the address Vite prints (usually `http://localhost:5173`).

A `.env` is optional for local work. To use one, copy `.env.example` to `.env`. Everything prefixed `VITE_` is bundled into browser code, so never put secrets there.

## Project layout

| Path | What lives there |
| --- | --- |
| `src/kavyn/` | The library. One file per component, plus shared helpers (`canvas-loop.js`, `shader-bg.tsx`, `share-sheet-qr.js`, `world-dots.js`) |
| `src/data/catalog.json` | Single source of truth for everything the site and registry show |
| `src/data/gradients.js` | CSS backgrounds and their CSS / Tailwind / React generators |
| `src/pages/`, `src/site/`, `src/docs/` | The documentation site |
| `scripts/` | Registry, SEO and static-page generators, scaffolding, verification, install/e2e/smoke tests |
| `tests/unit/` | Unit tests (Vitest) |
| `public/r/` | Generated registry. Don't edit by hand |

## Adding a component

### 1. Scaffold it

```bash
npm run new -- price-flip --family cards --use "Pricing card"   # TypeScript (default)
npm run new -- shader-mist --shader                             # a shader background
npm run new -- plain-thing --family buttons --js                # plain JSX
```

Optional: `--name "Display Name"` if the title-cased slug isn't right.

This writes `src/kavyn/<slug>.tsx` (or `.jsx`) from a template that already follows the house rules, and inserts a catalog entry next to the other components of the same family.

Valid families:

| `--family` | Shown as |
| --- | --- |
| `blocks` | Sections |
| `buttons` | Buttons |
| `forms` | Forms & inputs |
| `nav` | Navigation |
| `type` | Text |
| `cards` | Cards & layout |
| `proof` | Social proof |
| `interactive` | Interactive |
| `data` | Maps & data |
| `loaders` | Loaders |
| `scroll` | Scroll & cursor |
| `bg` | Backgrounds |

### 2. Build it

```bash
npm run dev
```

Open `/components/<slug>` and work on it there. Check it in both dark and light themes, on a narrow screen, and with reduced motion turned on.

### 3. Finish the catalog entry

The scaffold leaves TODOs in `src/data/catalog.json`. A finished entry looks like this:

```json
{
  "slug": "price-flip",
  "name": "Price Flip",
  "export": "PriceFlip",
  "family": "cards",
  "description": "Plan price that flips between monthly and yearly",
  "useCase": "Pricing card",
  "tags": ["new", "original"],
  "dependencies": ["motion", "react"],
  "lang": "tsx",
  "added": "2026-11-19"
}
```

| Field | Rule |
| --- | --- |
| `description` | One short line, no full stop. Required |
| `useCase` | The job it does, in one line of at most 90 characters. "Delete account", not "cool button". Required |
| `tags` | `original`, `new` (recently added), `featured` (shown in the home showcase) |
| `dependencies` | npm packages it imports. Only `react` and `motion` are allowed |
| `deps` | Shared helper files from `src/kavyn/` it needs, e.g. `["canvas-loop.js"]`. They are shipped with it |
| `kit` | Sections only: `{ "role": "Hero", "on": true }` adds it to the home page builder |
| `lang` | `tsx` for TypeScript files. Leave it out for `.jsx` |

The catalog entry drives everything else with no page code: the sidebar, search, the detail page and its Customize panel, the registry JSON, the static page and share image, the sitemap and `llms.txt`. The tests pick it up automatically too.

### 4. Registry entry

You never write registry JSON by hand. `scripts/gen-registry.mjs` builds `public/r/<slug>.json` and `public/r/registry.json` from the catalog and the source file:

```bash
npm run registry
```

Commit the regenerated files in `public/r/` together with your component. `npm run build` runs the generator too, and CI checks with `npm run registry:verify` that every item passes shadcn's schema and that its source is byte-identical to the file in `src/kavyn/`.

After merge, the component installs with:

```bash
npx shadcn@latest add @kavynui/<slug>
```

## Naming

- **Slug:** lowercase words joined by hyphens, named for what it is or does: `hold-to-confirm`, `breath-dots`, `shader-silk`. Must be unique. Shader backgrounds start with `shader-`.
- **File:** `src/kavyn/<slug>.tsx` (or `.jsx`). One component per file, default export.
- **Name:** Title Case of the slug unless `--name` says otherwise (`Hold To Confirm`).
- **Export:** PascalCase from the name (`HoldToConfirm`). Must be unique across the catalog.
- **Install path:** users get it at `components/kavyn/<slug>`, so the slug is also its public file name. Don't rename a published slug.

## House rules

These are enforced, mostly by tests:

- Theme tokens only. No hardcoded hex colors. Use the theme classes (`bg-bg`, `bg-panel`, `text-tx`, `text-mute`, `border-line` ...) or `var(--bg)`, `var(--panel)`, `var(--tx)`.
- Works in dark and light.
- Has a real `useCase`. "Looks cool" isn't one.
- `'use client'` on the first line, and nothing touches `window` or `document` while rendering (tested: every component is server-rendered).
- No requests to other servers: no remote images, fonts or APIs by default (tested). People paste these into sites with strict CSPs, and every remote asset leaks their visitors' IPs.
- No `innerHTML`, `eval` or `new Function` (tested). Links that open a new tab use `noopener`.
- Imports only from `react`, `motion` or files the registry ships (tested).
- Respects `prefers-reduced-motion`, and is reachable and usable by keyboard.
- Canvas and shader loops stop when off screen or when the tab is hidden.
- Site code loads no external images (the CSP is `img-src 'self'`). Put files in `public/`.

## Checks

Before opening a PR, run at least:

```bash
npm run lint        # unused code, hook rules
npm run typecheck   # the TypeScript components
npm run check       # catalog, stray files, CSP
npm test            # unit: catalog, server render, safety, playground, color audit, contrast
npm run build
```

CI runs the full suite on every pull request:

```bash
npm run build && npx vite preview --port 4173 &
npm run registry:verify   # every item against shadcn's schema, sources byte-identical
npm run test:install      # installs every component into a fresh TS app, type-checks, builds
JS=1 npm run test:install # same for a JavaScript app
npm run e2e               # real Chrome: page kit, search, theme, filters, uploads
node scripts/smoke.mjs    # every route, fails on any console error
```

Browser scripts use `CHROME=/path/to/chrome`. Run smoke with `LIGHT=1` or `MOBILE=1` for the other modes.

## Commits and pull requests

- Branch from `main` with a short descriptive name: `add-price-flip`, `fix-orbit-light-mode`.
- Keep one change per PR. A new component and an unrelated fix go in separate PRs.
- Write commit subjects in the imperative, short and specific: `Add price-flip card`, `Fix light mode in uptime-bars`.
- Fill in the PR template: the problem it solves, what changed, before/after screenshots (dark and light for anything visual), and the checklist.
- CI must be green before review.
- Don't commit `.env`, `dist/`, or delivery files (`.patch`, `.diff`, `.zip` and similar). `npm run check` fails on stray files in the repo root.

## Reporting a bug

Open an issue with:

- the component's slug (e.g. `liquid-button`)
- browser and OS
- theme (dark or light) and whether reduced motion is on
- how it was installed (shadcn CLI or copied from the site) and your React / Tailwind versions
- steps to reproduce, and a screenshot or recording if it's visual

## Code of conduct

Be respectful and constructive in issues, pull requests and discussions. Harassment or personal attacks aren't tolerated. This project follows the spirit of the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). To report a problem, email the maintainer at shaikhmdaseel@gmail.com.

## License

kavynUI is [MIT](LICENSE). By contributing, you agree that your contributions are released under the same license.
