// Runs after `vite build`. Gives every route its own static HTML file and every component its own share image.
//
// Why: the app is a client-rendered SPA, so without this every URL returns the same empty shell.
// Link previews (X, Discord, WhatsApp, Slack), most AI agents and some crawlers never run JavaScript:
// they saw the home page title on every link and no content at all.
//
// What it writes into dist/:
//   <route>/index.html   the built shell with that page's own <title>, description, canonical and
//                        Open Graph tags, plus a plain HTML version of the page inside #root.
//                        React replaces that content as soon as it mounts.
//   og/<slug>.png        a 1200x630 card per component (name, description, install command)
//   404.html             the shell, marked noindex
//
// Hosts serve real files before SPA rewrites, so /components/liquid-button now gets its own file
// while unknown URLs still fall through to the app.
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const root = path.resolve(import.meta.dirname, '..')
const dist = path.join(root, 'dist')
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8')
if (!fs.existsSync(path.join(dist, 'index.html'))) { console.error('prerender: dist/index.html is missing. Run vite build first.'); process.exit(1) }

const env = Object.fromEntries(['.env', '.env.production', '.env.local'].flatMap((f) => {
  try { return read(f).split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]) } catch { return [] }
}))
const rawSite = (process.env.VITE_SITE_URL || env.VITE_SITE_URL || 'https://kavynui.com').replace(/\/+$/, '')
const SITE = /^https:\/\/[a-z0-9.-]+(:\d+)?$/i.test(rawSite) ? rawSite : 'https://kavynui.com'

