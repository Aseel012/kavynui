# kavynUI

Open-source motion components, page blocks, maps and gradient backgrounds for React.
Built with React 19, Tailwind CSS v4, Motion, React Router and Vite.

## Run it

```bash
npm install
cp .env.example .env
npm run dev          # http://localhost:5173
npm run build        # sitemap + robots, usage scan, production build to dist/
```

## Project layout

| Path | What |
|------|------|
| `src/kavyn/` | Components and blocks, one file each (`world-dots.js` is shared map data) |
| `src/data/catalog.json` | Catalog: every sidebar entry, card and detail page comes from here |
| `src/data/gradients.js` | Gradient backgrounds + CSS / Tailwind / React code generators |
| `src/docs/` | Docs pages and live docs widgets |
| `src/pages/` | Home, Components, Detail, Blocks, Backgrounds, Docs, Blog, Info (About, Privacy, Terms) |
| `src/site/` | Layout, catalog sidebar, previews, code blocks, error boundary, network status |
| `src/lib/` | Catalog search, lazy loading with retry, SEO helpers |
| `src/config.js` | Site name, GitHub URL, license |
| `scripts/` | `gen-seo.mjs`, `scan-usage.mjs`, `smoke.mjs` (headless test of every route) |

## Adding a component

1. Create `src/kavyn/my-thing.jsx` with one default export.
2. Add an entry to `src/data/catalog.json` (`slug`, `name`, `export`, `family`, `description`, `useCase`, `tags`, optional `deps`).
3. `npm run build`, then `node scripts/smoke.mjs --only my-thing` with `npx vite preview` running.

## Deploy

See [DEPLOY.md](DEPLOY.md): Vercel Hobby (free) with a custom domain on Cloudflare DNS, plus Cloudflare Pages as an alternative.

## License

MIT, see [LICENSE](LICENSE).
