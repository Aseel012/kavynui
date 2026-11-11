// End-to-end tests in real Chrome against the built site.
// Usage: npm run build && npx vite preview --port 4173 & node scripts/e2e.mjs
import puppeteer from 'puppeteer-core'
import path from 'node:path'

const BASE = process.env.BASE || 'http://127.0.0.1:4173'
const CHROME = process.env.CHROME || '/usr/bin/google-chrome'
const root = path.resolve(import.meta.dirname, '..')
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox', '--disable-gpu'] })
await browser.defaultBrowserContext().overridePermissions(BASE, ['clipboard-read', 'clipboard-write', 'clipboard-sanitized-write'])

const results = []
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
function assert(cond, msg) { if (!cond) throw new Error(msg) }

async function open(route, { mobile = false, light = false } = {}) {
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => { if (m.type() === 'error' && !m.text().includes('404') && !(m.location()?.url || '').includes('/_vercel/')) errors.push(m.text()) })
  if (light) await page.evaluateOnNewDocument(() => localStorage.setItem('kavynui.theme', 'light'))
  await page.setViewport(mobile ? { width: 390, height: 844, isMobile: true, hasTouch: true } : { width: 1440, height: 900 })
  await page.goto(BASE + route, { waitUntil: 'load' })
  await page.waitForSelector('h1', { timeout: 10000 })
  page.errors = errors
  return page
}
const text = (page, sel) => page.$eval(sel, (e) => e.textContent)
const clip = (page) => page.evaluate(() => navigator.clipboard.readText())
const clickText = async (page, tag, label) => {
  const h = await page.waitForFunction((t, l) => [...document.querySelectorAll(t)].find((e) => e.textContent.trim() === l || e.getAttribute('aria-label') === l), { timeout: 8000 }, tag, label)
  await h.asElement().click()
}

async function test(name, fn) {
  const t = Date.now()
  let page
  try { page = await fn(); if (page?.errors?.length) throw new Error(`console: ${page.errors.join(' | ')}`); results.push([true, name, Date.now() - t]) }
  catch (e) { results.push([false, name, Date.now() - t, e.message]) }
  finally { await page?.close?.() }
}

await test('home: hero pill links to the newest component from catalog.json', async () => {
  const p = await open('/')
  const href = await p.$eval('main a[href^="/components/"]', (a) => a.getAttribute('href'))
  assert(href === '/components/avatar-upload', `pill points to ${href}`)
  return p
})

await test('home: showcase tabs switch to that family\'s live components', async () => {
  const p = await open('/')
  const names = () => p.$$eval('[role=tabpanel] a span:first-child', (s) => s.map((x) => x.textContent))
  assert((await names()).includes('Liquid Button'), 'buttons not shown first')
  await clickText(p, 'button', 'Forms & inputs')
  await p.waitForFunction(() => [...document.querySelectorAll('[role=tabpanel] a span:first-child')].some((s) => s.textContent === 'Avatar Upload'))
  assert(await p.$eval('[role=tab][aria-selected=true]', (t) => t.textContent) === 'Forms & inputs', 'tab state wrong')
  return p
})

await test('home: page kit adds a section to the command and the page file', async () => {
  const p = await open('/')
  const before = await text(p, '[data-testid=kit-command]')
  assert(!before.includes('proof-wall'), 'proof wall should start off')
  await clickText(p, 'button', 'Include Social proof')
  await p.waitForFunction(() => document.querySelector('[data-testid=kit-command]').textContent.includes('/r/proof-wall.json'))
  assert(await p.$eval('[aria-label="Include Social proof"]', (e) => e.getAttribute('aria-checked')) === 'true', 'switch did not report on')
  await p.waitForFunction(() => [...document.querySelectorAll('code')].some((c) => c.textContent.includes("import ProofWall from '@/components/kavyn/proof-wall'")))
  return p
})

await test('home: page kit keeps page order and empties cleanly', async () => {
  const p = await open('/')
  const cmd = await text(p, '[data-testid=kit-command]')
  const order = ['product-hero', 'feature-bento', 'pricing-morph', 'faq-accordion', 'wordmark-footer'].map((s) => cmd.indexOf(s))
  assert(order.every((v, i) => v > -1 && (i === 0 || v > order[i - 1])), `out of order: ${cmd}`)
  for (const l of ['Hero', 'Features', 'Pricing', 'FAQ', 'Footer']) await clickText(p, 'button', `Include ${l}`)
  await p.waitForFunction(() => document.querySelector('[data-testid=kit-command]').textContent.startsWith('Turn on a section'))
  await p.waitForFunction(() => document.querySelector('[data-testid=kit-preview]').textContent.includes('An empty page'))
  return p
})

