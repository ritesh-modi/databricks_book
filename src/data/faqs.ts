export const homepageFaqs = [
  {
    q: "Why are there two books? Should I buy both?",
    a: "The series splits cleanly. Volume 3 (The Production Lakehouse Playbook) is the platform foundation, Unity Catalog, Lakeflow ingestion and SDP pipelines, Lakeflow Jobs orchestration, Asset Bundles, CI/CD with OIDC, performance tuning. Volume 4 (The AI Lakehouse Playbook) is the AI build-out on top, Mosaic AI Vector Search and RAG, Agent Bricks, the Multi-Agent Supervisor, MLflow 3, Feature Store, MLOps, Lakehouse Monitoring, Lakebase. Read either standalone. Read both for the full picture, from raw Auto Loader ingestion to a multi-agent assistant deployed behind the AI Gateway.",
  },
  {
    q: "Which volume should I start with?",
    a: "If you're still figuring out Unity Catalog, Lakeflow pipelines, and how to deploy and orchestrate work on Databricks, start with Volume 3. If your platform is already in place and you're staring at the AI side (Mosaic AI Vector Search, Agent Bricks, MLflow 3, multi-agent systems), start with Volume 4. Volume 4 explicitly assumes Volume 3-level platform fluency, but it doesn't require having read Volume 3.",
  },
  {
    q: "Are these books for beginners or experienced engineers?",
    a: "Experienced. We assume you've written PySpark, you understand notebooks, you know what a DataFrame is. The series is for engineers and architects who want to go from prototypes to production systems on Databricks, UC governance, Lakeflow pipelines, RAG, agents, MLflow, model serving, the full operational picture.",
  },
  {
    q: "Does this cover the 2026 platform features, Agent Bricks, the Multi-Agent Supervisor, Lakebase, MLflow 3?",
    a: "Yes. Volume 4 is built around 2026 features: Agent Bricks (classification + information extraction), the Multi-Agent Supervisor with MCP integration, Lakebase (managed Postgres in the lakehouse), MLflow 3 with UC Model Registry and traces, the AI SQL function family (ai_query, ai_parse_document, ai_classify, ai_extract, ai_gen, ai_forecast, vector_search), and the AI Gateway. Volume 3 covers the platform features as of the 2026 cycle, Lakeflow renames, governed tags, predictive optimization, Liquid Clustering, OIDC federation.",
  },
  {
    q: "Will the books go stale when Databricks releases new versions?",
    a: "Kindle readers get free addendum updates for major Databricks releases, DBR LTS bumps, MLflow versions, Agent Bricks API changes, new AI SQL functions. The architectural lessons are durable; the platform-specific code gets refreshed.",
  },
  {
    q: "How is this different from the Databricks official documentation?",
    a: "The docs tell you what a feature does. These books tell you when to use it, what its failure modes are, what it costs, how it interacts with the rest of your stack, and how to operate it after the demo. The opinionated practitioner perspective is the value.",
  },
  {
    q: "Do I need a Databricks workspace to follow along?",
    a: "Yes, most code samples assume an active Databricks workspace. The free Community Edition is enough for many V3 chapters. Cloud-specific features (Vector Search, Model Serving, Agent Bricks, Lakebase) require a paid workspace; the books flag which sections need what.",
  },
  {
    q: "What format is best?",
    a: "Kindle for readers who want lifetime free updates as Databricks evolves. Paperback for readers who want a desk reference they don't lose tabs on. Hardcover for the long-life desk copy. All three are available on Amazon.",
  },
  {
    q: "Who wrote the books?",
    a: "Ritesh Modi, Head of AI at MarketOnce, previously Principal Forward Deployed Engineer at Microsoft. Author of 18 technology books including the Azure for Architects series and Solidity Programming Essentials. Creator of Microsoft's open-source RAG Experiment Accelerator. Speaker at Microsoft BUILD, .NET Conf, and Global Azure.",
  },
];
