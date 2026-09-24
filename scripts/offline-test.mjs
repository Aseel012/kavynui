// Offline test: load home, drop the network, navigate to a lazy page, restore, confirm it recovers.
import puppeteer from 'puppeteer-core'
const BASE = process.env.BASE || 'http://localhost:4173'
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-gpu', `--user-data-dir=/tmp/off-${process.pid}`] })
const page = await browser.newPage()
const errs = []
page.on('pageerror', (e) => errs.push('pageerror: ' + e.message))
page.on('console', (m) => m.type() === 'error' && errs.push('console: ' + m.text()))
await page.goto(BASE + '/', { waitUntil: 'networkidle2' })
await page.setOfflineMode(true)
await page.evaluate(() => window.dispatchEvent(new Event('offline')))
await new Promise((r) => setTimeout(r, 500))
const pill = await page.$eval('[role=status]', (e) => e.textContent).catch(() => '')
await page.click('a[href="/docs"]')
await new Promise((r) => setTimeout(r, 2500))
const during = page.url() + ' :: ' + await page.$eval('body', (e) => e.innerText.slice(0, 80)).catch(() => '')
await page.setOfflineMode(false)
await page.evaluate(() => window.dispatchEvent(new Event('online')))
await new Promise((r) => setTimeout(r, 3000))
const h1 = await page.$eval('h1', (e) => e.textContent).catch(() => '')
console.log(JSON.stringify({ pill, during, h1, errs }, null, 1))
await browser.close()
