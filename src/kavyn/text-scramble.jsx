import { useEffect, useRef, useState } from 'react'

const GLYPHS = '!<>-_\\/[]{}=+*^?#01'

// Letters decode from noise, left to right. Replays on hover.
export default function TextScramble({ text = 'Deploy to the edge', duration = 900, className = '' }) {
  const [out, setOut] = useState(text)
  const raf = useRef(0)
  const run = () => {
    cancelAnimationFrame(raf.current)
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - start) / Math.max(1, duration))
      const lock = Math.floor(p * text.length)
      setOut(text.split('').map((ch, i) => (ch === ' ' || i < lock ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join(''))
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
  }
  useEffect(() => { run(); return () => cancelAnimationFrame(raf.current) }, [text, duration]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <span onMouseEnter={run} onFocus={run} tabIndex={0} aria-label={text}
      className={`cursor-default whitespace-nowrap font-mono text-2xl tracking-tight text-tx outline-none sm:text-3xl ${className}`}>
      <span aria-hidden>{out}</span>
    </span>
  )
}
