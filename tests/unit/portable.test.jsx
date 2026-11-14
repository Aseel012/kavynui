// @vitest-environment node
// Every component must work once it is installed in someone else's app, not just on kavynui.com.
// These tests read catalog.json, so a component you add later is covered with no edits here.
import fs from 'node:fs'
import path from 'node:path'
import { describe, it, expect } from 'vitest'
import { renderToString } from 'react-dom/server'
import catalog from '../../src/data/catalog.json'

const root = path.resolve(import.meta.dirname, '../..')
const dir = path.join(root, 'src/kavyn')
const fileOf = (slug) => ['tsx', 'jsx'].map((x) => `${slug}.${x}`).find((f) => fs.existsSync(path.join(dir, f)))
const modules = import.meta.glob('../../src/kavyn/*.{jsx,tsx}')
const load = (slug) => modules[`../../src/kavyn/${fileOf(slug)}`]()
// Every file a user receives: components and the helpers they import.
const shipped = fs.readdirSync(dir).filter((f) => /\.[jt]sx?$/.test(f))
const read = (f) => fs.readFileSync(path.join(dir, f), 'utf8')
// Comments may mention URLs (licences, docs); only code counts.
const code = (src) => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1')

describe('server rendering (Next.js, Remix, Astro)', () => {
  // A component that touches window or document while rendering crashes the whole page on the server.
  for (const c of catalog.components) {
    it(`${c.slug} renders on the server with default props`, async () => {
      const mod = await load(c.slug)
      const C = mod.default
      expect(typeof C, `${c.slug} has no default export`).toBe('function')
      expect(() => renderToString(<C />)).not.toThrow()
    })
  }
})

describe('safe to paste into any site', () => {
  it('no component calls a third-party server by default', () => {
    // Assets from another host leak every visitor's IP to that host and break under a strict CSP.
    // Allowed: share-intent links the user clicks, and placeholder links that are never fetched.
    const allowed = /^https:\/\/(api\.whatsapp\.com\/send|t\.me\/share|twitter\.com\/intent|x\.com\/intent)|^http:\/\/www\.w3\.org\/|^https?:\/\/(localhost|example\.(com|org))\b/
    for (const f of shipped) {
      const urls = code(read(f)).match(/https?:\/\/[^\s'"`)<>]+/g) || []
      expect(urls.filter((u) => !allowed.test(u)), f).toEqual([])
    }
  })

  it('no raw HTML injection or code evaluation', () => {
    for (const f of shipped) {
      const src = code(read(f))
      expect(src, f).not.toMatch(/dangerouslySetInnerHTML|\.innerHTML\s*=|outerHTML\s*=|insertAdjacentHTML|document\.write|\beval\(|new Function\(/)
    }
  })

  it('links that open a new tab cannot reach back into the page', () => {
    for (const f of shipped) {
      const src = read(f)
      for (const m of src.matchAll(/<a\b[^>]*target=["{]['"]?_blank[^>]*>/g)) expect(m[0], f).toMatch(/noopener|noreferrer/)
      for (const m of src.matchAll(/window\.open\([^)]*\)/g)) expect(m[0], f).toMatch(/noopener/)
    }
  })

  it('every component is marked as a client component for the Next.js app router', () => {
    for (const c of catalog.components) expect(read(fileOf(c.slug)).trimStart().startsWith("'use client'"), c.slug).toBe(true)
  })

  it('imports resolve to React, motion, or files the registry ships', () => {
    const ok = new Set(['react', 'react-dom', 'motion/react', 'motion', 'react/jsx-runtime'])
    for (const f of shipped) {
      for (const [, spec] of read(f).matchAll(/from\s+['"]([^'"]+)['"]/g)) {
        if (spec.startsWith('.')) continue
        expect(ok.has(spec), `${f} imports ${spec}, which installs will not have`).toBe(true)
      }
    }
  })
})
