import { Link } from 'react-router-dom'

// Bar + keyframe diamond = K. Colours come from the theme tokens, so it follows dark and light.
export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 text-[20px] font-semibold tracking-tight text-tx">
      <svg viewBox="8 20 106 80" aria-hidden="true" fill="currentColor" className="size-6 shrink-0 overflow-visible">
        <rect x="10" y="22" width="20" height="76" rx="5" />
        <g className="kv-key">
          <rect x="47.13" y="33.13" width="53.74" height="53.74" rx="5" transform="rotate(45 74 60)" />
        </g>
      </svg>
      <span>
        <span className="kv-shim">kavyn</span>
        <span className="text-faint">UI</span>
      </span>
    </Link>
  )
}