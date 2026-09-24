import { Link, useParams, Navigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { byPostSlug, posts } from '@/data/posts'
import { useSEO } from '@/lib/seo'
import { SITE } from '@/config'

const fmtDate = (d) => new Date(`${d}T00:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

export default function BlogPost() {
  const { slug } = useParams()
  const post = byPostSlug[slug]
  const idx = posts.indexOf(post)
  const next = posts[idx + 1]
  useSEO(post ? {
    title: `${post.title} - kavynUI blog`,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    type: 'article',
    jsonLd: {
      '@context': 'https://schema.org', '@type': 'Article',
      headline: post.title, description: post.excerpt, datePublished: post.date,
      author: { '@type': 'Organization', name: 'kavynUI', url: SITE.url },
      publisher: { '@type': 'Organization', name: 'kavynUI', url: SITE.url },
      mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
    },
  } : { title: 'kavynUI', noindex: true })
  if (!post) return <Navigate to="/blog" replace />
  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-12 sm:px-6 sm:pt-16">
      <motion.article initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 28 }}>
        <Link to="/blog" className="text-sm text-mute hover:text-tx">← All posts</Link>
        <div className="mt-6 flex items-center gap-3 text-xs text-faint"><time dateTime={post.date}>{fmtDate(post.date)}</time><span>·</span><span>{post.minutes} min read</span></div>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-tx sm:text-4xl">{post.title}</h1>
        <div className="mt-8 border-t border-line pt-2">
          {post.body.map((b, i) => b.h2
            ? <h2 key={i} className="mt-10 text-lg font-medium tracking-tight text-tx">{b.h2}</h2>
            : <p key={i} className="mt-4 leading-7 text-mute">{b.p}</p>)}
        </div>
      </motion.article>
      {next && (
        <Link to={`/blog/${next.slug}`} className="mt-16 block rounded-2xl border border-line bg-panel p-6 hover:border-line2">
          <div className="text-xs uppercase tracking-[0.12em] text-faint">Next post</div>
          <div className="mt-2 text-lg font-medium tracking-tight text-tx">{next.title}</div>
        </Link>
      )}
    </div>
  )
}
