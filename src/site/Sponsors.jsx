import data from '@/data/sponsors.json'
import { SITE } from '@/config'
import { track } from '@/lib/track'

// Sponsor wall: a fixed number of small tiles. Filled tiles come from src/data/sponsors.json:
//   { "name": "Acme", "url": "https://acme.com", "logo": "/sponsors/acme.svg" }
// Logos live in public/sponsors/ (the CSP only allows same-origin images) and should be single-colour
// SVGs; they are drawn in the theme's text colour so the wall stays monochrome in both themes.
// Empty tiles invite the next sponsor: they open a pre-filled email to SITE.sponsorEmail,
// or go to VITE_SPONSOR_URL instead when that is set (GitHub Sponsors, a form).
const safe = (url) => (/^(https:\/\/|mailto:)[^\s"'<>]+$/i.test(url || '') ? url : '')

export default function Sponsors() {
  const sponsors = (data.sponsors || []).filter((s) => s && s.name && safe(s.url)).slice(0, data.slots)
  const open = Math.max(0, data.slots - sponsors.length)
  const mail = SITE.sponsorEmail
    ? `mailto:${SITE.sponsorEmail}?subject=${encodeURIComponent('Sponsoring kavynUI')}&body=${encodeURIComponent('Hi Aseel,\n\nWe would like to sponsor kavynUI.\n\nCompany:\nWebsite:\nTier or budget:\n\nThanks!')}`
    : ''
  const contact = SITE.sponsor || mail
  const tile = 'flex h-20 items-center justify-center rounded-[18px] px-4 text-center transition-colors'
  return (
    <section aria-label="Sponsors" className="mx-auto max-w-[1280px] px-4 pt-28 sm:px-8 sm:pt-40">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-[15px] font-medium text-tx">Sponsors</h2>
        <p className="text-[13px] text-mute">
          kavynUI is free and MIT. Sponsors keep it that way.
          {SITE.sponsorEmail && <> Reach out at <a href={mail} onClick={() => track('sponsor_email_click', { from: 'text' })} className="text-tx underline decoration-line2 underline-offset-4 hover:decoration-tx">{SITE.sponsorEmail}</a></>}
        </p>
      </div>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {sponsors.map((s) => (
          <li key={s.name}>
            <a href={safe(s.url)} target="_blank" rel="sponsored noopener" onClick={() => track('sponsor_click', { name: s.name })} className={`${tile} bg-panel text-[14px] font-medium text-tx hover:bg-panel2`}>
              {s.logo
                ? <span role="img" aria-label={s.name} className="block h-7 w-full bg-tx" style={{ WebkitMask: `url(${s.logo}) center / contain no-repeat`, mask: `url(${s.logo}) center / contain no-repeat` }} />
                : s.name}
            </a>
          </li>
        ))}
        {Array.from({ length: open }, (_, i) => (
          <li key={`open-${i}`}>
            {contact
              ? <a href={contact} target={contact.startsWith('mailto:') ? undefined : '_blank'} rel="noopener" onClick={() => track('sponsor_slot_click', { slot: sponsors.length + i + 1 })} className={`${tile} border border-dashed border-line2 text-[13px] text-faint hover:border-mute hover:text-tx`}>Your logo here<span className="sr-only"> (sponsor kavynUI)</span></a>
              : <span className={`${tile} border border-dashed border-line2 text-[13px] text-faint`}>Open slot</span>}
          </li>
        ))}
      </ul>
    </section>
  )
}
