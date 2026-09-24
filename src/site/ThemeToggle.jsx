import { useState } from 'react'

export const THEME_KEY = 'kavynui.theme'

export function applyTheme(t) {
  document.documentElement.classList.toggle('light', t === 'light')
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t === 'light' ? '#fafafa' : '#09090a')
}

// Sun/moon toggle. Dark is the default; the choice persists in local storage.
export default function ThemeToggle({ className = '' }) {
  const [light, setLight] = useState(() => document.documentElement.classList.contains('light'))
  const toggle = () => {
    const t = light ? 'dark' : 'light'
    try { localStorage.setItem(THEME_KEY, t) } catch { /* storage blocked */ }
    applyTheme(t)
    setLight(!light)
  }
  return (
    <button type="button" onClick={toggle} aria-label={light ? 'Switch to dark mode' : 'Switch to light mode'} title={light ? 'Dark mode' : 'Light mode'} className={`grid size-9 place-items-center rounded-lg border border-line2 bg-panel text-mute hover:text-tx ${className}`}>
      {light ? (
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></svg>
      ) : (
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
      )}
    </button>
  )
}
