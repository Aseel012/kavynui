import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const LOGOS = ['Northwind', 'Lumen', 'Parcel', 'Orbit', 'Helix', 'Quanta', 'Fable', 'Kite']
const QUOTES = [
  { q: 'We moved 40 sites over in a weekend. Page loads dropped by half.', n: 'Riya Menon', r: 'CTO, Parcel' },
  { q: 'The dashboard is the first one my whole team actually opens.', n: 'Daniel Park', r: 'Eng lead, Lumen' },
  { q: 'Blocked a credential-stuffing wave before we even got paged.', n: 'Sara Okafor', r: 'Security, Helix' },
]

// Block: logo marquee plus a rotating customer quote.
export default function ProofWall({ logos = LOGOS, quotes = QUOTES, interval = 4200 }) {
  const [i, setI] = useState(0)
  useEffect(() => { const id = setInterval(() => !document.hidden && setI((n) => (n + 1) % Math.max(1, quotes.length)), interval); return () => clearInterval(id) }, [quotes.length, interval])
  const q = quotes[i]
  return (
    <section className="@container w-full overflow-hidden rounded-2xl border border-line bg-bg py-10">
      <style>{`@keyframes kv-marq{to{transform:translateX(-50%)}}`}</style>
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]">
        <div className="flex w-max gap-12 px-6" style={{ animation: 'kv-marq 28s linear infinite' }}>
          {[...logos, ...logos].map((l, k) => <span key={k} className="whitespace-nowrap text-lg font-semibold tracking-tight text-faint">{l}</span>)}
        </div>
      </div>
      <div className="mx-auto mt-10 h-40 max-w-xl px-6 text-center">
        <AnimatePresence mode="wait">
          {q && (
            <motion.figure key={i} initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }} transition={{ duration: 0.35 }}>
              <blockquote className="text-lg leading-8 tracking-tight text-tx @2xl:text-xl">“{q.q}”</blockquote>
              <figcaption className="mt-4 text-sm text-mute">{q.n} · <span className="text-faint">{q.r}</span></figcaption>
            </motion.figure>
          )}
        </AnimatePresence>
      </div>
      <div className="flex justify-center gap-1.5">
        {quotes.map((_, k) => <button key={k} type="button" aria-label={`Quote ${k + 1}`} onClick={() => setI(k)} className={`h-1.5 rounded-full transition-all ${k === i ? 'w-5 bg-tx' : 'w-1.5 bg-line2'}`} />)}
      </div>
    </section>
  )
}
