# kavynUI

```bash
npx shadcn@latest add https://kavynui.com/r/liquid-button.json
```

94 animated React components and page sections, monochrome in iOS system grays. Choose a component at [kavynui.com](https://kavynui.com), then copy its install command. Requires React and a shadcn-initialized Tailwind v4 project. Source files, local helpers, npm dependencies and theme tokens are installed together.

For shorter commands, merge this into `components.json`:

```json
"registries": { "@kavynui": "https://kavynui.com/r/{name}.json" }
```

```bash
npx shadcn@latest add @kavynui/share-sheet
```

Files go into your configured components folder under `kavyn/`. Import the default export, for example `import LiquidButton from '@/components/kavyn/liquid-button'`. Use your project's configured import alias. Theme tokens follow `.dark` and also support `.light`.

## Develop

```bash
npm install
npm run dev
npm run build
```

## Test

```bash
npm run lint             # unused code, hook rules
npm test                 # unit: catalog, search, color audit, contrast, backgrounds, upload components
npx vite preview --port 4173 &
npm run registry:verify  # every item against shadcn's own schema, sources byte-identical
npm run e2e              # real Chrome: page kit, search, theme, filters, uploads, links, mobile overflow
node scripts/smoke.mjs   # every route, fails on any console error (LIGHT=1 / MOBILE=1 for other modes)
```

Browser scripts use `CHROME=/path/to/chrome` (defaults to `/usr/bin/google-chrome`).

The build regenerates `public/r/*.json` from `src/data/catalog.json` and transitive imports in `src/kavyn`. The registry index is `/r/index.json`. MIT licensed; retain included copyright notices.
