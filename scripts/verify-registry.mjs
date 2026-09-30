import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import Ajv from 'ajv'

const root = path.resolve(import.meta.dirname, '..')
const base = process.argv[2] || 'http://127.0.0.1:4173'
const ajv = new Ajv({ strict: false })
ajv.addMetaSchema(ajv.getSchema('http://json-schema.org/draft-07/schema').schema, 'https://json-schema.org/draft-07/schema')
const itemSchema = await (await fetch('https://ui.shadcn.com/schema/registry-item.json')).json()
const indexSchema = await (await fetch('https://ui.shadcn.com/schema/registry.json')).json()
ajv.addSchema(itemSchema, 'https://ui.shadcn.com/schema/registry-item.json')
const validateItem = ajv.compile(itemSchema), validateIndex = ajv.compile(indexSchema)
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'src/data/catalog.json'), 'utf8'))
for (const entry of catalog.components) {
  const response = await fetch(`${base}/r/${entry.slug}.json`)
  assert.equal(response.status, 200, entry.slug)
  assert.match(response.headers.get('content-type'), /json/)
  const item = await response.json()
  assert.ok(validateItem(item), `${entry.slug}: ${JSON.stringify(validateItem.errors)}`)
  assert.equal(item.name, entry.slug)
  assert.ok(item.files.length > 0)
  for (const file of item.files) {
    assert.equal(file.content, fs.readFileSync(path.join(root, file.path), 'utf8'), file.path)
    assert.ok(file.target.startsWith('@components/kavyn/'))
  }
  assert.equal(Object.keys(item.cssVars.theme).length, 9)
}
const response = await fetch(`${base}/r/index.json`)
const index = await response.json()
assert.ok(validateIndex(index), JSON.stringify(validateIndex.errors))
assert.equal(index.items.length, catalog.components.length)
console.log(`PASS: ${catalog.components.length} served endpoints and registry index are schema-valid; every source is complete and byte-identical.`)
