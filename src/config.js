// Site-wide settings. Set these in .env (see .env.example) - nothing here is secret.
const clean = (v) => (typeof v === 'string' ? v.trim() : '')
const safeUrl = (v) => (/^https:\/\/[^\s"'<>]+$/i.test(clean(v)) ? clean(v) : '')

export const SITE = {
  name: 'kavynUI',
  url: safeUrl(import.meta.env.VITE_SITE_URL) || 'https://kavynui.com', 
  // Leave empty to show the GitHub icon as "coming soon".
  github: safeUrl(import.meta.env.VITE_GITHUB_URL),
  // Sponsor enquiries. Empty sponsor tiles open a pre-filled email to this address.
  sponsorEmail: 'shaikhmdaseel@gmail.com',
  // Optional override for those tiles: a GitHub Sponsors page or a form. Empty = the email above.
  sponsor: /^(https:\/\/|mailto:)[^\s"'<>]+$/i.test(clean(import.meta.env.VITE_SPONSOR_URL)) ? clean(import.meta.env.VITE_SPONSOR_URL) : '',
  license: 'MIT',
}
