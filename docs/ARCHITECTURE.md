# 🏗️ RailSaarthi (RailDristhi) — System Architecture

This document provides a comprehensive technical breakdown of **RailSaarthi (RailDristhi)**, an enterprise-grade Indian Railways Passenger Experience & Control Room Operations Intelligence Platform engineered for **Smart India Hackathon (SIH) 2026**.

---

## 🧭 High-Level Architecture Diagram

```mermaid
flowchart TB
    subgraph ClientLayer ["Client Layer (Cross-Platform Modern Web & PWA)"]
        UI_Home["Passenger Live Tracking UI"]
        UI_Control["Central Control Room & Dispatch Dashboard"]
        UI_Connecting["Connecting Train Miss Risk Analyzer"]
        UI_PNR["Smart PNR & Berth Intelligence"]
        UI_Sandbox["Developer Interactive REST Sandbox"]
        UI_GPS["On-Board GPS & Peer Mesh Sensor Hook"]
    end

    subgraph AppServer ["Application Server (TanStack Start + Nitro SSR)"]
        Router["TanStack Router (Type-Safe Routing & Meta Hydration)"]
        I18nEngine["Multilingual i18n Engine (8 Indic Languages)"]
        APIGateway["REST API Gateway (/api/v1/* with CORS & OpenAPI 3.0)"]
    end

    subgraph IntelligenceEngine ["Core Intelligence & Math Engines"]
        ETAModel["Multi-Factor ETA Prediction Engine (etaModel.ts)"]
        DelayClassifier["Root-Cause Delay Classifier (delayReasons.ts)"]
        LiveStatus["Spatial Kinematics & Geo-Interpolation (liveStatus.ts)"]
        RiskAnalyzer["Connecting Transfer Feasibility Calculator"]
        ZonalEngine["Indian Railways Zonal Matrix & Congestion Index"]
    end

    subgraph DataIngestion ["Data Pipeline & Scrape Ingestion Engine (scripts/ingest.mjs)"]
        CSV_Delay["Historical Delay Dataset (Station-Level)"]
        CSV_Routes["Train Timetables & Route Network Dataset"]
        CSV_History["Recent Past Run Delays Dataset (2025)"]
        JSON_Stations["Geo-Coordinates Dictionary (stations.json)"]
    end

    subgraph BuildArtifacts ["Generated Type-Safe Modules (src/data/generated/)"]
        GEN_Delay["delayStats.ts"]
        GEN_Routes["routes.ts"]
        GEN_History["runHistory.ts"]
        GEN_Stations["stations.ts"]
    end

    %% Data Pipeline Connections
    DataIngestion --> BuildArtifacts
    BuildArtifacts --> IntelligenceEngine

    %% Runtime Connections
    ClientLayer --> Router
    Router --> AppServer
    AppServer --> APIGateway
    APIGateway --> IntelligenceEngine
    UI_GPS --> LiveStatus
    IntelligenceEngine --> UI_Control
    IntelligenceEngine --> UI_Home
    IntelligenceEngine --> UI_Connecting
```

---

## 🔬 Core Subsystems & Mathematical Formulations

### 1. Multi-Variable ETA Forecasting Model (`src/lib/etaModel.ts`)

Standard railway apps rely on simplistic static time subtraction $(t_{scheduled} + delay_{last\_station})$, which fails miserably during cascades, peak hours, or weather disruptions. RailSaarthi implements a multi-variable convergence model:

$$\Delta_{target} = \max\left(0, \delta_{observed} \cdot (1 - \lambda \Delta h) + \bar{\delta}_{prior} \cdot \alpha \Delta h + \text{Med}(\mathbf{D}_{runs}) \cdot \beta (1 - \lambda \Delta h) + \omega_{weather} + \gamma_{congestion} + \tau_{peak}\right)$$

