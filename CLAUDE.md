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
`src/layouts/Layout.astro` wraps every page. It:

- Auto-builds the canonical URL from `Astro.url.pathname` + `astro.config.mjs`'s `site` (currently `https://genaiblueprints.com`).
- Emits a `Person` schema plus one `Book` schema per relevant volume. Pages that focus on one volume pass `primaryVolume="v3"` or `primaryVolume="v4"` — Layout then emits only that volume's Book schema. Series-wide pages (homepage, FAQ, buy, about, blog) omit the prop and Layout emits both Books.
- Accepts a `jsonLd` prop (object or array) appended to — not replacing — those defaults. Page-specific schemas (FAQPage, TechArticle, BreadcrumbList, BlogPosting, WebSite, BookSeries) come in this way.

### Topic pillar pages use `TopicShell`
`src/components/TopicShell.astro` renders the 13 SEO pillar pages in `src/pages/topics/*.astro`. Each topic page only supplies: title, description, keywords, intro, FAQs, related topics, and a `volume` prop (`'v3'` or `'v4'`) — the shell auto-emits BreadcrumbList + TechArticle + FAQPage schemas, renders a "Covered in Volume N" badge, passes `primaryVolume` to Layout, and routes the per-page BuyCTA at the correct volume's Amazon URL.

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
`public/robots.txt` explicitly allows AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot) for Generative Engine Optimization. Don't tighten without checking with the author.

## Launch-blocking placeholders

In `src/data/book.ts`, each volume has placeholders that render literal "PLACEHOLDER" strings until updated:

- `volumes.v3.amazonUrl` and `volumes.v4.amazonUrl` — every Buy CTA + the `/buy/` page rely on these.
- `volumes.v3.isbn` and `volumes.v4.isbn` — Layout omits them from Book JSON-LD while they start with "PLACEHOLDER", so they're safe-but-empty until updated.

The cover images for both volumes are wired (V3 at `/images/Databricks_Cover_1600x2560 (2).jpg`, V4 at `/images/Databricks_Cover_v4_1600x2560.jpg`). Author photo at `/images/author.jpg` is still missing — AuthorCard has a JS fallback that swaps in initials if the image fails to load.

## Deploy

Both `vercel.json` and `netlify.toml` are present; the site builds statically to `./dist/`. After deploy, **add all secondary domains and configure them as 301 redirects to `genaiblueprints.com`** in the host's Domain settings.
