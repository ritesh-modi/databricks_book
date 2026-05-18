# Reddit Ads Campaign Plan — Spark 4.0 from Scratch (4 Volumes)

A complete paid-acquisition plan for the four-volume *Spark 4.0 from Scratch* series:

- **Volume 1** — Apache Spark fundamentals (PySpark, distributed compute)
- **Volume 2** — Spark/Lakehouse advanced (Delta Lake, streaming, MLlib)
- **Volume 3** — Databricks for Practitioners: The Production Lakehouse Playbook
- **Volume 4** — Databricks for Practitioners: The AI Lakehouse Playbook

This is paid Reddit advertising via Reddit Ads Manager — distinct from organic posting in §3 Step 5 of `SEO_PLAYBOOK.md`. Both should run in parallel.

---

## §0. The honest framing

**Reddit users have a near-allergic reaction to ad copy that "looks like an ad."** The best-performing creatives on Reddit read like organic posts written by someone who happens to have made the thing. The worst-performing creatives are the polished landing-page-style ads you'd run on Google or LinkedIn.

This single insight drives every recommendation below.

**Realistic outcomes for a $1,000–$2,000 spend over 60 days:**

| Metric | Realistic range |
|---|---|
| Impressions | 200,000–500,000 |
| Clicks | 1,500–5,000 |
| CTR | 0.5%–1.5% (good creative; below 0.4% means kill it) |
| CPC | $0.40–$1.20 (subreddit targeting) — higher in `r/MachineLearning`, lower in `r/learnpython` |
| Landing page → Amazon clicks | 8%–18% |
| Amazon clicks → purchases | 5%–10% |
| **End-to-end paid conversion rate** | **0.04%–0.18%** of impressions become buyers |
| **Direct-response ROAS** | **0.4–1.5× for V1/V2** (lower-priced), **0.8–2.5× for V3/V4** (higher Kindle price) |
| Brand lift / search volume increase | Measurable within 3 weeks if total spend > $500 |

**Don't run Reddit ads as a direct-response channel and expect them to print money on a $9.99 Kindle book.** Run them as a brand-awareness + funnel-top channel where the goals are (1) introducing the series to qualified audiences, (2) building search demand for "Ritesh Modi" / "Spark 4.0 from Scratch" / "Databricks for Practitioners", and (3) lifting your organic ranking signals via secondary traffic. Direct sales are the **second-order effect**, not the primary KPI.

Royalty math for context (US KDP, 2026):

| Volume | Kindle price | Royalty rate | Royalty/sale | Paperback price | Royalty/sale |
|---|---|---|---|---|---|
| V1 | $9.99 (assumed) | 70% | $7.00 | $29.99 (assumed) | ~$5–8 |
| V2 | $9.99 (assumed) | 70% | $7.00 | $29.99 (assumed) | ~$5–8 |
| V3 | $29.00 | 35% | $10.15 | $39.99 | ~$8–12 |
| V4 | $32.00 | 35% | $11.20 | $39.99 | ~$8–12 |

Anything above $9.99 on Kindle pays the **35% royalty tier**, not 70%. This is why V1 and V2 (priced under the threshold) deliver lower absolute royalty per sale despite the same conversion mechanics. **Account for this when allocating ad budget.**

---

## §1. Account setup (one-time, 30 min)

Before launching any campaign, complete these steps in Reddit Ads Manager.

### 1.1 Install the Reddit Pixel on the site

The Pixel enables conversion tracking, audience retargeting, and lookalike audiences. Without it, you're flying blind.

1. Reddit Ads Manager → **Events Manager** → **Create pixel** → name it `genaiblueprints-main`
2. Reddit gives you a `rdt('init', 'a2_...')` snippet. Copy the full snippet.
3. Add it to `src/layouts/Layout.astro` inside `<head>`, near the closing `</head>`, after the JSON-LD block:

```html
<!-- Reddit Pixel -->
<script>
!function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);
rdt('init','a2_YOUR_PIXEL_ID_HERE');
rdt('track', 'PageVisit');
</script>
```

4. Replace `a2_YOUR_PIXEL_ID_HERE` with your actual pixel ID from Reddit.
5. Commit + push + deploy.
6. Reddit → Events Manager → click the pixel → wait ~15 min for the first PageVisit event to register.

### 1.2 Define conversion events

