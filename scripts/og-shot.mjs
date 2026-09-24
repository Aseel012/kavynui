// Renders the home page at 1200x630 and saves public/og.png (social card).
import puppeteer from 'puppeteer-core'
const BASE = process.env.BASE || 'http://localhost:4173'
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-gpu', `--user-data-dir=/tmp/og-${process.pid}`] })
const page = await browser.newPage()
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 })
await page.goto(BASE + '/', { waitUntil: 'load', timeout: 20000 })
await page.waitForNetworkIdle({ idleTime: 600, timeout: 15000 }).catch(() => {})
await new Promise((r) => setTimeout(r, 1800))
await page.screenshot({ path: 'public/og.png' })
await browser.close()
console.log('og.png written')
