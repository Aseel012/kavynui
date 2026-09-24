import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

const LINES = ['Write the release notes', 'Summarize this thread', 'Draft a reply to Priya']

export default function CaretRewrite({ lines = LINES, speed = 55 }) {
  const [i, setI] = useState(0)
  const [n, setN] = useState(0)
  const [del, setDel] = useState(false)
  useEffect(() => {
    const full = lines[i]
    let t
    if (!del && n < full.length) t = setTimeout(() => setN(n + 1), speed + Math.random() * 40)
    else if (!del) t = setTimeout(() => setDel(true), 1400)
    else if (n > 0) t = setTimeout(() => setN(n - 1), 24)
    else { setDel(false); setI((i + 1) % lines.length) }
    return () => clearTimeout(t)
  }, [n, del, i, lines, speed])
  return (
    <div className="flex h-12 w-full max-w-md items-center gap-3 rounded-xl border border-line2 bg-panel px-4 text-[15px]">
      <span className="text-acc">✦</span>
      <span className="text-tx">{lines[i].slice(0, n)}</span>
      <motion.span
        className="-ml-2 h-5 w-[2px] rounded bg-acc"
        animate={{ opacity: [1, 1, 0, 0] }}
        transition={{ repeat: Infinity, duration: 0.9, times: [0, 0.5, 0.5, 1] }}
      />
    </div>
  )
}
