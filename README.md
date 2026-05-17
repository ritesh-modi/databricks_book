# databricks-book-site

Marketing + SEO landing site for **Databricks for Practitioners** by Ritesh Modi.

Astro + Tailwind CSS v4. Statically generated. Aggressive 2026 SEO baked in.

---

## Quick start

```bash
cd /Users/riteshmodi/databricks-book-site
npm install     # one-time
npm run dev     # local preview at http://localhost:4321
npm run build   # production build to ./dist/
```

---

## What lives where

```
databricks-book-site/
├── src/
│   ├── components/      Hero, Nav, Footer, FAQ, BuyCTA, etc.
│   ├── content/
│   │   └── blog/        ← add new blog posts here as .md files
│   ├── data/
│   │   ├── book.ts      ← single source of truth for book metadata
│   │   └── faqs.ts      ← homepage + global FAQ data
│   ├── layouts/
│   │   └── Layout.astro Shared layout with JSON-LD structured data
│   ├── pages/
│   │   ├── index.astro          Homepage
│   │   ├── preview.astro        TOC + sample chapter
│   │   ├── about.astro          Author bio
│   │   ├── faq.astro            Extended FAQ
│   │   ├── reviews.astro        Endorsements (placeholders for now)
│   │   ├── topics/              SEO pillar pages
│   │   │   ├── index.astro            Topic listing
│   │   │   ├── rag-with-databricks.astro
│   │   │   ├── agentbricks.astro
│   │   │   ├── multi-agent-systems.astro
│   │   │   ├── mlflow.astro
│   │   │   ├── vector-search.astro
│   │   │   ├── feature-stores.astro
│   │   │   ├── lakehouse.astro
│   │   │   └── mlops-on-databricks.astro
│   │   ├── blog/
│   │   │   ├── index.astro
│   │   │   └── [...slug].astro  Blog post template
│   │   ├── rss.xml.ts           RSS feed
│   │   └── 404.astro
│   └── styles/
│       └── global.css
├── public/
│   ├── images/          ← drop cover.jpg and author.jpg here
│   ├── favicon.svg
│   ├── og-default.svg
│   └── robots.txt       (AI crawlers explicitly allowed for GEO)
├── astro.config.mjs
├── package.json
├── vercel.json          Vercel deploy config
└── netlify.toml         Netlify deploy config
```

---

## What you need to do before launch

There are exactly 4 placeholders to fill in:

1. **Cover image.** Drop your final cover JPG/PNG into `public/images/cover.jpg`. It will appear in the hero and in OG previews automatically.

2. **Amazon URL.** Edit `src/data/book.ts` — change `amazonUrl` from `'PLACEHOLDER-AMAZON-URL'` to the real Amazon link. Every "Buy on Amazon" button reads from this single source.

3. **Author photo.** Drop your headshot into `public/images/author.jpg`. Used in the homepage author card.

4. **ISBN, page count, exact price.** Update the matching fields in `src/data/book.ts` when finalized. These flow into the Schema.org Book structured data — Google reads it.

That's it. Everything else is content you may want to refine but doesn't block launch.

---

## How to add a blog post

1. Create a new file in `src/content/blog/` — e.g., `mosaic-ai-cost-tuning.md`.
2. Frontmatter:

   ```markdown
   ---
   title: "Title of the post"
   description: "One or two sentences. Shows in search results and meta."
   pubDate: 2026-06-01
   tags: ["RAG", "Vector Search"]
   ---

   Your markdown body. Use ## for section headings.
   ```

3. Commit. Vercel/Netlify auto-deploys.

GitHub web UI works too — no terminal needed.

---

## How to deploy

### Vercel (recommended)

1. Push this folder to a new GitHub repo.
2. Sign up at vercel.com, click **Add New Project**, pick the repo, deploy.
3. Vercel detects Astro automatically. You get a `*.vercel.app` URL within a minute.
4. **Important:** change `site` in `astro.config.mjs` to the production URL (`https://databricksforpractitioners.com` or whatever you choose) before final deploy — the sitemap and canonical URLs depend on it.

### Netlify

Same flow at netlify.com. The included `netlify.toml` covers build settings.

### Custom domain

1. Buy a domain (e.g., `databricksforpractitioners.com` or `databricksbook.com`).
2. In Vercel: Settings → Domains → Add. Vercel gives you DNS records.
3. Add the records at your registrar. Propagation takes minutes to hours.

---

## SEO infrastructure (already wired up)

- Schema.org **Book** + **Person** structured data on every page
- Schema.org **FAQPage** on home + FAQ + every topic
- Schema.org **BreadcrumbList** on topic pages
- Schema.org **TechArticle** on topic pages, **BlogPosting** on blog posts
- Open Graph + Twitter Card meta tags
- Canonical URLs on every page
- XML sitemap auto-generated (`/sitemap-index.xml`)
- RSS feed at `/rss.xml`
- `robots.txt` explicitly allows AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) — important for **GEO** (Generative Engine Optimization) in 2026
- Mobile-first responsive design
- Static generation = fast Core Web Vitals out of the box

See `SEO_STRATEGY.md` for the keyword and content plan.

---

## How to update going forward

- **New blog post**: markdown file → commit → live.
- **Topic page update**: edit the relevant `src/pages/topics/*.astro` file → commit → live.
- **Add a review**: open `src/pages/reviews.astro` → replace placeholders.
- **Book metadata change**: edit `src/data/book.ts` once. It propagates everywhere.

---

## Questions

If anything breaks or you want me to extend something (more topic pages, analytics, newsletter, A/B testing on the CTA, etc.), say the word.