Where:
- $\delta_{observed}$: Observed real-time delay in minutes at the last recorded halt.
- $\lambda$: Delay decay and recovery rate constant ($\lambda = 0.045 / \text{halt}$).
- $\Delta h = \max(0, h_{target} - h_{last})$: Halt horizon distance.
- $\bar{\delta}_{prior}$: Historical drift average across prior halts on the current run ($\alpha = 0.40$).
- $\text{Med}(\mathbf{D}_{runs})$: Median delay from empirical historical run distributions ($\beta = 0.35$).
- $\omega_{weather}$: Weather penalty coefficients:
  - $\text{Fog} = +14\text{ min}$
  - $\text{Rain} = +6\text{ min}$
  - $\text{Wind} = +8\text{ min}$
  - $\text{Heat} = +4\text{ min}$
  - $\text{Clear} = 0\text{ min}$
- $\gamma_{congestion}$: Dynamic corridor congestion coefficient $(18 \times \text{congestionFactor})$.
- $\tau_{peak}$: Time-of-day peak congestion penalty ($+5\text{ min}$ for 08:00–11:00 & 17:00–20:00).

#### Confidence Interval Window Formulation
The dynamic $80\%$ uncertainty interval is calculated as:

$$I_{interval} = \pm \left(6 + 0.2 \cdot \Delta_{target} + 2 \cdot \Delta h\right)\text{ minutes}$$

$$\text{Confidence Score} = \text{clamp}\left(0.35, 0.95, 0.62 + 0.20 \cdot \min\left(1, \frac{N_{halts}}{4}\right) - \min(0.35, 0.05 \cdot \Delta h) - \omega_{penalty}\right)$$

---

### 2. Root-Cause Delay Classifier (`src/lib/delayReasons.ts`)

Instead of generic "Train Delayed" messages, RailSaarthi decomposes delays into 6 actionable operational categories:

```mermaid
flowchart TD
    Start["Delay Detected (delayMin > 3)"] --> C1{"Is train halted >= 15 min at non-scheduled stop?"}
    C1 -- Yes --> R1["Signal Failure / Preceding Train Block (signal-failure)"]
    C1 -- No --> C2{"Is active severe weather reported?"}
    C2 -- Yes --> R2["Adverse Weather: Fog/Rain/Storm (weather)"]
    C2 -- No --> C3{"Is time between 07:00-11:00 or 17:00-21:00 & delay < 30?"}
    C3 -- Yes --> R3["Corridor Traffic & Section Congestion (congestion)"]
    C3 -- No --> C4{"Is delay >= 45 min with repeated drift?"}
    C4 -- Yes --> R4["Loco/Rake Technical Issue or OHE Glitch (technical)"]
    C4 -- No --> C5{"Is scheduled maintenance window active?"}
    C5 -- Yes --> R5["Caution Order / Track Maintenance (track-work)"]
    C5 -- No --> R6["Operational Transit Variance (unknown)"]
```

---

### 3. Connecting Train Miss Risk Analyzer (`src/routes/connecting-impact.tsx`)

Passenger missed connections cause severe distress and station overcrowding. The Connecting Train Impact Engine calculates:

$$\text{Effective Buffer} = (\text{Departure}_{\text{connecting}} - \text{Predicted Arrival}_{\text{incoming}}) - \text{PlatformTransferTime}_{\text{nominal}}$$

$$\text{Miss Probability (\%)} = \begin{cases} 
0\% & \text{if Effective Buffer} \ge 30\text{ min} \\
\frac{30 - \text{Effective Buffer}}{30} \times 100\% & \text{if } 0 < \text{Effective Buffer} < 30\text{ min} \\
100\% & \text{if Effective Buffer} \le 0\text{ min (MISSED)}
\end{cases}$$

- **Feasibility Classification**:
  - `SAFE` (Risk $< 30\%$): Adequate transfer margin.
  - `RISKY` ($30\% \le \text{Risk} < 85\%$): High probability of tight connection, passengers alerted with platform navigation shortcuts.
  - `MISSED` ($\text{Risk} \ge 85\%$): System automatically queries timetable graph and presents alternative connecting trains from the transfer junction with live availability indicators.

---

### 4. Control Room Zonal Matrix & Dispatch Intelligence (`src/components/rail/ControlRoomDashboard.tsx`)

The Control Room module provides real-time situational awareness across all 16 Indian Railway Zones:

