# How to add a new template to kavynUI

The /templates page is data-driven. You never edit the page itself to add a product - you add one entry to a JSON file and drop the preview images in a folder.

## 1. Add the entry

Open `src/data/templates.json` and add an object to the `templates` array:

```json
{
  "slug": "ledger",
  "name": "Ledger",
  "niche": "Accounting",
  "tagline": "One line that sells the template",
  "description": "Two to three sentences describing the whole product.",
  "screens": 19,
  "stack": ["HTML", "CSS", "JavaScript"],
  "responsive": true,
  "price": 79,
  "currency": "USD",
  "status": "available",
  "preview": "/templates/ledger/preview.png",
  "gallery": [
    "/templates/ledger/screen-2.png",
    "/templates/ledger/screen-3.png"
  ],
  "includes": [
    "19 linked screens",
    "Editable source - no build step",
    "Desktop and mobile layouts"
  ],
  "accent": "#7db8ff",
  "buyUrl": "https://your-store.com/ledger",
  "previewNote": "Optional note shown under the buy area"
}
```

Field rules:

- `slug` - lowercase, no spaces. It becomes the page anchor (`#ledger`) and the image folder name.
- `price` / `currency` - shown on the card and in the SEO data. Change anytime.
- `buyUrl` - the checkout link (Gumroad, Lemon Squeezy, Stripe Payment Link, anything). While `buyUrl` is `""`, the detail section shows an inert price pill instead of a buy button, so the page never 404s a checkout.
- `accent` - the template's color, used for the placeholder preview art and detail accents.
- `gallery` - extra screenshots shown under the hero preview on the detail section. Empty array is fine.
- `stack` - free-form list, shown dot-separated.
- `status` - `available` for shipped work.

## 2. Add the images

Create `public/templates/<slug>/` and put the images in:

- `preview.png` - the big card + detail image. 16:10 aspect looks best (e.g. 1600x1000).
- Any gallery shots listed in the JSON.

Until `preview.png` exists, the card automatically shows a placeholder wireframe in the template's accent color, so the page always looks intentional. Once the PNG is in place it loads instead - no code change.

## 3. Build

```
npm run build
```

The templates entry appears in the sitemap and llms.txt automatically. No other file needs to change.

## Notes

- Never put a personal email address on this page or in these entries.
- Keep each template's copy fictional-brand-safe (no real client names).
