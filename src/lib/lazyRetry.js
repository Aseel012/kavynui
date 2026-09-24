import { lazy } from 'react'

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const RELOAD_KEY = 'kavyn.chunk-reload'

// Retries a dynamic import on flaky networks. If a chunk is gone after a new deploy,
// reload the page once so the browser picks up the fresh file names.
export async function importWithRetry(load, tries = 3) {
  let last
  for (let i = 0; i < tries; i++) {
    try {
      const mod = await load()
      try { sessionStorage.removeItem(RELOAD_KEY) } catch { /* storage blocked */ }
      return mod
    } catch (err) {
      last = err
      if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        await new Promise((r) => window.addEventListener('online', r, { once: true }))
      } else {
        await wait(400 * 2 ** i)
      }
    }
  }
  const chunkGone = /dynamically imported module|Failed to fetch|Importing a module script failed|error loading/i.test(String(last?.message))
  let reloaded = false
  try { reloaded = sessionStorage.getItem(RELOAD_KEY) === '1' } catch { /* ignore */ }
  if (chunkGone && !reloaded) {
    try { sessionStorage.setItem(RELOAD_KEY, '1') } catch { /* ignore */ }
    window.location.reload()
    return new Promise(() => {})
  }
  throw last
}

export const lazyRetry = (load) => lazy(() => importWithRetry(load))