await test('home: copy command puts it on the clipboard', async () => {
  const p = await open('/')
  await clickText(p, 'button', 'Copy command')
  await p.waitForFunction(() => [...document.querySelectorAll('button')].some((b) => b.textContent === 'Copied'))
  const c = await clip(p)
  assert(c.startsWith('npx shadcn@latest add ') && c.includes('/r/product-hero.json'), `clipboard: ${c}`)
  return p
})

await test('search palette: Ctrl+K, type, Enter navigates', async () => {
  const p = await open('/')
  await p.keyboard.down('Control'); await p.keyboard.press('k'); await p.keyboard.up('Control')
  await p.waitForSelector('[role=dialog][aria-label=Search] input')
  await p.keyboard.type('avatar')
  await sleep(150)
  await p.keyboard.press('Enter')
  await p.waitForFunction(() => location.pathname === '/components/avatar-upload')
  await p.waitForFunction(() => document.querySelector('h1')?.textContent === 'Avatar Upload')
  return p
})

await test('theme toggle switches to light and survives reload', async () => {
  const p = await open('/')
  await p.click('header [aria-label="Switch to light mode"]')
  assert(await p.evaluate(() => document.documentElement.classList.contains('light')), 'html is not .light')
  assert(await p.evaluate(() => getComputedStyle(document.body).backgroundColor) === 'rgb(255, 255, 255)', 'body not white')
  await p.reload({ waitUntil: 'load' })
  assert(await p.evaluate(() => document.documentElement.classList.contains('light')), 'theme lost on reload')
  await p.click('header [aria-label="Switch to dark mode"]')
  assert(await p.evaluate(() => getComputedStyle(document.body).backgroundColor) === 'rgb(0, 0, 0)', 'body not black')
  return p
})

await test('sidebar filter: type and Enter opens the first match', async () => {
  const p = await open('/components')
  await p.type('[aria-label="Filter components"]', 'drop')
  await p.waitForFunction(() => [...document.querySelectorAll('nav[aria-label=Catalog] a')].some((a) => a.textContent.includes('Dropzone')))
  await p.keyboard.press('Enter')
  await p.waitForFunction(() => location.pathname === '/components/dropzone')
  return p
})

await test('family filter shows exactly that family', async () => {
  const p = await open('/components?family=buttons')
  await p.waitForFunction(() => document.querySelectorAll('main article').length === 6)
  assert((await text(p, 'h1')) === 'Buttons', 'wrong heading')
  return p
})

await test('unknown family falls back to all components', async () => {
  const p = await open('/components?family=nope')
  assert((await text(p, 'h1')) === 'Components', 'did not fall back')
  return p
})

await test('avatar upload: real file, saved, removed; non-image rejected', async () => {
  const p = await open('/components/avatar-upload')
  await p.waitForFunction(() => document.body.textContent.includes('Saved'), { timeout: 8000 }) // demo run finishes first
  const input = await p.$('main input[type=file]')
  await input.uploadFile(path.join(root, 'public/avatars/p1.jpg'))
  await p.waitForFunction(() => [...document.querySelectorAll('main img')].some((i) => i.src.startsWith('blob:')))
  await p.waitForFunction(() => document.body.textContent.includes('Uploading'))
  await p.waitForFunction(() => document.body.textContent.includes('Saved'), { timeout: 8000 })
  await clickText(p, 'button', 'Remove')
  await p.waitForSelector('main [aria-label="Upload profile photo"]')
  await (await p.$('main input[type=file]')).uploadFile(path.join(root, 'package.json'))
  await p.waitForFunction(() => document.body.textContent.includes('Choose a JPG, PNG or WebP image.'))
  return p
})

