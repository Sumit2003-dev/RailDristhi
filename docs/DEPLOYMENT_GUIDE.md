# 🚀 RailSaarthi (RailDristhi) — Deployment & DevOps Guide

This guide covers building, testing, containerizing, and deploying **RailSaarthi** across modern cloud platforms including Docker, Vercel, Render, AWS, and Google Cloud Run.

---

## 📋 System Prerequisites

- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **Package Manager**: `npm` (v10+), `bun` (v1.1+), or `pnpm`
- **Docker**: `v24+` (Optional, for containerized deployments)
- **Git**: Latest version

---

## 🛠️ Local Development Setup

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/your-username/railsaarthi.git
cd railsaarthi

# Install project dependencies
npm install
```

### 2. (Optional) Run Data Ingestion Pipeline
If you modify or update the raw CSV datasets in `public/`:
```bash
npm run ingest
```
This parses the CSVs and regenerates typed TypeScript modules in `src/data/generated/`.

### 3. Start Development Server
```bash
npm run dev
```
The application will launch with hot module replacement (HMR) at:
👉 **`http://localhost:3000`** (or `http://localhost:5173` depending on port availability)

---

## 🧪 Testing, Linting & Formatting

```bash
# Verify ESLint rules
npm run lint

# Check & format code style with Prettier
npm run format

# Type check and build production bundle
npm run build
```

---

## 🐳 Docker Container Deployment

RailSaarthi includes a high-efficiency multi-stage `Dockerfile` creating a lightweight Alpine production image (~180MB).

### 1. Build the Docker Image
```bash
docker build -t railsaarthi:latest .
```

### 2. Run the Container
```bash
docker run -d \
  --name railsaarthi-app \
  -p 3000:3000 \
  --restart unless-stopped \
  railsaarthi:latest
```

### 3. Verify Container Status
```bash
docker ps
curl http://localhost:3000/api/v1/health
```

---

## ☁️ Cloud Deployment Options

### Option A: Vercel Deployment (Recommended for Serverless)

RailSaarthi comes pre-configured with `vercel.json` for zero-configuration Vercel deployment:

1. Push your code to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Import the repository `railsaarthi`.
4. Framework Preset: **Other** / **Vite**.
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Click **Deploy**.

---

### Option B: Render Deployment

1. Create a `render.yaml` or create a new **Web Service** on [Render.com](https://render.com).
2. Connect your GitHub repository.
3. Configuration:
   - **Environment**: `Node`
   - **Node Version**: `20`
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `node dist/server/server.js`
4. Set Environment Variables:
   - `NODE_ENV=production`
   - `PORT=3000`
5. Click **Create Web Service**.

---

### Option C: Google Cloud Run / AWS App Runner (Containerized)

```bash
# Build & tag image for Google Container Registry (GCR)
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/railsaarthi:latest

# Deploy to Cloud Run with automatic SSL and autoscaling
gcloud run deploy railsaarthi \
  --image gcr.io/YOUR_PROJECT_ID/railsaarthi:latest \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --port 3000
```

---

## ⚙️ Environment Configuration

| Variable | Description | Default Value | Required |
|:---|:---|:---|:---:|
| `NODE_ENV` | Runtime environment mode | `production` | No |
| `PORT` | HTTP Server port | `3000` | No |
| `VITE_APP_TITLE` | Application branding title | `RailSaarthi` | No |

---

## 🔄 CI/CD Pipeline (GitHub Actions)

The repository includes a ready-to-use GitHub Actions workflow in `.github/workflows/ci.yml`:

```yaml
name: CI Build & Test

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"
      - run: npm ci
      - run: npm run lint
      - run: npm run build
```
