// Screenshots of key pages at desktop and mobile sizes: node scripts/shots.mjs <outdir>
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'
const BASE = process.env.BASE || 'http://localhost:4173'
const out = process.argv[2] || 'shots'
mkdirSync(out, { recursive: true })
const PAGES = [['home', '/'], ['components', '/components'], ['detail', '/components/traffic-map'], ['block', '/components/edge-dashboard'], ['blocks', '/blocks'], ['backgrounds', '/backgrounds'], ['bg-sheet', '/backgrounds?bg=aurora-drift'], ['docs-motion', '/docs/motion'], ['docs-deploy', '/docs/deploy'], ['about', '/about'], ['contribute', '/contribute'], ['night-transit', '/components/night-transit']]
const SIZES = [['desktop', 1440, 900, 1, false], ['mobile', 390, 844, 2, true]]
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-gpu', `--user-data-dir=/tmp/shots-${process.pid}`] })
const page = await browser.newPage()
for (const [sz, w, h, dpr, mobile] of SIZES) {
  await page.setViewport({ width: w, height: h, deviceScaleFactor: dpr, isMobile: mobile, hasTouch: mobile })
  for (const [name, path] of PAGES) {
    await page.goto(BASE + path, { waitUntil: 'networkidle2' })
    await new Promise((r) => setTimeout(r, 1800))
    await page.screenshot({ path: `${out}/${name}-${sz}.png`, fullPage: !['components', 'blocks', 'bg-sheet'].includes(name) })
  }
}
await browser.close()
console.log('done')
