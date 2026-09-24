// External links always open safely: new tab, no opener, no referrer, https/mailto only.
const ok = (href) => typeof href === 'string' && /^(https:\/\/|mailto:)/i.test(href)

export default function ExternalLink({ href, children, className = '', ...rest }) {
  if (!ok(href)) return <span className={className} aria-disabled="true" {...rest}>{children}</span>
  const mail = href.startsWith('mailto:')
  return (
    <a href={href} className={className} {...(mail ? {} : { target: '_blank', rel: 'noopener noreferrer' })} {...rest}>{children}</a>
  )
}
