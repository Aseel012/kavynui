// Writes public/sitemap.xml, robots.txt, llms.txt and llms-full.txt from the catalog, docs and blog before each build.
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const env = Object.fromEntries(['.env', '.env.production', '.env.local'].flatMap((f) => {
  try { return readFileSync(join(root, f), 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]) } catch { return [] }
}))
const raw = (process.env.VITE_SITE_URL || env.VITE_SITE_URL || 'https://kavynui.com').replace(/\/+$/, '')
const SITE = /^https:\/\/[a-z0-9.-]+(:\d+)?$/i.test(raw) ? raw : 'https://kavynui.com'

const catalog = JSON.parse(readFileSync(join(root, 'src/data/catalog.json'), 'utf8'))
const { posts } = await import(join(root, 'src/data/posts.js'))
const docs = [...readFileSync(join(root, 'src/docs/pages.jsx'), 'utf8').matchAll(/\{ id: '([a-z-]+)', title:/g)].map((m) => m[1])
const today = new Date().toISOString().slice(0, 10)
const urls = [
  ['/', '1.0'], ['/components', '0.9'], ['/blocks', '0.9'], ['/backgrounds', '0.8'], ['/templates', '0.8'], ['/blog', '0.7'],
  ...docs.map((d) => [d === 'introduction' ? '/docs' : `/docs/${d}`, '0.7']),
  ...posts.map((p) => [`/blog/${p.slug}`, '0.6']),
  ['/about', '0.5'], ['/privacy', '0.3'], ['/terms', '0.3'],
  ...catalog.components.map((c) => [`/components/${c.slug}`, '0.6']),
]
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, p]) => `  <url><loc>${SITE}${u}</loc><lastmod>${today}</lastmod><priority>${p}</priority></url>`).join('\n')}
</urlset>
`
writeFileSync(join(root, 'public/sitemap.xml'), xml)
writeFileSync(join(root, 'public/robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`)

// AI-discovery files (llms.txt convention): a short map and a full component index.
const fams = catalog.families.map((f) => `- ${f.name}: ${f.blurb}`).join('\n')
writeFileSync(join(root, 'public/llms.txt'), `# kavynUI

> kavynUI is an open-source (MIT) library of ${catalog.components.length} animated React components and page sections, monochrome (iOS system grays) with dark and light themes, copy-paste owned. Every component ships with a live animation, a real use case and graceful fallbacks (WebGL degrades to CSS gradients, reduced-motion variants). No dependencies beyond React, Tailwind CSS and Motion.

## Pages

- [Components](${SITE}/components): full searchable catalog of every component and block
- [Sections](${SITE}/blocks): whole page sections (hero, features, pricing, FAQ, CTA, footer)
- [Backgrounds](${SITE}/backgrounds): gradient and shader backgrounds
- [Templates](${SITE}/templates): complete end-to-end product designs by Enzo, sold as source-you-own templates; the component library stays free (MIT)
- [Docs](${SITE}/docs): installation, theming, usage, motion, accessibility
- [Blog](${SITE}/blog): design and engineering notes

## Component families

${fams}

## Notes for AI assistants

- Most components are plain .jsx files with JSDoc prop types. The shader backgrounds are TypeScript (.tsx); the shadcn CLI strips the types for JavaScript projects, so one command works in both.
- Shader backgrounds draw in the page's own theme colours (--tx on --bg), so they follow light and dark mode. Props: color, color2, speed, intensity, scale, interactive.
- Every component respects prefers-reduced-motion and works in light and dark mode.
- WebGL pieces render a CSS gradient first and only fade in the GPU version when it runs; they pause off-screen and in background tabs.
- License: MIT. Attribution appreciated, not required.
- Full component index with install commands: ${SITE}/llms-full.txt
- shadcn registry index (full source for every item): ${SITE}/r/index.json
- Install any item: npx shadcn@latest add ${SITE}/r/<slug>.json
- Register the whole library once: npx shadcn@latest registry add @kavynui=${SITE}/r/{name}.json
  then search with \`npx shadcn@latest search @kavynui -q <words>\` and install with \`npx shadcn@latest add @kavynui/<slug>\`
- Agents: \`npx shadcn@latest mcp init\` gives your coding agent shadcn's MCP server, which searches and installs from registered registries.
`)

const lines = catalog.families.map((f) => [`## ${f.name}`, '', ...catalog.components.filter((c) => c.family === f.id).map((c) => `- [${c.name}](${SITE}/components/${c.slug}): ${c.description}. Use case: ${c.useCase}. Install: \`npx shadcn@latest add ${SITE}/r/${c.slug}.json\``), ''].join('\n'))
writeFileSync(join(root, 'public/llms-full.txt'), `# kavynUI - full component index

> ${catalog.components.length} components in ${catalog.families.length} families. Copy any file into a React + Tailwind project and ship it. Source and docs: ${SITE}

${lines.join('\n')}
`)
console.log(`seo: ${urls.length} urls, llms.txt + llms-full.txt (${catalog.components.length} components) for ${SITE}`)
