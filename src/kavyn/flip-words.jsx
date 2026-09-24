import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

// The last word of a headline rolls to the next one, letter by letter.
export default function FlipWords({ prefix = 'Ship', words = ['faster', 'safer', 'globally', 'today'], interval = 2200 }) {
  const [i, setI] = useState(0)
  useEffect(() => { const id = setInterval(() => setI((n) => (n + 1) % Math.max(1, words.length)), interval); return () => clearInterval(id) }, [words.length, interval])
  const word = words[i] ?? ''
  return (
    <h3 className="flex items-baseline gap-2 text-3xl font-semibold tracking-[-0.03em] text-tx sm:text-4xl">
      <span>{prefix}</span>
      <span className="relative inline-flex overflow-hidden pb-1 text-acc">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={word} className="inline-flex" exit={{ opacity: 0, y: -24, filter: 'blur(6px)' }} transition={{ duration: 0.25 }}>
            {word.split('').map((ch, k) => (
              <motion.span key={k} initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: k * 0.035, type: 'spring', stiffness: 420, damping: 30 }}>{ch}</motion.span>
            ))}
          </motion.span>
        </AnimatePresence>
      </span>
    </h3>
  )
}
