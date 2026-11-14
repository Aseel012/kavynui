// The "does it work on someone else's site" test.
//
// Creates a brand-new Vite + React 19 + Tailwind v4 app in a temp folder, installs EVERY component
// from the built registry with the real shadcn CLI, then:
//   1. type-checks the app (TypeScript project) or skips that step (JavaScript project)
//   2. builds it for production
// A component that installs a missing file, imports a package the registry does not declare,
// or breaks TypeScript fails here before a user finds out.
//
//   npm run build
//   npx vite preview --host 127.0.0.1 --port 4173 &
//   npm run test:install            # TypeScript app
//   JS=1 npm run test:install       # JavaScript app ("tsx": false: the CLI strips types)
//
// Needs network for npm install. Reads catalog.json, so new components are covered automatically.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const root = path.resolve(import.meta.dirname, '..')
const base = (process.argv[2] || process.env.BASE || 'http://127.0.0.1:4173').replace(/\/+$/, '')
const ts = !process.env.JS
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'src/data/catalog.json'), 'utf8'))
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'kavyn-install-'))
const write = (f, s) => { fs.mkdirSync(path.dirname(path.join(dir, f)), { recursive: true }); fs.writeFileSync(path.join(dir, f), s) }
const run = (cmd, args, env = {}) => execFileSync(cmd, args, { cwd: dir, stdio: 'inherit', env: { ...process.env, ...env } })
const ext = ts ? 'tsx' : 'jsx'

try {
  const res = await fetch(`${base}/r/registry.json`).catch(() => null)
  if (!res?.ok) throw new Error(`No registry at ${base}/r/registry.json. Build and serve the site first.`)

  write('package.json', JSON.stringify({
    name: 'kavyn-install-test', private: true, type: 'module',
    dependencies: { react: '^19.1.0', 'react-dom': '^19.1.0' },
    devDependencies: { vite: '^7.1.0', '@vitejs/plugin-react': '^5.0.0', tailwindcss: '^4.1.0', '@tailwindcss/vite': '^4.1.0', ...(ts ? { typescript: '~5.9.0', '@types/react': '^19.1.0', '@types/react-dom': '^19.1.0' } : {}) },
  }, null, 2))
  write('src/index.css', '@import "tailwindcss";\n')
  write(ts ? 'tsconfig.json' : 'jsconfig.json', JSON.stringify({ compilerOptions: { target: 'ES2022', lib: ['ES2022', 'DOM', 'DOM.Iterable'], module: 'ESNext', moduleResolution: 'bundler', jsx: 'react-jsx', strict: true, noEmit: true, skipLibCheck: true, allowJs: true, baseUrl: '.', paths: { '@/*': ['./src/*'] } }, include: ['src'] }))
  write('vite.config.js', "import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\nimport tailwind from '@tailwindcss/vite'\nimport path from 'node:path'\nexport default defineConfig({ plugins: [react(), tailwind()], resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } } })\n")
  write('components.json', JSON.stringify({ $schema: 'https://ui.shadcn.com/schema.json', style: 'new-york', rsc: false, tsx: ts, tailwind: { config: '', css: 'src/index.css', baseColor: 'neutral', cssVariables: true }, aliases: { components: '@/components', utils: '@/lib/utils', ui: '@/components/ui', lib: '@/lib', hooks: '@/hooks' } }))
  run('npm', ['install', '--no-audit', '--no-fund', '--loglevel=error'])

  const urls = catalog.components.map((c) => `${base}/r/${c.slug}.json`)
  run(path.join(root, 'node_modules/.bin/shadcn'), ['add', ...urls, '--yes', '--overwrite'])

  // One page that imports and renders every component with its default props.
  const imports = catalog.components.map((c) => `import ${c.export} from '@/components/kavyn/${c.slug}'`).join('\n')
  const items = catalog.components.map((c) => `<section key="${c.slug}" style={{ minHeight: 320 }}><${c.export} /></section>`).join('\n      ')
  write(`src/App.${ext}`, `${imports}\n\nexport default function App() {\n  return (\n    <main>\n      ${items}\n    </main>\n  )\n}\n`)
  write(`src/main.${ext}`, `import { createRoot } from 'react-dom/client'\nimport './index.css'\nimport App from './App'\ncreateRoot(document.getElementById('root')${ts ? '!' : ''}).render(<App />)\n`)
  write('index.html', `<!doctype html><html><head><meta charset="utf-8"><title>install test</title></head><body><div id="root"></div><script type="module" src="/src/main.${ext}"></script></body></html>\n`)

  const missing = catalog.components.filter((c) => !['tsx', 'jsx'].some((x) => fs.existsSync(path.join(dir, `src/components/kavyn/${c.slug}.${x}`))))
  if (missing.length) throw new Error(`Not installed: ${missing.map((c) => c.slug).join(', ')}`)
  if (ts) run('npx', ['tsc', '--noEmit', '-p', '.'])
  run('npx', ['vite', 'build', '--logLevel', 'warn'])
  console.log(`PASS: ${catalog.components.length} components installed into a fresh ${ts ? 'TypeScript' : 'JavaScript'} app, ${ts ? 'type-checked and ' : ''}built.`)
  fs.rmSync(dir, { recursive: true, force: true })
} catch (e) {
  console.error(`FAIL: ${e.message}\nTest app left at ${dir} for inspection.`)
  process.exit(1)
}
