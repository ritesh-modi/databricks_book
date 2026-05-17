# Azure Static Web Apps — Deployment Guide

End-to-end setup for deploying this site (`databricks-book-site`) to **Azure Static Web Apps (SWA)** with the primary canonical domain `genaiblueprints.com` plus 301 redirects for the 8 secondary domains.

The site is a fully static Astro 5 build — no SSR, no API — so the **Free tier** of SWA is enough. Estimated cost: **$0/month** unless you add custom paid features (Premium, private endpoints, etc.).

---

## Prerequisites

| Item | Notes |
|---|---|
| Azure account | Free trial works. Sign up at https://azure.microsoft.com/free |
| GitHub account | Source code must live in a GitHub repo for SWA's auto-CI/CD |
| Domain ownership | All 9 domains must be in a registrar where you can edit DNS records |
| Node.js 20+ | Local development (already set up) |
| Azure CLI (optional) | Useful for scripting but the Azure Portal works fine |

---

## Step 1 — Push the site to GitHub

If the code isn't already in a GitHub repo:

```bash
cd /Users/riteshmodi/databricks-book-site
git init
git add .
git commit -m "Initial commit: Databricks for Practitioners site"
gh repo create databricks-book-site --private --source=. --push
```

If `gh` (GitHub CLI) isn't installed:

```bash
brew install gh
gh auth login
```

Verify the push succeeded:

```bash
gh repo view --web
```

---

## Step 2 — Add the SWA configuration file

Before deploying, add `staticwebapp.config.json` at the **repo root**. This file controls routing, headers, custom error pages, and security. It will not break the existing build.

```json
{
  "routes": [
    { "route": "/rss.xml", "headers": { "content-type": "application/xml; charset=utf-8" } }
  ],
  "navigationFallback": {
    "rewrite": "/404.html",
    "exclude": ["/images/*", "/figures/*", "/*.{css,js,svg,png,jpg,jpeg,webp,xml,txt,ico}"]
  },
  "responseOverrides": {
    "404": { "rewrite": "/404.html", "statusCode": 404 }
  },
  "globalHeaders": {
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
    "Permissions-Policy": "interest-cohort=()"
  },
  "mimeTypes": {
    ".svg": "image/svg+xml",
    ".webmanifest": "application/manifest+json"
  }
}
```

Commit and push:

```bash
git add staticwebapp.config.json
git commit -m "Add SWA config: navigation fallback and security headers"
git push
```

---

## Step 3 — Create the Static Web App in the Azure Portal

1. Sign in at https://portal.azure.com.
2. Click **Create a resource** → search **Static Web App** → **Create**.
3. Fill in the **Basics** tab:

   | Field | Value |
   |---|---|
   | Subscription | Your Azure subscription |
   | Resource group | Create new → `rg-genaiblueprints` |
   | Name | `swa-genaiblueprints-prod` |
   | Plan type | **Free** |
   | Region | Pick the one closest to your users — `East US 2`, `West Europe`, or `Central India` are common defaults |
   | Source | **GitHub** |

4. Sign in to GitHub when prompted, then select:
   - **Organization**: your GitHub username
   - **Repository**: `databricks-book-site`
   - **Branch**: `main`

5. Under **Build Details**, choose:

   | Field | Value |
   |---|---|
   | Build presets | **Astro** |
   | App location | `/` |
   | Api location | *(leave empty)* |
   | Output location | `dist` |

6. Click **Review + create** → **Create**. Azure provisions in ~1 minute.

When complete, Azure auto-generates `.github/workflows/azure-static-web-apps-<random>.yml` in your repo (commits it to `main`). The workflow runs immediately. Wait for the first deploy — about 2–4 minutes.

7. Get the temporary URL from the Portal: **Overview → URL** — looks like `https://kind-meadow-0a1b2c3d4.eastus2.azurestaticapps.net`. Visit it to confirm the site renders.

---

## Step 4 — Verify the auto-generated GitHub Actions workflow

Open `.github/workflows/azure-static-web-apps-<random>.yml`. Confirm the build config matches:

```yaml
- name: Build And Deploy
  uses: Azure/static-web-apps-deploy@v1
  with:
    azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_<RANDOM> }}
    repo_token: ${{ secrets.GITHUB_TOKEN }}
    action: "upload"
    app_location: "/"
    api_location: ""
    output_location: "dist"
```

If anything is wrong, edit and push. The next workflow run will use the new settings.

---

## Step 5 — Add the primary canonical domain (genaiblueprints.com)

1. In the SWA blade, click **Custom domains** in the left nav.
2. Click **+ Add** → **Custom domain on other DNS**.
3. Enter `genaiblueprints.com`. Azure asks you to validate ownership via either:
   - **TXT record** (recommended) — Azure shows a TXT value to add at your registrar.
   - **CNAME** — only works for subdomains.

