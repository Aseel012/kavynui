import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

// Same resolution order as scripts/gen-seo.mjs: process env, then .env files, then the placeholder.
const siteUrl = (mode) => {
  const env = loadEnv(mode, process.cwd(), '')
  const raw = (process.env.VITE_SITE_URL || env.VITE_SITE_URL || 'https://kavynui.com').replace(/\/+$/, '')
  return /^https:\/\/[a-z0-9.-]+(:\d+)?$/i.test(raw) ? raw : 'https://kavynui.com'
}

// Fills __SITE_URL__ tokens in index.html so the static head (canonical, OG, JSON-LD)
// points at the real domain even before React mounts.
const siteUrlHtml = (mode) => ({
  name: 'site-url-html',
  transformIndexHtml(html) { return html.replaceAll('__SITE_URL__', siteUrl(mode)) },
})

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), siteUrlHtml(mode)],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: { chunkSizeWarningLimit: 900 },
}))

