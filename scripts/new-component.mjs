// Scaffold a new component in one command:
//
//   npm run new -- <slug> --family <family> [--name "Display Name"] [--use "Use case"] [--js] [--shader]
//
//   npm run new -- price-flip --family cards --use "Pricing card"
//   npm run new -- shader-mist --family bg --shader
//
// Writes src/kavyn/<slug>.tsx (or .jsx with --js) from a template that already follows the library's
// rules ('use client', theme tokens, reduced motion, typed props), and adds the catalog entry.
// From there the build picks it up everywhere with no other edits: sidebar, search, detail page,
// registry JSON, static page, share image, sitemap, llms.txt, and every test in tests/unit.
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const catalogPath = path.join(root, 'src/data/catalog.json')
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'))
const argv = process.argv.slice(2)
const flag = (name) => { const i = argv.indexOf(`--${name}`); return i === -1 ? undefined : (argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : true) }
const die = (msg) => { console.error(`new-component: ${msg}`); process.exit(1) }

const slug = argv.find((a) => !a.startsWith('--') && !argv[argv.indexOf(a) - 1]?.startsWith('--'))
if (!slug) die('usage: npm run new -- <slug> --family <family> [--name "Name"] [--use "Use case"] [--js] [--shader]')
if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(slug)) die(`"${slug}" is not a valid slug. Use lowercase words joined by hyphens, like hold-to-confirm.`)
if (catalog.components.some((c) => c.slug === slug)) die(`"${slug}" is already in catalog.json.`)
const shader = flag('shader') === true
const family = flag('family') || (shader ? 'bg' : undefined)
const families = catalog.families.map((f) => f.id)
if (!families.includes(family)) die(`--family must be one of: ${families.join(', ')}`)
const ext = flag('js') === true && !shader ? 'jsx' : 'tsx'
const file = path.join(root, 'src/kavyn', `${slug}.${ext}`)
if (['jsx', 'tsx'].some((x) => fs.existsSync(path.join(root, 'src/kavyn', `${slug}.${x}`)))) die(`src/kavyn/${slug} already exists.`)

const title = (s) => s.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ')
const name = typeof flag('name') === 'string' ? flag('name') : title(slug)
const exportName = name.replace(/[^A-Za-z0-9]+/g, ' ').trim().split(' ').map((w) => w[0].toUpperCase() + w.slice(1)).join('')
if (!/^[A-Z][A-Za-z0-9]*$/.test(exportName)) die(`Could not make a component name from "${name}".`)
if (catalog.components.some((c) => c.export === exportName)) die(`Another component already exports ${exportName}. Pass --name.`)
const useCase = typeof flag('use') === 'string' ? flag('use') : 'TODO: the job this does, e.g. "Delete account"'

const SHADER = `'use client'

import ShaderBackground, { type ShaderBackgroundProps } from './shader-bg'

// Helpers available here: centered(), pointer(), noise(), fbm(), hash(), hash2(), and
// uniforms uTime, uMouse, uRes, uPx, uScale. Finish with paint(amount 0..1, colourBlend 0..1).
const FRAG = \`
void main(){
  vec2 p=centered()*uScale;float t=uTime*.2;
  float v=fbm(p*1.5+t);
  v+=uMouse.w*.4*exp(-4.*length(centered()-pointer()));
  paint(smoothstep(.35,.85,v)*.6,v);
}
\`

// TODO: one line on what this looks like.
export default function ${exportName}({ color = '', color2 = '', speed = 1, intensity = 1, scale = 1, interactive = true, allowSoftware = false, className = '', style, children }: ShaderBackgroundProps) {
  return (
    <ShaderBackground frag={FRAG} color={color} color2={color2} speed={speed} intensity={intensity} scale={scale} interactive={interactive} allowSoftware={allowSoftware} className={className} style={style}>
      {children}
    </ShaderBackground>
  )
}
`

const TSX = `'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

export interface ${exportName}Props {
  /** Text shown on the component. */
  label?: string
  /** Called when the user activates it. */
  onAction?: () => void
  className?: string
}

// TODO: one line on what it does and the job it is for.
// Rules every kavynUI component follows (tests check the first three):
//   'use client' on line 1; no network requests; nothing touches window or document while rendering
//   colours only from theme classes (bg-bg, bg-panel, text-tx, text-mute, border-line ...)
//   respect reduced motion; reachable and usable by keyboard
export default function ${exportName}({ label = '${name}', onAction, className = '' }: ${exportName}Props) {
  const reduced = useReducedMotion()
  const [on, setOn] = useState(false)
  return (
    <motion.button
      type="button"
      aria-pressed={on}
      onClick={() => { setOn((v) => !v); onAction?.() }}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      className={\`rounded-full bg-panel px-5 py-2.5 text-sm font-medium text-tx outline-none transition-colors hover:bg-panel2 focus-visible:ring-2 focus-visible:ring-tx \${className}\`}
    >
      {label}
    </motion.button>
  )
}
`

const JSX = TSX
  .replace(/export interface [\s\S]*?\n}\n\n/, '')
  .replace(`}: ${exportName}Props) {`, '}) {')
  .replace(`export default function ${exportName}`, `/** @param {{ label?: string, onAction?: () => void, className?: string }} props */\nexport default function ${exportName}`)

fs.writeFileSync(file, shader ? SHADER : ext === 'tsx' ? TSX : JSX)

const entry = {
  slug, name, export: exportName, family,
  description: 'TODO: one short line, no full stop',
  useCase,
  tags: ['new', 'original'],
  ...(shader ? { deps: ['shader-bg.tsx'], dependencies: ['react'] } : { dependencies: ['motion', 'react'] }),
  ...(ext === 'tsx' ? { lang: 'tsx' } : {}),
  added: new Date().toISOString().slice(0, 10),
}
// Insert after the last component of the same family, so the sidebar order stays grouped.
const last = catalog.components.map((c) => c.family).lastIndexOf(family)
catalog.components.splice(last + 1, 0, entry)
const fam = catalog.families.find((f) => f.id === family)
if (typeof fam.count === 'number') fam.count = catalog.components.filter((c) => c.family === family).length
fs.writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`)

console.log(`Created src/kavyn/${slug}.${ext} and added "${slug}" to catalog.json (${family}).

Next:
  1. Build it: npm run dev, then open /components/${slug}
  2. Fill the TODOs: description and useCase in catalog.json, the comment in the file
  3. npm test && npm run build    (tests cover it automatically: server render, no network, imports)`)
