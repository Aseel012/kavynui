// Site-wide sponsor banner, rendered at the top of every page from Layout.jsx.
// Sponsor details live here - change name/url/logo in one place.
import { useState } from 'react'

const SPONSOR = {
  name: 'Second Mind',
  url: 'https://secondmind.ae/',
  logo: '/sponsors/secondmind.svg',
}

export default function SponsorBanner() {
  const [hidden, setHidden] = useState(false)
  if (hidden) return null

  return (
    <div className="relative border-b border-line2 bg-panel">
      <div className="mx-auto flex max-w-[1280px] items-center justify-center px-4 py-2 sm:px-8">
        <a
          href={SPONSOR.url}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="group inline-flex items-center gap-2.5 text-[13px]"
        >
          <span className="rounded-full border border-line2 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-tx">
            Sponsored
          </span>
          <span className="text-tx">
            Thanks to <span className="font-semibold">{SPONSOR.name}</span> for supporting kavynUI
            <span aria-hidden="true" className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">&#8599;</span>
          </span>
        </a>
      </div>
      <button
        type="button"
        onClick={() => setHidden(true)}
        aria-label="Dismiss sponsor banner"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-mute transition-colors hover:text-tx"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
