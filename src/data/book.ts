/**
 * Single source of truth for the series metadata.
 *
 * The site markets a two-volume series — both titled "Databricks for Practitioners".
 * Shared series-level data (title, author, series name) lives in `series`.
 * Per-volume data (subtitles, covers, chapter counts, descriptions) lives in `volumes`.
 *
 * Update PLACEHOLDER values when Amazon listing / ISBN / page count finalize.
 */

export const series = {
  title: 'Databricks for Practitioners',
  seriesName: 'Spark 4.0 from Scratch',
  tagline:
    'Two volumes. The platform. The AI. Everything an engineer actually needs to ship and operate production data + AI systems on Databricks.',
  author: {
    name: 'Ritesh Modi',
    title: 'Head of AI at MarketOnce · ex-Microsoft Principal Forward Deployed Engineer · 18× Author',
    url: 'https://www.riteshmodi.com',
    image: '/images/ritesh.jpeg',
    email: 'riteshmodi1310@gmail.com',
  },
  /**
   * Search engine verification tokens. Empty string means "not yet verified" —
   * the meta tag is skipped at build time. Paste the value from each console
   * (the bare token, not the full <meta> tag) when ready.
   */
  verification: {
    google: 'googlef0ab1e9b943275f3.html', // Google Search Console → Settings → Ownership → HTML tag → content="..."
    bing: '', // Bing Webmaster Tools → Add Site → Add a meta tag → content="..."
    yandex: '', // optional
  },
  /**
   * IndexNow key for Bing/Yandex/Seznam push indexing.
   * The key below is the canonical key for this site. The build script
   * (scripts/write-indexnow.mjs) writes it to /public/<KEY>.txt so search
   * engines can verify ownership before accepting URL submissions.
   * See: https://www.indexnow.org/
   */
  indexnow: {
    key: 'd1b87503ad504e155bc272e3f5ed8f07',
  },
};

export type Volume = {
  key: 'v3' | 'v4';
  volume: number;
  title: string;
  subtitle: string;
  fullTitle: string;
  seriesSubtitle: string;
  tagline: string;
  shortName: string;
  chapters: number;
  chapterRange: string;
  pages: number;
  format: string[];
  language: string;
  publishedYear: number;
  publisher: string;
  isbn: string;
  amazonUrl: string;
  amazonAsin: string;
  coverImage: string;
  price: { kindle: number; paperback: number; currency: string };
  description: string;
  keyTopics: string[];
  audience: string[];
};

