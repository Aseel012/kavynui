import { motion } from 'motion/react'

const COLS = [
  ['Product', ['Pricing', 'Changelog', 'Status']],
  ['Company', ['About', 'Careers', 'Contact']],
  ['Legal', ['Privacy', 'Terms']],
]

// Block: site footer. Link columns, and a giant wordmark that rises in letter by letter.
export default function WordmarkFooter({ brand = 'acme', columns = COLS }) {
  return (
    <footer className="@container w-full overflow-hidden rounded-2xl border border-line bg-bg">
      <div className="grid gap-8 p-8 @2xl:grid-cols-[1fr_auto]">
        <p className="max-w-xs text-sm text-mute">Infrastructure for teams that would rather ship than babysit servers.</p>
        <div className="grid grid-cols-3 gap-8 text-sm">
          {columns.map(([h, links]) => (
            <div key={h}><div className="text-faint">{h}</div><ul className="mt-3 space-y-2">{links.map((l) => <li key={l}><a href="#" onClick={(e) => e.preventDefault()} className="text-mute hover:text-tx">{l}</a></li>)}</ul></div>
          ))}
        </div>
      </div>
      <div className="flex select-none justify-center border-t border-line px-4 pt-4" aria-hidden>
        {brand.split('').map((ch, i) => (
          <motion.span key={i} initial={{ y: '60%', opacity: 0 }} whileInView={{ y: '22%', opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06, type: 'spring', stiffness: 160, damping: 18 }}
            className="bg-gradient-to-b from-tx to-transparent bg-clip-text text-[24cqw] font-semibold leading-none tracking-[-0.06em] text-transparent">{ch}</motion.span>
        ))}
      </div>
    </footer>
  )
}
