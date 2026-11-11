// Everything the home page shows is derived from catalog.json, so adding a component
// never needs a home page edit:
//   tags: ["featured"]          -> appears in the live showcase under its family
//   tags: ["new"], added: date  -> "Just added" tiles; the newest also gets the hero pill
//   kit: { role, on }           -> a section in "Assemble a page" (on = switched on by default)
import { components, families } from './catalog'

const time = (c) => (c.added ? Date.parse(c.added) : 0)

/** Newest first: dated items by date, then undated "new" items in catalog order. */
export function justAdded(list = components, limit = 4) {
  return list
    .map((c, i) => [c, i])
    .filter(([c]) => c.tags.includes('new'))
    .sort((a, b) => time(b[0]) - time(a[0]) || a[1] - b[1])
    .slice(0, limit)
    .map(([c]) => c)
}

/** Families that have featured components, each with up to `per` of them, in family order. */
export function showcase(list = components, fams = families, per = 3) {
  return fams
    .map((f) => ({ ...f, items: list.filter((c) => c.family === f.id && c.tags.includes('featured')).slice(0, per) }))
    .filter((f) => f.items.length)
}

/** Page-kit sections in catalog (reading) order. */
export function kitSections(list = components) {
  return list.filter((c) => c.kit?.role).map((c) => ({ slug: c.slug, role: c.kit.role, on: !!c.kit.on, item: c }))
}

export function stats(list = components) {
  return { components: list.length, sections: list.filter((c) => c.family === 'blocks').length }
}