For each volume's "Buy on Amazon" click, fire a custom event. Add this to the Buy CTA component (`src/components/BuyCTA.astro`) — when the Amazon link is clicked:

```html
<a
  href={v.amazonUrl}
  target="_blank"
  rel="noopener"
  onclick={`window.rdt && rdt('track', 'Lead', {customEventName: 'amazon_click_v${v.volume}'})`}
  ...
>
```

This fires a `Lead` event with a custom name per volume. Reddit then optimizes against these events when you choose "Conversions" as the campaign objective.

### 1.3 Build retargeting audiences

In Reddit Audiences → **Create custom audience**:

| Audience | Definition | Use for |
|---|---|---|
| `Site visitors 30d` | All `PageVisit` events, 30-day window | Retargeting funnel |
| `Topic page readers` | `PageVisit` where URL contains `/topics/` | Higher-intent retargeting |
| `Buy page visitors` | `PageVisit` where URL contains `/buy/` | Highest-intent retargeting (cart abandoners) |
| `Amazon clickers V3` | Custom event `amazon_click_v3` | Lookalike seed for V3 cross-sell |
| `Amazon clickers V4` | Custom event `amazon_click_v4` | Lookalike seed for V4 cross-sell |

Most of these start empty — they fill over the first 2 weeks. After ~500 users in each audience, Reddit can build lookalikes from them. **Lookalike audiences typically outperform interest targeting by 30–50% on Reddit** for technical products.

### 1.4 Currency + billing

Reddit billing currency is set at account creation. Your dashboard shows £ (GBP). If you'd rather see $ (USD), you'll need to create a separate ad account — Reddit doesn't let you change currency on an existing account. For a $1K–$2K budget, keep it as-is and translate USD → GBP at runtime (~£1 = $1.27 at writing).

### 1.5 Disable auto-bidding initially

Reddit's auto-bidder is aggressive and overspends in the first few days while it "learns." For a small budget, use **Manual CPC** for the first 2 weeks. Switch to auto-bidding once you have ~500 conversion events recorded.

---

## §2. Campaign architecture

Four campaigns, one per volume. Each campaign has 2–3 ad groups (each targeting a different subreddit cluster), and each ad group runs 3–5 creative variants.

```
Account: Ritesh Modi Ad Account
├── Campaign: V1 — Spark from Scratch                 [Awareness + Traffic]
│   ├── Ad Group: r/learnpython + adjacent
│   │   ├── Ad: Story creative (long-form text)
│   │   ├── Ad: Carousel (4-cover series)
│   │   └── Ad: Single image (cover only)
│   └── Ad Group: r/dataengineering + adjacent
│       └── (3 ads, same creative families)
├── Campaign: V2 — Spark Advanced                     [Awareness + Traffic]
│   ├── Ad Group: r/apachespark + r/bigdata
│   └── Ad Group: r/dataengineering (broader)
├── Campaign: V3 — Databricks Platform                [Conversions]
│   ├── Ad Group: r/databricks + r/dataengineering
│   ├── Ad Group: r/aws + r/AZURE + r/dataops
│   └── Ad Group: Retargeting (site visitors 30d)
└── Campaign: V4 — Databricks AI                      [Conversions]
    ├── Ad Group: r/MachineLearning + r/LocalLLaMA
    ├── Ad Group: r/databricks + r/dataengineering
    ├── Ad Group: r/LangChain + r/LLMDevs + r/AI_Agents
    └── Ad Group: Retargeting (site visitors 30d)
```

**Why this structure works:**

- **One campaign per volume** lets you set different budgets and objectives per book. V3/V4 (higher royalty) get more budget and "Conversions" objective. V1/V2 get less budget and "Traffic" objective (cheaper, broader funnel).
- **Multiple ad groups per campaign** segment audiences for diagnostic visibility. When V4's `r/MachineLearning` ad group outperforms its `r/databricks` ad group by 3×, you know where to scale.
- **3–5 creatives per ad group** lets Reddit's optimization compare and concentrate spend on winners.

---

## §3. Subreddit targeting per volume

This is where Reddit ads succeed or fail. Generic interest categories ("technology," "programming") burn budget. Specific subreddit lists convert.

### 3.1 Volume 1 — Apache Spark Fundamentals

**Primary subreddits** (audience: people learning PySpark / distributed computing):

