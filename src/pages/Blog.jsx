import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { posts } from '@/data/posts'
import { useSEO } from '@/lib/seo'

const fmtDate = (d) => new Date(`${d}T00:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

export default function Blog() {
  useSEO({ title: 'Blog - kavynUI', description: 'Design and engineering notes from the kavynUI library: shaders, scroll scenes, physics and theming.', path: '/blog' })
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-12 sm:px-6 sm:pt-16">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 28 }}>
        <div className="text-xs uppercase tracking-[0.12em] text-faint">Blog</div>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-tx sm:text-4xl">Notes from the library</h1>
        <p className="mt-3 max-w-xl text-mute">How the components are designed and built, and the patterns behind them.</p>
      </motion.div>
      <div className="mt-10 divide-y divide-line border-y border-line">
        {posts.map((p, i) => (
          <motion.article key={p.slug} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 28, delay: 0.05 * i }}>
            <Link to={`/blog/${p.slug}`} className="group block py-6">
              <div className="flex items-center gap-3 text-xs text-faint"><time dateTime={p.date}>{fmtDate(p.date)}</time><span>·</span><span>{p.minutes} min read</span></div>
              <h2 className="mt-2 text-xl font-medium tracking-tight text-tx group-hover:text-acc">{p.title}</h2>
              <p className="mt-2 text-sm leading-6 text-mute">{p.excerpt}</p>
              <span className="mt-3 inline-block text-sm text-acc opacity-0 transition-opacity group-hover:opacity-100">Read →</span>
            </Link>
          </motion.article>
        ))}
      </div>
    </div>
  )
}
