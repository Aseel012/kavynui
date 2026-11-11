import { describe, it, expect } from 'vitest'
import { justAdded, showcase, kitSections, stats } from '@/lib/home'
import { components, families } from '@/lib/catalog'

const c = (slug, extra = {}) => ({ slug, family: 'buttons', tags: [], ...extra })

describe('home data (derived from catalog.json)', () => {
  it('justAdded: dated items newest first, then undated in catalog order, capped', () => {
    const list = [c('a', { tags: ['new'] }), c('b', { tags: ['new'], added: '2026-01-01' }), c('x'), c('d', { tags: ['new'], added: '2026-03-01' }), c('e', { tags: ['new'] })]
    expect(justAdded(list, 3).map((x) => x.slug)).toEqual(['d', 'b', 'a'])
    expect(justAdded([c('x')])).toEqual([])
  })

  it('justAdded on the real catalog starts with Avatar Upload', () => {
    expect(justAdded()[0].slug).toBe('avatar-upload')
  })

  it('showcase: only families with featured items, in family order, capped per family', () => {
    const fams = [{ id: 'buttons' }, { id: 'forms' }, { id: 'nav' }]
    const list = [c('a', { tags: ['featured'] }), c('b', { tags: ['featured'] }), c('z', { tags: ['featured'] }), c('f', { family: 'nav', tags: ['featured'] }), c('g', { family: 'forms' })]
    const out = showcase(list, fams, 2)
    expect(out.map((f) => f.id)).toEqual(['buttons', 'nav'])
    expect(out[0].items.map((x) => x.slug)).toEqual(['a', 'b'])
  })

  it('showcase on the real catalog: every featured slug exists and families are real', () => {
    const ids = new Set(families.map((f) => f.id))
    for (const f of showcase()) { expect(ids.has(f.id)).toBe(true); expect(f.items.length).toBeGreaterThan(0) }
  })

  it('kitSections: only blocks with a role, in catalog order, with defaults', () => {
    const k = kitSections()
    expect(k[0]).toMatchObject({ slug: 'product-hero', role: 'Hero', on: true })
    expect(k.at(-1).role).toBe('Footer')
    expect(k.every((s) => s.item.family === 'blocks')).toBe(true)
    expect(k.some((s) => !s.on)).toBe(true)
  })

  it('stats count from the catalog', () => {
    expect(stats()).toEqual({ components: components.length, sections: components.filter((x) => x.family === 'blocks').length })
  })
})
