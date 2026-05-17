# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing/SEO site for the **two-volume *Databricks for Practitioners* series** by Ritesh Modi:

- **Volume 3 — The Production Lakehouse Playbook**: Unity Catalog, Lakeflow, governance, orchestration, CI/CD.
- **Volume 4 — The AI Lakehouse Playbook**: Mosaic AI, Agent Bricks, MLflow 3, Multi-Agent Supervisor, Lakebase.

Both volumes are part of the *Spark 4.0 from Scratch* series. Static Astro 5 + Tailwind v4 site. Two jobs: rank for technical Databricks queries (per-volume topic pillar pages) and convert traffic to Amazon sales (one `/buy/` page that lists both volumes).

## Commands

```bash
npm install         # one-time
npm run dev         # local preview at http://localhost:4321
npm run build       # production build to ./dist/
npm run preview     # serve the built ./dist/
```

There are no tests, no linter, no typecheck step. `npm run build` is the only quality gate — it runs Astro's typechecker on `.astro` files implicitly.

## Architecture

### Single source of truth: `src/data/book.ts`
Exports three things:

- `series` — shared metadata (title, author, series name, tagline). Author title is "Head of AI at MarketOnce · ex-Microsoft Principal Forward Deployed Engineer · 18× Author".
- `volumes.v3` and `volumes.v4` — per-volume metadata (subtitle, cover image, chapter count, page count, description, key topics, audience, ISBN, Amazon URL, price).
- `book` — backwards-compat alias that points at `volumes.v4`. Older code paths still import this; new code should prefer `series` and `volumes.X`.

**Do not duplicate book metadata into individual pages.** When a component or page needs volume-specific data, import from this file.

### Layout-driven SEO with primary-volume hint
`src/layouts/Layout.astro` is the SEO chassis. It wraps every page and emits, by default:

- Canonical URL from `Astro.url.pathname` + `astro.config.mjs` `site` (currently `https://genaiblueprints.com`).
- `Book` schema per relevant volume — each with `@id`, `Offer` (price/currency/availability/seller), `audience`, `educationalLevel`, `educationalUse`, `learningResourceType`, `teaches`, `keywords`, `workExample` with `ReadAction`, and `isPartOf` linking the BookSeries. Pages that focus on one volume pass `primaryVolume="v3"` or `primaryVolume="v4"` — Layout then emits only that volume's Book schema. Series-wide pages omit the prop and Layout emits both.
- `Person` schema for the author — with `@id`, `worksFor` MarketOnce, `alumniOf` Microsoft, `award` list, `email`, expanded `knowsAbout` (every Databricks platform concept), `sameAs` (LinkedIn, GitHub, Medium, Hackernoon, Twitter/X, Amazon author page), and `subjectOf` linking both books.
- `BookSeries` schema with `hasPart` references to both books.
- `Organization` schema for site-level entity identity.
- Verification meta tags for Google / Bing / Yandex — auto-rendered when tokens exist in `series.verification` (skipped while empty).
- Twitter Card, Open Graph, `theme-color`, `format-detection`, `article:author/tag/published_time/modified_time`, `book:author/isbn`, and `hreflang="en"` / `hreflang="x-default"` alternates.
- Per-bot robots directives (separate `googlebot` and `bingbot` lines), `max-snippet:-1`, `max-image-preview:large`.
- Sitemap discovery link (`<link rel="sitemap">`) for older crawlers.

The default schemas use Schema.org `@id` references to link Books → Person → Series → Organization, which Google parses as a knowledge graph subgraph rather than four independent records.

Pages pass a `jsonLd` prop (object or array) that is appended to — not replacing — the defaults. Page-specific schemas (FAQPage, TechArticle, BreadcrumbList, BlogPosting, WebSite, HowTo) come in this way.

### Topic pillar pages use `TopicShell`
`src/components/TopicShell.astro` renders the 13 SEO pillar pages in `src/pages/topics/*.astro`. Each topic page supplies the required props (title, description, keywords, intro, FAQs, related topics, `volume`) and optional SEO-boosting props:

- `wordCount` — drives the auto-computed `time-to-read` badge and TechArticle's `wordCount` + `timeRequired` (read at ~220 words/min).
- `lastUpdated` — ISO date; defaults to build date; flows into `dateModified` in both meta and JSON-LD.
- `datePublished` — ISO date; defaults to 2026-01-01; flows into `datePublished` schema.
- `mentions` — array of `{ name, url? }` for every Databricks technology referenced; rendered as Schema.org `mentions` of type `SoftwareApplication` (semantic SEO, entity recognition).
- `toc` — array of H2 labels; the component renders a TOC with anchor links that the page-level H2s match via `id="<slug>"` attributes (slug = lowercase, alphanumeric only, hyphens for spaces — `slugify` is inlined).
- `howToSteps` + `howToTotalTime` — when present, emits HowTo JSON-LD (rich-result eligible). Currently wired on RAG only.

The shell auto-emits TechArticle + FAQPage + BreadcrumbList (+ HowTo when steps present), renders a "Covered in Volume N" badge, passes `primaryVolume` to Layout, and routes the per-page BuyCTA at the correct volume's Amazon URL.

