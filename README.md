# kavynUI

```bash
npx shadcn@latest add https://kavynui.com/r/liquid-button.json
```

138 React components, blocks and backgrounds. Choose a component at [kavynui.com](https://kavynui.com), then copy its install command. Requires React and a shadcn-initialized Tailwind v4 project. Source files, local helpers, npm dependencies and theme tokens are installed together.

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

The build regenerates `public/r/*.json` from `src/data/catalog.json` and transitive imports in `src/kavyn`. The registry index is `/r/index.json`. MIT licensed; retain included copyright notices.
