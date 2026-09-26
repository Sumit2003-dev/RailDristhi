# 🤖 RailDristhi — Agent & Contributor Guide

Welcome to the **RailDristhi** codebase. This guide outlines key architecture patterns, code styles, and development workflows.

---

## 🏛️ Project Architecture

- **Framework**: [TanStack Start](https://tanstack.com/start) (Full-stack SSR on top of Vite 8 + Nitro)
- **Routing**: File-based routing via `@tanstack/react-router` in `src/routes/`
- **Styling**: Tailwind CSS v4 (`src/styles.css`) + Radix UI primitives (`src/components/ui/`)
- **Intelligence Engines**:
  - `src/lib/etaModel.ts`: Multi-variable physics + drift ETA convergence model with 80% confidence intervals.
  - `src/lib/delayReasons.ts`: Semantic delay root cause decomposition.
  - `src/lib/liveStatus.ts`: Train spatial interpolation & kinematics calculator.
  - `src/hooks/useOnBoardGps.ts`: Client-side GPS dead-reckoning engine.
- **REST Gateway**: `/api/v1/*` handled in `src/server/apiRouter.ts`.

---

## 🛠️ Key Commands

```bash
# Start local development server (port 3000)
npm run dev

# Run data ingestion pipeline from CSV datasets
npm run ingest

# Type check codebase
npx tsc --noEmit

# Lint rules verification
npm run lint

# Format codebase with Prettier
npm run format

# Compile production bundle
npm run build
```

---

## 🌐 Live Production Links

- **Web App**: [https://raildristhigov.vercel.app](https://raildristhigov.vercel.app)
- **API Health**: [https://raildristhigov.vercel.app/api/v1/health](https://raildristhigov.vercel.app/api/v1/health)
- **API Docs**: [https://raildristhigov.vercel.app/api/v1/docs](https://raildristhigov.vercel.app/api/v1/docs)
- **Developer Sandbox**: [https://raildristhigov.vercel.app/developer](https://raildristhigov.vercel.app/developer)
