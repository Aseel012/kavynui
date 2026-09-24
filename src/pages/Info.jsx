import { useSEO } from '@/lib/seo'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { SITE } from '@/config'
import CodeBlock from '@/site/CodeBlock'
import TrafficMap from '@/kavyn/traffic-map'
import { components, families } from '@/lib/catalog'

const UPDATED = 'September 24, 2026'
const H2 = ({ children }) => <h2 className="mt-10 text-lg font-medium tracking-tight text-tx">{children}</h2>
const P = ({ children }) => <p className="mt-3 leading-7 text-mute">{children}</p>
const Li = ({ children }) => <li className="flex gap-3 leading-7 text-mute"><span className="mt-[11px] size-1 shrink-0 rounded-full bg-faint" />{children}</li>

function Shell({ kicker, title, sub, children, updated }) {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-12 sm:px-6 sm:pt-16">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 28 }}>
        <div className="text-xs uppercase tracking-[0.12em] text-faint">{kicker}</div>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-tx sm:text-4xl">{title}</h1>
        {sub && <p className="mt-3 max-w-xl text-mute">{sub}</p>}
        {updated && <p className="mt-4 text-xs text-faint">Last updated {UPDATED}</p>}
      </motion.div>
      <div className="mt-8 border-t border-line pt-2">{children}</div>
    </div>
  )
}

function About() {
  const nonBlocks = components.filter((c) => c.family !== 'blocks').length
  return (
    <Shell kicker="About" title="Motion for real products" sub="kavynUI is a free, open-source library of animated React components and page blocks. Every piece has a job in a real interface.">
      <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-panel p-4"><TrafficMap /></div>
      <H2>Why it exists</H2>
      <P>Most animation libraries show off. We wanted pieces you would actually ship: a button that confirms a destructive action, a map that shows where traffic comes from, a sign-in card that handles a bad email gracefully.</P>
      <H2>How it is built</H2>
      <ul className="mt-3 space-y-1">
        <Li>React, Tailwind CSS and Motion. Nothing else to install.</Li>
        <Li>Copy the file into your project. You own the code, there is no runtime package.</Li>
        <Li>Springs instead of fixed durations, so interrupted animations never jump.</Li>
        <Li>Respects "reduce motion", works with a keyboard, and pauses work when a tab is hidden.</Li>
      </ul>
      <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
        {[[nonBlocks, 'components'], [components.length - nonBlocks, 'blocks'], [families.length, 'categories']].map(([n, l]) => (
          <div key={l} className="bg-bg p-5"><div className="font-mono text-2xl text-tx">{n}</div><div className="text-sm text-mute">{l}</div></div>
        ))}
      </div>
      <H2>Who is behind it</H2>
      <P>kavynUI is built and maintained by Aseel. The public GitHub repository link will appear here once it is published.</P>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/components" className="h-10 rounded-full bg-tx px-5 text-sm font-medium leading-10 text-bg">Open the library</Link>
      </div>
    </Shell>
  )
}

function Privacy() {
  return (
    <Shell kicker="Legal" title="Privacy policy" updated sub="Short version: no accounts, no ad trackers, no selling data.">
      <H2>What we collect</H2>
      <P>kavynUI has no sign-up, no analytics and no tracking cookies. Nothing you do here is counted, logged or sent anywhere. Your theme choice (light or dark) is stored in your own browser's local storage so the site remembers it - it never leaves your device.</P>
      <H2>Hosting</H2>
      <P>The site is served through Vercel and Cloudflare. Like any web host, they process technical data such as your IP address and browser type to deliver pages and stop attacks. See their own privacy policies for details.</P>
      <H2>Your choices</H2>
      <ul className="mt-3 space-y-1">
        <Li>Clear this site's storage in your browser to remove the saved theme choice.</Li>
        <Li>Block local storage and the site still works; the theme simply falls back to dark.</Li>
      </ul>
      <H2>Children</H2>
      <P>The site is a developer tool and is not aimed at children under 13.</P>
      <H2>Changes</H2>
      <P>If this policy changes, the date at the top changes too. Material changes will be noted on this page.</P>
    </Shell>
  )
}

function Terms() {
  return (
    <Shell kicker="Legal" title="Terms & conditions" updated sub="kavynUI is open source. These terms cover the website and the code you copy from it.">
      <H2>The code</H2>
      <P>All components, blocks and backgrounds are released under the {SITE.license} license. You can use them in personal and commercial projects, modify them and redistribute them. Keep the license notice when you redistribute the source.</P>
      <H2>No warranty</H2>
      <P>The code is provided "as is", without warranty of any kind. You are responsible for testing it in your own product, including accessibility and performance.</P>
      <H2>Using the website</H2>
      <ul className="mt-3 space-y-1">
        <Li>Do not try to break, overload or scrape the site in a way that harms other visitors.</Li>
        <Li>Do not present the kavynUI name or logo as your own product or imply we endorse you.</Li>
        <Li>Demo content (company names, numbers, quotes) is made up for illustration.</Li>
      </ul>
      <H2>Contributions</H2>
      <P>When you submit a pull request, you agree that your contribution is released under the same {SITE.license} license and that you have the right to submit it.</P>
      <H2>Third-party code</H2>
      <P>The components depend on React, Tailwind CSS and Motion, each under its own license. The world map data comes from Natural Earth, which is in the public domain.</P>
      <H2>Limitation of liability</H2>
      <P>To the extent allowed by law, kavynUI and its contributors are not liable for any damages arising from use of the site or the code.</P>
      <H2>Contact</H2>
      <P>Questions about these terms can be raised on the project's public GitHub repository once it is published.</P>
    </Shell>
  )
}

const PAGES = { about: [About, 'About'], privacy: [Privacy, 'Privacy policy'], terms: [Terms, 'Terms & conditions'] }

export default function Info({ page }) {
  const [C, title] = PAGES[page] || PAGES.about
  useSEO({ title: `${title} - kavynUI`, path: `/${page}` })
  return <C />
}
