import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import App from './App'
import ErrorBoundary from './site/ErrorBoundary'
import './index.css'

// A new deploy renames chunks. If an old tab asks for one that is gone, reload once.
window.addEventListener('vite:preloadError', (e) => {
  // Offline is not a stale deploy. Let the error boundary show a retry instead of reloading into the browser's offline page.
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return
  try {
    if (sessionStorage.getItem('kavyn.preload-reload') === '1') return
    sessionStorage.setItem('kavyn.preload-reload', '1')
  } catch { return }
  e.preventDefault()
  window.location.reload()
})

setTimeout(() => { try { sessionStorage.removeItem('kavyn.preload-reload') } catch { /* ignore */ } }, 10000)

const root = document.getElementById('root')
if (root) createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <ErrorBoundary><App /></ErrorBoundary>
      </MotionConfig>
    </BrowserRouter>
  </StrictMode>,
)
