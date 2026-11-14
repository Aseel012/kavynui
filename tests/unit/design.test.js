import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { GRADIENTS, KINDS, styleOf, cssOf, reactOf, tailwindOf } from '@/data/gradients'

const root = path.resolve(import.meta.dirname, '../..')
const walk = (dir) => fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(dir, e.name)) : /\.([jt]sx?|css)$/.test(e.name) ? [path.join(dir, e.name)] : [])
const files = ['src/kavyn', 'src/site', 'src/pages', 'src/docs', 'src/data'].flatMap(walk).concat('src/index.css')

// Hue and saturation from a hex or rgb triplet.
function hsl(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min
  if (!d) return { h: 0, s: 0, l }
  const s = d / (1 - Math.abs(2 * l - 1))
  const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4
  return { h: (h * 60 + 360) % 360, s, l }
}
const isBlue = ({ h, s, l }) => h >= 185 && h <= 255 && s > 0.3 && l > 0.08
function colorsIn(text) {
  const out = []
  for (const [, hex] of text.matchAll(/#([0-9a-f]{6})\b/gi)) out.push([`#${hex}`, hsl(...[0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)))])
  for (const [m, r, g, b] of text.matchAll(/rgba?\((\d+),\s*(\d+),\s*(\d+)/g)) out.push([m, hsl(+r, +g, +b)])
  return out
}
const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrast = (a, b) => { const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }

describe('color audit', () => {
  it('has no trace of the retired orange accent', () => {
    for (const f of files) expect(fs.readFileSync(path.join(root, f), 'utf8'), f).not.toMatch(/ff6a2b|255,\s*106,\s*43|e14e0b/i)
  })
  it('uses no blue hex or rgb values', () => {
    // Third-party brand marks keep their official colors.
    const BRAND = new Set(['src/kavyn/share-sheet.jsx: #258ed7', 'src/kavyn/share-sheet.jsx: #4097c9'])
    const hits = files.flatMap((f) => colorsIn(fs.readFileSync(path.join(root, f), 'utf8')).filter(([, v]) => isBlue(v)).map(([c]) => `${f}: ${c}`)).filter((h) => !BRAND.has(h))
    expect(hits).toEqual([])
  })
  it('uses no blue Tailwind palette classes', () => {
    for (const f of files) expect(fs.readFileSync(path.join(root, f), 'utf8'), f).not.toMatch(/\b(?:bg|text|border|ring|from|to|via|fill|stroke|shadow|accent)-(?:blue|sky|indigo|cyan)-\d/)
  })
  it('never puts black text on the accent (it flips in light mode)', () => {
    for (const f of walk('src/kavyn')) {
      const s = fs.readFileSync(path.join(root, f), 'utf8')
      expect(/bg-acc\b[^"]*text-black|text-black[^"]*bg-acc\b/.test(s), f).toBe(false)
    }
  })
})

describe('theme tokens', () => {
  const css = fs.readFileSync(path.join(root, 'src/index.css'), 'utf8')
  const read = (re) => Object.fromEntries([...css.match(re)[1].matchAll(/--([\w-]+):\s*([^;]+);/g)].map(([, k, v]) => [k, v.trim()]))
  const dark = read(/:root\s*\{([\s\S]*?)\}/), light = read(/\.light\s*\{([\s\S]*?)\}/)
  it('defines the same ten tokens in both themes', () => {
    expect(Object.keys(dark).sort()).toEqual(Object.keys(light).sort())
    expect(Object.keys(dark)).toHaveLength(10)
  })
  it('is monochrome: every token is a gray (channel spread under 3%)', () => {
    for (const t of [dark, light]) for (const v of Object.values(t)) {
      const ch = [1, 3, 5].map((i) => parseInt(v.slice(i, i + 2), 16))
      expect((Math.max(...ch) - Math.min(...ch)) / 255, v).toBeLessThan(0.03)
    }
  })
  for (const [name, t] of [['dark', dark], ['light', light]]) {
    it(`${name}: body text passes AAA, secondary text passes AA`, () => {
      expect(contrast(t.tx, t.bg)).toBeGreaterThanOrEqual(7)
      expect(contrast(t.tx, t.panel)).toBeGreaterThanOrEqual(7)
      expect(contrast(t.mute, t.bg)).toBeGreaterThanOrEqual(4.5)
      expect(contrast(t['acc-fg'], t.acc)).toBeGreaterThanOrEqual(7)
    })
  }
})

describe('backgrounds', () => {
  it('has unique ids, a use case and a known kind', () => {
    expect(new Set(GRADIENTS.map((g) => g.id)).size).toBe(GRADIENTS.length)
    for (const g of GRADIENTS) { expect(g.use, g.id).toBeTruthy(); expect(KINDS).toContain(g.kind) }
  })
  it('builds a preview style with every layer', () => {
    for (const g of GRADIENTS) {
      const s = styleOf(g)
      expect(s.backgroundColor).toBe(g.base)
      expect(s.backgroundImage.split(/,\s*(?=(?:radial|linear|conic)-gradient|url\()/).length, g.id).toBe(g.layers.length)
      if (g.anim) expect(s.animation).toBe(g.anim.value)
    }
  })
  it('emits keyframes and a reduced-motion rule only for animated ones', () => {
    for (const g of GRADIENTS) {
      const c = cssOf(g)
      expect(c.includes('@keyframes'), g.id).toBe(!!g.anim)
      expect(c.includes('prefers-reduced-motion'), g.id).toBe(!!g.anim)
      expect((c.match(/\{/g) || []).length, g.id).toBe((c.match(/\}/g) || []).length)
    }
  })
  it('generates a React wrapper named after the background', () => {
    expect(reactOf(GRADIENTS.find((g) => g.id === 'copper-dusk'))).toMatch(/export default function CopperDuskBackground\(/)
  })
  it('makes Tailwind classes without spaces, or explains why not', () => {
    for (const g of GRADIENTS) {
      const t = tailwindOf(g)
      if (g.anim) expect(t).toMatch(/keyframes/)
      else expect(t.match(/className="([^"]*)"/)[1].split(' ').every((c) => c.length > 0)).toBe(true)
    }
  })
})