const catalog = JSON.parse(read('src/data/catalog.json'))
const { posts } = await import(path.join(root, 'src/data/posts.js'))
const templates = JSON.parse(read('src/data/templates.json')).templates
const docs = [...read('src/docs/pages.jsx').matchAll(/\{ id: '([a-z-]+)', title: '([^']+)', lead: '([^']+)'/g)].map(([, id, title, lead]) => ({ id, title, lead }))
const famById = Object.fromEntries(catalog.families.map((f) => [f.id, f]))
const total = catalog.components.length
const sections = catalog.components.filter((c) => c.family === 'blocks').length

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const sourceFile = (slug) => ['tsx', 'jsx'].map((x) => `${slug}.${x}`).find((f) => fs.existsSync(path.join(root, 'src/kavyn', f)))

// ---------- static page bodies (plain HTML, themed by the site's own CSS variables) ----------
const S = {
  main: 'max-width:760px;margin:0 auto;padding:56px 20px 96px;font-family:Inter,system-ui,sans-serif;color:var(--tx);line-height:1.6',
  h1: 'font-size:34px;line-height:1.1;letter-spacing:-0.035em;font-weight:600;margin:12px 0 8px',
  h2: 'font-size:18px;font-weight:600;margin:32px 0 10px',
  mute: 'color:var(--mute)',
  pre: 'background:var(--panel);border-radius:14px;padding:14px 16px;overflow:auto;font:12.5px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--tx)',
  a: 'color:var(--tx)',
}
const link = (href, text) => `<a style="${S.a}" href="${esc(href)}">${esc(text)}</a>`
const nav = `<nav style="font-size:14px;${S.mute}">${[['/', 'kavynUI'], ['/components', 'Components'], ['/blocks', 'Sections'], ['/backgrounds', 'Backgrounds'], ['/docs', 'Docs'], ['/blog', 'Blog']].map(([h, t]) => link(h, t)).join(' · ')}</nav>`
const wrap = (inner) => `<main style="${S.main}">${nav}${inner}</main>`
const list = (items) => `<ul style="padding-left:18px">${items.map((i) => `<li>${i}</li>`).join('')}</ul>`
const componentLine = (c) => `${link(`/components/${c.slug}`, c.name)} <span style="${S.mute}">- ${esc(c.description)}. For: ${esc(c.useCase)}.</span>`
const REGISTER = `npx shadcn@latest registry add @kavynui=${SITE}/r/{name}.json`

function componentBody(c) {
  const file = sourceFile(c.slug)
  const files = [file, ...(c.deps || [])]
  const fam = famById[c.family]
  const siblings = catalog.components.filter((x) => x.family === c.family && x.slug !== c.slug).slice(0, 8)
  const source = fs.readFileSync(path.join(root, 'src/kavyn', file), 'utf8')
  return wrap(`
<h1 style="${S.h1}">${esc(c.name)}</h1>
<p style="${S.mute};font-size:17px">${esc(c.description)}. Use case: ${esc(c.useCase)}.</p>
<p style="${S.mute};font-size:14px">${link(`/components?family=${c.family}`, fam?.name || c.family)} · React · Tailwind CSS v4 · MIT · ${file.endsWith('.tsx') ? 'TypeScript' : 'JavaScript'}</p>
<h2 style="${S.h2}">Install</h2>
<pre style="${S.pre}">npx shadcn@latest add ${SITE}/r/${c.slug}.json</pre>
<p style="${S.mute};font-size:14px">Or register the library once (<code>${esc(REGISTER)}</code>) and run <code>npx shadcn@latest add @kavynui/${c.slug}</code>. Registry item: ${link(`/r/${c.slug}.json`, `/r/${c.slug}.json`)}.</p>
<h2 style="${S.h2}">Use</h2>
<pre style="${S.pre}">${esc(`import ${c.export} from '@/components/kavyn/${c.slug}'\n\nexport default function Page() {\n  return <${c.export} />\n}`)}</pre>
<p style="${S.mute};font-size:14px">Files: ${files.map((f) => `<code>components/kavyn/${esc(f)}</code>`).join(', ')}. Packages: ${esc((c.dependencies || ['react']).join(', '))}.</p>
<h2 style="${S.h2}">Source: ${esc(file)}</h2>
<pre style="${S.pre}">${esc(source)}</pre>
${siblings.length ? `<h2 style="${S.h2}">More in ${esc(fam?.name || '')}</h2>${list(siblings.map(componentLine))}` : ''}`)
}

const byFamily = () => catalog.families.map((f) => `<h2 style="${S.h2}">${esc(f.name)} <span style="${S.mute};font-weight:400">- ${esc(f.blurb)}</span></h2>${list(catalog.components.filter((c) => c.family === f.id).map(componentLine))}`).join('')

const HOME_DESC = `${total} animated React components and ${sections} page sections. Monochrome, theme-aware, installed as source you own with the shadcn CLI. Open source, MIT.`
const pages = [
  { path: '/', title: 'kavynUI - animated React components and page sections', description: HOME_DESC,
    body: wrap(`<h1 style="${S.h1}">Build interfaces people remember.</h1><p style="${S.mute};font-size:17px">${esc(HOME_DESC)}</p><h2 style="${S.h2}">Install</h2><pre style="${S.pre}">${esc(REGISTER)}\nnpx shadcn@latest add @kavynui/liquid-button</pre><p style="${S.mute};font-size:14px">For coding agents: ${link('/llms.txt', 'llms.txt')}, ${link('/llms-full.txt', 'llms-full.txt')}, ${link('/r/registry.json', 'registry index')}.</p>${byFamily()}`) },
  { path: '/components', title: 'Components - kavynUI', description: `Browse all ${total} animated React components by job: sections, buttons, forms, navigation, text, cards, maps, loaders, scroll scenes and shader backgrounds.`,
    body: wrap(`<h1 style="${S.h1}">Components</h1><p style="${S.mute}">${total} components. Each is one file you own.</p>${byFamily()}`) },
  { path: '/blocks', title: 'Page sections - kavynUI', description: 'Whole page sections ready to drop in: hero, features, social proof, pricing, FAQ, call to action, footer, sign-in, status and dashboard.',
    body: wrap(`<h1 style="${S.h1}">Page sections</h1>${list(catalog.components.filter((c) => c.family === 'blocks').map(componentLine))}`) },
  { path: '/backgrounds', title: 'Backgrounds - kavynUI', description: 'Theme-aware shader backgrounds and plain CSS gradients, each named for the product it suits.',
    body: wrap(`<h1 style="${S.h1}">Backgrounds</h1><p style="${S.mute}">CSS gradients you can export as CSS, Tailwind or React, plus live shader backgrounds:</p>${list(catalog.components.filter((c) => c.family === 'bg').map(componentLine))}`) },
  { path: '/templates', title: 'Templates - kavynUI', description: 'Complete product designs sold as source you own. The component library stays free and MIT.',
    body: wrap(`<h1 style="${S.h1}">Templates</h1>${list(templates.map((t) => `<strong>${esc(t.name)}</strong> <span style="${S.mute}">- ${esc(t.niche)}. ${esc(t.tagline)}</span>`))}`) },
  ...docs.map((d) => ({ path: d.id === 'introduction' ? '/docs' : `/docs/${d.id}`, title: `${d.title} - kavynUI docs`, description: d.lead,
    body: wrap(`<h1 style="${S.h1}">${esc(d.title)}</h1><p style="${S.mute};font-size:17px">${esc(d.lead)}</p><h2 style="${S.h2}">Docs</h2>${list(docs.map((x) => link(x.id === 'introduction' ? '/docs' : `/docs/${x.id}`, x.title) + ` <span style="${S.mute}">- ${esc(x.lead)}</span>`))}`) })),
  { path: '/blog', title: 'Blog - kavynUI', description: 'Design and engineering notes from the kavynUI library: shaders, scroll scenes, physics and theming.',
    body: wrap(`<h1 style="${S.h1}">Blog</h1>${list(posts.map((p) => `${link(`/blog/${p.slug}`, p.title)} <span style="${S.mute}">- ${esc(p.excerpt)}</span>`))}`) },
  ...posts.map((p) => ({ path: `/blog/${p.slug}`, title: `${p.title} - kavynUI`, description: p.excerpt, type: 'article',
    body: wrap(`<h1 style="${S.h1}">${esc(p.title)}</h1><p style="${S.mute};font-size:14px">${esc(p.date)}</p>${(p.body || []).map((b) => (b.h2 ? `<h2 style="${S.h2}">${esc(b.h2)}</h2>` : b.p ? `<p>${esc(b.p)}</p>` : '')).join('')}`) })),
  ...['about', 'privacy', 'terms'].map((id) => ({ path: `/${id}`, title: `${id[0].toUpperCase()}${id.slice(1)} - kavynUI`, description: HOME_DESC, body: '' })),
  ...catalog.components.map((c) => ({ path: `/components/${c.slug}`, title: `${c.name} - kavynUI`, description: `${c.description}. Use case: ${c.useCase}. Install with the shadcn CLI or copy the file.`, image: `/og/${c.slug}.png`, body: componentBody(c),
    jsonLd: { '@context': 'https://schema.org', '@type': 'SoftwareSourceCode', name: c.name, description: c.description, programmingLanguage: sourceFile(c.slug).endsWith('.tsx') ? 'TypeScript' : 'JavaScript', runtimePlatform: 'React', license: 'https://opensource.org/licenses/MIT', codeRepository: 'https://github.com/Aseel012/kavynui', url: `${SITE}/components/${c.slug}` } })),
]

// ---------- head rewriting ----------
// Safe to run twice: if dist/index.html was already filled by an earlier run, empty its #root again.
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8').replace(/<div id="root">[\s\S]*?<\/div>(\s*<noscript>)/, '<div id="root"></div>$1')
const setMeta = (html, attr, key, value) => {
  const re = new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`)
  if (!re.test(html)) throw new Error(`prerender: index.html has no <meta ${attr}="${key}">`)
  return html.replace(re, `$1${esc(value)}$2`)
}
function render({ path: route, title, description, image = '/og.png', body = '', type = 'website', jsonLd, noindex = false }) {
  const url = `${SITE}${route === '/' ? '/' : route}`
  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${esc(url)}$2`)
  for (const [attr, key, value] of [
    ['name', 'description', description], ['name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow'],
    ['property', 'og:title', title], ['property', 'og:description', description], ['property', 'og:type', type], ['property', 'og:url', url], ['property', 'og:image', `${SITE}${image}`],
    ['name', 'twitter:title', title], ['name', 'twitter:description', description], ['name', 'twitter:image', `${SITE}${image}`],
  ]) html = setMeta(html, attr, key, value)
  if (jsonLd) html = html.replace('</head>', `  <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>\n  </head>`)
  if (!html.includes('<div id="root"></div>')) throw new Error('prerender: index.html has no empty #root')
  return html.replace('<div id="root"></div>', `<div id="root">${body}</div>`)
}