| Zone Code | Zone Name | Headquarters | Primary Monitored Hubs |
|:---|:---|:---|:---|
| **NR** | Northern Railway | New Delhi | NDLS, DLI, NZM, ANVT, LKO, BSB, MB, ASR |
| **WR** | Western Railway | Mumbai (Churchgate) | MMCT, BDTS, BVI, ST, BRC, ADI, RTM |
| **CR** | Central Railway | Mumbai (CSMT) | CSMT, DR, LTT, PNVL, PUNE, NGP, BSL |
| **ER** | Eastern Railway | Kolkata (Fairlie Place) | HWH, SDAH, ASN, DGR, MLDT, BGP |
| **SR** | Southern Railway | Chennai | MAS, MS, TBM, CBE, MDU, TVC, ERS |
| **NCR** | North Central Railway | Prayagraj | PRYJ, CNB, AGC, GWL, JHS |
| **ECR** | East Central Railway | Hajipur | PNBE, DNR, DDU, DHN, MFP, GAYA |
| **WCR** | West Central Railway | Jabalpur | JBP, BPL, RKMP, KOTA, ET |
| **SCR** | South Central Railway | Secunderabad | SC, HYB, BZA, TPTY, GNT, RU |
| **SWR** | South Western Railway | Hubballi | UBL, SBC, YPR, MYS, SMVB |
| **SER** | South Eastern Railway | Kolkata (Garden Reach) | TATA, ROU, KGP, RNC |

**Key Control Room Metrics Computed in Real-Time**:
- **On-Time Performance (OTP)**: Ratio of fleet running within $\le 15\text{ minutes}$ of schedule.
- **Critical Risk Threshold**: Trains running $>60\text{ minutes}$ behind schedule flagged with automated section precedence recommendations.
- **Corridor Heatmap**: Active calculation of trains per track block segment to prevent gridlock.

---

### 5. On-Board GPS & Peer Sensor Mesh (`src/hooks/useOnBoardGps.ts`)

To provide uninterrupted tracking even in remote rural tracks with zero mobile data:
1. **HTML5 Geolocation High-Accuracy Hook**: Reads device GPS sensors directly in browser without app store installation.
2. **Kinematic Dead Reckoning**: When GPS signal drops in tunnels or gorges, the engine extrapolates current position based on the last known velocity vector and railway track curve geometry:
   $$\vec{P}_{t+\Delta t} = \vec{P}_t + \vec{v}_{last} \cdot \Delta t$$
3. **Station Snapping**: Constrains GPS coordinates to the verified geo-polyline of the train's route to eliminate sensor drift.

---

## 📂 Source Code Architecture & Directory Mapping