await test('dropzone: a real file appears with progress and finishes', async () => {
  const p = await open('/components/dropzone')
  await (await p.$('main input[type=file]')).uploadFile(path.join(root, 'public/favicon.svg'))
  const rowText = () => [...document.querySelectorAll('main span')].find((s) => s.textContent === 'favicon.svg')?.closest('[class*="gap-3.5"]')?.textContent.trim() || ''
  await p.waitForFunction((f) => /of [\d.]+ (KB|MB) · /.test(eval(f)()), {}, `(${rowText})`) // live progress line
  await p.waitForFunction((f) => /favicon\.svg[\d.]+ (KB|MB)$/.test(eval(f)()), { timeout: 20000 }, `(${rowText})`) // done: size only, no bar
  return p
})

await test('detail: Copy for AI copies an install-ready spec', async () => {
  const p = await open('/components/hold-to-confirm')
  await clickText(p, 'button', 'Copy for AI')
  await p.waitForFunction(() => [...document.querySelectorAll('button')].some((b) => b.textContent === 'Copied'))
  const c = await clip(p)
  for (const s of ['# Hold to Confirm', 'Install: npx shadcn@latest add', '/r/hold-to-confirm.json', "import HoldToConfirm from '@/components/kavyn/hold-to-confirm'", 'Props:', '- onConfirm: function, default undefined']) assert(c.includes(s), `missing "${s}" in:\n${c}`)
  return p
})

await test('backgrounds: open sheet by click, deep link, close with Escape', async () => {
  const p = await open('/backgrounds')
  await p.click('main button.group')
  await p.waitForSelector('[role=dialog][aria-modal=true]')
  assert((await p.evaluate(() => location.search)).startsWith('?bg='), 'no deep link')
  await clickText(p, 'button', 'Tailwind')
  await p.keyboard.press('Escape')
  await p.waitForFunction(() => !document.querySelector('[role=dialog][aria-modal=true]') && location.search === '')
  return p
})

await test('registry endpoint serves full source for the new component', async () => {
  const p = await open('/')
  const item = await p.evaluate(async () => (await fetch('/r/avatar-upload.json')).json())
  assert(item.name === 'avatar-upload' && item.type === 'registry:component', 'bad item')
  assert(item.files[0].content.includes('export default function AvatarUpload'), 'missing source')
  assert(Object.keys(item.cssVars.theme).length === 10 && item.cssVars.dark['acc-fg'] === '#000000', 'tokens wrong')
  return p
})

await test('every internal link on main pages resolves (no 404s)', async () => {
  const p = await open('/')
  const hrefs = new Set()
  for (const r of ['/', '/components', '/docs', '/docs/theming', '/docs/shaders', '/blocks', '/backgrounds']) {
    await p.goto(BASE + r, { waitUntil: 'load' }); await p.waitForSelector('h1')
    for (const h of await p.$$eval('a[href^="/"]', (as) => as.map((a) => a.getAttribute('href')))) if (!/\.(txt|json)$/.test(h)) hrefs.add(h.split('#')[0])
  }
  const bad = []
  for (const h of hrefs) {
    await p.goto(BASE + h, { waitUntil: 'load' }); await p.waitForSelector('h1')
    if ((await text(p, 'h1')) === 'This page does not exist') bad.push(h)
  }
  assert(!bad.length, `broken: ${bad.join(', ')}`)
  return p
})

await test('mobile: no sideways scrolling on key pages', async () => {
  const bad = []
  for (const r of ['/', '/components', '/components/avatar-upload', '/components/edge-dashboard', '/blocks', '/backgrounds', '/docs', '/docs/theming', '/templates', '/blog']) {
    const p = await open(r, { mobile: true })
    await sleep(800)
    const w = await p.evaluate(() => document.documentElement.scrollWidth)
    if (w > 391) bad.push(`${r}=${w}`)
    await p.close()
  }
  assert(!bad.length, bad.join(', '))
})

await test('404 page renders for unknown routes', async () => {
  const p = await open('/nope/nothing')
  assert((await text(p, 'h1')) === 'This page does not exist', 'no 404')
  return p
})

await browser.close()
for (const [ok, name, ms, err] of results) console.log(`${ok ? 'PASS' : 'FAIL'} ${name} (${ms}ms)${err ? `\n     ${err}` : ''}`)
const failed = results.filter((r) => !r[0]).length
console.log(`\n${results.length - failed}/${results.length} passed`)
process.exit(failed ? 1 : 0)