- `r/learnpython` (1.4M members) — beginners ready for the next step
- `r/Python` (1.5M members) — intermediate Pythonistas hitting scale
- `r/learnprogramming` (4.5M members) — broad but contains the right segment
- `r/dataengineering` (280K members) — high-intent overlap
- `r/datascience` (1.6M members) — career-changers exploring data engineering
- `r/coding` (250K members)
- `r/bigdata` (175K members) — explicitly correct topic
- `r/apachespark` (35K members) — small but pure intent

**Avoid:**
- `r/programming` — too broad, low engagement on books
- `r/ProgrammerHumor` — non-buyer audience
- `r/cscareerquestions` — interview-focused, not learning

**Suggested budget split:** £15/day total → £6 to r/learnpython, £3 to r/dataengineering, £3 to r/Python, £3 to r/datascience.

### 3.2 Volume 2 — Spark / Lakehouse Advanced

**Primary subreddits:**

- `r/dataengineering` (highest converter for this topic)
- `r/apachespark`
- `r/bigdata`
- `r/dataops` (95K members) — operational angle
- `r/learnmachinelearning` (700K members) — for the MLlib/streaming content
- `r/streaming` and `r/dataengineeringjobs` — secondary
- `r/aws` (~720K members) — but only the data-platform segment

**Avoid:**
- `r/aws` general (too broad, dominated by infrastructure folks)
- `r/devops` (different reader profile)

**Suggested budget split:** £15/day total → £7 r/dataengineering, £4 r/learnmachinelearning, £4 r/dataops.

### 3.3 Volume 3 — Databricks Platform & Data Engineering

**Primary subreddits:**

- `r/databricks` (smaller but pure-intent — every member is a Databricks user)
- `r/dataengineering` (still the workhorse)
- `r/dataops`
- `r/aws` (Databricks runs on AWS; many users find here)
- `r/AZURE` (~165K members, similar reason)
- `r/googlecloud` (~80K members)
- `r/snowflake` (~22K members) — competitive switchers
- `r/businessintelligence` (~50K members) — analytics adjacents
- `r/datawarehouse`
- `r/cloudcomputing`

**Avoid:**
- `r/MachineLearning` — wrong volume for that audience (use for V4)
- `r/programming`

**Suggested budget split:** £25/day total → £8 r/databricks, £6 r/dataengineering, £4 r/AZURE, £4 r/aws, £3 r/dataops.

### 3.4 Volume 4 — Databricks AI Lakehouse

**Primary subreddits:**

- `r/databricks`
- `r/MachineLearning` (3M+ members) — careful with creative; this audience is research-oriented and bullshit-detectors
- `r/LocalLLaMA` (450K members) — practical LLM crowd, very receptive
- `r/LangChain` (60K members) — direct topical overlap
- `r/LLMDevs` (~40K members) — emerging, growing fast
- `r/AI_Agents` (~50K members) — directly aligned with Agent Bricks content
- `r/MLOps` (~30K members) — explicit MLOps overlap
- `r/learnmachinelearning`
- `r/dataengineering` (still relevant — many readers come from V3)
- `r/MosaicAI` (~few thousand, but pure intent)
- `r/vector_databases` (~12K members)

**Avoid:**
- `r/singularity`, `r/artificial`, `r/Futurology` — wrong demographic; lots of impressions, zero buyers
- `r/ChatGPT` and `r/OpenAI` — consumer audience, not developers

**Suggested budget split:** £25/day total → £6 r/databricks, £5 r/MachineLearning, £4 r/LocalLLaMA, £3 r/LangChain, £3 r/MLOps, £4 r/dataengineering.

---

## §4. Creative formats — what to actually run

Three formats, in order of likely performance for technical books:

### 4.1 "Promoted Post" — long-form text (HIGHEST PERFORMER)

The single most important Reddit ad format for technical content. It looks like an organic post from a real user. Headline is the title; body is 2–4 paragraphs of substance.

**Template 1 — the "What I learned" post (V4):**