Topic pages currently map to volumes as follows:
- **V3**: `unity-catalog`, `lakehouse`, `lakeflow-sdp`, `lakeflow-jobs`, `asset-bundles`, `databricks-cicd`, `performance-tuning`.
- **V4**: `rag-with-databricks`, `agentbricks`, `multi-agent-systems`, `mlflow`, `vector-search`, `feature-stores`, `mlops-on-databricks`.

`/topics/` (the index) groups them by volume.

### Buy flow with two Amazon URLs
There is no single "Buy" button on the site. Every primary Buy CTA routes to `/buy/`, which lists both volumes side-by-side with separate Amazon links. Each volume has its own `amazonUrl` and ISBN in `book.ts`. Per-volume topic pages also include an inline volume-specific BuyCTA (rendered automatically by TopicShell) that links directly to that volume's Amazon URL — bypassing `/buy/`.

`BuyCTA.astro` has two visual variants: a `volume` prop pins it to a single volume (used on topic pages); omitting it shows both volumes as choices (used on the homepage and FAQ).

### Book figures
`src/components/BookFigure.astro` renders a captioned figure with a "Figure N.M · Volume V, Chapter C" source line. 13 actual book figures are embedded across topic pages — 4 as SVG vector (V4 only, in `public/images/figures/ch{41,49,51,52}_*.svg`) and the rest as 800px PNG rasters extracted from the source .docx files. The Genie SVG (`ch41_fig1_genie_grounding.svg`) is in the figures folder but not currently embedded — available if a Genie topic page is added.

### Blog uses Astro content collections
- Schema: `src/content.config.ts` (validates `title`, `description`, `pubDate`, `tags`, optional `draft`, optional `canonical`).
- Files: `src/content/blog/*.md`. Setting `draft: true` excludes from build and RSS.
- Routes: `src/pages/blog/[...slug].astro` per-post, `src/pages/blog/index.astro` for the index, `src/pages/rss.xml.ts` for the feed.

### Canonical domain + redirect strategy
- Primary canonical: `https://genaiblueprints.com` — set in `astro.config.mjs` `site`. Sitemap, canonical URLs, OG URLs, RSS feed, and the few absolute references in `Layout.astro` / `TopicShell.astro` / `index.astro` all derive from this.
- The author owns several other domains (`azureblueprints.com`, `velocityengineer.com`, `armtemplate.com`, `azurebluprint.com`, `zerosnone.com`, `onenzeros.com`, `hyper-coding.com`, `loopingly.com`). **These must 301-redirect to `genaiblueprints.com` at the host platform (Vercel/Netlify Domain settings)** — never serve as alternate canonicals, or you'll split SEO rank across domains.

### Robots / GEO
`public/robots.txt` explicitly allows the full AI crawler set (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-Web, anthropic-ai, PerplexityBot, Perplexity-User, Google-Extended, GoogleOther, CCBot, Applebot, Applebot-Extended, meta-externalagent, Bytespider, DuckAssistBot) plus standard search crawlers (Googlebot, Bingbot, Slurp, DuckDuckBot, YandexBot, Baiduspider) for Generative Engine Optimization. Don't tighten without checking with the author.

### Search engine verification + IndexNow
`series.verification` in `book.ts` holds three empty string slots — `google`, `bing`, `yandex`. When you have a verification token from Google Search Console / Bing Webmaster Tools / Yandex Webmaster, paste it as the value (just the token, not the full meta tag). Layout will emit the corresponding `<meta name="…-verification">` tag automatically. While empty, no tag is emitted.

`series.indexnow.key` holds the IndexNow API key (already generated: `d1b87503ad504e155bc272e3f5ed8f07`). The matching `public/d1b87503ad504e155bc272e3f5ed8f07.txt` file proves ownership. After deploy, you can push URL changes to Bing/Yandex/Seznam by hitting `https://api.indexnow.org/IndexNow` with the canonical URL and the key — useful for new blog posts and topic updates.

### Sitemap priorities
`astro.config.mjs` overrides `@astrojs/sitemap`'s defaults with a `serialize` function that sets per-route priority and changefreq:
- Homepage: priority 1.0, weekly
- `/buy/`: 0.95, monthly
- Topic pillar pages (`/topics/<slug>/`): 0.9, monthly
- Other static pages (`/preview/`, `/faq/`, `/about/`, `/reviews/`): 0.8, monthly
- Blog index + posts: 0.7, weekly/monthly
This crawl-budget hint is read by Google and (especially) Bing. Avoid claiming priority 1.0 on multiple pages; it dilutes the signal.

## Launch-blocking placeholders

In `src/data/book.ts`, each volume has placeholders that render literal "PLACEHOLDER" strings until updated:

- `volumes.v3.amazonUrl` and `volumes.v4.amazonUrl` — every Buy CTA + the `/buy/` page rely on these.
- `volumes.v3.isbn` and `volumes.v4.isbn` — Layout omits them from Book JSON-LD while they start with "PLACEHOLDER", so they're safe-but-empty until updated.

The cover images for both volumes are wired (V3 at `/images/Databricks_Cover_1600x2560 (2).jpg`, V4 at `/images/Databricks_Cover_v4_1600x2560.jpg`). Author photo at `/images/author.jpg` is still missing — AuthorCard has a JS fallback that swaps in initials if the image fails to load.

## Deploy

Both `vercel.json` and `netlify.toml` are present; the site builds statically to `./dist/`. After deploy, **add all secondary domains and configure them as 301 redirects to `genaiblueprints.com`** in the host's Domain settings.
