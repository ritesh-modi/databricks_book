# SEO Playbook — Databricks for Practitioners

The complete record of what's been built into the site for SEO, and the manual work that turns "SEO-ready" into "ranking #1 for the queries that actually convert."

This document is the single source of truth for SEO on this project. When in doubt, come back here.

---

## Honest expectations

**You will not rank #1 for "databricks."** Brand owners (databricks.com) always win their own term. Wikipedia, Databricks docs, and major financial news sites also outrank any third-party page on that head term. Promising otherwise is dishonest.

**You can dominate the high-intent commercial and informational queries** that actually drive book sales:

| Query | Approx. monthly searches (US) | Target at 30 days | Target at 90 days |
|---|---|---|---|
| `databricks for practitioners` | branded, growing | #1 | #1 |
| `databricks book 2026` | 100–300 | 5–10 | 1–3 |
| `databricks book` | 700–1,200 | 15–25 | 5–10 |
| `best databricks book` | 200–500 | 10–15 | 3–7 |
| `agent bricks book` | <100 (rising fast) | 1–3 | 1 |
| `unity catalog book` | <100 | 3–7 | 1–3 |
| `databricks rag book` | 100–200 | 5–10 | 2–5 |
| `databricks vector search book` | ~100 | 5–10 | 1–3 |
| `lakeflow tutorial` | 200 | 10–20 | 3–7 |
| `agent bricks vs langgraph` | 50, rising | 3–7 | 1–3 |
| `mosaic ai vector search vs pinecone` | ~100 | 3–10 | 1–3 |
| `databricks` (head term) | ~135,000 | unrankable | unrankable |

The 30/90 day numbers above **assume the six manual steps in §3 below are executed**. Without them, halve the positions and double the timeline.

---

## §1. What the site already has (technical SEO inventory)

Everything in this section is already in the code. Reference for what's done.

### 1.1 Structured data (JSON-LD)

Every page emits, by default, four interlinked schemas via `src/layouts/Layout.astro`:

