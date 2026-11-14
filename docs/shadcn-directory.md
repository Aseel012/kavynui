# Getting @kavynui into the shadcn registry directory

Once this is merged, `npx shadcn@latest add @kavynui/liquid-button` works in any project with no
`registry add` step, and shadcn search and its MCP server list kavynUI by default.

kavynUI already meets the four requirements (open source, valid `registry.json`, flat layout, no
`content` in the index). `npm run registry:verify` checks the schema part.

## Steps

1. Deploy this version of the site first, so the URLs below serve the current registry.
2. Fork https://github.com/shadcn-ui/ui and clone your fork.
3. Open `apps/v4/registry/directory.json` and add this object at the end of the array
   (put a comma after the entry before it):

```json
{
  "name": "@kavynui",
  "homepage": "https://www.kavynui.com",
  "url": "https://www.kavynui.com/r/{name}.json",
  "description": "Monochrome animated React components and page sections that follow your theme: buttons, navigation, maps, scroll scenes and shader backgrounds. Each one is a single file you own.",
  "author": "Shaikh Aseel",
  "logo": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120' fill='var(--foreground)'><rect x='24' y='22' width='20' height='76' rx='5'/><rect x='61.13' y='33.13' width='53.74' height='53.74' rx='5' transform='rotate(45 88 60)'/></svg>"
}
```

4. In the fork: `pnpm install`, then `pnpm validate:registries`.
5. Commit, push, open a pull request to `shadcn-ui/ui` titled `feat(registry): add @kavynui`.

## Before you open the PR, check

- `https://www.kavynui.com/r/registry.json` opens and lists every component.
- `https://www.kavynui.com/r/liquid-button.json` opens.
- Use the host that does not redirect. If `kavynui.com` redirects to `www.kavynui.com`, keep `www` in both URLs above.
