// Site-wide settings. Set these in .env (see .env.example) - nothing here is secret.
const clean = (v) => (typeof v === 'string' ? v.trim() : '')
const safeUrl = (v) => (/^https:\/\/[^\s"'<>]+$/i.test(clean(v)) ? clean(v) : '')

export const SITE = {
  name: 'kavynUI',
  url: safeUrl(import.meta.env.VITE_SITE_URL) || 'https://kavynui.com', // placeholder until the real domain is bought
  // Placeholder until the repo is public. Leave empty to show the icon as "coming soon".
  github: safeUrl(import.meta.env.VITE_GITHUB_URL),
  license: 'MIT',
}
