// Smoke test: renders every route in headless Chrome and fails on console errors.
// Usage: npm run build && npx vite preview --port 4173 & node scripts/smoke.mjs [--shots dir] [--only a,b]
import puppeteer from 'puppeteer-core'
import { readFileSync, mkdirSync } from 'node:fs'

const BASE = process.env.BASE || 'http://localhost:4173'
const args = process.argv.slice(2)
const shots = args.includes('--shots') ? args[args.indexOf('--shots') + 1] : null
const only = args.includes('--only') ? args[args.indexOf('--only') + 1].split(',') : null
const cat = JSON.parse(readFileSync(new URL('../src/data/catalog.json', import.meta.url)))
const { posts } = await import(new URL('../src/data/posts.js', import.meta.url))
const docs = [...readFileSync(new URL('../src/docs/pages.jsx', import.meta.url), 'utf8').matchAll(/\{ id: '([a-z-]+)', title:/g)].map((m) => m[1])
let routes = ['/', '/components', '/components?family=data', '/blocks', '/backgrounds', '/backgrounds?bg=aurora-drift', '/about', '/privacy', '/terms', '/blog', ...posts.map((p) => `/blog/${p.slug}`), '/contribute', '/admin', '/this-does-not-exist',
  ...docs.map((d) => (d === 'introduction' ? '/docs' : `/docs/${d}`)), ...cat.components.map((c) => `/components/${c.slug}`)]
if (only) routes = routes.filter((r) => only.some((o) => r === o || r.endsWith('/' + o)))
if (shots) mkdirSync(shots, { recursive: true })

const browser = await puppeteer.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-gpu', `--user-data-dir=/tmp/smoke-${process.pid}`] })
const errors = []
let current = ''

let ok = 0
for (const r of routes) {
  current = r
  const page = await browser.newPage()
  if (process.env.LIGHT) await page.evaluateOnNewDocument(() => { try { localStorage.setItem('kavynui.theme', 'light') } catch (e) {} })
  await page.setViewport(process.env.MOBILE ? { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { width: 1280, height: 860 })
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`[${m.type()}] ${current}: ${m.text()}`) })
  page.on('pageerror', (e) => errors.push(`[pageerror] ${current}: ${e.message}`))
  page.on('requestfailed', (r) => errors.push(`[requestfailed] ${current}: ${r.url()}`))
  // load, then wait for real request quiet. (Chrome's networkidle lifecycle event can stall behind a busy WebGL canvas in headless.)
  try { await page.goto(BASE + r, { waitUntil: 'load', timeout: 15000 }); await page.waitForNetworkIdle({ idleTime: 500, timeout: 15000 }) } catch (e) { errors.push(`[goto] ${r}: ${e.message}`) }
  await new Promise((res) => setTimeout(res, 900))
  if (r === '/components' || r === '/blocks' || r === '/') {
    for (let y = 0; y < 30; y++) { await page.evaluate(() => window.scrollBy(0, 700)); await new Promise((res) => setTimeout(res, 120)) }
  }
  const h1 = await page.$eval('h1', (e) => e.textContent).catch(() => '')
  if (!h1) errors.push(`[render] ${r}: no <h1>`)
  else ok++
  await page.close()
}
await browser.close()
console.log(`routes rendered: ${ok}/${routes.length}`)
if (errors.length) { console.log(errors.join('\n')); process.exit(1) }
console.log('no console errors or warnings')
