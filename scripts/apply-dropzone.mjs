// Adds the Dropzone component to the catalog and syncs the actions family count
// with the real number of actions entries (also repairs any drift). Safe to re-run.
import fs from 'node:fs'

const file = new URL('../src/data/catalog.json', import.meta.url)
let s = fs.readFileSync(file, 'utf8')

const catalog = JSON.parse(s)
const trueCount = catalog.components.filter((c) => c.family === 'actions').length + (s.includes('"slug": "dropzone"') ? 0 : 1)

if (!s.includes('"slug": "dropzone"')) {
  const entry = `,
    {
    "slug": "dropzone",
    "name": "Dropzone",
    "export": "Dropzone",
    "family": "actions",
    "description": "File upload dropzone with per-file progress, retry and aggregate status",
    "useCase": "File upload flows",
    "tags": ["original"],
    "deps": [],
    "dependencies": ["motion", "react"]
  }`
  const tail = s.lastIndexOf('\n  ]\n}')
  if (tail === -1) throw new Error('catalog tail not found')
  s = s.slice(0, tail) + entry + s.slice(tail)
}

const m = s.match(/("id": "actions",\s*\n\s*"name": "Actions",\s*\n\s*"blurb": "[^"]*",\s*\n\s*"count": )(\d+)/)
if (!m) throw new Error('actions family count not found')
s = s.replace(m[0], m[1] + trueCount)

fs.writeFileSync(file, s)
console.log(`dropzone added; actions count ${m[2]} -> ${trueCount}`)