export const volumes: Record<'v3' | 'v4', Volume> = {
  v3: {
    key: 'v3',
    volume: 3,
    title: series.title,
    subtitle: 'The Production Lakehouse Playbook',
    fullTitle: `${series.title}: The Production Lakehouse Playbook`,
    seriesSubtitle: 'Databricks Platform & Data Engineering',
    tagline:
      'Unity Catalog, Lakeflow, and the Databricks Data Intelligence Platform — the production playbook for engineers who already know Spark.',
    shortName: 'Volume 3 · The Production Lakehouse',
    chapters: 16,
    chapterRange: 'Ch 22–37',
    pages: 800,
    format: ['Kindle eBook', 'Paperback', 'Hardcover'],
    language: 'English',
    publishedYear: 2026,
    publisher: 'Independent',
    isbn: 'PLACEHOLDER-ISBN-V3',
    amazonUrl: 'https://www.amazon.com/dp/B0GXNYQNLT',
    amazonAsin: 'B0GXNYQNLT',
    coverImage: '/images/Databricks_Cover_1600x2560 (2).jpg',
    price: { kindle: 29, paperback: 39.99, currency: 'USD' },
    description:
      'Volume 3 of the Spark 4.0 from Scratch series. The production playbook for engineers governing, ingesting, transforming, orchestrating, and shipping on the Databricks Data Intelligence Platform. Covers Unity Catalog end-to-end (catalogs, schemas, volumes, ABAC, governed tags, lineage, audit), identity and secret scopes, managed tables with Delta + Iceberg/UniForm, liquid clustering and predictive optimization, Auto Loader and Lakeflow Connect ingestion, Lakeflow Spark Declarative Pipelines, Lakeflow Jobs, Declarative Automation Bundles, GitHub Actions CI/CD with OIDC, performance tuning, and the bridge into the AI work that Volume 4 picks up.',
    keyTopics: [
      'Unity Catalog architecture and the three-level namespace',
      'Access control, ABAC, governed tags, lineage, audit',
      'Service principals, OAuth, and secret scopes',
      'Managed tables, Delta Lake, Iceberg, UniForm, UC Metrics',
      'Liquid Clustering and Predictive Optimization',
      'Auto Loader, Lakeflow Connect, and streaming tables',
      'Lakeflow Spark Declarative Pipelines (formerly Delta Live Tables)',
      'Lakeflow Jobs and event-driven orchestration',
      'Declarative Automation Bundles, CLI, SDK, Terraform',
      'GitHub Actions CI/CD with OIDC',
      'Performance tuning and Photon',
      'System tables, observability, and HMS → UC migration',
    ],
    audience: [
      'Data engineers shipping production pipelines on Databricks',
      'Platform engineers building the governance layer',
      'Solutions architects designing Unity Catalog and Lakeflow estates',
      'Senior engineers migrating from legacy Hive Metastore or external orchestration',
      'Engineering managers evaluating Databricks for an enterprise rollout',
    ],
  },
  v4: {
    key: 'v4',
    volume: 4,
    title: series.title,
    subtitle: 'The AI Lakehouse Playbook',
    fullTitle: `${series.title}: The AI Lakehouse Playbook`,
    seriesSubtitle: 'Databricks Platform & AI Engineering',
    tagline:
      'Mosaic AI, Agent Bricks, Lakebase, and the production Lakehouse — the 2026 field manual for shipping AI systems on Databricks.',
    shortName: 'Volume 4 · The AI Lakehouse',
    chapters: 21,
    chapterRange: 'Ch 38–58',
    pages: 800,
    format: ['Kindle eBook', 'Paperback', 'Hardcover'],
    language: 'English',
    publishedYear: 2026,
    publisher: 'Independent',
    isbn: 'PLACEHOLDER-ISBN-V4',
    amazonUrl: 'https://www.amazon.com/dp/B0H2418X82',
    amazonAsin: 'B0H2418X82',
    coverImage: '/images/Databricks_Cover_v4_1600x2560.jpg',
    price: { kindle: 32, paperback: 39.99, currency: 'USD' },
    description:
      'Volume 4 of the Spark 4.0 from Scratch series. The practitioner field manual for production AI on Databricks in 2026. Databricks SQL in production, AI/BI Dashboards, AI/BI Genie, the AI SQL function family (ai_query, vector_search, ai_parse_document, ai_classify, ai_extract, ai_gen, ai_forecast), Model Serving and the AI Gateway, Foundation Model APIs and external models, Mosaic AI Vector Search and RAG patterns, MLflow 3 (experiments, UC Model Registry, traces, evaluation), Feature Store on Unity Catalog, full MLOps (promotion, aliases, champion/challenger, traffic splitting), Lakehouse Monitoring for drift, distributed deep learning (TorchDistributor, DeepSpeed, Ray, serverless GPU), Agent Bricks classification and information extraction, the Multi-Agent Supervisor with MCP, Lakebase managed Postgres in the Lakehouse, an end-to-end retail capstone, and the certification roadmap.',
    keyTopics: [
      'Databricks SQL warehouses, materialized views, Lakehouse Federation',
      'AI/BI Dashboards and the Dashboard Agent',
      'AI/BI Genie at production scale — grounding, certified answers, evaluation',
      'AI SQL function family — ai_query, vector_search, ai_parse_document, ai_classify, ai_extract, ai_gen, ai_forecast',
      'Model Serving, AI Gateway, and inference tables',
      'Foundation Model APIs and external model federation',
      'Mosaic AI Vector Search and RAG patterns',
      'MLflow 3 — experiments, UC Model Registry, traces, evaluation',
      'Feature Store on Unity Catalog with point-in-time lookups',
      'MLOps — alias-driven promotion, champion/challenger, traffic splitting',
      'Lakehouse Monitoring for data and model drift',
      'Distributed deep learning — TorchDistributor, DeepSpeed, Ray, serverless GPU',
      'Agent Bricks — classification and information extraction',
      'Multi-Agent Supervisor, MCP, and agent evaluation',
      'Lakebase — managed Postgres in the Lakehouse',
      'End-to-end retail-intelligence capstone',
    ],
    audience: [
      'ML engineers shipping production GenAI systems on Databricks',
      'AI engineers building RAG, agents, and multi-agent applications',
      'Data engineers extending into AI and Mosaic AI workloads',
      'Solutions architects designing Lakehouse + AI platforms',
      'Engineering managers evaluating Databricks for AI initiatives',
      'Practitioners preparing for Databricks ML Associate and Professional certifications',
    ],
  },
};

/**
 * Backwards-compat alias. Most components imported `{ book }` before the series split.
 * V4 is the default because most homepage/topic-page content is AI-focused.
 * New code should prefer `volumes.v4` / `volumes.v3` / `series` for clarity.
 */
export const book = volumes.v4;