// ---------- share images ----------
async function ogCards() {
  const require = createRequire(import.meta.url)
  let satori, Resvg
  try { satori = (await import('satori')).default; ({ Resvg } = await import('@resvg/resvg-js')) } catch { console.warn('prerender: satori / @resvg/resvg-js not installed, skipping share images'); return false }
  const font = (w) => fs.readFileSync(require.resolve(`@fontsource/inter/files/inter-latin-${w}-normal.woff`))
  const fonts = [{ name: 'Inter', data: font(400), weight: 400, style: 'normal' }, { name: 'Inter', data: font(600), weight: 600, style: 'normal' }]
  const h = (style, children) => ({ type: 'div', props: { style: { display: 'flex', ...style }, children } })
  fs.mkdirSync(path.join(dist, 'og'), { recursive: true })
  for (const c of catalog.components) {
    const card = h({ width: 1200, height: 630, backgroundColor: '#000', color: '#f5f5f7', fontFamily: 'Inter' }, [h({ position: 'absolute', left: 72, top: 68, width: 1056, height: 494, flexDirection: 'column', justifyContent: 'space-between' }, [
      h({ alignItems: 'center', justifyContent: 'space-between', fontSize: 28 }, [
        h({ alignItems: 'center', fontWeight: 600 }, [h({ width: 10, height: 34, backgroundColor: '#f5f5f7', borderRadius: 3, marginRight: 8 }), h({ width: 18, height: 18, backgroundColor: '#f5f5f7', transform: 'rotate(45deg)', marginRight: 18 }), 'kavynUI']),
        h({ color: '#a1a1a6' }, famById[c.family]?.name || ''),
      ]),
      h({ flexDirection: 'column' }, [
        h({ fontSize: c.name.length > 16 ? 92 : 116, fontWeight: 600, letterSpacing: '-0.045em', lineHeight: 1 }, c.name),
        h({ fontSize: 36, color: '#a1a1a6', marginTop: 26, lineHeight: 1.3 }, `${c.description}.`),
      ]),
      h({ alignItems: 'center', backgroundColor: '#141416', borderRadius: 999, padding: '18px 30px', fontSize: 27, alignSelf: 'flex-start' }, [h({ color: '#6e6e73', marginRight: 14 }, '$'), `npx shadcn@latest add @kavynui/${c.slug}`]),
    ])])
    const svg = await satori(card, { width: 1200, height: 630, fonts })
    fs.writeFileSync(path.join(dist, 'og', `${c.slug}.png`), new Resvg(svg).render().asPng())
  }
  return true
}

const hasCards = await ogCards()
let count = 0
for (const page of pages) {
  if (!hasCards) delete page.image
  if (page.path === '/') continue
  const file = path.join(dist, page.path.slice(1), 'index.html')
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, render(page)); count++
}
fs.writeFileSync(path.join(dist, '404.html'), render({ path: '/404', title: 'Page not found - kavynUI', description: 'This page does not exist.', noindex: true }))
fs.writeFileSync(path.join(dist, 'index.html'), render(pages[0])); count++
console.log(`prerender: ${count} static pages${hasCards ? `, ${total} share images` : ''}`)
