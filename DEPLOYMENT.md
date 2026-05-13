# Auto-Deploy Setup Guide

This repository is configured for automatic deployment to Cloudflare via GitHub Actions.

## Workflows

| Workflow | File | Trigger |
|----------|------|---------|
| Deploy Worker | `.github/workflows/deploy-worker.yml` | Push to `main` or manual |
| Deploy Pages | `.github/workflows/deploy-pages.yml` | Push to `main` or manual |

---

## Step 1: Get Your Cloudflare Credentials

### CLOUDFLARE_API_TOKEN

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click **My Profile** (top-right avatar)
3. Select **API Tokens** tab
4. Click **Create Token**
5. Use the **Edit Cloudflare Workers** template — or create a custom token with:
   - `Account > Cloudflare Pages > Edit`
   - `Account > Workers Scripts > Edit`
   - `Zone > Zone > Read` (optional, for custom domains)
6. Copy the generated token — **it is shown only once**

### CLOUDFLARE_ACCOUNT_ID

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select any domain (or the Workers & Pages section)
3. Your **Account ID** is shown in the **right sidebar** under "API"
4. It is a 32-character hex string like `a1b2c3d4e5f6...`

---

## Step 2: Add Secrets to GitHub

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add:

| Secret Name | Value |
|-------------|-------|
| `CLOUDFLARE_API_TOKEN` | Your API token from Step 1 |
| `CLOUDFLARE_ACCOUNT_ID` | Your Account ID from Step 1 |

---

## Step 3: How Auto-Deploy Works

Once secrets are configured:

1. Every `git push` to the `main` branch automatically triggers both workflows
2. **deploy-worker.yml** runs `pnpm run build` → `wrangler deploy` → deploys the Worker
3. **deploy-pages.yml** runs `pnpm run build` → deploys `build/client/` to Cloudflare Pages
4. You can also trigger either workflow manually from **Actions** tab → select workflow → **Run workflow**

If secrets are **not** configured, both workflows will pass gracefully with an info message — they will not fail your CI.

---

## wrangler.toml (Current Config)

```toml
name = "bolt"
compatibility_flags = ["nodejs_compat"]
compatibility_date = "2024-09-02"
pages_build_output_dir = "./build/client"
send_metrics = false
```

The Pages project name in `deploy-pages.yml` is set to `my-ai-factory`. If your Cloudflare Pages project has a different name, update the `projectName` field in `.github/workflows/deploy-pages.yml`.

---

## Manual Deploy (Without GitHub Actions)

```bash
# Install dependencies
pnpm install

# Build
pnpm run build

# Deploy Worker
pnpm wrangler deploy

# Deploy Pages
pnpm wrangler pages deploy ./build/client --project-name=my-ai-factory
```
