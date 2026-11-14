# kavynUI launch kit

Ready-to-post drafts plus the order to do things in. Edit the wording to sound like you; keep the facts.

The one rule: every post leads with something people can **see** (a clip) and ends with something
they can **run** (one command). Make clips with `npm run clip -- <slug>`.

## Order

| When | What | Why first |
| --- | --- | --- |
| Day 0 | Deploy this version. Check `curl -s https://www.kavynui.com/components/shader-silk \| grep -o '<title>[^<]*'` prints `Silk - kavynUI`. | Every link you share from now on gets its own preview card. |
| Day 0 | Open the shadcn directory PR (`docs/shadcn-directory.md`). | Puts you inside `shadcn search` and the shadcn MCP server, where developers and agents already look. |
| Day 1 | Google Search Console: add the domain, submit `/sitemap.xml`. | Static pages only help once they are crawled. |
| Days 1–28 | One clip a day on X (drafts below). | Consistency beats one launch. |
| Week 2 | Reddit, one sub per day, at most. | Needs a few weeks of posts behind you so the account is not "new, only promo". |
| Week 3 | Show HN. | After the directory PR is merged and you have a little proof. |
| Week 4 | Second Product Hunt launch, framed as the backgrounds + TypeScript release. | PH allows relaunching after major changes. |

## X: daily clip posts

Format: clip, two lines, command. No hashtags wall. Reply to your own post with the link.

> Silk. A satin shader background that takes its colour from your theme, so it works in light and dark without touching it.
>
> `npx shadcn@latest add @kavynui/shader-silk`

> Hold to Confirm. For "delete account", where a click is too easy and a modal is too much.
>
> `npx shadcn@latest add @kavynui/hold-to-confirm`

> Horizon: the lit edge of a planet under your headline. Made for waitlist pages.
>
> Every kavynUI background pauses off-screen, respects reduced motion and falls back to CSS without WebGL.

> Every component page now has a Customize panel. Drag the sliders, and the code you copy has exactly those props.
>
> [clip of the panel on shader-chrome]

> I installed all 101 kavynUI components into a fresh Next-style app with the shadcn CLI, then type-checked, built and server-rendered every one. It found two bugs. Both fixed. That test now runs on every commit.

The last one is the strongest kind of post for developers: a real number, a real failure, a fix.

## X: launch thread (use once, for the backgrounds release)

1. I rewrote every shader background in kavynUI and added seven new ones. 18 backgrounds, all free, MIT. [reel: `npm run clip -- shader-horizon,shader-silk,shader-rays,shader-chrome --seconds 3`]
2. They read your theme's `--bg` and `--tx` at runtime. Same file is light-on-black in dark mode, ink-on-paper in light mode. Pass `color` to tint one.
3. Each one: full resolution, dithered (no banding on dark gradients), pauses off-screen and in background tabs, one still frame for reduced motion, CSS fallback without WebGL.
4. They are TypeScript now. The shadcn CLI strips the types for JS projects, so one command works in both.
5. One command: `npx shadcn@latest add @kavynui/shader-silk`. Every component: kavynui.com

## Reddit

Read each sub's rules first; several ban self-promotion outside a weekly thread. Post as a builder
sharing what they learned, answer every comment, and never post the same text in two subs.

**r/reactjs** (check for a "Show off" thread)

> **Title:** I made shader backgrounds that read your Tailwind theme instead of hardcoding colours
>
> Most shader backgrounds I tried hardcode their colours, so they look wrong the moment you switch to light mode. I wanted ones that behave like a CSS background: same file, follows the theme.
>
> How it works: a small runner reads `--bg` and `--tx` from computed style, passes them as uniforms, and watches the `<html>` class for theme switches. Every shader ends in a `paint(amount, blend)` call that mixes ink into paper, so light and dark just work.
>
> Other things that took longer than the shaders: stepping resolution down when frames run slow, a tiny dither so dark gradients don't band on 8-bit screens, and pausing off-screen.
>
> They're MIT and install with the shadcn CLI. Happy to go into the GLSL if anyone's curious. [link]

**r/webdev**: lead with the clip and the "follows your theme" point; ask for feedback on which background they would actually ship.

**r/nextjs**: lead with "every component is server-render tested and marked `'use client'`" and the fresh-app install test.

## Show HN

> **Title:** Show HN: kavynUI – 101 animated React components you install as source, tested in a fresh app
>
> kavynUI is a monochrome set of animated React components and page sections. You install each one as a file you own via the shadcn CLI; there is no package to depend on.
>
> Two things I think are a bit different. Every component is filed under the job it does (hold-to-confirm is "delete account", breath-dots is "AI thinking"). And it is tested the way people use it: CI installs every component into a fresh TypeScript app and a fresh JavaScript app, type-checks, builds and server-renders all of them. That test found a component missing `'use client'` and one that loaded avatars from a third-party host.
>
> The site serves static HTML per component (code, install command, props) so agents and crawlers that don't run JavaScript can read it, plus `llms.txt`.
>
> MIT. I'm 19 and build this alone; criticism welcome.

Post on a weekday morning US time. Stay in the thread for the first two hours.

## Communities to join (and help in before posting)

- shadcn/ui GitHub Discussions and the community around it
- Reactiflux Discord (#show-and-tell type channels only)
- daily.dev (submit the blog posts, not the homepage)
- Indie Hackers (for the templates/sponsor side: post what you earned and how, even if it is zero)

## Sponsors

Do not cold-pitch sponsors until there is traffic to sell. With Search Console and Vercel numbers
in hand, write to dev-tool companies whose users build landing pages (hosting, auth, forms, email).
Offer: logo on the home page and README, one month, a price you name. The email already lands at
shaikhmdaseel@gmail.com from the empty tiles.

## What to measure, weekly

- Search Console: impressions and clicks per `/components/<slug>` page
- PostHog (`VITE_POSTHOG_KEY`): `copy_install`, `copy_usage` (and `customized: true`), `copy_source` by slug
- GitHub: stars, and referrers (Insights > Traffic)
- Which clips got the most views: make more of that kind