> **Title:** I just finished writing a 800-page book on production Databricks AI — here's what surprised me
>
> **Body:**
> After two years working with Mosaic AI, Agent Bricks, and MLflow at production scale, I started writing a practitioner-level guide. Two things surprised me along the way:
>
> The first is that 80% of the documentation tells you what a feature does, and almost none of it tells you what its failure modes are. Agent Bricks is a great example — the marketing makes it sound declarative and effortless, but if you don't set the right eval gates, you'll ship a regression at 3am and never see it coming.
>
> The second is how much of "AI engineering" is actually old-school MLOps wearing a new hat. Alias-driven promotion, traffic splitting, drift monitoring — the principles haven't changed. What's changed is the surface area.
>
> The book is part of a four-volume series on the Databricks stack. V4 specifically covers RAG, Agent Bricks, the Multi-Agent Supervisor, Vector Search, MLflow 3, and Lakebase. Happy to answer questions about any of the chapters.
>
> Free topic guides at genaiblueprints.com if you want to skim the depth before committing. Amazon link in the comments.

**Why this works:** It's a story, not a sell. It positions the author as a peer who learned things, not as a vendor. The "Amazon link in the comments" pattern is a Reddit native convention (this is how product launches happen in r/dataisbeautiful, r/learnprogramming, etc.).

**Template 2 — the "Comparison" post (V3):**

> **Title:** Wrote a 800-page guide to shipping production on Databricks. Here's how it differs from the official docs.
>
> **Body:**
> Databricks docs are good. They tell you what every feature does. What they rarely tell you is *when* a feature is the wrong choice, *what* it costs, and *how* it interacts with the rest of your stack.
>
> A few examples from the book:
>
> - Unity Catalog ABAC is the right answer for any team past ~100 tables — but it's actively a worse choice for small teams who haven't standardized tagging yet.
> - Lakeflow SDP (the rename of DLT) is the default for new pipelines — but if your team is already deep in dbt, the dbt + SDP coexistence pattern beats either alone.
> - Asset Bundles replace clicked-jobs and brittle Terraform — but they're not a Terraform replacement for the workspace-level infrastructure underneath.
>
> Volume 3 covers all of this end-to-end (~800 pages, 16 chapters). Free practitioner-level topic guides at genaiblueprints.com — skim those before deciding the book is worth your time.

**Why this works:** It's a "what's NOT in the official docs" hook. Reddit users LOVE contrarian-but-grounded perspectives.

**Template 3 — the "AMA-style" hook (V1/V2 broad):**

> **Title:** Wrote four books on Spark and Databricks (1,400+ pages total) — ask me anything before I move on to the next series
>
> **Body:**
> Spent the last 18 months writing the Spark 4.0 from Scratch series — four volumes covering Spark fundamentals, advanced Spark/Lakehouse, the Databricks platform, and finally Databricks AI (Mosaic AI, Agent Bricks, MLflow 3).
>
> Happy to answer questions about:
> - Whether Spark is still worth learning in 2026 (yes, but different reasons than 2020)
> - How the rename of DLT → Lakeflow SDP changed real-world adoption
> - Why Agent Bricks is the first agent platform I'd trust in production
> - How to learn the Databricks stack without burning $5K of compute
>
> Series link in comments. Engage on the topics that interest you.

