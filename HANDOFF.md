# Handoff — Databricks for Practitioners site

## What's built (today)

A complete, aggressive-SEO landing site for the book. Deploy-ready.

### Pages (16)

- `/` — Homepage with hero, features, audience, testimonials, author card, FAQ, CTA
- `/topics/` — Topic index page
- `/topics/rag-with-databricks/` — ~1,800-word pillar SEO page
- `/topics/agentbricks/` — ~1,800-word pillar SEO page
- `/topics/multi-agent-systems/` — ~1,800-word pillar SEO page
- `/topics/mlflow/` — ~1,800-word pillar SEO page
- `/topics/vector-search/` — ~1,800-word pillar SEO page
- `/topics/feature-stores/` — ~1,700-word pillar SEO page
- `/topics/lakehouse/` — ~1,700-word pillar SEO page
- `/topics/mlops-on-databricks/` — ~1,900-word pillar SEO page
- `/preview/` — TOC + sample chapter referral
- `/about/` — Author bio with credentials
- `/faq/` — Extended FAQ with schema
- `/reviews/` — Endorsement placeholders ready to fill
- `/blog/` — Blog index
- `/blog/welcome/` — Seed blog post
- `/blog/[slug]/` — Individual post template
- `/rss.xml` — RSS feed
- `/sitemap-index.xml` — Auto-generated sitemap
- `/404` — Custom 404

### SEO baseline

- Schema.org Book + Person on every page
- Schema.org FAQPage on home, FAQ, and all 8 topic pages
- Schema.org BreadcrumbList on topic pages
- Schema.org TechArticle on topic pages, BlogPosting on blog
- Open Graph + Twitter Card meta tags
- Canonical URLs
- XML sitemap
- `robots.txt` with explicit AI crawler allowlist (for GEO / Generative Engine Optimization)
- Mobile-first, ~zero JavaScript (Astro = great Core Web Vitals)

### Technical

- Astro 5 + Tailwind CSS v4
- Builds clean, sub-second
- Vercel + Netlify deploy configs included
- Sticky mobile buy bar
- Single source of truth (`src/data/book.ts`) for all book metadata

---

## What's intentionally placeholder

These are blocking-for-launch items, all in one file or one folder:

1. **Cover image** — drop into `public/images/cover.jpg`.
2. **Amazon URL** — edit `amazonUrl` in `src/data/book.ts`.
3. **Author photo** — drop into `public/images/author.jpg`.
4. **ISBN, page count, exact prices** — update the corresponding fields in `src/data/book.ts`.

And these are non-blocking but should be filled in over time:

5. **Real testimonials** — `src/pages/reviews.astro` has 6 placeholder slots. Replace as endorsements arrive.
6. **Homepage testimonials** — `src/components/Testimonials.astro` has 3 placeholder quotes (homepage social proof).
7. **Newsletter integration** — not added. Easy 10-minute add when you have a provider.
8. **Analytics** — not installed. Plausible, Vercel Analytics, or GA4 each take ~5 minutes.

---

## What's been gambled on (review and tell me to fix)

A few choices I made that you may want to redirect:

- **Domain assumption.** `astro.config.mjs` uses `https://databricksforpractitioners.com` — change to your actual domain.
- **Pricing.** Set to $9.99 Kindle / $39.99 paperback as placeholders. Edit `src/data/book.ts`.
- **Topic page content.** Each is written as authoritative practitioner content based on Databricks' 2026 state. If you disagree with any architectural opinions, tell me — I'll rewrite.
- **8 topic pages chosen.** RAG, AgentBricks, multi-agent, MLflow, vector search, feature stores, Lakehouse, MLOps. If you want others (Genie, Mosaic AI Inference, Unity Catalog deep-dive as standalone, Spark Streaming for AI, etc.), I can add them.
- **Author credentials.** Pulled from the riteshmodi.com data — same 18 books, BUILD talks, etc. Verify nothing's stale.
- **Hero copy.** Confident, opinionated, written to sell. Tone is "expert speaking to peers." If you want softer/different tone, tell me.

---

## Deployment in 30 minutes

1. Drop cover.jpg and author.jpg into `public/images/`
2. Edit `src/data/book.ts` — amazonUrl, ISBN, prices
3. `npm install` (if not done)
4. `npm run dev` to verify locally
5. Push to a new GitHub repo
6. Connect on Vercel, deploy
7. Add custom domain in Vercel settings
8. Update DNS at your registrar
9. Done. Site is live.

---

## What this site is optimized for

**Primary goal:** convert qualified search traffic to Amazon sales.

**Secondary goal:** rank for high-intent Databricks-related queries, especially the long-tail technical queries (e.g., "mosaic ai vector search vs pinecone," "agentbricks tutorial," "mlflow 3 tracing setup").

**Tertiary goal:** build author authority for future books and speaking.

The topic pages are doing most of the work. They're written long enough and substantive enough to genuinely earn rankings — not thin SEO bait. Every topic page links to the book.
