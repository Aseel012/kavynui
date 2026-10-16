// Fast static checks. No browser, no network. Run: npm run check
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8')
const errors = []
const fail = (m) => errors.push(m)

// 1. Stray delivery files must not be committed or sitting in the repo root
const strayRoot = /\.(patch|diff|orig|rej|tar\.gz|zip|zip\.txt)$|^kavyn-.*(fix|files)/i
for (const name of fs.readdirSync(root)) {
  if (name === 'node_modules' || name === 'dist' || name === '.git') continue
  if (strayRoot.test(name)) fail(`stray file in repo root: ${name} (delete it)`)
}

// 2. Every catalog entry: source file, one-line "problem it solves" (useCase), unique slug
const catalog = JSON.parse(read('src/data/catalog.json'))
const seen = new Set()
for (const c of catalog.components) {
  if (seen.has(c.slug)) fail(`duplicate slug: ${c.slug}`)
  seen.add(c.slug)
  if (!fs.existsSync(path.join(root, 'src/kavyn', `${c.slug}.jsx`))) fail(`${c.slug}: src/kavyn/${c.slug}.jsx is missing`)
  const u = (c.useCase || '').trim()
  if (u.length < 5) fail(`${c.slug}: "useCase" is empty. Write one line: what problem does this solve?`)
  if (u.length > 90 || u.includes('\n')) fail(`${c.slug}: "useCase" must be one short line (max 90 chars)`)
  if (!c.description || !c.description.trim()) fail(`${c.slug}: description is empty`)
}

// 3. Component files in src/kavyn that are not in the catalog (orphans)
for (const f of fs.readdirSync(path.join(root, 'src/kavyn'))) {
  if (!f.endsWith('.jsx')) continue
  const slug = f.replace(/\.jsx$/, '')
  if (!seen.has(slug)) console.warn(`warn: src/kavyn/${f} is not in catalog.json (helper file? ok. component? add it)`)
}

// 4. CSP: site code must not load external images (vercel.json has img-src 'self')
const vercel = JSON.parse(read('vercel.json'))
const csp = JSON.stringify(vercel).match(/img-src ([^;]*);/)?.[1] || ''
if (/https?:/.test(csp)) console.warn(`warn: CSP img-src allows external hosts: ${csp}`)
else {
  const dirs = ['src/site', 'src/pages', 'src/App.jsx']
  const files = []
  const walk = (p) => {
    const full = path.join(root, p)
    if (fs.statSync(full).isDirectory()) fs.readdirSync(full).forEach((n) => walk(path.join(p, n)))
    else if (/\.(jsx?|css)$/.test(p)) files.push(p)
  }
  dirs.forEach(walk)
  for (const f of files) {
    const hit = read(f).match(/(?:src\s*[=:]\s*|url\()\s*['"(]?https?:\/\/[^'")\s]+\.(?:jpe?g|png|webp|gif|avif|svg)/i)
    if (hit) fail(`${f}: external image blocked by CSP (img-src 'self'): ${hit[0].slice(0, 80)}. Put it in public/ instead.`)
  }
}

// 5. Site chrome must use theme tokens, not hardcoded dark hex
const darkHex = /#(1a1024|0b0b0d|0a0a0a|111113)\b/i
for (const f of ['src/site/CodeBlock.jsx', 'src/site/Layout.jsx', 'src/pages/Detail.jsx']) {
  if (fs.existsSync(path.join(root, f)) && darkHex.test(read(f))) fail(`${f}: hardcoded dark hex, use var(--bg) / var(--panel) tokens`)
}

// 6. Detail page animations: initial={false} freezes them
if (/AnimatePresence[^>]*initial=\{false\}/.test(read('src/pages/Detail.jsx'))) fail('src/pages/Detail.jsx: AnimatePresence initial={false} freezes demo animations')

if (errors.length) {
  console.error(errors.map((e) => `FAIL ${e}`).join('\n'))
  console.error(`\n${errors.length} problem(s)`)
  process.exit(1)
}
console.log(`ok: ${catalog.components.length} components checked`)