4. At your domain registrar (the DNS host for `genaiblueprints.com`), add the records Azure tells you:

   For an apex domain (no `www`):
   ```
   ALIAS/ANAME  @     <swa-hostname>.azurestaticapps.net
   TXT          @     <validation-value-from-azure>
   ```
   Most registrars (Cloudflare, Namecheap, Google Domains, GoDaddy, Porkbun) support `ALIAS` or `ANAME`. If yours doesn't, use `A` records pointing to the IPs Azure provides — but `ALIAS` is preferred because it follows IP changes automatically.

5. Back in the Portal, click **Validate**. Azure provisions a free SSL cert via Let's Encrypt — takes 5–30 minutes.

6. Repeat for the `www` subdomain:
   - Add `www.genaiblueprints.com` in **Custom domains** → **+ Add** → **Custom domain on other DNS**.
   - At the registrar: `CNAME  www  <swa-hostname>.azurestaticapps.net`.

7. Decide which is canonical (apex or www). Recommended: apex (`genaiblueprints.com`). Add a `www → apex` redirect rule below.

---

## Step 6 — Configure 301 redirects: www and the 8 secondary domains

You need to redirect:
- `www.genaiblueprints.com` → `genaiblueprints.com`
- `azureblueprints.com` → `genaiblueprints.com`
- `velocityengineer.com` → `genaiblueprints.com`
- `armtemplate.com` → `genaiblueprints.com`
- `azurebluprint.com` → `genaiblueprints.com`
- `zerosnone.com` → `genaiblueprints.com`
- `onenzeros.com` → `genaiblueprints.com`
- `hyper-coding.com` → `genaiblueprints.com`
- `loopingly.com` → `genaiblueprints.com`

**SWA does not support cross-domain redirect rules natively** in `staticwebapp.config.json`. You have three options. Pick one.

### Option A — Registrar-level URL forwarding (simplest, recommended for the secondary domains)

Most registrars provide free **"URL Forwarding"** or **"Domain Redirect"** as a feature. Set each secondary domain to forward to `https://genaiblueprints.com` with a **301 Permanent** redirect, preserving the path.

| Registrar | Where it lives |
|---|---|
| Cloudflare | Rules → Bulk Redirects (free up to 20 rules) |
| Namecheap | Domain List → Manage → Redirect Domain |
| GoDaddy | Domains → Forwarding |
| Porkbun | Domain Management → URL Forwarding |
| Google Domains / Squarespace | Forwarding |

**This is the cheapest option ($0/month)** and the one I recommend.

### Option B — One SWA per secondary domain (more control, still free)

For each secondary domain:

1. Create another SWA on the **Free** tier in the same resource group.
2. Point it at a minimal repo (or even a fork of this one) that contains only this `staticwebapp.config.json`:
   ```json
   {
     "routes": [{ "route": "/*", "redirect": "https://genaiblueprints.com/", "statusCode": 301 }]
   }
   ```
3. Attach the secondary domain to this throwaway SWA.

Eight extra SWAs = still $0 on the Free tier, but operationally heavier than Option A.

### Option C — Azure Front Door (only if you need it)

Azure Front Door can host all 9 hostnames behind one frontend and apply redirect rules centrally. **Cost: ~$35/month minimum** for the Standard tier. Skip unless you also need a WAF, global CDN tuning, or already use Front Door elsewhere.

---

## Step 7 — Update `site` in `astro.config.mjs` (already done)

Confirm it's correct:

```js
export default defineConfig({
  site: 'https://genaiblueprints.com',
  ...
});
```

This drives canonical URLs, sitemap URLs, OG image URLs, and the RSS feed. If this is wrong, search engines will index the temporary `azurestaticapps.net` URL.

After confirming, push any pending commits — the next deploy picks them up.

---

## Step 8 — Verify the deployment

Run through this checklist:

```bash
# Canonical domain serves the site
curl -I https://genaiblueprints.com
# Expect: HTTP/2 200, content-type: text/html

# WWW redirects to apex (if configured)
curl -I https://www.genaiblueprints.com
# Expect: HTTP/2 301 with location: https://genaiblueprints.com/

# Secondary domain redirects to canonical
curl -I https://azureblueprints.com
# Expect: HTTP/2 301 with location: https://genaiblueprints.com/

# Path is preserved in redirect (test on a secondary domain)
curl -I https://azureblueprints.com/topics/unity-catalog/
# Expect: HTTP/2 301 with location: https://genaiblueprints.com/topics/unity-catalog/

# Sitemap is reachable and uses canonical URLs
curl -s https://genaiblueprints.com/sitemap-index.xml | head -20
# Expect: <loc> entries with genaiblueprints.com, NOT databricksforpractitioners.com

# RSS feed works
curl -I https://genaiblueprints.com/rss.xml
# Expect: HTTP/2 200, content-type: application/xml

# Security headers are present
curl -sI https://genaiblueprints.com | grep -iE "strict-transport|x-content-type|referrer"
# Expect: Strict-Transport-Security, X-Content-Type-Options: nosniff, Referrer-Policy

# 404 page works
curl -I https://genaiblueprints.com/this-does-not-exist
# Expect: HTTP/2 404
```

