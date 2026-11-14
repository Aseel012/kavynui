import fs from 'node:fs'
import path from 'node:path'
import { describe, it, expect } from 'vitest'
import { parseProps } from '@/lib/registry'
import { controlsFor, changed, usageCode } from '@/site/PropsPlayground'
import catalog from '../../src/data/catalog.json'

const root = path.resolve(import.meta.dirname, '../..')
const src = (slug) => fs.readFileSync(path.join(root, 'src/kavyn', ['tsx', 'jsx'].map((x) => `${slug}.${x}`).find((f) => fs.existsSync(path.join(root, 'src/kavyn', f)))), 'utf8')
const item = { slug: 'x-thing', export: 'XThing' }

describe('props playground', () => {
  it('builds controls for numbers, booleans, text and colours, and skips the rest', () => {
    const c = controlsFor([
      { name: 'speed', type: 'number', default: '1' }, { name: 'count', type: 'number', default: '22' },
      { name: 'interactive', type: 'boolean', default: 'true' }, { name: 'label', type: 'string', default: "'Join'" },
      { name: 'color', type: 'string', default: "''" }, { name: 'onSubmit', type: 'function', default: '-' },
      { name: 'className', type: 'string', default: "''" }, { name: 'items', type: 'array', default: '[]' },
      { name: 'tpl', type: 'string', default: '`${a}`' },
    ])
    expect(c.map((x) => [x.name, x.kind])).toEqual([['speed', 'number'], ['count', 'number'], ['interactive', 'boolean'], ['label', 'text'], ['color', 'colour']])
    expect(c[0]).toMatchObject({ initial: 1, min: 0, step: 0.05 })
    expect(c[1]).toMatchObject({ initial: 22, step: 1, max: 88 })
  })

  it('caps text length relative to the default, so a 1-character currency cannot become a paragraph', () => {
    const [cur, label] = controlsFor([{ name: 'currency', type: 'string', default: "'$'" }, { name: 'label', type: 'string', default: "'Join the waitlist'" }])
    expect(cur.max).toBe(8)
    expect(label.max).toBe(68)
  })

  it('applies only values that differ from the defaults', () => {
    const c = controlsFor([{ name: 'speed', type: 'number', default: '1' }, { name: 'label', type: 'string', default: "'Hi'" }])
    expect(changed(c, { speed: 1, label: 'Yo' })).toEqual({ label: 'Yo' })
  })

  it('prints usage code that stays valid whatever the user types', () => {
    const code = usageCode(item, { label: 'He said "hi" </script> {x}', speed: 0.5, interactive: false, on: true })
    expect(code).toContain('label="He said \\"hi\\" </script> {x}"')
    expect(code).toContain('speed={0.5}')
    expect(code).toContain('interactive={false}')
    expect(code).toMatch(/\bon\b(?!=)/)
    expect(usageCode(item, {})).toContain('<XThing />')
  })

  it('every catalog component yields controls without throwing', () => {
    for (const c of catalog.components) expect(() => controlsFor(parseProps(src(c.slug))), c.slug).not.toThrow()
  })
})
