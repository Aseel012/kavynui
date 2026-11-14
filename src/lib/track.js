import { track as vercelTrack } from '@vercel/analytics'

// One place for product events (which component gets copied, which command gets used).
//
// Events always go to Vercel Web Analytics. Vercel only stores custom events on paid plans, so on
// the free plan set VITE_POSTHOG_KEY as well: events are then also sent to PostHog (free tier) with
// a plain fetch. No SDK, no cookies, and the id below lives only as long as the tab.
const clean = (v) => (typeof v === 'string' ? v.trim() : '')
const KEY = clean(import.meta.env.VITE_POSTHOG_KEY)
const HOST = /^https:\/\/[a-z0-9.-]+$/i.test(clean(import.meta.env.VITE_POSTHOG_HOST)) ? clean(import.meta.env.VITE_POSTHOG_HOST) : 'https://us.i.posthog.com'

function sessionId() {
  try {
    let id = sessionStorage.getItem('kavyn.sid')
    if (!id) { id = `s_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`; sessionStorage.setItem('kavyn.sid', id) }
    return id
  } catch { return 's_anon' }
}

/** track('copy_install', { slug: 'liquid-button' }) - never throws, never blocks the UI. */
export function track(name, props = {}) {
  if (typeof window === 'undefined') return
  try { vercelTrack(name, props) } catch { /* analytics must never break the page */ }
  if (!KEY) return
  try {
    fetch(`${HOST}/i/v0/e/`, {
      method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: KEY, event: name, distinct_id: sessionId(), properties: { ...props, path: window.location.pathname, $process_person_profile: false } }),
    }).catch(() => {})
  } catch { /* ignore */ }
}