Also visit in a browser:

- `/` (homepage with both covers)
- `/buy/` (two Amazon links, anchor `/buy/#v3` and `/buy/#v4` scroll correctly)
- `/topics/unity-catalog/` (a V3 topic page — figure should render)
- `/topics/rag-with-databricks/` (a V4 topic page — figure should render)
- `/preview/`, `/faq/`, `/about/`, `/reviews/`
- `/blog/` and `/blog/welcome/`
- `/404` (any nonexistent path)

---

## Step 9 — Submit to Google and Bing

Once the canonical domain is live and SSL is valid:

1. **Google Search Console** (https://search.google.com/search-console):
   - Add property: `https://genaiblueprints.com` (use the URL prefix option).
   - Verify via TXT record (easiest).
   - Submit sitemap: `https://genaiblueprints.com/sitemap-index.xml`.

2. **Bing Webmaster Tools** (https://www.bing.com/webmasters):
   - Add site, verify, submit the same sitemap.

3. **Add the 8 secondary domains as separate properties** in both consoles. This lets you see when crawlers hit them and confirm the 301 redirects are being followed. Once crawlers stop indexing the redirected URLs (usually within 6–8 weeks), you can remove those properties.

---

## Step 10 — Continuous deployment is automatic

Any commit to `main` triggers the SWA GitHub Action and deploys in 2–4 minutes. PRs trigger **staging environments** at a unique URL — perfect for review.

To configure staging environment behavior:

```
Portal → Static Web App → Configuration → Application settings
```

Add app settings if you need them (this site has none currently). They flow into the runtime — but since this is a pure static site, app settings have no effect at runtime; they would only matter if you added Azure Functions.

---

## Production hardening (optional)

| Concern | Action |
|---|---|
| Force HTTPS | On by default — SWA auto-redirects HTTP → HTTPS |
| Block staging URLs from indexing | Already covered — `azurestaticapps.net` returns `X-Robots-Tag: noindex` by default; PR staging environments do the same. |
| Locked-down preview | Portal → **Role management** → restrict who can view staging URLs |
| Custom 404 | Already wired via `responseOverrides` in `staticwebapp.config.json` |
| Sitemap freshness | `astro-sitemap` rebuilds on every deploy automatically |
| Image optimization | Out of scope for this static site; revisit if Core Web Vitals slip |

---

## Costs at a glance

| Item | Cost |
|---|---|
| Static Web App (Free tier) | **$0/month** |
| 100 GB egress / month | **Free** on the Free tier |
| Custom domains (10 supported on Free tier) | **$0** |
| SSL certificates | **$0** (auto-renewed by Azure via Let's Encrypt) |
| Registrar URL forwarding (Option A above) | **$0** with most registrars |
| Domain renewals | Whatever your registrar charges — typically $10–$15/year per domain |

If you switch to Standard tier later (more bandwidth, private endpoints, BYO functions backend): **$9/month flat** per SWA + $0.20 per million function invocations.

---

## Troubleshooting

**"The page can't be reached" on the custom domain for ~30 min after setup**
DNS propagation. Verify with `dig genaiblueprints.com` — when the resolved record matches what Azure shows, the site will work.

**SSL cert stuck pending**
Azure provisions via Let's Encrypt and Let's Encrypt rate-limits validation attempts. Wait 30 min, then click **Validate** again in the Portal.

**404s on routes that should work (e.g. `/topics/unity-catalog/`)**
Confirm `staticwebapp.config.json` has the `navigationFallback` block. Without it, SWA may not serve trailing-slash routes correctly.

**Build fails with "Could not find Astro"**
Confirm `package.json` has `"astro": "^5.1.1"` in dependencies (not just devDependencies). Astro 5+ requires Node 20+ — SWA's Astro preset uses Node 20 by default.

**GitHub Actions workflow keeps failing**
Open the failed run in GitHub Actions, expand the "Build And Deploy" step. Most common: a syntax error in a recently added page. `npm run build` locally first; if it builds clean locally, it will build clean on SWA.

**Redirects from secondary domains land at the temporary `azurestaticapps.net` URL**
The redirect target in your registrar config is wrong. It should be `https://genaiblueprints.com/`, not the Azure staging URL.

---

## Rollback

The SWA Portal → **Environments** lists every deployment. Click a previous successful one → **Swap to production**. Rollback takes ~30 seconds.

For destructive issues, you can also re-run any prior GitHub Actions workflow run from the GitHub UI.

---

## Reference

- Azure Static Web Apps docs: https://learn.microsoft.com/en-us/azure/static-web-apps/
- `staticwebapp.config.json` schema: https://learn.microsoft.com/en-us/azure/static-web-apps/configuration
- Astro on SWA: https://docs.astro.build/en/guides/deploy/microsoft-azure/
