import { Link } from 'react-router-dom'

// Bar + keyframe diamond = K. Colours come from the theme tokens, so it follows dark and light.
// Hover: the diamond spins with a spring. Idle: it ticks a quarter turn every few seconds.
export default function Logo() {
  return (
    <Link to="/" aria-label="kavynUI home" className="kv-logo flex items-center gap-2 text-[20px] font-semibold tracking-tight text-tx">
      <svg viewBox="8 20 106 80" aria-hidden="true" fill="currentColor" className="h-6 w-auto shrink-0 overflow-visible">
        <rect x="10" y="22" width="20" height="76" rx="5" />
        <g className="kv-key">
          <g className="kv-spin">
            <rect x="47.13" y="33.13" width="53.74" height="53.74" rx="5" transform="rotate(45 74 60)" />
          </g>
        </g>
      </svg>
      <span>
        <span className="kv-shim">kavyn</span>
        <span className="text-faint">UI</span>
      </span>
    </Link>
  )
}