**Why this works:** AMA framing is Reddit-native. Triggers comments (which boost the ad's organic-engagement score and lower CPC). Even non-buyers comment, which is good — it drives the ad up the feed.

### 4.2 "Conversation Ad" — paragraph + image

Second-best format. A short paragraph (50–120 words) plus a hero image (one of the book covers). Lower engagement than promoted posts but easier to produce at scale.

**Template — V3:**

> Most teams adopting Databricks hit the same wall around month 6: lineage is a Slack thread, three teams disagree about whether a column is PII, and nobody knows who can read what. Unity Catalog solves this — but only if you treat it as the platform contract, not a checkbox.
>
> Volume 3 of the *Spark 4.0 from Scratch* series is the practitioner guide to UC, Lakeflow, and the production patterns that hold up at scale. 800 pages, no marketing fluff.
>
> [Cover image of V3]
> [CTA: "Learn More" → /topics/unity-catalog/]

### 4.3 Single image / video — avoid unless you have great assets

Single-image ads in Reddit's feed look like ads, and Reddit users skip them. Video performs better than single image but takes effort to produce. **Skip both for the initial campaign.** Only add video if the campaign is performing and you want to scale.

---

## §5. Ad copy templates — one per volume

Five ready-to-use creatives below. Use these as starting points, then iterate based on what's working in week 1.

### 5.1 Volume 1 — Spark from Scratch

**Title:** Wrote a 700-page intro to Apache Spark from first principles — for people who learned Pandas first

**Body:**
Most Spark intros assume you already think distributed. Volume 1 of the *Spark 4.0 from Scratch* series doesn't — it assumes you've written Pandas, you've hit the memory wall once, and you want to understand the *why* of distributed computing before the *how*.

Covers PySpark from `SparkSession` → DataFrames → joins → UDFs → tuning → debugging the Spark UI. Every code listing runs as-is. Reader-tested by ~50 engineers learning Spark in 2025.

V1 is $9.99 on Kindle. Other volumes (V2: advanced Spark, V3: Databricks Platform, V4: Databricks AI) at genaiblueprints.com.

**Target:** r/learnpython, r/Python, r/dataengineering, r/datascience
**Objective:** Traffic
**Daily budget:** £15
**Bid:** Manual CPC £0.40

### 5.2 Volume 2 — Spark Advanced

**Title:** The Spark book I wish I'd had when streaming and Delta finally clicked

**Body:**
Volume 2 of the *Spark 4.0 from Scratch* series picks up where V1 ended. Structured Streaming, Delta Lake, MLlib, query optimization, catalyst internals, the patterns that survive production load.

Written for engineers who know PySpark and want the next layer — the operational layer that the docs gloss over. ~600 pages.

If you're already at Databricks scale, V3 (platform) and V4 (AI) might be the right entry point. Series at genaiblueprints.com.

**Target:** r/dataengineering, r/apachespark, r/learnmachinelearning, r/dataops
**Objective:** Traffic
**Daily budget:** £15
**Bid:** Manual CPC £0.50

### 5.3 Volume 3 — Databricks Platform

**Title:** I wrote 800 pages on shipping production data systems on Databricks. AMA before I move to Volume 4 of the series.

**Body:**
Volume 3 of *Spark 4.0 from Scratch* — covers Unity Catalog (the three-level namespace, ABAC, governed tags, lineage), Lakeflow SDP and Jobs, Asset Bundles + OIDC CI/CD, performance tuning, the migration story off legacy Hive Metastore.

Two-year writing project. Reader-tested by data engineering leads from a few enterprise teams that had hit the operational wall.

Free practitioner-level topic guides at genaiblueprints.com — skim those before deciding the book is worth your time. V4 (Databricks AI Lakehouse) just launched too.

Happy to answer questions about: UC migration, when SDP beats dbt, the alias-promotion model, anything that's in the book.

**Target:** r/databricks, r/dataengineering, r/AZURE, r/aws (data-platform), r/dataops, r/snowflake (competitive switchers)
**Objective:** Conversions (optimized for `amazon_click_v3`)
**Daily budget:** £25
**Bid:** Auto (after week 2 with conversion data)

### 5.4 Volume 4 — Databricks AI

**Title:** Just shipped a 800-page practitioner guide to production Databricks AI (Mosaic AI, Agent Bricks, MLflow 3). Here's the unfair advantage Databricks AI engineering has over the rest of the LLM stack.

**Body:**
Spent two years on Volume 4 of the *Spark 4.0 from Scratch* series. The thesis: Databricks is the only LLM platform where the data layer, the agent runtime, the governance, and the evaluation harness are owned by the same vendor. That sounds like marketing, but the operational difference is real — your RAG pipeline reads from the same governed Delta tables that your dashboards run against; your agent traces flow through the same MLflow that your training runs do.

The book covers Mosaic AI Vector Search, Agent Bricks (classification + info extraction), the Multi-Agent Supervisor with MCP, MLflow 3 traces and evaluation, Feature Store on UC, Lakehouse Monitoring, Lakebase. Plus a capstone that stitches it all together on a retail dataset.

V4 is the AI build-out on top of V3 (the platform foundation). Buy either standalone, or both for the full picture.

Free topic guides at genaiblueprints.com (RAG, Agent Bricks, Multi-Agent Systems, MLflow, Vector Search, Feature Store, MLOps).

**Target:** r/databricks, r/MachineLearning, r/LocalLLaMA, r/LangChain, r/LLMDevs, r/AI_Agents, r/MLOps, r/learnmachinelearning
**Objective:** Conversions (optimized for `amazon_click_v4`)
**Daily budget:** £25
**Bid:** Auto (after week 2)

### 5.5 Cross-sell — Series bundle

After 30 days, run this as a retargeting-only ad to people who've visited the site at least once but not clicked Amazon:

**Title:** Read a topic page on Databricks? Here's why the four-volume series matters.

**Body:**
You probably hit this site for one topic. But the series is built so each volume sets up the next:

- V1 (Spark from Scratch) → V2 (Spark Advanced) → V3 (Databricks Platform) → V4 (Databricks AI)

Skip V1 if you already know PySpark. Skip V2 if you already know Delta and streaming. Don't skip V3 if you're touching V4 — Volume 4 explicitly assumes platform fluency from V3.

Pricing: V1+V2 at $9.99 each on Kindle, V3 at $29, V4 at $32. All formats (Kindle, Paperback, Hardcover).

**Target:** Custom audience `Site visitors 30d` MINUS audience `Amazon clickers V3+V4`
**Objective:** Conversions
**Daily budget:** £10
**Bid:** Manual CPC £0.80

---

## §6. Budget allocation — the recommended split

**Total monthly budget: £600 (~$760)** — adjust up if early results are good, down if they're not.

| Campaign | Daily | Monthly | Why |
|---|---|---|---|
| V1 — Spark from Scratch | £5 | £150 | Low royalty, broad audience — cheap top-of-funnel |
| V2 — Spark Advanced | £5 | £150 | Same logic; warms readers for V3/V4 |
| V3 — Databricks Platform | £8 | £240 | Higher royalty ($10/sale); buyer-rich subreddits |
| V4 — Databricks AI | £8 | £240 | Highest royalty ($11/sale); largest TAM |
| Retargeting (after week 4) | £4 | £120 | Highest ROAS — start small, scale up |
| **Total** | **£20–30** | **£600–900** | |

**The 70/30 rule:** spend 70% of budget on the two newest/highest-value volumes (V3+V4), 30% on the back catalog (V1+V2). The series brand lift from V3/V4 ads also pulls organic V1/V2 sales — measurable but slow.

**Week-by-week budget escalation:**

| Week | Total daily | Action |
|---|---|---|
| 1 | £20 | All manual CPC. Gather baseline data. No optimization changes. |
| 2 | £20 | Kill bottom 30% of creatives. Reallocate to top performers. |
| 3 | £25 | Switch to auto-bidding on campaigns with >100 conversion events. Add retargeting ad group. |
| 4 | £30 | Scale winners to 2× budget. Refresh worst creatives. |
| 5–8 | £30–40 | Steady-state optimization. Add new creative every 2 weeks (audiences fatigue). |

---

## §7. Pre-launch checklist

Before you turn any campaign on, walk through this list:

| ✓ | Item |
|---|---|
| [ ] | Reddit Pixel installed and firing `PageVisit` (confirm in Events Manager) |
| [ ] | `Lead` events fire on every Amazon-click (test on `/buy/`) |
| [ ] | Custom audiences created (site visitors 30d, buy page visitors, etc.) |
| [ ] | UTM parameters added to every ad's destination URL: `?utm_source=reddit&utm_medium=cpc&utm_campaign=v4-launch&utm_content=ml_subreddit` |
| [ ] | `/buy/` page renders correctly on mobile (Reddit traffic is ~80% mobile) |
| [ ] | All 4 Amazon links open in a new tab and don't error |
| [ ] | Cover images load quickly on mobile (test from a real phone) |
| [ ] | One-line tracker spreadsheet ready: date, ad, impressions, clicks, CTR, CPC, conversions, ROAS |
| [ ] | Daily spend cap set at the campaign level (so a typo doesn't burn £100 in a day) |
| [ ] | Reddit account billing limit set conservatively for the first month |
| [ ] | Schedule: when ads run. Recommend **NOT 24/7 initially** — start with US/EU business-hour blocks (~12:00–22:00 UTC) where engagement is highest |

---

## §8. The first 30 days — optimization cadence

### Week 1 — Don't touch anything

Reddit's algorithm needs ~50 events per ad group before it can optimize. **Resist the urge to pause underperformers in week 1.** The data is too sparse. Anything you change makes the algorithm restart its learning.

**Daily check (5 min):**
- Total spend so far vs. monthly budget
- Total impressions, clicks, CTR
- Any creative with zero impressions? (Usually a rejection — Reddit's policy bots flag certain phrases. Edit and resubmit.)

### Week 2 — Pruning

By day 14, each ad should have 30–60 impressions minimum. Now you can act on data.

**Actions:**
- **Pause any creative with CTR < 0.3%.** This is the floor. Below this, the ad costs more than it returns.
- **Pause any ad group with CPC > 1.5× the campaign average.** Likely a wrong-subreddit signal — reallocate that budget to better-performing groups.
- **DO NOT increase budgets yet.** Wait one more week for confidence intervals to tighten.

### Week 3 — Scaling winners

Now you have 21 days of data and ~150–300 conversion events. Reddit's optimization is dialed in.

**Actions:**
- **Increase budget on ad groups with CPA below your breakeven** (target: £8 per Amazon click for V3, £6 for V4). Increase by 25% per day, no more — bigger jumps reset the learning phase.
- **Switch to auto-bidding** on Conversions-optimized campaigns. Manual CPC was for the learning phase; auto-bidding wins long-term.
- **Add retargeting ad group**: target the `Site visitors 30d` custom audience with the §5.5 cross-sell creative. Retargeting ROAS is typically 3–5× cold traffic.

### Week 4 — Creative refresh

Reddit users see the same ad 5–15 times before action; after that, **CTR drops by ~30%**. Refresh the top 2 creatives by week 4 (new title, new hero paragraph). Keep the targeting and budget the same.

### Ongoing — Monthly cadence

- **Every 2 weeks**: refresh one creative per active ad group. Keep the high performer; replace the low.
- **Monthly**: review per-subreddit performance. Reallocate budget. Add 1 new subreddit to test (some are seasonal — `r/dataengineering` spikes during Databricks World, for example).
- **Quarterly**: refresh hero images. Run an A/B test with a new cover variant or a quote/testimonial as the hero.

---

## §9. Subreddit-specific quirks worth knowing

### r/databricks (small, pure-intent)
~5K members but very high conversion rate. Moderators are tolerant of book ads if they reference real platform features. Don't try to sneak in unrelated content.

### r/dataengineering (the workhorse)
280K members. The single best converter across all four volumes. But CPC is rising (~£0.80) because every data tool advertises here. Worth the spend.

### r/MachineLearning (high impressions, low conversion)
3M+ members. Easy to spend a lot here. Low buyer conversion rate because the audience skews academic. **Use only for V4 awareness, not direct response.** Set the ad group to a max £5/day cap.

### r/LocalLLaMA (sleeper hit)
450K members. Practical LLM crowd, very receptive to applied content. **CPC is much lower than r/MachineLearning** for similar audience quality. Underrated.

### r/learnpython (V1's bread and butter)
1.4M members. CPC ~£0.30 — the cheapest meaningful traffic across the four volumes. Skews beginner; high impression-to-click ratio but low click-to-purchase. Best for awareness.

### r/AI_Agents (newest, fastest-growing)
~50K members. Direct alignment with Agent Bricks content in V4. CPC is still low because few advertisers know about it. **Lean in here for V4** before it becomes saturated.

### Subreddits NOT to advertise in
- `r/programming` — too broad, low conversion
- `r/cscareerquestions` — interview prep, not book buyers
- `r/ChatGPT`, `r/OpenAI` — consumer audience
- `r/Futurology`, `r/singularity`, `r/artificial` — wrong demographic
- `r/india`, `r/indianstartups` — only if you're explicitly targeting INR pricing, otherwise CPC is misleading
- Any meme subreddit — even ones tangentially related (`r/ProgrammerHumor`, `r/dataisbeautiful`)

---

## §10. Reddit moderator risk — the failure mode nobody warns about

**Reddit moderators can ban your ads from their subreddit at will, even if the ad is paid.** Reddit Ads is sold as a self-serve product, but individual moderators have the power to flag any ad as spam and remove it from their subreddit's feed. They sometimes do this with no warning.

**Mitigations:**

1. **Lead with substance, not selling.** Ads that read like organic posts get flagged less. The §4.1 promoted-post templates above are far less likely to be removed than a polished display ad.
2. **Don't link directly to Amazon in the ad body.** Link to the site (`/buy/`, or a topic page), then put the Amazon link in a pinned comment. This is the Reddit-native pattern.
3. **Engage in the comments.** When users comment on the ad, reply substantively. Mods see engagement; high-engagement ads get protected.
4. **If banned from a subreddit, accept it.** Don't try to relaunch with a tweaked creative — mods notice. Move budget to a different subreddit.
5. **Avoid weighted language.** Words like "free," "limited time," "best," "guaranteed" trigger spam filters. The promoted-post templates above avoid all of these intentionally.

**Subreddits most likely to ban book ads (proceed carefully):**
- `r/MachineLearning` — strict on commercial content
- `r/programming` — strict
- `r/datascience` — moderately strict

**Subreddits that tolerate book ads well:**
- `r/learnpython` — explicitly allows resource recommendations
- `r/dataengineering` — high tolerance
- `r/databricks` — very high tolerance
- `r/LocalLLaMA` — high tolerance

---

## §11. Tracking & reporting

Maintain a Google Sheet or Notion table updated weekly:

| Week | Campaign | Impressions | Clicks | CTR | CPC | Site visits | Amazon clicks | Est. purchases | Spend | Royalty earned | ROAS |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | V3 | 12,000 | 95 | 0.79% | £0.72 | 80 | 9 | 1 (est.) | £68 | $10.15 | 0.12× |
| ... | | | | | | | | | | | |

**ROAS** = (Royalty earned in USD × 1.27) / (Spend in GBP). Below 1.0 = losing money on direct response (but may still be net-positive once you account for brand lift and organic uplift).

**KPIs to watch:**
- Per-volume CTR (target: > 0.8%)
- Per-ad-group CPC (target: < £1.20)
- Per-volume CPA (Amazon click cost; target: < £8 for V3, < £6 for V4)
- Retargeting ROAS (target: > 2.0× — usually beats this if creative is good)
- Search Console branded-search volume (target: lift after 3 weeks of campaigns running)

---

## §12. The 90-day plan

| Phase | Days | Goal |
|---|---|---|
| **Validate** | 1–14 | Pixel + audiences + creative library live. £20/day spend. Identify which subreddits work. |
| **Optimize** | 15–30 | Kill losers, scale winners, add retargeting. £25–30/day spend. Hit 0.8% CTR on top creatives. |
| **Scale** | 31–60 | Increase budget on winning ad groups by 50%. Refresh creative every 2 weeks. £30–50/day spend. |
| **Compound** | 61–90 | Custom audiences are now mature → run lookalike-audience campaigns. Add a new creative format (video). £40–60/day spend. |

By day 90, you should have:

- Total spend: ~£2,500–4,500 (~$3K–6K)
- Total clicks: ~5,000–10,000
- Estimated direct purchases: ~250–600 across all four volumes
- Royalty earned: ~$2,500–6,000 (depending on Kindle/paperback mix)
- Brand search volume on `genaiblueprints.com` properties: lifted 2–5×
- Retargeting + lookalike audiences: ready to scale into a sustaining $1K–2K/month spend

**Direct-response break-even is realistic but tight.** The strategic value is the audience you build — once `Amazon clickers V3` and `V4` audiences have ~2,000 users each, Reddit's lookalike modeling becomes accurate enough that the channel becomes self-sustaining.

---

## §13. Killing the campaigns — what to do if it's not working

**Hard kill criteria** (after week 4):

- Total ROAS across all campaigns is below 0.4× and not improving — pause everything, revisit creative.
- A specific campaign has spent > £100 with zero conversion events — pause that campaign.
- Cost per Amazon click is consistently > £15 — pause and rework.

**Soft kill criteria** (after week 4):

- One creative is consistently 50% below the campaign-average CTR — replace it, don't try to fix it.
- A subreddit has high impressions and low CTR — exclude it, reallocate.

**If everything is below break-even by day 60:** the issue is likely creative, not channel. Reddit ads work for technical books — but only with native-feel content. Generic ad copy will reliably underperform. Re-read §0 and §4.1.

---

## §14. Reference

- Reddit Ads Manager: https://ads.reddit.com
- Reddit Pixel docs: https://business.reddithelp.com/s/article/conversion-tracking
- Reddit ad policies: https://www.redditinc.com/policies/ad-policy
- Custom audience guide: https://business.reddithelp.com/s/article/custom-audiences
- This file is the source of truth for the campaign plan — update it as you iterate.
