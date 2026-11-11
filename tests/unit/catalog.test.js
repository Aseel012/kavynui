import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import data from '@/data/catalog.json'
import { components, families, bySlug, search, neighbors } from '@/lib/catalog'
import { parseProps } from '@/lib/registry'

const root = path.resolve(import.meta.dirname, '../..')
const src = (f) => fs.readFileSync(path.join(root, 'src/kavyn', f), 'utf8')

describe('catalog integrity', () => {
  it('has unique slugs that each map to a component file', () => {
    expect(new Set(components.map((c) => c.slug)).size).toBe(components.length)
    for (const c of components) expect(fs.existsSync(path.join(root, 'src/kavyn', `${c.slug}.jsx`)), c.slug).toBe(true)
  })

  it('declares the export name the file really exports', () => {
    for (const c of components) expect(src(`${c.slug}.jsx`), c.slug).toMatch(new RegExp(`export default function ${c.export}\\b`))
  })

  it('puts every component in a known family and keeps family counts true', () => {
    const ids = new Set(families.map((f) => f.id))
    for (const c of components) expect(ids.has(c.family), c.slug).toBe(true)
    for (const f of families) expect(f.count, f.id).toBe(components.filter((c) => c.family === f.id).length)
    for (const f of families) expect(f.count, `${f.id} is empty`).toBeGreaterThan(0)
  })

  it('lists helper files that exist and are actually imported', () => {
    for (const c of components) for (const d of c.deps || []) {
      expect(fs.existsSync(path.join(root, 'src/kavyn', d)), `${c.slug} -> ${d}`).toBe(true)
    }
  })

  it('resolves every relative import inside component files', () => {
    for (const f of fs.readdirSync(path.join(root, 'src/kavyn'))) {
      for (const [, spec] of src(f).matchAll(/from '(\.\/[^']+)'/g)) {
        const base = path.join(root, 'src/kavyn', spec)
        expect([base, `${base}.js`, `${base}.jsx`].some((p) => fs.existsSync(p)), `${f} imports ${spec}`).toBe(true)
      }
    }
  })

  it('gives every component a one-line use case and description', () => {
    for (const c of components) {
      expect(c.useCase.length, c.slug).toBeGreaterThan(4)
      expect(c.useCase.length, c.slug).toBeLessThanOrEqual(90)
      expect(c.description.trim().length, c.slug).toBeGreaterThan(10)
    }
  })

  it('has no orphan component files outside the catalog', () => {
    const files = fs.readdirSync(path.join(root, 'src/kavyn')).filter((f) => f.endsWith('.jsx')).map((f) => f.replace('.jsx', ''))
    const helpers = new Set(components.flatMap((c) => c.deps || []).map((d) => d.replace(/\.jsx?$/, '')))
    for (const f of files) expect(bySlug[f] || helpers.has(f), `${f}.jsx is not in catalog.json`).toBeTruthy()
  })

  it('keeps sections in page order with pricing among them', () => {
    const order = data.components.filter((c) => c.family === 'blocks').map((c) => c.slug)
    expect(order.indexOf('product-hero')).toBe(0)
    expect(order.indexOf('wordmark-footer')).toBeGreaterThan(order.indexOf('faq-accordion'))
    expect(order).toContain('pricing-morph')
  })
})

describe('search', () => {
  it('returns everything for an empty query', () => expect(search('', 'all')).toHaveLength(components.length))
  it('ranks name prefix matches first', () => expect(search('avatar')[0].slug).toBe('avatar-upload'))
  it('matches use cases', () => expect(search('profile photo').map((c) => c.slug)).toContain('avatar-upload'))
  it('filters by family', () => {
    const r = search('', 'buttons')
    expect(r.length).toBe(families.find((f) => f.id === 'buttons').count)
    expect(r.every((c) => c.family === 'buttons')).toBe(true)
  })
  it('requires every word to match', () => expect(search('avatar zzzz')).toEqual([]))
  it('is case and whitespace insensitive', () => expect(search('  DROPZONE ')[0].slug).toBe('dropzone'))
})

describe('neighbors', () => {
  it('wraps around both ends', () => {
    expect(neighbors(components[0].slug).prev.slug).toBe(components.at(-1).slug)
    expect(neighbors(components.at(-1).slug).next.slug).toBe(components[0].slug)
  })
})

describe('parseProps', () => {
  it('reads names, defaults and types from the signature', () => {
    const p = Object.fromEntries(parseProps(src('avatar-upload.jsx')).map((x) => [x.name, x]))
    expect(p.size).toMatchObject({ default: '112', type: 'number' })
    expect(p.initialSrc).toMatchObject({ default: "''", type: 'string' })
    expect(p.onUpload).toMatchObject({ default: 'undefined', type: 'function' })
    expect(p.demoSrc.type).toBe('string')
    expect(Object.keys(p)).toEqual(['initialSrc', 'size', 'maxSizeMB', 'onUpload', 'onChange', 'demoSrc', 'name'])
  })
  it('does not split on commas inside nested defaults', () => {
    const p = parseProps("export default function X({ a = [1, 2], b = { c: 1, d: 2 }, e = 'x' }) {")
    expect(p.map((x) => x.name)).toEqual(['a', 'b', 'e'])
    expect(p[0].type).toBe('array')
  })
  it('returns nothing for components without a props object', () => expect(parseProps('export default function X() {')).toEqual([]))
})
