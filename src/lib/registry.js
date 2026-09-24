import { lazyRetry, importWithRetry } from './lazyRetry'

// One lazy chunk per component, generated from the files in src/kavyn.
const modules = import.meta.glob('../kavyn/*.jsx')
const sources = import.meta.glob('../kavyn/*.{jsx,js}', { query: '?raw', import: 'default' })

const slugOf = (p) => p.split('/').pop().replace('.jsx', '')
const cache = {}

export function getComponent(slug) {
  const key = `../kavyn/${slug}.jsx`
  if (!modules[key]) return null
  if (!cache[slug]) cache[slug] = lazyRetry(modules[key])
  return cache[slug]
}

// Accepts a slug ('traffic-map') or a file name ('world-dots.js').
export async function getSource(slug) {
  const key = /\.jsx?$/.test(slug) ? `../kavyn/${slug}` : `../kavyn/${slug}.jsx`
  if (!sources[key]) return ''
  try { return await importWithRetry(sources[key]) } catch { return null }
}

export const registeredSlugs = Object.keys(modules).map(slugOf)

// Pull default props straight out of the component signature.
export function parseProps(src) {
  const m = src.match(/export default function \w+\(\{([\s\S]*?)\}\)\s*\{/)
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
    const type = !def ? (name.trim() === 'children' ? 'ReactNode' : name.trim().startsWith('on') ? 'function' : 'any')
      : /^['"`]/.test(def) ? 'string' : /^-?\d/.test(def) ? 'number' : /^(true|false)$/.test(def) ? 'boolean' : /^\[/.test(def) ? 'array' : /^[A-Z_]+$/.test(def) ? 'array | object' : 'any'
    return { name: name.trim(), default: def || '-', type }
  })
}
