# Deploying kavynUI

A static Vite build. Hosting is free on Vercel's Hobby plan, with your own domain whose DNS lives on Cloudflare.

Checked against Vercel's docs on September 24, 2026:
- https://vercel.com/docs/domains/working-with-domains/add-a-domain
- https://vercel.com/docs/plans/hobby
- https://vercel.com/kb/guide/cloudflare-with-vercel

> **Hobby plan note:** Hobby is free and includes custom domains (up to 50 per project), but Vercel limits it to non-commercial, personal use. A free open-source site is fine. If you ever sell something through it, look at the Pro plan.

---

## 1. Before you push

```bash
npm install
cp .env.example .env        # fill in VITE_SITE_URL, and VITE_GITHUB_URL once the repo is public
npm run build               # writes sitemap.xml + robots.txt, then builds to dist/
npx vite preview            # check http://localhost:4173
```

Only `VITE_` variables end up in the browser bundle. **Never put secrets in them.** None of the current variables are secret.

## 2. Deploy on Vercel (free)

1. Push the project to GitHub.
2. Go to https://vercel.com/new and import the repo. Vercel detects Vite:
   - Build command: `npm run build`
   - Output directory: `dist`
3. Project → Settings → Environment Variables. Add the same values as your `.env`:
   - `VITE_SITE_URL` = `https://yourdomain.com`
   - `VITE_GITHUB_URL` = `https://github.com/you/kavynui` (optional)
4. Deploy. You get a `*.vercel.app` URL straight away.

`vercel.json` already handles the SPA rewrite, long cache for `/assets`, no-cache for `index.html`, and the security headers.

## 3. Connect your domain (Cloudflare DNS, no Vercel payment)

Buy the domain anywhere (Cloudflare Registrar is at-cost). The DNS stays on Cloudflare. You only add two records there.

**In Vercel**
1. Project → Settings → Domains → Add.
2. Add `yourdomain.com`. Vercel will offer to add `www.yourdomain.com` too. Accept it and choose which one redirects to the other.
3. Vercel then shows a domain card with the exact records it wants. **Copy the values from that card.** The CNAME is unique to your project (it looks like `d1d4fc829fe7bc7c.vercel-dns-017.com`), so don't copy one from a tutorial.

**In Cloudflare** (dash.cloudflare.com → your domain → DNS → Records)

| Type  | Name  | Content                                        | Proxy status |
|-------|-------|------------------------------------------------|--------------|
| A     | `@`   | `76.76.21.21` (or the value on your domain card) | **DNS only** (grey cloud) |
| CNAME | `www` | the project-specific value on your domain card  | **DNS only** (grey cloud) |

- Set both to **DNS only**. Vercel recommends against running another proxy in front of it: it hides traffic signals from Vercel's firewall, adds latency, and causes cache problems.
- Delete any old A, AAAA or CNAME records for `@` or `www` first. Conflicting records are the most common reason Vercel shows "Invalid configuration".
- Leave your MX and TXT records (email and verification) alone. You are only changing the website records, not moving DNS.

**Wait**
- The domain card turns green once DNS resolves (usually minutes, up to a few hours).
- Vercel issues the SSL certificate on its own. There is nothing to upload.

**If it doesn't work**
- "Invalid configuration": check for leftover A/AAAA/CNAME records on the same name, and that the proxy is grey.
- Only one of `yourdomain.com` / `www` works: add both in Vercel and set the redirect.
- Stuck on "pending verification": the domain is used by another Vercel account. Add the TXT record Vercel shows.

## 4. Alternative: Cloudflare Pages

Cloudflare Pages is also free, and your DNS is already there.
1. Cloudflare dashboard → Workers & Pages → Create → Pages → connect the GitHub repo.
2. Build command `npm run build`, output directory `dist`, and add the same `VITE_` variables.
3. Custom domains → add `yourdomain.com`. Cloudflare creates the record for you.

`public/_redirects` (SPA fallback) and `public/_headers` (security headers) are already included and are read by Cloudflare Pages and Netlify.

## 5. What ships in the kit

| File | Purpose |
|------|---------|
| `vercel.json` | SPA rewrite, caching, security headers |
| `public/_headers` | Same headers for Cloudflare Pages / Netlify |
| `public/_redirects` | SPA fallback for Cloudflare Pages / Netlify |
| `netlify.toml` | Netlify build settings |
| `public/robots.txt`, `public/sitemap.xml` | Generated on every build from `VITE_SITE_URL` (`scripts/gen-seo.mjs`) |
| `.env.example` | Every variable the site reads, with notes |
| `LICENSE` | MIT |

## 6. Security headers

| Header | Value |
|--------|-------|
| Content-Security-Policy | `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' https:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; …` |
| Strict-Transport-Security | `max-age=63072000; includeSubDomains; preload` |
| X-Content-Type-Options | `nosniff` |
| X-Frame-Options | `DENY` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Permissions-Policy | camera, microphone, geolocation, payment, usb all off |
| Cross-Origin-Opener-Policy | `same-origin` |

- `style-src 'unsafe-inline'` is there because animated components set inline styles and a few ship small `<style>` keyframes. Scripts stay strict: no inline scripts, no eval.
- If you add analytics from another domain, add that domain to `script-src` / `connect-src`.
- HSTS `preload` is a commitment. Keep it only if every subdomain will always be HTTPS. Otherwise remove `; preload`.
- Test after deploy: https://securityheaders.com and https://observatory.mozilla.org
