import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const sourceRoot = path.join(root, 'src/kavyn')
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'src/data/catalog.json'), 'utf8'))
const packageInfo = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
const css = fs.readFileSync(path.join(root, 'src/index.css'), 'utf8')
const readVars = (selector) => Object.fromEntries([...css.match(selector)[1].matchAll(/--([\w-]+):\s*([^;]+);/g)].map(([, key, value]) => [key, value.trim()]))
const dark = readVars(/:root\s*\{([\s\S]*?)\}/)
const light = readVars(/\.light\s*\{([\s\S]*?)\}/)
const theme = Object.fromEntries(Object.keys(dark).map(key => [`color-${key}`, `var(--${key})`]))
const imports = /(?:\b(?:import|export)\s+(?:[^'";]*?\s+from\s*)?|\bimport\s*\()\s*['"]([^'"]+)['"]/g
function resolveSource(name, from = sourceRoot) {
  const stem = path.resolve(from, name)
  if (!stem.startsWith(sourceRoot + path.sep)) throw new Error(`Outside source root: ${name}`)
  const found = [stem, `${stem}.jsx`, `${stem}.js`, path.join(stem, 'index.jsx'), path.join(stem, 'index.js')].find(file => fs.existsSync(file) && fs.statSync(file).isFile())
  if (!found) throw new Error(`Missing local source: ${name}`)
  return found
}
function collect(entry) {
  const files = new Map(), dependencies = new Set()
  function visit(file) {
    if (files.has(file)) return
    const content = fs.readFileSync(file, 'utf8')
    files.set(file, content)
    for (const [, specifier] of content.matchAll(imports)) {
      if (specifier.startsWith('.')) visit(resolveSource(specifier, path.dirname(file)))
      else {
        const name = specifier.startsWith('@') ? specifier.split('/').slice(0, 2).join('/') : specifier.split('/')[0]
        if (!packageInfo.dependencies[name]) throw new Error(`Unknown dependency ${name} in ${file}`)
        dependencies.add(name)
      }
    }
  }
  visit(resolveSource(`./${entry.slug}.jsx`))
  for (const dep of entry.deps || []) visit(resolveSource(`./${dep}`))
  for (const dep of entry.dependencies || []) dependencies.add(dep)
  return { files, dependencies }
}
const output = path.join(root, 'public/r')
fs.mkdirSync(output, { recursive: true })
// Remove only generated JSON to avoid retaining deleted catalog entries.
for (const file of fs.readdirSync(output)) if (file.endsWith('.json')) fs.unlinkSync(path.join(output, file))
const items = catalog.components.map(entry => {
  const { files, dependencies } = collect(entry)
  const item = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: entry.slug,
    title: entry.name,
    type: entry.family === 'blocks' ? 'registry:block' : 'registry:component',
    description: entry.description,
    dependencies: [...dependencies].filter(name => !['react', 'react-dom'].includes(name)).map(name => `${name}@${packageInfo.dependencies[name]}`).sort(),
    files: [...files].map(([file, content]) => ({ path: `src/kavyn/${path.relative(sourceRoot, file)}`, type: 'registry:file', target: `@components/kavyn/${path.relative(sourceRoot, file)}`, content })),
    cssVars: { theme, light, dark },
    css: { '.light': Object.fromEntries(Object.entries(light).map(([key, value]) => [`--${key}`, value])) },
  }
  fs.writeFileSync(path.join(output, `${entry.slug}.json`), JSON.stringify(item, null, 2) + '\n')
  return item
})
const index = { $schema: 'https://ui.shadcn.com/schema/registry.json', name: 'kavynui', homepage: 'https://kavynui.com', items }
fs.writeFileSync(path.join(output, 'index.json'), JSON.stringify(index, null, 2) + '\n')
console.log(`registry: ${items.length} components with transitive sources and Tailwind v4 tokens`)