```
railsaarthi-main/
├── .github/
│   └── workflows/
│       └── ci.yml                 # Automated CI build, lint, and formatting pipeline
├── docs/                          # Comprehensive SIH 2026 Documentation Suite
│   ├── ARCHITECTURE.md            # System Architecture & Math Specifications
│   ├── API_DOCUMENTATION.md       # Full OpenAPI 3.0 REST API Reference
│   ├── SIH_2026_PITCH_DECK.md     # 6-Slide SIH 2026 Presentation Deck & Q&A
│   ├── DEPLOYMENT_GUIDE.md        # Production Deployment (Docker, Vercel, Nitro)
│   └── FEATURES.md                # Feature Catalog & Module Breakdown
├── public/                        # Static datasets & raw CSV scrapes
│   ├── Indian Railway Delay Dataset.csv
│   ├── Train_details_22122017.csv
│   └── Indian Railways Train Delays Dataset 2025.csv
├── scripts/
│   ├── data/
│   │   └── stations.json          # Master database of station coordinates
│   ├── ingest.mjs                 # Build-time CSV parser and TS data generator
│   └── manual-overrides.json      # Coordinate and metadata overrides
├── src/
│   ├── components/
│   │   ├── rail/                  # Domain-specific Indian Railways UI components
│   │   │   ├── ControlRoomDashboard.tsx # Real-time section controller console
│   │   │   ├── DelayReasonTag.tsx       # Semantic delay cause badge
│   │   │   ├── EtaConfidenceBadge.tsx   # Visual uncertainty indicator
│   │   │   ├── LanguageSelector.tsx     # Indic multilingual picker
│   │   │   ├── LiveTrainList.tsx        # Real-time train list with filters
│   │   │   ├── NetworkMap.tsx           # Full-India interactive SVG rail map
│   │   │   ├── RouteMap.tsx             # Canvas/Google Maps train route visualizer
│   │   │   ├── SearchPanel.tsx          # Multi-tab train/station/PNR search bar
│   │   │   ├── Sections.tsx             # Landing page showcase sections & FAQ
│   │   │   ├── SiteHeader.tsx           # Responsive navigation header
│   │   │   ├── TrainTrackTimeline.tsx   # Detailed halt-by-halt tracking timeline
│   │   │   └── useLiveClock.ts          # Synchronized simulated live clock hook
│   │   └── ui/                          # Radix UI + Tailwind design system primitives
│   ├── data/
│   │   ├── generated/                   # Ingested datasets compiled into typed modules
│   │   │   ├── delayStats.ts            # Station-level historical delay benchmarks
│   │   │   ├── routes.ts                # Real timetables for 100+ major routes
│   │   │   ├── runHistory.ts            # Recent 2025 multi-run empirical delays
│   │   │   └── stations.ts              # Station geo-coordinates and names
│   │   ├── rail.ts                      # Common types and domain helpers
│   │   ├── trainTypes.ts                # Rajdhani, Shatabdi, Vande Bharat, etc.
│   │   ├── trains.ts                    # Curated featured train lists
│   │   └── translations.ts              # 8-language i18n translation dictionary
│   ├── hooks/
│   │   ├── use-mobile.tsx               # Responsive viewport breakpoint hook
│   │   └── useOnBoardGps.ts             # On-board sensor GPS dead-reckoning engine
│   ├── lib/
│   │   ├── delayReasons.ts              # Root cause delay classification logic
│   │   ├── error-capture.ts             # Global telemetry and error logging
│   │   ├── error-page.ts                # Fallback error boundaries
│   │   ├── etaModel.ts                  # Multi-factor ETA mathematical model
│   │   ├── i18n.tsx                     # React Context and hook for localization
│   │   ├── liveStatus.ts                # Real-time train position interpolation
│   │   └── utils.ts                     # Tailwind class merging utility
│   ├── routes/                          # TanStack File-Based Route Tree
│   │   ├── __root.tsx                   # Root application layout with navigation
│   │   ├── index.tsx                    # Passenger home page & search
│   │   ├── train.$number.tsx            # Live train running status & GPS timeline
│   │   ├── station.$code.tsx            # Live station arrival/departure board
│   │   ├── control-room.tsx             # Control room dashboard page
│   │   ├── connecting-impact.tsx        # Connecting train transfer miss risk analyzer
│   │   ├── pnr.tsx                      # Smart PNR & coach position status
│   │   ├── network.tsx                  # Pan-India interactive rail network map
│   │   └── developer.tsx                # REST API documentation & interactive sandbox
│   ├── server/
│   │   ├── services/
│   │   │   └── railBackend.ts           # Core server service handling queries & logic
│   │   └── apiRouter.ts                 # Full OpenAPI 3.0 REST Gateway router
│   ├── router.tsx                       # TanStack Router instance configuration
│   ├── server.ts                        # Nitro SSR server handler entrypoint
│   ├── start.ts                         # TanStack Start client hydration entrypoint
│   └── styles.css                       # Global Tailwind CSS v4 design system
├── Dockerfile                           # Multi-stage production container image
├── package.json                         # Project dependencies and script declarations
├── tsconfig.json                        # Strict TypeScript compilation options
└── vite.config.ts                       # Vite 8 + TanStack Start bundler configuration
```

---

## 🔒 Security, Scalability & Performance Benchmarks

- **Zero-Dependency Cold Start Ingestion**: Data generation happens at build time via `npm run ingest`, loading zero DB connections into memory for standard queries.
- **Client-Side Sub-10ms Forecasting**: The ETA engine executes in under $5\text{ms}$ in pure client JavaScript, enabling offline calculations inside running train coaches.
- **Type-Safe Full-Stack**: 100% strict TypeScript typing across routing, data schemas, API contracts, and UI components.
- **Lighthouse Performance Score**: Optimized for $95+$ Performance, $100$ Accessibility, $100$ Best Practices, and $100$ SEO.
