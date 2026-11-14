// Record a short, post-ready clip of any component's live preview.
//
//   npm run build && npx vite preview --port 4173 &
//   npm run clip -- shader-silk                      -> clips/shader-silk.mp4
//   npm run clip -- liquid-button --seconds 6 --square
//   npm run clip -- shader-horizon,shader-silk,shader-rays --seconds 3   -> clips/reel.mp4 (one after another)
//   npm run clip -- shader-silk --webp               -> also clips/shader-silk.webp (for README / GitHub)
//
// The pointer sweeps across the preview while recording, so hover and pointer effects show.
// Needs Chrome (set CHROME=/path/to/chrome) and ffmpeg on PATH. Uses puppeteer-core, already a dev dependency.
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import puppeteer from 'puppeteer-core'

const root = path.resolve(import.meta.dirname, '..')
const args = process.argv.slice(2)
const opt = (name, fallback) => { const i = args.indexOf(`--${name}`); return i === -1 ? fallback : args[i + 1] }
const has = (name) => args.includes(`--${name}`)
const BASE = (process.env.BASE || 'http://localhost:4173').replace(/\/+$/, '')
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'src/data/catalog.json'), 'utf8'))
const known = new Set(catalog.components.map((c) => c.slug))
const slugs = (args[0] && !args[0].startsWith('--') ? args[0] : '').split(',').filter(Boolean)
const seconds = Math.min(30, Math.max(1, Number(opt('seconds', 5)) || 5))
const square = has('square')
const light = has('light')
const die = (m) => { console.error(`clip: ${m}`); process.exit(1) }

if (!slugs.length) die('usage: npm run clip -- <slug>[,<slug>...] [--seconds 5] [--square] [--light] [--webp]')
for (const s of slugs) if (!known.has(s)) die(`"${s}" is not in catalog.json`)
try { execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' }) } catch { die('ffmpeg is not installed or not on PATH') }

const outDir = path.join(root, 'clips')
fs.mkdirSync(outDir, { recursive: true })
const tmp = fs.mkdtempSync(path.join(outDir, '.tmp-'))
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true,
  args: ['--no-sandbox', '--ignore-gpu-blocklist', '--enable-gpu-rasterization', '--window-size=1280,900'],
})
const parts = []
try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 })
  await page.evaluateOnNewDocument((theme) => { try { localStorage.setItem('kavynui.theme', theme) } catch { /* private mode */ } }, light ? 'light' : 'dark')
  for (const [i, slug] of slugs.entries()) {
    await page.goto(`${BASE}/components/${slug}`, { waitUntil: 'networkidle0', timeout: 60000 })
    // Hide the site around the preview and scroll it into the middle.
    await page.addStyleTag({ content: 'header,aside,nav{visibility:hidden!important}' })
    const frame = await page.evaluateHandle(() => document.querySelector('[class*="rounded-[22px]"][class*="border-line"]'))
    if (!frame.asElement()) die(`no preview frame found on /components/${slug}`)
    await frame.asElement().evaluate((el) => el.scrollIntoView({ block: 'center' }))
    await new Promise((r) => setTimeout(r, 1500))
    let box = await frame.asElement().boundingBox()
    if (square) { const side = Math.min(box.width, box.height); box = { x: box.x + (box.width - side) / 2, y: box.y + (box.height - side) / 2, width: side, height: side } }
    const crop = { x: Math.round(box.x + 2), y: Math.round(box.y + 2), width: Math.round(box.width - 4) & ~1, height: Math.round(box.height - 4) & ~1 }
    const raw = path.join(tmp, `${i}.webm`)
    const rec = await page.screencast({ path: raw, crop, scale: 1 })
    const steps = seconds * 20
    for (let s = 0; s < steps; s++) {
      const t = s / steps
      await page.mouse.move(crop.x + crop.width * (0.2 + 0.6 * t), crop.y + crop.height * (0.5 + 0.15 * Math.sin(t * Math.PI * 2)))
      await new Promise((r) => setTimeout(r, 50))
    }
    await rec.stop()
    const mp4 = path.join(tmp, `${i}.mp4`)
    // Even dimensions, 30 fps, H.264: what X, LinkedIn and Reddit accept without re-encoding problems.
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', raw, '-vf', 'scale=trunc(min(iw\\,1280)/2)*2:-2,fps=30', '-an', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart', mp4])
    parts.push(mp4)
    console.log(`recorded ${slug}`)
  }
} finally {
  await browser.close()
}

const name = slugs.length === 1 ? slugs[0] : 'reel'
const final = path.join(outDir, `${name}.mp4`)
if (parts.length === 1) fs.copyFileSync(parts[0], final)
else {
  const list = path.join(tmp, 'list.txt')
  fs.writeFileSync(list, parts.map((p) => `file '${p}'`).join('\n'))
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', final])
}
if (has('webp')) execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', final, '-vf', 'fps=20,scale=720:-1:flags=lanczos', '-c:v', 'libwebp', '-q:v', '62', '-compression_level', '6', '-loop', '0', '-an', path.join(outDir, `${name}.webp`)])
fs.rmSync(tmp, { recursive: true, force: true })
console.log(`saved ${path.relative(root, final)}${has('webp') ? ` and ${name}.webp` : ''}`)
