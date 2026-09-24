// Screenshot every detail preview: node scripts/preview-shots.mjs <width> <dpr> <d|m> <outdir> [slug,slug]
import puppeteer from 'puppeteer-core'
import { readFileSync, mkdirSync } from 'node:fs'
const cat = JSON.parse(readFileSync('src/data/catalog.json'))
const [w, dpr, mob, out] = [+process.argv[2], +process.argv[3], process.argv[4] === 'm', process.argv[5]]
mkdirSync(out, { recursive: true })
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-gpu', `--user-data-dir=/tmp/g-${process.pid}`] })
const p = await b.newPage()
await p.setViewport({ width: w, height: 900, deviceScaleFactor: dpr, isMobile: mob, hasTouch: mob })
const only = process.argv[6] ? process.argv[6].split(',') : null
for (const c of cat.components.filter((c) => !only || only.includes(c.slug))) {
  await p.goto('http://localhost:4173/components/' + c.slug, { waitUntil: 'networkidle2' })
  await new Promise((r) => setTimeout(r, 1500))
  const el = await p.$('.grid-fade')
  const box = await p.evaluateHandle((e) => e.parentElement, el)
  await box.screenshot({ path: `${out}/${c.slug}.png` })
}
await b.close()
