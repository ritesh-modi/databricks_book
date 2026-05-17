# SEO Strategy — Databricks for Practitioners

The 2026 SEO playbook this site implements. Read this before changing anything that affects search visibility.

---

## Target shape

This is a **single-product book site** that needs to do two things at once:

1. **Convert** qualified traffic to Amazon sales.
2. **Earn** that traffic by ranking for technical Databricks queries.

The play is content-led SEO. Pillar pages on the topics the book covers. Each pillar is substantive enough to rank, opinionated enough to be worth reading, and structured to push readers toward the buy CTA.

---

## Keyword targeting

### Tier 1 — high-intent buying keywords (homepage, preview, FAQ)

| Query | Intent | Current placement |
|---|---|---|
| databricks for practitioners | branded | homepage |
| databricks book | commercial | homepage, preview |
| best databricks book 2026 | commercial | homepage, FAQ |
| databricks book pdf | informational → commercial | FAQ |

These rank with a small amount of branded link-building and a few real reviews.

### Tier 2 — high-volume topic pillars (topic pages, ~1,500-2,000 words each)

| Query cluster | Topic page |
|---|---|
| rag on databricks, databricks rag tutorial, mosaic ai rag | `/topics/rag-with-databricks/` |
| agentbricks, databricks agentbricks, databricks agent framework | `/topics/agentbricks/` |
| mlflow databricks, mlflow 3.0, mlflow tracing | `/topics/mlflow/` |
| mosaic ai vector search, databricks vector database | `/topics/vector-search/` |
| databricks feature store, unity catalog feature store | `/topics/feature-stores/` |
| databricks lakehouse, lakehouse architecture, delta lake | `/topics/lakehouse/` |
| mlops databricks, databricks asset bundles | `/topics/mlops-on-databricks/` |
| multi-agent databricks, supervisor agent pattern | `/topics/multi-agent-systems/` |

Each topic page is structured for SEO:
- H1 = primary keyword variant
- H2s = related secondary queries
- Internal links to other topic pages (topic cluster + book pages)
- FAQ schema embedded
- Canonical URL set
- TechArticle schema on each

### Tier 3 — long-tail blog (filled over time)

Examples to write:
- "Mosaic AI Vector Search vs Pinecone — cost analysis"
- "How to debug an AgentBricks agent that's looping"
- "Asset Bundles tutorial — from notebooks to production"
- "MLflow Tracing setup for RAG systems"
- "Feature Store online tables — performance tuning"
- "AgentBricks vs LangGraph — production tradeoffs"

Each blog post should target a specific long-tail query and link back to the relevant topic page and the book.

---

## On-page SEO checklist (per page)

- [x] Unique `<title>` tag, 50-60 chars
- [x] Unique meta description, 140-160 chars
- [x] Single H1 per page
- [x] H2/H3 hierarchy reflects content structure
- [x] Internal links to related topic pages
- [x] Canonical URL set
- [x] Open Graph + Twitter Card tags
- [x] Schema.org JSON-LD (page-specific type + Book + Person)
- [x] Mobile-friendly (test in Chrome DevTools)

---

## Schema.org structured data

Implemented across the site:

| Schema type | Where | Why |
|---|---|---|
| `Book` | Every page (via Layout) | Tells Google there's a buyable book, drives Book Carousel + Knowledge Panel |
| `Person` (Author) | Every page (via Layout) | Author authority signal; ties content to a known entity |
| `WebSite` | Homepage | Site identity, optional SearchAction |
| `FAQPage` | Home, FAQ, every topic page | Eligible for FAQ rich results in Google |
| `BreadcrumbList` | Topic pages | Breadcrumb display in SERP |
| `TechArticle` | Topic pages | Article-level rich snippets |
| `BlogPosting` | Blog posts | Blog snippet eligibility |

Validate with Google Rich Results Test before launch.

---

## GEO — Generative Engine Optimization

For 2026, ranking in ChatGPT search, Perplexity, Google AI Overviews, and Claude is as important as ranking in classical Google. The site implements GEO-specific tactics:

1. **AI crawler allowlist** in `robots.txt`. GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot all explicitly allowed.
2. **Clean semantic HTML** — clear H1/H2 hierarchy, no JavaScript-rendered content. LLMs parse this directly.
3. **FAQ-format content** — LLMs prefer Q&A patterns for citation.
4. **Definitional content at the top of each topic page** — LLMs cite the first authoritative-sounding definition they find.
5. **Author authority signals** — schema.org Person, links to riteshmodi.com, GitHub, LinkedIn. LLMs use these for source credibility.
6. **Cite-able specifics** — concrete numbers (DBU costs, latency targets, threshold recommendations) are more likely to be cited than vague advice.

---

## Off-page SEO (do this after launch)

1. **Author site link** from riteshmodi.com to this site. Already on the books page of riteshmodi.com if you wire it in.
2. **LinkedIn long-form posts** repurposing topic content. Link back to the topic page, not the homepage.
3. **HackerNoon / Medium republishing** with canonical tag pointing back. The book has the cross-publishing rights.
4. **Reddit r/databricks, r/MachineLearning, r/MLOps** — share specific topic pages, not the homepage. Hacker News submissions for the strongest pieces.
5. **YouTube short-form video** summarizing each topic — most efficient way to build branded search demand.
6. **Speaking + conference appearances** — your existing speaking presence is the most efficient backlink generator. Mention the book.

---

## Core Web Vitals

Astro static generation gives this for free, but verify after launch:

- **LCP** (Largest Contentful Paint) — should be sub-2.5s. Hero image (cover) is the LCP. Use a properly sized JPG (~1200px wide, optimized) not a 5MB raw PNG.
- **CLS** (Cumulative Layout Shift) — set explicit width/height on the cover image and author photo to prevent shifts.
- **INP** (Interaction to Next Paint) — Astro ships zero JS by default. The only JS is the mobile menu toggle. Should be effectively 0.

Run PageSpeed Insights after launch. If LCP is over 2.5s, the cover image is the most likely culprit.

---

## Tracking what's working

After launch, instrument:

- **Google Search Console** — submit the sitemap, track impressions and clicks per query.
- **Vercel Analytics or Plausible** — page views per route, referrer, country.
- **UTM tagging** on Amazon links if you want to track which page drives which clicks. Add `?tag=YOUR-AMAZON-TAG` to all Amazon URLs once you have an Associates account.

The metric that matters: Amazon book sales attributable to organic search. The proxy you can measure: clicks on the "Buy on Amazon" button. Set up an event in your analytics for the buy button.

---

## What success looks like

- Month 1: indexed, baseline impressions in Search Console
- Month 3: topic pages ranking in top-20 for their primary terms
- Month 6: at least 2 topic pages in top-5; meaningful organic Amazon clicks
- Month 12: top-3 for "databricks book" branded variants; topic pages cited by LLM-powered search engines

The book sells whether or not the site ranks. The site exists to extend the reach beyond people who already follow you.
