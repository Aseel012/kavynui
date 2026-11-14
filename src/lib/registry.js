import { lazyRetry, importWithRetry } from './lazyRetry'

// One lazy chunk per component, generated from the files in src/kavyn.
const modules = import.meta.glob('../kavyn/*.{jsx,tsx}')
const sources = import.meta.glob('../kavyn/*.{jsx,js,tsx,ts}', { query: '?raw', import: 'default' })

const cache = {}

// Components are .jsx or .tsx; the catalog only knows the slug.
const keyOf = (slug) => [`../kavyn/${slug}.tsx`, `../kavyn/${slug}.jsx`].find((k) => modules[k])

/** File name of a component's source: 'liquid-button.jsx' or 'shader-silk.tsx'. */
export const fileOf = (slug) => (keyOf(slug) || `../kavyn/${slug}.jsx`).slice('../kavyn/'.length)

export function getComponent(slug) {
  const key = keyOf(slug)
  if (!key) return null
  if (!cache[slug]) cache[slug] = lazyRetry(modules[key])
  return cache[slug]
}

// Accepts a slug ('traffic-map') or a file name ('world-dots.js', 'shader-bg.tsx').
export async function getSource(slug) {
  const key = /\.[jt]sx?$/.test(slug) ? `../kavyn/${slug}` : `../kavyn/${fileOf(slug)}`
  if (!sources[key]) return ''
  try { return await importWithRetry(sources[key]) } catch { return null }
}

// Pull default props straight out of the component signature (TypeScript files end it with `}: Props)`).
export function parseProps(src) {
  const m = src.match(/export default function \w+\(\{([\s\S]*?)\}(?::\s*[\w.<>[\], |]+)?\)\s*\{/)
  if (!m) return []
  const out = []
  let depth = 0, cur = ''
  for (const ch of m[1]) {
    if ('([{'.includes(ch)) depth++
    if (')]}'.includes(ch)) depth--
    if (ch === ',' && depth === 0) { out.push(cur); cur = '' } else cur += ch
  }
  if (cur.trim()) out.push(cur)
  return out.map((s) => s.trim()).filter(Boolean).map((s) => {
    const [name, ...rest] = s.split('=')
    const def = rest.join('=').trim()
    const key = name.trim()
    const type = /^on[A-Z]/.test(key) ? 'function' : key === 'children' ? 'ReactNode' : key === 'style' ? 'CSSProperties' : !def || def === 'undefined' ? 'any'
      : /^['"`]/.test(def) ? 'string' : /^-?\d/.test(def) ? 'number' : /^(true|false)$/.test(def) ? 'boolean' : /^\[/.test(def) ? 'array' : /^[A-Z_]+$/.test(def) ? 'array | object' : 'any'
    return { name: name.trim(), default: def || '-', type }
  })
}
