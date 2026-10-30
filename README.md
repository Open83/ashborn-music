# ASHBORN — MARATHON

Landing page for ASHBORN's debut single, MARATHON. A single static page: Next.js (App Router) + Tailwind CSS, exported to plain HTML.

Creative direction, acceptance rules and approvals live in `docs/creative/`. This file covers building, checking and deploying.

## Commands

| Command | What it does |
| --- | --- |
| `npm ci` | Install dependencies |
| `npm run dev` | Development server at http://localhost:3000 |
| `npm run build` | Production build into `out/`, then `scripts/static-finish.mjs` (see below) |
| `npm run check:build` | Validates `out/`: scripts, metadata, streaming links, assets, social image |
| `npm run check:links` | Confirms the three streaming URLs are exactly as supplied and resolve to MARATHON (needs internet) |
| `npm run images` | Re-creates the optimised hero images in `public/assets/hero/` from the original poster |

Requires Node 20.9 or newer.

## Important: no React client components

**Do not add React client components to this project** (`'use client'`, hooks such as `useState` or `useEffect`, or event handlers like `onClick` in JSX) **without first removing the post-build step.**

`npm run build` runs `scripts/static-finish.mjs` after `next build`. It removes Next.js's client runtime from the exported HTML, so the browser downloads and runs no framework JavaScript. This is deliberate: on mobile it removed about 0.8 s from first paint and about 550 ms of hydration work, and took Lighthouse performance from a median of 83 to 96 and LCP from 3.62 s to 2.56 s.

The cost: nothing on the page is hydrated. A client component would be exported as static markup and **silently do nothing**. The page's only behaviour (scroll reveals and the floating Listen shortcut) is the small vanilla script `public/enhance.js`.

If you need a client component:
1. Delete the `node scripts/static-finish.mjs` call from the `build` script in `package.json`, and delete that script.
2. Re-measure with Lighthouse on a mobile profile before and after.

The step is safe to rerun on an already-finished `out/` (it changes nothing the second time) and is deterministic: no timestamps or random values reach the output. It fails the build if a half-removed runtime remains.

Everything else is ordinary: change copy in `lib/site.js`, styles in `app/globals.css`, markup in `app/page.js`.

## Content rules

- The poster `public/assets/marathon-hero.png` is the approved landing-page hero and must not be altered. `npm run images` derives the web encodings from it without cropping.
- Lyric fragments in `lib/site.js` are quoted exactly from the artist-provided lyrics recorded in `docs/creative/ASHBORN_ARTWORK_ACCEPTANCE_CRITERIA.md` (section 3.1). Do not edit, correct or translate them. Full lyrics are not approved for publication.
- The landing-page copy was supplied by the owner. Do not add slogans or invent biography, statistics or social profiles.
- The Instagram link in the closing section is the profile the owner supplied on 2026-10-30, stored in `lib/site.js` without its share-tracking parameter. Its bio reads "Ashborn", but ownership is not independently verified. Set `instagram: null` there to remove it.

## Site URL (canonical, Open Graph, Twitter)

The canonical URL, `og:url` and the absolute social-image URLs need the site's public origin. It is resolved in `lib/site-url.js`:

1. `NEXT_PUBLIC_SITE_URL`, if set. Use this for a custom domain (see `.env.example`).
2. On Vercel, `VERCEL_PROJECT_PRODUCTION_URL`, which Vercel sets to the project's real production domain (the free `*.vercel.app` one until a custom domain is added). This needs **Settings → Environment Variables → "Automatically expose System Environment Variables"** to be on.
3. Otherwise nothing URL-dependent is emitted, and the build prints a warning. No domain is ever invented.

After building, `npm run check:build` verifies the result.

## Deploying to Vercel

`vercel.json` configures a plain static deployment: `framework: null`, `buildCommand: npm run build`, `outputDirectory: out`. In `vercel.json` these override the dashboard and `package.json`, so Vercel runs the full build, including `static-finish`. Do not change the Build Command in the dashboard back to `next build`: the site would still work but would ship and hydrate the full React runtime.

Caching (set in `vercel.json`; `next.config` headers are not supported by static exports):

| Path | Cache-Control | Why |
| --- | --- | --- |
| `/_next/static/*` | `public, max-age=31536000, immutable` | Content-hashed file names |
| `/assets/hero/*`, `/assets/og/*`, `/icon.svg` | `public, max-age=86400, stale-while-revalidate=604800` | Not hashed, so changes show within a day |
| HTML and `/enhance.js` | Vercel default (always revalidated) | Not hashed |

Vercel serves gzip or brotli itself. All responses also get `X-Content-Type-Options: nosniff` and `Referrer-Policy: strict-origin-when-cross-origin`.

Before sharing the link, follow the social-preview checklist: validate the live URL in Facebook's Sharing Debugger and a Twitter/X card validator, then send it in a real WhatsApp chat and post it to an Instagram Story. Previews cannot be verified without a real public URL.
