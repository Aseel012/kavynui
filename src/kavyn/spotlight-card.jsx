import { motion, useMotionTemplate, useMotionValue } from 'motion/react'

// A soft light follows the cursor across the card and lights up its border.
export default function SpotlightCard({ title = 'Zero-config SSL', body = 'Certificates issue and renew on their own. You never touch a cron job.', tag = 'Security' }) {
  const x = useMotionValue(-200), y = useMotionValue(-200)
  const bg = useMotionTemplate`radial-gradient(260px circle at ${x}px ${y}px, rgba(255,106,43,0.14), transparent 70%)`
  const border = useMotionTemplate`radial-gradient(180px circle at ${x}px ${y}px, rgba(255,106,43,0.9), transparent 70%)`
  const move = (e) => { const r = e.currentTarget.getBoundingClientRect(); x.set(e.clientX - r.left); y.set(e.clientY - r.top) }
  return (
    <div onPointerMove={move} onPointerLeave={() => { x.set(-200); y.set(-200) }} className="group relative w-[340px] max-w-full rounded-2xl p-px">
      <motion.div className="absolute inset-0 rounded-2xl" style={{ background: border }} />
      <div className="absolute inset-px rounded-[15px] bg-panel" />
      <motion.div className="absolute inset-px rounded-[15px]" style={{ background: bg }} />
      <div className="relative p-6">
        <span className="rounded-full border border-line2 px-2 py-0.5 text-[11px] text-mute">{tag}</span>
        <h3 className="mt-4 text-lg font-medium tracking-tight text-tx">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-mute">{body}</p>
      </div>
    </div>
  )
}