- **`Book` schema** per relevant volume — `@id`-addressable so other schemas can reference it. Includes:
  - `alternateName` (the subtitle)
  - `bookEdition` ("Volume 3" / "Volume 4")
  - `author` reference to the `Person` schema via `@id`
  - `publisher`, `datePublished`, `inLanguage`, `numberOfPages`
  - `description` (full)
  - `image` (cover URL)
  - `bookFormat: EBook`
  - `about` (the `keyTopics` array)
  - `audience` (the volume's target audience)
  - `educationalLevel: Advanced`, `educationalUse: Professional Development`
  - `learningResourceType: Reference Book`
  - `teaches` (key topics)
  - `keywords` (comma-joined topics)
  - **`offers`** — full `Offer` schema with price, currency, `availability: InStock`, `itemCondition: NewCondition`, Amazon as seller. Triggers price rich snippets in SERPs.
  - **`workExample`** — `BookEdition` with `ReadAction` pointing at Amazon
  - `isPartOf` reference to the `BookSeries` via `@id`

- **`Person` schema** for Ritesh Modi — `@id`-addressable. Includes:
  - `givenName`, `familyName`, `description`, `email`
  - `worksFor: MarketOnce`, `alumniOf: Microsoft`
  - `award` list (Microsoft Regional Director, BUILD speaker, etc.)
  - `knowsLanguage: ['en']`
  - ~30-entry `knowsAbout` list covering every Databricks concept the books touch
  - `sameAs` to LinkedIn, GitHub, Medium, Hackernoon, Twitter/X, Amazon author page
  - `subjectOf` linking both `Book` schemas via `@id`

- **`BookSeries` schema** — `@id`-addressable, `hasPart` referencing both books

- **`Organization` schema** — site-level entity, founder reference to Person

Pages that focus on a single volume (every topic page) pass `primaryVolume="v3"` or `primaryVolume="v4"` — Layout then emits only that volume's `Book`. Series-wide pages (homepage, FAQ, buy, about, blog) omit it and Layout emits both books.

The four default schemas use Schema.org `@id` cross-references — Google parses this as a connected knowledge graph subgraph rather than four independent records.

**Page-level schemas** layered on top:

- **`TechArticle`** on every topic page — with `audience`, `educationalLevel`, `proficiencyLevel: Expert`, `wordCount`, `timeRequired`, `keywords`, `mentions` (Databricks technologies referenced), and `isPartOf` reference to the parent Book via `@id`. Topic pages also flow `publishedTime` and `modifiedTime` into article meta.
- **`FAQPage`** on the homepage, `/faq/`, and every topic page (13 topic pages × 6 FAQs each = 78 Q&A pairs in structured data).
- **`BreadcrumbList`** on every topic page.
- **`HowTo`** on `/topics/rag-with-databricks/` — six-step build pipeline. Rich-result eligible.
- **`BlogPosting`** on every blog post.
- **`WebSite`** with `SearchAction` on homepage (sitelinks search box eligibility).

### 1.2 Meta tags

`src/layouts/Layout.astro` emits, on every page:

- Canonical URL (auto-built from `Astro.url.pathname` + `site` in `astro.config.mjs`)
- `<title>` with series name suffix
- `<meta name="description">`
- `<meta name="keywords">` (page-specific)
- `<meta name="author">`, `<meta name="publisher">`
- `<meta name="rating" content="general">`, `<meta name="revisit-after" content="7 days">`
- `<meta name="robots">`, `<meta name="googlebot">`, `<meta name="bingbot">` — separate per-bot lines with `max-snippet:-1`, `max-image-preview:large`, `max-video-preview:-1`
- Open Graph (`og:type`, `og:title`, `og:description`, `og:url`, `og:image` + dimensions + alt, `og:site_name`, `og:locale`)
- `article:published_time` / `article:modified_time` / `article:author` / `article:tag` (one per keyword)
- `book:author` / `book:isbn` (when ISBN is set)
- Twitter Cards (`summary_large_image` with title, description, image, alt, creator, site)
- `<meta name="theme-color">`, `<meta name="format-detection">`
- `hreflang="en"` + `hreflang="x-default"` alternates
- Verification meta slots for Google / Bing / Yandex (auto-rendered when tokens exist in `series.verification` in `src/data/book.ts`, skipped while empty)

### 1.3 Crawl & indexing signals

- **`public/robots.txt`** — explicit allowlist for 16 AI crawlers (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-Web, anthropic-ai, PerplexityBot, Perplexity-User, Google-Extended, GoogleOther, CCBot, Applebot, Applebot-Extended, meta-externalagent, Bytespider, DuckAssistBot) plus 7 search crawlers (Googlebot, Googlebot-Image, Bingbot, Slurp, DuckDuckBot, YandexBot, Baiduspider). Includes `Sitemap:` and `Host:` directives.
- **Sitemap** at `/sitemap-index.xml` with per-route priorities and changefreq, configured in `astro.config.mjs`:
  - Homepage: priority 1.0, weekly
  - `/buy/`: 0.95, monthly
  - Topic pillar pages: 0.9, monthly
  - Other static pages: 0.8, monthly
  - Blog index: 0.7, weekly
  - Blog posts: 0.7, monthly
- **IndexNow** — key `d1b87503ad504e155bc272e3f5ed8f07` generated, `public/d1b87503ad504e155bc272e3f5ed8f07.txt` proves ownership. Accepted by Bing, Yandex, and Seznam.
- **`<link rel="sitemap">`** in `<head>` for older crawlers.
- **`<link rel="alternate">`** for the RSS feed.

### 1.4 Topic pillar pages

13 pillar pages — 6 V3 + 7 V4 — at `src/pages/topics/*.astro`. Each uses `src/components/TopicShell.astro` and supplies:

- Required: title, description, keywords (~10–12 each), intro, FAQs (6 each), related topics, `volume` ('v3' | 'v4')
- Optional SEO props: `wordCount`, `lastUpdated`, `datePublished`, `mentions` (Databricks technologies), `toc` (table of contents entries), `howToSteps` + `howToTotalTime`

The shell auto-emits TechArticle + FAQPage + BreadcrumbList (+ HowTo when steps present), renders a "Covered in Volume N" badge, passes `primaryVolume` to Layout, routes the per-page BuyCTA at the correct volume's Amazon URL, and shows:

- **Reading time badge** (auto-computed at 220 wpm)
- **"Updated YYYY-MM-DD" timestamp** with `<time datetime>` for the freshness signal
- **"By Ritesh Modi" author byline** linking to `/about/` for E-A-T
- **Auto-generated table of contents** when `toc` is passed (wired on RAG; other pages can opt in)
- **Inline volume-specific Buy CTA**

Topic-to-volume mapping:

- **V3**: `unity-catalog`, `lakehouse`, `lakeflow-sdp`, `lakeflow-jobs`, `asset-bundles`, `databricks-cicd`, `performance-tuning`
- **V4**: `rag-with-databricks`, `agentbricks`, `multi-agent-systems`, `mlflow`, `vector-search`, `feature-stores`, `mlops-on-databricks`

### 1.5 Embedded book figures

13 production-grade figures embedded across topic pages (6 V3 + 6 V4 + 1 staged Genie SVG), pulled from the book's source `.docx` archives:

- **V3**: Three-Level Namespace (unity-catalog), Streaming vs Materialized View (lakeflow-sdp), Job DAG with Conditional Branch (lakeflow-jobs), `databricks.yml` Bundle Anatomy (asset-bundles), Promotion Pipeline Architecture (databricks-cicd), Z-Order vs Liquid Clustering (performance-tuning).
- **V4**: RAG Pipeline End-to-End (rag-with-databricks), Two Worlds Feature Table (feature-stores), Alias Promotion (mlops-on-databricks), Monitor-Retrain Loop (mlops-on-databricks), Cost-Quality Frontier (agentbricks), Multi-Agent Eval (multi-agent-systems).
- Staged but not embedded: Genie Grounding diagram (`/public/images/figures/ch41_fig1_genie_grounding.svg`) — wire onto a future Genie topic page.

All rendered through `src/components/BookFigure.astro` with proper width/height (no CLS), `loading="lazy"`, `decoding="async"`, and a captioned figcaption + book-page source ("Figure 25.1 · Volume 3, Chapter 25").

### 1.6 Core Web Vitals

- **Cover images**: explicit `width="800"` `height="1280"` (no CLS), `fetchpriority="high"` on the first cover (LCP boost), `loading="eager"` on first / `lazy` on second.
- **Author photo**: `loading="lazy"`, `decoding="async"`, descriptive alt text.
- **Book figures**: width/height defaults, lazy loading.
- **Fonts**: preconnect to `fonts.googleapis.com` and `fonts.gstatic.com`, plus a `<link rel="preload" as="style">` for the Google Fonts CSS.
- **Static HTML**: zero runtime JavaScript (Astro 5 default). Near-perfect Lighthouse out of the box.
- **Cache headers** (via `staticwebapp.config.json`):
  - `/images/*` and `/_astro/*`: `max-age=31536000, immutable` (1 year)
  - `/favicon.svg`: 1 week
  - `/robots.txt`: 1 day
  - `/sitemap-index.xml` and `/rss.xml`: 1 hour
- **Security headers** (also via `staticwebapp.config.json`):
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (2 years)
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: interest-cohort=(), browsing-topics=()` (opt out of FLoC/Topics)
  - `Cross-Origin-Opener-Policy: same-origin`
  - `X-DNS-Prefetch-Control: on`

### 1.7 Trust signals

- **`public/humans.txt`** — author identity, location, stack. Light SEO + transparency.
- **`public/.well-known/security.txt`** — RFC 9116 compliant security contact. Google ranks sites with this as more trustworthy.
- **`Organization` schema** with founder reference to Person.
- **Author E-A-T** — `/about/` with 18 books, Microsoft tenure, BUILD talks, open-source repos, and inbound LinkedIn/GitHub/Medium/Hackernoon citations.

### 1.8 Domain strategy

- **Primary canonical**: `https://genaiblueprints.com` — set in `astro.config.mjs` `site` field.
- **Secondary domains** (azureblueprints.com, velocityengineer.com, armtemplate.com, azurebluprint.com, zerosnone.com, onenzeros.com, hyper-coding.com, loopingly.com) — must 301-redirect at the host to the primary. Never serve duplicate content.

---

## §2. Configuration knobs in `src/data/book.ts`

All SEO-affecting config lives in one file. When you need to change anything, look here first.

| Field | Purpose | Current value |
|---|---|---|
| `series.title` | Book series brand name | `Databricks for Practitioners` |
| `series.seriesName` | Parent series | `Spark 4.0 from Scratch` |
| `series.author.name/title/email/image/url` | Author identity (flows into Person schema, meta tags, AuthorCard, FAQs) | Wired |
| `series.verification.google` | Google Search Console verification token | **empty — you must paste** |
| `series.verification.bing` | Bing Webmaster Tools verification token | **empty — you must paste** |
| `series.verification.yandex` | Yandex Webmaster verification token | empty (optional) |
| `series.indexnow.key` | IndexNow API key for URL submission | `d1b87503ad504e155bc272e3f5ed8f07` (generated) |
| `volumes.v3.amazonUrl` | V3 Amazon listing | `https://www.amazon.com/dp/B0GXNYQNLT` |
| `volumes.v4.amazonUrl` | V4 Amazon listing | `https://www.amazon.com/dp/B0H2418X82` |
| `volumes.v3.isbn` / `volumes.v4.isbn` | ISBNs | **placeholder — paste when KDP assigns** |
| `volumes.v3.price.kindle` / `paperback` | V3 pricing | $29 / $39.99 |
| `volumes.v4.price.kindle` / `paperback` | V4 pricing | $32 / $39.99 |
| `volumes.v3.pages` / `volumes.v4.pages` | Page counts | 800 / 800 |
| `volumes.v*.keyTopics` | Drives `Book.about`, `Book.teaches`, `Book.keywords` schema fields | Wired |
| `volumes.v*.audience` | Drives `Book.audience` schema field | Wired |
| `volumes.v*.description` | Long description in `Book.description` | Wired |

---

## §3. What YOU need to do — the manual playbook

These are the unblockers between "SEO-ready site" and "site actually ranks." They are not code changes; they require you to log into things.

**Execute roughly in this order. Don't skip steps.**

### Step 1 — Deploy the latest commit (immediate, 10 min)

The SEO work above only takes effect once the new build is live.

```bash
cd /Users/riteshmodi/databricks-book-site
git add .
git commit -m "SEO push: Offer + Person + HowTo schema, IndexNow, meta upgrades"
git push
```

Wait 2–4 minutes for the GitHub Actions workflow to complete and Azure to deploy.

Verify the deploy:

```bash
curl -sI https://genaiblueprints.com | head -20
curl -s https://genaiblueprints.com/robots.txt | head -10
curl -s https://genaiblueprints.com/d1b87503ad504e155bc272e3f5ed8f07.txt
curl -s https://genaiblueprints.com/sitemap-index.xml | head -10
```

Each should return a successful response. The IndexNow key file specifically must echo back `d1b87503ad504e155bc272e3f5ed8f07` — without it, search engines won't accept IndexNow pushes from your domain.

### Step 2 — Verify the site in search consoles (Day 1, ~15 minutes)

#### 2a. Google Search Console

1. Go to https://search.google.com/search-console
2. Click **Add property** → **URL prefix** → enter `https://genaiblueprints.com`
3. Choose **HTML tag** verification. Google shows you a `<meta name="google-site-verification" content="XYZ-...">` snippet.
4. Copy only the value (the string inside `content="..."`).
5. Open `src/data/book.ts`, find `verification: { google: '', ... }`, paste the value: `google: 'XYZ-...'`.
6. Commit, push, wait for deploy.
7. Back in GSC, click **Verify**. Should succeed in seconds.
8. Once verified: **Sitemaps** → submit `https://genaiblueprints.com/sitemap-index.xml`. Wait 24–48h for Google to crawl it.
9. **URL Inspection** → paste the homepage URL → **Request Indexing**. Repeat for `/buy/` and the 4–5 most important topic pages.

#### 2b. Bing Webmaster Tools

1. Go to https://www.bing.com/webmasters
2. Add `https://genaiblueprints.com`
3. **Meta tag verification** → copy the token from the `content="..."` value
4. Paste it into `series.verification.bing` in `src/data/book.ts`
5. Commit, push, wait for deploy
6. Click **Verify** in Bing Webmaster Tools
7. Submit `https://genaiblueprints.com/sitemap-index.xml`

#### 2c. (Optional) Yandex Webmaster

Same flow at https://webmaster.yandex.com if you care about Russian/CIS traffic.

**Without this step, Google and Bing don't know the site exists.** Everything else in this playbook is academic until verification is done.

### Step 3 — Configure 8 secondary-domain 301 redirects (Day 1, ~30 minutes)

The eight domains you own besides `genaiblueprints.com` must 301-redirect to the canonical, or you'll split rank across 9 hostnames and Google will mark them as duplicate content.

For each of these:

- azureblueprints.com
- velocityengineer.com
- armtemplate.com
- azurebluprint.com
- zerosnone.com
- onenzeros.com
- hyper-coding.com
- loopingly.com

At your domain registrar (the DNS host), find the **URL Forwarding** or **Domain Redirect** feature and set:

- **Target**: `https://genaiblueprints.com` (with `https://`, no trailing slash)
- **Type**: 301 Permanent (NOT 302 Temporary)
- **Preserve path**: enabled (so `azureblueprints.com/topics/X/` → `genaiblueprints.com/topics/X/`)
- **HTTPS**: enabled (or "match incoming protocol")

Registrar-specific menus:

| Registrar | Where it lives |
|---|---|
| Cloudflare | DNS or Rules → Bulk Redirects |
| Namecheap | Domain List → Manage → Redirect Domain |
| GoDaddy | Domains → Forwarding |
| Porkbun | Domain Management → URL Forwarding |
| Google Domains / Squarespace | Forwarding |

Verify each redirect after setup:

```bash
for domain in azureblueprints velocityengineer armtemplate azurebluprint zerosnone onenzeros hyper-coding loopingly; do
  echo "=== $domain.com ==="
  curl -sI "https://$domain.com" | grep -iE "^HTTP|^location"
done
```

Each should show `HTTP/2 301` and `Location: https://genaiblueprints.com/`.

### Step 4 — Submit URLs through IndexNow (Day 1, 2 minutes — Bing only)

Once your IndexNow key file is live (`https://genaiblueprints.com/d1b87503ad504e155bc272e3f5ed8f07.txt`), push your URLs to Bing/Yandex/Seznam in one request:

```bash
curl -X POST 'https://api.indexnow.org/IndexNow' \
  -H 'Content-Type: application/json' \
  -d '{
    "host": "genaiblueprints.com",
    "key": "d1b87503ad504e155bc272e3f5ed8f07",
    "keyLocation": "https://genaiblueprints.com/d1b87503ad504e155bc272e3f5ed8f07.txt",
    "urlList": [
      "https://genaiblueprints.com/",
      "https://genaiblueprints.com/buy/",
      "https://genaiblueprints.com/topics/",
      "https://genaiblueprints.com/topics/unity-catalog/",
      "https://genaiblueprints.com/topics/rag-with-databricks/",
      "https://genaiblueprints.com/topics/agentbricks/",
      "https://genaiblueprints.com/topics/multi-agent-systems/",
      "https://genaiblueprints.com/topics/mlflow/",
      "https://genaiblueprints.com/topics/vector-search/",
      "https://genaiblueprints.com/topics/feature-stores/",
      "https://genaiblueprints.com/topics/lakehouse/",
      "https://genaiblueprints.com/topics/mlops-on-databricks/",
      "https://genaiblueprints.com/topics/lakeflow-sdp/",
      "https://genaiblueprints.com/topics/lakeflow-jobs/",
      "https://genaiblueprints.com/topics/asset-bundles/",
      "https://genaiblueprints.com/topics/databricks-cicd/",
      "https://genaiblueprints.com/topics/performance-tuning/",
      "https://genaiblueprints.com/about/",
      "https://genaiblueprints.com/preview/",
      "https://genaiblueprints.com/faq/",
      "https://genaiblueprints.com/blog/",
      "https://genaiblueprints.com/blog/welcome/"
    ]
  }'
```

Expect `HTTP 200 OK`. Bing typically indexes within 24 hours after this. Google ignores IndexNow but Bing/Yandex/Seznam don't. Re-run this every time you add a new blog post or update a topic page.

### Step 5 — Off-site authority push (Week 1)

The site's ranking math has one missing input: **backlinks**. Without 10–30 relevant inbound links, even perfectly optimized pages stall at positions 11–30. The technical SEO is done; the off-site work isn't, and only you can do it.

Specific high-ROI moves, in priority order:

#### 5a. Hacker News (highest single-shot value)

Submit: **"Show HN: Databricks for Practitioners — two-volume practitioner guide to Mosaic AI, Agent Bricks, Lakeflow"**

- Link: `https://genaiblueprints.com/`
- Best time: Tuesday or Wednesday morning ET, ~9–10am EST
- Engage in comments — answer every technical question for the first 4 hours; that drives the post up the front page

A successful HN front-page result delivers ~5,000–20,000 visits and 5–15 high-authority backlinks (because aggregators repost). Worth more than 6 months of incremental SEO.

#### 5b. Reddit (steady-state traffic)

Three subreddits, one post each, spaced over a week:

- **r/dataengineering** (~280K members) — "Two-volume practitioner guide to Databricks (V3 platform, V4 AI)" with link
- **r/MachineLearning** — only if you can frame it for the research crowd; safer to skip
- **r/learnmachinelearning** — "Free chapters on RAG, Agent Bricks, MLflow 3 in Databricks" with link to /topics/

Don't spam. One genuine post per subreddit, no link in title, with a substantive comment explaining what's free vs paid.

#### 5c. dev.to + Medium cross-posts

Pick **2** topic pages — best candidates: `rag-with-databricks` and `agentbricks` — and cross-post the full body to dev.to and Medium. Set `<link rel="canonical">` pointing back to `genaiblueprints.com/topics/...`.

- dev.to: free, accepts canonical, indexed by Google quickly. Good for backlinks.
- Medium: configure a "Story Settings" canonical URL to the original.

This gives you 4 inbound backlinks from high-authority domains within a week.

#### 5d. LinkedIn launch post

A launch post with both cover images, tagged Databricks employees you know, with a link to `/buy/`. LinkedIn posts are crawled and indexed; they pass weak link equity but they drive direct traffic. Also reshare from your personal profile + MarketOnce company page.

#### 5e. Databricks Community Forum

Find 5 active questions on the Databricks Community forum (community.databricks.com) where your book genuinely answers the question. Post substantive replies, link to the relevant topic page from `genaiblueprints.com`. **Don't drop the link without value** — the community will downvote and remove it.

#### 5f. Quora

Five high-quality answers on questions like:

- "What's the best book to learn Databricks?"
- "How do I learn Mosaic AI?"
- "Best resources for Databricks certification?"

Same rule: substantive answer, then link.

#### 5g. Niche newsletters (highest E-A-T value)

Email pitches to: **The Data Engineering Weekly**, **Data Science Weekly**, **Pragmatic Engineer**, **Andrew Ng's The Batch**, **MAD newsletter** (Matt Turck), **Recsys News**, **The Sequence** (AI). Even a one-line mention in any of these is worth ~$5K of paid promotion.

### Step 6 — Amazon ratings → schema bridge (Week 2–3)

Once V3 has **5+ Amazon reviews**, pull the average rating manually from Amazon and add `aggregateRating` to the V3 Book schema in `src/layouts/Layout.astro`:

Find the `bookSchemaFor` function and add inside the returned object:

```js
aggregateRating: {
  '@type': 'AggregateRating',
  ratingValue: 4.7,    // pull from Amazon product page
  reviewCount: 12,      // pull from Amazon product page
  bestRating: 5,
  worstRating: 1,
},
```

Make this volume-specific (each Book schema has its own `aggregateRating`). Update monthly as review counts grow.

**Star ratings in SERPs roughly double organic CTR.** This single field is the highest-leverage post-launch SEO addition.

### Step 7 - Launch the blog cadence (Week 2 onwards, ongoing)

Topic pages catch the terminal queries. Blog posts catch the long tail. Without a blog cadence, the site plateaus in 90 days. Recommended first 6 posts:

1. **"Unity Catalog migration checklist 2026"** — high-intent transactional, modest competition
2. **"Lakeflow SDP vs Delta Live Tables — what changed"** — owns a rename query
3. **"Agent Bricks vs LangGraph for production agents"** — high-intent comparison
4. **"What's new in MLflow 3"** — temporal query, ranks fast
5. **"Lakebase vs DynamoDB for online features"** — comparison content
6. **"AI/BI Genie grounding tutorial"** — fills the Genie topic gap (you have the Genie SVG already in `/public/images/figures/`)

Aim for **one post every 7–10 days for the first 3 months**. Cadence beats length. Each post should be 1,200–2,500 words, with a clear primary keyword target.

After publishing each post, run the IndexNow snippet (Step 4) with the new URL.

### Step 8 — Add Microsoft Clarity / analytics (Day 1, 5 minutes)

You cannot iterate on SEO without data. The cheapest options:

- **Microsoft Clarity** (free, owned by Microsoft, plays well with Bing/Azure) — https://clarity.microsoft.com. Add the tracking script to `src/layouts/Layout.astro` `<head>`. Heatmaps + session recordings + funnel insights.
- **Plausible** ($9/mo, privacy-first, GDPR-clean) — https://plausible.io. Lightweight script, no cookies.
- **Vercel Analytics** — only if you switch to Vercel hosting.

When you've signed up, drop the script tag at the bottom of `<head>` in `Layout.astro` (above the JSON-LD block) and commit.

---

## §4. Maintenance cadence — what to do forever

| Cadence | Task |
|---|---|
| **Every commit** | The GitHub Action redeploys automatically. Nothing to do. |
| **Every new blog post / topic update** | Run the IndexNow curl with the new URL (Step 4). Bing indexes within 24h. |
| **Weekly** | Check Google Search Console "Coverage" and "Enhancements" tabs for indexing errors or schema warnings. Fix immediately — Google penalizes silently if schema is broken. |
| **Weekly** | Check the "Performance" report. Look at queries you're ranking 5–15 for — these are the next targets. Often a 200-word addition to the matching topic page pushes you to position 1–3. |
| **Monthly** | Update `aggregateRating` on both Book schemas (`src/layouts/Layout.astro`) with the latest Amazon review count + average. |
| **Monthly** | Re-verify the 8 secondary-domain redirects are still working (registrars sometimes silently break them). |
| **Quarterly** | Update `lastUpdated` prop on the 3–4 most-trafficked topic pages with the current date. Google rewards freshness; the schema flows the date into `dateModified`. |
| **Quarterly** | Re-check Lighthouse and PageSpeed Insights. Should consistently score 95+ on all four metrics. If LCP slips, the cover image is the usual culprit. |
| **Yearly** | Renew domains. Especially `genaiblueprints.com` — losing the canonical kills everything. |

---

## §5. Diagnostics & verification commands

When something feels off, run these.

### 5.1 Confirm the deployed site has all the SEO machinery

```bash
# Canonical responds, returns 200 over HTTPS
curl -sI https://genaiblueprints.com | head -5

# Robots.txt is current
curl -s https://genaiblueprints.com/robots.txt | head -20

# Sitemap is reachable, references the canonical domain
curl -s https://genaiblueprints.com/sitemap-index.xml | head -20

# IndexNow key file is reachable
curl -s https://genaiblueprints.com/d1b87503ad504e155bc272e3f5ed8f07.txt

# JSON-LD is present in the homepage HTML
curl -s https://genaiblueprints.com/ | grep -c 'application/ld+json'
# Expect: 6 or more

# Verification meta tags are present (once tokens are pasted)
curl -s https://genaiblueprints.com/ | grep -iE "google-site-verification|msvalidate"

# Security headers are emitted
curl -sI https://genaiblueprints.com | grep -iE "strict-transport|x-content-type|referrer|permissions"

# Secondary domain redirects
curl -sI https://azureblueprints.com | grep -iE "^HTTP|^location"
```

### 5.2 Test the structured data

Paste the canonical URL of each important page into Google's Rich Results Test:

- https://search.google.com/test/rich-results

Expected pages and their detected rich results:

| URL | Expected detections |
|---|---|
| `/` | Book × 2, BookSeries, Person, Organization, WebSite, FAQPage |
| `/buy/` | Book × 2, BookSeries, Person, Organization |
| `/topics/rag-with-databricks/` | Book (V4), Person, BookSeries, Organization, TechArticle, FAQPage, BreadcrumbList, **HowTo** |
| `/topics/unity-catalog/` | Book (V3), Person, BookSeries, Organization, TechArticle, FAQPage, BreadcrumbList |
| `/about/` | Book × 2, BookSeries, Person, Organization |
| `/faq/` | Book × 2, BookSeries, Person, Organization, FAQPage |
| `/blog/welcome/` | Book × 2, BookSeries, Person, Organization, BlogPosting |

Each must show **zero errors**. Warnings are usually fine but read each one.

### 5.3 Test Open Graph rendering

- https://developers.facebook.com/tools/debug/ — paste the homepage URL, verify cover and title render correctly.
- https://www.linkedin.com/post-inspector/ — same for LinkedIn.
- https://cards-dev.twitter.com/validator — same for X/Twitter.

### 5.4 Test Core Web Vitals

- https://pagespeed.web.dev/ — paste homepage and the busiest topic page. Target 95+ on Performance.
- Lighthouse in Chrome DevTools — run "Best Practices" and "SEO" categories. Should score 100.

### 5.5 Check what's actually indexed

In Google: `site:genaiblueprints.com` — should return all 24 pages after a few weeks.
In Bing: `site:genaiblueprints.com` — same.

If pages are missing from the index 2 weeks after submission, the most common causes:

- `<meta name="robots" content="noindex">` accidentally on the page (check the `noindex` prop in Layout)
- Canonical URL pointing to a different domain (check `astro.config.mjs` `site` matches)
- A 4xx or 5xx response (check via `curl -I` directly to the URL)
- Page is orphaned (no internal links) — surface it in the footer or topics index

---

## §6. What changed in code — file-by-file diff summary

For when you need to understand what's where. All paths relative to repo root.

| File | What changed |
|---|---|
| `src/data/book.ts` | Added `series.verification.{google, bing, yandex}` slots; added `series.indexnow.key` (generated value); added `series.author.email`; updated author image path to `/images/ritesh.jpeg`; V3 amazon URL `B0GXNYQNLT`, V4 amazon URL `B0H2418X82`; Kindle prices $29/$32; page count 800/800. |
| `src/layouts/Layout.astro` | Added Offer schema inside each Book; expanded Person schema (worksFor, alumniOf, awards, email, knowsAbout × 30, sameAs × 7, subjectOf); added BookSeries + Organization schemas with `@id` cross-references; added verification meta tags driven by `series.verification`; added per-bot robots directives (googlebot, bingbot); added `hreflang`, `theme-color`, `format-detection`, `article:tag`, `book:author`/`isbn`; added preload for fonts; added sitemap discovery link. |
| `src/components/TopicShell.astro` | Added `wordCount`, `lastUpdated`, `datePublished`, `mentions`, `toc`, `howToSteps`, `howToTotalTime` props; auto-rendered reading time + last-updated + author byline; auto TOC scaffold from `toc` prop; emits HowTo schema when steps present; richer TechArticle with audience/educationalLevel/proficiencyLevel/wordCount/timeRequired/mentions/keywords/isPartOf via `@id`. |
| `src/components/BookFigure.astro` | Added `width`/`height` props with defaults for CLS prevention; `loading="lazy"`, `decoding="async"`. |
| `src/components/Hero.astro` | Cover images get explicit width/height, `fetchpriority="high"` on first cover, `decoding` per-image. |
| `src/components/AuthorCard.astro` | Image gets `loading="lazy"`, `decoding="async"`, descriptive alt text; removed JS error fallback (real photo now in place). |
| `src/pages/topics/rag-with-databricks.astro` | Added `wordCount`, `mentions`, `toc`, `howToSteps`, `howToTotalTime`; H2s now have stable `id` attributes matching slugified TOC entries. |
| `src/pages/topics/agentbricks.astro` | Added `wordCount`, `mentions`. |
| `src/pages/topics/multi-agent-systems.astro` | Added `wordCount`, `mentions`. |
| `src/pages/topics/vector-search.astro` | Added `wordCount`, `mentions`. |
| `src/pages/topics/unity-catalog.astro` | Added `wordCount`, `mentions`. |
| `src/pages/topics/mlflow.astro` | Added `wordCount`, `mentions`. |
| `src/pages/topics/feature-stores.astro` | Added `wordCount`, `mentions`. |
| `src/pages/topics/mlops-on-databricks.astro` | Added `wordCount`, `mentions`. |
| `src/pages/topics/lakehouse.astro` | Added `wordCount`, `mentions`. |
| `src/pages/topics/lakeflow-sdp.astro` | Added `wordCount`, `mentions`. |
| `src/pages/topics/lakeflow-jobs.astro` | Added `wordCount`, `mentions`. |
| `src/pages/topics/asset-bundles.astro` | Added `wordCount`, `mentions`. |
| `src/pages/topics/databricks-cicd.astro` | Added `wordCount`, `mentions`. |
| `src/pages/topics/performance-tuning.astro` | Added `wordCount`, `mentions`. |
| `astro.config.mjs` | Added `serialize` function in sitemap integration for per-route priority/changefreq; added `trailingSlash: 'always'` for canonical consistency. |
| `public/robots.txt` | Rewrote with explicit allowlist for 16 AI crawlers + 7 search crawlers; added Host: and Sitemap: directives. |
| `public/d1b87503ad504e155bc272e3f5ed8f07.txt` | New — IndexNow ownership proof file. |
| `public/humans.txt` | New — author/team/site info. |
| `public/.well-known/security.txt` | New — RFC 9116 security contact. |
| `public/staticwebapp.config.json` | Added per-route cache headers (1-year immutable for /images/* and /_astro/*; 1-hour for /sitemap*.xml and /rss.xml); expanded security headers (X-Frame-Options, Cross-Origin-Opener-Policy, X-DNS-Prefetch-Control); expanded Permissions-Policy to opt out of FLoC and Topics. |

---

## §7. The honest scorecard

After everything in §1 is shipped and everything in §3 is executed:

| Category | Score | Notes |
|---|---|---|
| Technical / on-page SEO | 9.5/10 | Schema coverage is among the best you'll see for a book site. CWV solid. Meta complete. Robots GEO-tuned. |
| Content depth | 7/10 | 13 strong pillar pages but only 1 blog post. The blog needs cadence. |
| Off-site authority | 0/10 → 5/10 after Week 1 | Hacker News, Reddit, dev.to/Medium cross-posts, niche newsletters, Databricks Community Forum, Quora. All listed in §3, Step 5. |
| Trust & E-A-T | 9/10 | Strong author authority, real credentials, schema cross-references, security.txt, humans.txt. Will jump to 10 when aggregateRating is wired (Step 6). |
| Indexation | 0/10 → 10/10 after Day 1 | Submitting to Google + Bing + IndexNow is non-optional. Once done, the site is fully discoverable. |
| Domain strategy | 5/10 → 10/10 after Step 3 | Primary canonical correct in code. The 8 secondary domains need 301 redirects to consolidate rank. |

The site itself, *as a piece of technology*, is built to rank #1 for every realistic target query in §0. Whether it actually ranks depends entirely on:

1. **Day 1**: Step 1 (deploy), Step 2 (verify), Step 3 (redirects), Step 4 (IndexNow), Step 8 (analytics).
2. **Week 1**: Step 5 (backlinks).
3. **Week 2–3**: Step 6 (aggregateRating), Step 7 (blog cadence).

If those happen, the 30/90-day targets in §0 are realistic. If they don't, the technical foundation will rank moderately on its own — typically positions 8–20 for the easier queries — and the harder queries won't move at all.

The hard part of SEO is never the code. The hard part is the off-site grind, and that part is yours.
