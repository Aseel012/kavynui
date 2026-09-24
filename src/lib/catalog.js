import data from '@/data/catalog.json'

export const families = data.families
export const components = data.components
export const bySlug = Object.fromEntries(components.map((c) => [c.slug, c]))
export const familyById = Object.fromEntries(families.map((f) => [f.id, f]))

export function search(query, family) {
  const q = query.trim().toLowerCase()
  const words = q.split(/\s+/).filter(Boolean)
  return components
    .filter((c) => !family || family === 'all' || c.family === family)
    .map((c) => {
      if (!words.length) return { c, score: 1 }
      const name = c.name.toLowerCase()
      const hay = `${name} ${c.description} ${c.useCase} ${familyById[c.family]?.name || ''} ${c.tags.join(' ')}`.toLowerCase()
      if (!words.every((w) => hay.includes(w))) return null
      let score = 1
      if (name.startsWith(q)) score += 10
      else if (name.includes(q)) score += 5
      words.forEach((w) => { if (name.includes(w)) score += 2 })
      return { c, score }
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.c)
}

export function neighbors(slug) {
  const i = components.findIndex((c) => c.slug === slug)
  return { prev: components[(i - 1 + components.length) % components.length], next: components[(i + 1) % components.length] }
}
