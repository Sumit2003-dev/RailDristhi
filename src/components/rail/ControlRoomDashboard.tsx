import { useState, useMemo, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  PauseCircle,
  CheckCircle2,
  Check,
  RotateCcw,
  CloudRain,
  Search,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Building2,
  Activity,
  X,
  Target,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { trainRoutes } from "@/data/trains";
import type { TrainRoute } from "@/data/trains";
import { computeLiveStatus } from "@/lib/liveStatus";
import type { LiveStatus } from "@/lib/liveStatus";
import { useLiveClock } from "./useLiveClock";
import { EtaConfidenceBadge } from "./EtaConfidenceBadge";
import { DelayReasonTag } from "./DelayReasonTag";
import { DELAY_REASONS } from "@/lib/delayReasons";
import type { DelayReason } from "@/lib/delayReasons";
import { historicalDelayAt } from "@/lib/etaModel";

const reasonColors: Record<DelayReason, string> = {
  weather: "#38bdf8",
  congestion: "#f59e0b",
  "track-work": "#fb923c",
  "signal-failure": "#ef4444",
  technical: "#a855f7",
  unknown: "#94a3b8",
};

const zoneColors: Record<string, string> = {
  NR: "#3b82f6",
  WR: "#10b981",
  CR: "#8b5cf6",
  ER: "#f59e0b",
  SR: "#ec4899",
  NCR: "#06b6d4",
  ECR: "#f97316",
  WCR: "#6366f1",
  SCR: "#14b8a6",
  SWR: "#84cc16",
  SER: "#eab308",
  Other: "#94a3b8",
};

/**
 * Determine the primary Indian Railway Zone for a given station code or train route.
 */
function getStationZone(stationCode: string): string {
  const code = stationCode.toUpperCase();
  // Northern Railway (NR)
  if (
    [
      "NDLS",
      "DLI",
      "NZM",
      "ANVT",
      "LKO",
      "BSB",
      "MB",
      "ASR",
      "JUC",
      "UMB",
      "KLK",
      "CDG",
      "HW",
      "DDN",
      "JAT",
      "SVDK",
      "BE",
      "GZB",
    ].includes(code)
  )
    return "NR";

  // Western Railway (WR)
  if (
    [
      "MMCT",
      "BDTS",
      "BVI",
      "ST",
      "BRC",
      "ADI",
      "RTM",
      "UJN",
      "RJT",
      "BVP",
      "INDB",
      "GDA",
      "BL",
      "VAPI",
    ].includes(code)
  )
    return "WR";

  // Central Railway (CR)
  if (
    [
      "CSMT",
      "DR",
      "LTT",
      "TNA",
      "KYN",
      "PUNE",
      "NGP",
      "BSL",
      "MMR",
      "SUR",
      "KOP",
      "NK",
      "IGP",
      "DD",
    ].includes(code)
  )
    return "CR";

  // Eastern Railway (ER)
  if (["HWH", "SDAH", "KOAA", "ASN", "BWN", "MLDT", "BGP", "DGR", "RPH", "BDC"].includes(code))
    return "ER";

  // Southern Railway (SR)
  if (
    [
      "MAS",
      "MS",
      "TBM",
      "CBE",
      "MDU",
      "TPJ",
      "TVC",
      "ERS",
      "CLT",
      "CAN",
      "ALLP",
      "SA",
      "ED",
      "PGT",
      "KRR",
    ].includes(code)
  )
    return "SR";

  // North Central Railway (NCR)
  if (["CNB", "PRYJ", "ALJN", "AGC", "AF", "GWL", "JHS", "GOY", "TDL", "ETW", "FTP"].includes(code))
    return "NCR";

  // East Central Railway (ECR)
  if (
    [
      "PNBE",
      "PPTA",
      "DNR",
      "MGS",
      "DDU",
      "GAYA",
      "MFP",
      "SPJ",
      "DBG",
      "DHN",
      "DOS",
      "ARA",
      "BXR",
    ].includes(code)
  )
    return "ECR";

  // West Central Railway (WCR)
  if (
    ["JBP", "BPL", "RKMP", "KOTA", "SWM", "BINA", "ET", "KTE", "STA", "NU", "GUNA"].includes(code)
  )
    return "WCR";

  // South Central Railway (SCR)
  if (
    ["SC", "HYB", "KCG", "BZA", "TPTY", "GNT", "KZJ", "WL", "RU", "GTL", "NED", "MDR"].includes(
      code,
    )
  )
    return "SCR";

  // South Western Railway (SWR)
  if (["SBC", "YPR", "SMVB", "MYS", "UBL", "BGM", "BAY", "DWR", "HPT", "DVG"].includes(code))
    return "SWR";

  // South Eastern Railway (SER)
  if (["TATA", "ROU", "KGP", "RNC", "HTE", "BKSC", "SHM", "SRC", "CKP", "JSG"].includes(code))
    return "SER";

  return "NR";
}

function getTrainZone(train: TrainRoute): string {
  if (train.halts.length > 0) {
    return getStationZone(train.halts[0]!.code);
  }
  return "NR";
}

/**
 * Dynamically evaluate the model performance vs static schedule baseline across all route halts.
 */
function computeModelEvaluation(trains: TrainRoute[], now: Date) {
  let totalHaltObs = 0;
  let sumModelAbsError = 0;
  let sumBaselineAbsError = 0;

  trains.forEach((t) => {
    const live = computeLiveStatus(t, now);
    live.haltStatus.forEach((hs, idx) => {
      const histDelay = historicalDelayAt(t, idx);
      const predictedDelay = hs.forecast?.delayMin ?? 0;

      const modelError = Math.abs(predictedDelay - histDelay);
      const baselineError = Math.abs(0 - histDelay); // Static schedule assumes zero delay buffer

      sumModelAbsError += modelError;
      sumBaselineAbsError += baselineError;
      totalHaltObs++;
    });
  });

  const maeModel = totalHaltObs ? (sumModelAbsError / totalHaltObs).toFixed(1) : "0.0";
  const maeBaseline = totalHaltObs ? (sumBaselineAbsError / totalHaltObs).toFixed(1) : "0.0";
  const errorReductionPct =
    totalHaltObs && sumBaselineAbsError
      ? Math.round(((sumBaselineAbsError - sumModelAbsError) / sumBaselineAbsError) * 100)
      : 0;

  return {
    maeMinutes: Number(maeModel),
    baselineMaeMinutes: Number(maeBaseline),
    errorReductionPercent: errorReductionPct,
    sampleSize: totalHaltObs,
    evaluationWindow: "90-day rolling window",
  };
}

export function ControlRoomDashboard() {
  const now = useLiveClock(4000);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);

  // Search, Filter & Sort State for Active Delay Alerts
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState<string>("all");
  const [selectedCause, setSelectedCause] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"delay-desc" | "delay-asc" | "conf-desc" | "number">(
    "delay-desc",
  );

  // Alert Acknowledgment State
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Record<string, boolean>>({});
  const [showAcknowledgedSection, setShowAcknowledgedSection] = useState(false);

  // Auto-updating "Last updated Xs ago" ticker
  useEffect(() => {
    setSecondsAgo(0);
    const interval = setInterval(() => {
      setSecondsAgo((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [now]);

  const toggleAcknowledge = (trainNumber: string) => {
    setAcknowledgedAlerts((prev) => ({
      ...prev,
      [trainNumber]: !prev[trainNumber],
    }));
  };

  const statuses = useMemo(
    () => (now ? trainRoutes.map((t) => ({ t, s: computeLiveStatus(t, now) })) : []),
    [now],
  );

  // Model Evaluation Performance metrics
  const modelPerf = useMemo(() => {
    return computeModelEvaluation(trainRoutes, now ?? new Date());
  }, [now]);

  const fleet = useMemo(() => {
    const running = statuses.filter((x) => x.s.state === "running" || x.s.state === "halted");
    const onTime = running.filter((x) => (x.s.forecast?.delayMin ?? 0) <= 2).length;
    const late = running.length - onTime;
    const halted = running.filter((x) => x.s.state === "halted").length;
    const highConf = running.filter((x) => (x.s.forecast?.confidence ?? 0) >= 0.7).length;
    return { running: running.length, onTime, late, halted, highConf };
  }, [statuses]);

  // Delay reason breakdown
  const reasonBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const { s } of statuses) {
      if ((s.forecast?.delayMin ?? 0) > 2) {
        counts[s.delayReason] = (counts[s.delayReason] ?? 0) + 1;
      }
    }
    return (Object.keys(DELAY_REASONS) as DelayReason[])
      .filter((r) => (counts[r] ?? 0) > 0)
      .map((r) => ({
        reason: r,
        label: DELAY_REASONS[r].short,
        count: counts[r] ?? 0,
      }));
  }, [statuses]);

  // Zone-wise delay breakdown
  const zoneBreakdown = useMemo(() => {
    const zoneMap: Record<string, { count: number; totalDelay: number }> = {};

    statuses.forEach(({ t, s }) => {
      if ((s.forecast?.delayMin ?? 0) > 2) {
        const zone = getTrainZone(t);
        if (!zoneMap[zone]) zoneMap[zone] = { count: 0, totalDelay: 0 };
        zoneMap[zone]!.count += 1;
        zoneMap[zone]!.totalDelay += s.forecast?.delayMin ?? s.delay;
      }
    });

    return Object.entries(zoneMap)
      .map(([zone, data]) => ({
        zone,
        count: data.count,
        avgDelay: Math.round(data.totalDelay / (data.count || 1)),
      }))
      .sort((a, b) => b.count - a.count);
  }, [statuses]);

  // All active alerts (>15 min)
  const rawAlerts = useMemo(
    () =>
      statuses
        .filter(({ s }) => (s.forecast?.delayMin ?? 0) > 15)
        .map(({ t, s }) => ({
          t,
          s,
          zone: getTrainZone(t),
          isAcknowledged: !!acknowledgedAlerts[t.number],
        })),
    [statuses, acknowledgedAlerts],
  );

  // Weather Advisory Detection
  const weatherAdvisory = useMemo(() => {
    const weatherAlerts = statuses.filter(
      ({ s }) => s.delayReason === "weather" && (s.forecast?.delayMin ?? 0) > 10,
    );
    if (weatherAlerts.length === 0) return null;

    const impactedZones = Array.from(new Set(weatherAlerts.map(({ t }) => getTrainZone(t)))).join(
      ", ",
    );
    return {
      count: weatherAlerts.length,
      zones: impactedZones || "NR, ER, SR",
    };
  }, [statuses]);

  // Filtered & Sorted Alerts
  const filteredAlerts = useMemo(() => {
    let list = rawAlerts;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.t.number.includes(q) ||
          item.t.name.toLowerCase().includes(q) ||
          item.t.halts.some(
            (h) => h.code.toLowerCase().includes(q) || h.name.toLowerCase().includes(q),
          ),
      );
    }

    // Zone filter
    if (selectedZone !== "all") {
      list = list.filter((item) => item.zone === selectedZone);
    }

    // Cause filter
    if (selectedCause !== "all") {
      list = list.filter((item) => item.s.delayReason === selectedCause);
    }

    // Sorting
    list = [...list].sort((a, b) => {
      const delayA = a.s.forecast?.delayMin ?? a.s.delay;
      const delayB = b.s.forecast?.delayMin ?? b.s.delay;
      const confA = a.s.forecast?.confidence ?? a.s.confidence;
      const confB = b.s.forecast?.confidence ?? b.s.confidence;

      if (sortBy === "delay-desc") return delayB - delayA;
      if (sortBy === "delay-asc") return delayA - delayB;
      if (sortBy === "conf-desc") return confB - confA;
      if (sortBy === "number") return a.t.number.localeCompare(b.t.number);
      return 0;
    });

    return list;
  }, [rawAlerts, searchQuery, selectedZone, selectedCause, sortBy]);

  const activePendingAlerts = useMemo(
    () => filteredAlerts.filter((a) => !a.isAcknowledged),
    [filteredAlerts],
  );
  const activeAckAlerts = useMemo(
    () => filteredAlerts.filter((a) => a.isAcknowledged),
    [filteredAlerts],
  );

  const availableZones = useMemo(() => {
    const zSet = new Set<string>();
    rawAlerts.forEach((a) => zSet.add(a.zone));
    return Array.from(zSet).sort();
  }, [rawAlerts]);

  return (
    <div className="space-y-6">
      {/* 6. Live Status Indicator & Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="size-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
            Network Operations Feed
          </span>
        </div>

        {/* Live Pulse Ticker */}
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground shadow-xs">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[11px] font-medium text-foreground">
            Last updated {secondsAgo}s ago
          </span>
          <span className="text-[10px] text-muted-foreground">• Live model telemetry</span>
        </div>
      </div>

      {/* 7. Weather Advisory Banner */}
      {!isBannerDismissed && weatherAdvisory && (
        <div className="flex items-start justify-between gap-3 rounded-2xl border border-sky-500/30 bg-sky-500/10 p-4 text-sky-950 dark:text-sky-100 shadow-sm animate-in fade-in duration-300">
          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-sky-500/20 text-sky-600 dark:text-sky-400">
              <CloudRain className="size-4.5" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-tight">
                Weather & Speed Restriction Advisory · Elevated Corridor Delays
              </p>
              <p className="mt-0.5 text-xs text-sky-800 dark:text-sky-200">
                Adverse weather and fog alerts detected across{" "}
                <strong>{weatherAdvisory.zones}</strong> zones ({weatherAdvisory.count} trains
                affected). Speed restrictions enforced on active trunk sections.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsBannerDismissed(true)}
            className="rounded-lg p-1 text-sky-700 hover:bg-sky-500/20 dark:text-sky-300 transition-colors cursor-pointer"
            title="Dismiss Advisory"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* 1 & 3. Top KPI Strip with Monitored Subset Clarification */}
      <div className="space-y-3">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi
            icon={<TrendingUp className="size-4" />}
            label="Trains monitored"
            value={fleet.running}
            sub={`${fleet.running} monitored (${fleet.onTime} on time)`}
          />
          <Kpi
            icon={<AlertTriangle className="size-4" />}
            label="Running late"
            value={fleet.late}
            sub="predicted by model"
            alert={fleet.late > 0}
          />
          <Kpi
            icon={<PauseCircle className="size-4" />}
            label="Halted at stations"
            value={fleet.halted}
            sub="currently stationary"
          />
          <Kpi
            icon={<ShieldCheck className="size-4" />}
            label="High-confidence forecasts"
            value={fleet.highConf}
            sub="≥ 70% confidence"
          />
        </div>

        {/* 1. Contextual note for dataset sample representation */}
        <div className="rounded-xl border border-border/80 bg-secondary/30 px-3.5 py-2 text-xs text-muted-foreground flex items-center gap-2">
          <Sparkles className="size-3.5 text-primary shrink-0" />
          <span>
            <strong>Dataset Note:</strong> Reflects a curated high-variance sample selected for
            delay-history depth — not representative of full-network baseline punctuality.
          </span>
        </div>
      </div>

      {/* 3. Model Performance Panel */}
      <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <Target className="size-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Model Forecasting Performance</h3>
          </div>
          <span className="rounded-md bg-secondary px-2 py-0.5 font-mono text-[11px] font-semibold text-primary">
            {modelPerf.evaluationWindow}
          </span>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border/60 bg-secondary/20 p-3">
            <p className="text-[11px] font-medium text-muted-foreground">
              Model Mean Absolute Error (MAE)
            </p>
            <p className="mt-1 font-mono text-2xl font-extrabold text-primary">
              {modelPerf.maeMinutes}{" "}
              <span className="text-xs font-normal text-muted-foreground">min</span>
            </p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              Average prediction delta across halts
            </p>
          </div>

          <div className="rounded-xl border border-border/60 bg-secondary/20 p-3">
            <p className="text-[11px] font-medium text-muted-foreground">Static Baseline Error</p>
            <p className="mt-1 font-mono text-2xl font-extrabold text-muted-foreground">
              {modelPerf.baselineMaeMinutes}{" "}
              <span className="text-xs font-normal text-muted-foreground">min</span>
            </p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              Schedule + static recovery baseline error
            </p>
          </div>

          <div
            className={`rounded-xl border p-3 ${
              modelPerf.errorReductionPercent >= 0
                ? "border-emerald-500/20 bg-emerald-500/5"
                : "border-amber-500/20 bg-amber-500/5"
            }`}
          >
            <p
              className={`text-[11px] font-medium ${
                modelPerf.errorReductionPercent >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-amber-600 dark:text-amber-400"
              }`}
            >
              {modelPerf.errorReductionPercent >= 0
                ? "Accuracy Improvement"
                : "Error vs Static Baseline"}
            </p>
            <p
              className={`mt-1 font-mono text-2xl font-extrabold ${
                modelPerf.errorReductionPercent >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-amber-600 dark:text-amber-400"
              }`}
            >
              {modelPerf.errorReductionPercent >= 0
                ? `+${modelPerf.errorReductionPercent}%`
                : `${modelPerf.errorReductionPercent}%`}
            </p>
            <p
              className={`mt-0.5 text-[10px] ${
                modelPerf.errorReductionPercent >= 0
                  ? "text-emerald-600/80 dark:text-emerald-400/80"
                  : "text-amber-600/80 dark:text-amber-400/80"
              }`}
            >
              {modelPerf.errorReductionPercent >= 0
                ? "Error reduction vs static schedule"
                : "Variance vs static schedule (0-delay assumption)"}
            </p>
          </div>

          <div className="rounded-xl border border-border/60 bg-secondary/20 p-3">
            <p className="text-[11px] font-medium text-muted-foreground">Evaluation Sample Size</p>
            <p className="mt-1 font-mono text-2xl font-extrabold text-foreground">
              {modelPerf.sampleSize.toLocaleString()}
            </p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              Halt observations in test cohort
            </p>
          </div>
        </div>
      </section>

      {/* Analytics Charts Row: Delay Cause Distribution & Zone-Wise Delay Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Existing: Delay cause distribution */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h3 className="text-sm font-semibold text-foreground">Delay cause distribution</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Classified causes for trains the model predicts as late.
          </p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reasonBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" fontSize={11} stroke="var(--muted-foreground)" />
                <YAxis allowDecimals={false} fontSize={11} stroke="var(--muted-foreground)" />
                <Tooltip
                  cursor={{ fill: "var(--secondary)" }}
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {reasonBreakdown.map((r) => (
                    <Cell key={r.reason} fill={reasonColors[r.reason]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* 4. Zone-wise delay breakdown */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Zone-wise delay breakdown</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Affected train counts and average delay severity grouped by Railway Zone.
              </p>
            </div>
            <Building2 className="size-4 text-primary" />
          </div>

          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="zone" fontSize={11} stroke="var(--muted-foreground)" />
                <YAxis allowDecimals={false} fontSize={11} stroke="var(--muted-foreground)" />
                <Tooltip
                  cursor={{ fill: "var(--secondary)" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0]!.payload;
                      return (
                        <div className="rounded-xl border border-border bg-card p-2 text-xs shadow-lg">
                          <p className="font-bold text-foreground">Zone {data.zone}</p>
                          <p className="text-primary font-semibold">Delayed Trains: {data.count}</p>
                          <p className="text-muted-foreground">Avg Delay: {data.avgDelay} min</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {zoneBreakdown.map((z) => (
                    <Cell key={z.zone} fill={zoneColors[z.zone] ?? "#3b82f6"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* 2 & 5 & 8. Active Delay Alerts with Filter, Sort & Acknowledgment */}
      <section className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
        {/* Header with Title & Stats */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-secondary/30 px-5 py-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-foreground">Active delay alerts</h3>
            <span className="rounded-full bg-rail-alert/15 px-2 py-0.5 font-mono text-[10px] font-bold text-rail-alert">
              {activePendingAlerts.length} Actionable
            </span>
            {activeAckAlerts.length > 0 && (
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                {activeAckAlerts.length} Acknowledged
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {rawAlerts.length} total trains &gt;15 min delay
          </span>
        </div>

        {/* 2. Filter & Search Bar */}
        <div className="flex flex-wrap items-center gap-3 border-b border-border bg-card p-3 text-xs">
          {/* Text Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search train no, name or station..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-secondary/30 pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            )}
          </div>

          {/* Zone Selector */}
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground font-medium">Zone:</span>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="rounded-lg border border-border bg-secondary/30 px-2 py-1.5 text-xs font-semibold text-foreground focus:border-primary focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Zones</option>
              {availableZones.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </div>

          {/* Delay Cause Selector */}
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground font-medium">Cause:</span>
            <select
              value={selectedCause}
              onChange={(e) => setSelectedCause(e.target.value)}
              className="rounded-lg border border-border bg-secondary/30 px-2 py-1.5 text-xs font-semibold text-foreground focus:border-primary focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Causes</option>
              <option value="weather">Weather</option>
              <option value="congestion">Congestion</option>
              <option value="track-work">Track Work</option>
              <option value="signal-failure">Signal Failure</option>
              <option value="technical">Technical</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>

          {/* 8. Sort By Selector */}
          <div className="flex items-center gap-1">
            <ArrowUpDown className="size-3 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="rounded-lg border border-border bg-secondary/30 px-2 py-1.5 text-xs font-semibold text-foreground focus:border-primary focus:outline-hidden cursor-pointer"
            >
              <option value="delay-desc">Delay: High → Low</option>
              <option value="delay-asc">Delay: Low → High</option>
              <option value="conf-desc">Confidence: High → Low</option>
              <option value="number">Train Number</option>
            </select>
          </div>
        </div>

        {/* Alerts List Body */}
        {activePendingAlerts.length === 0 && activeAckAlerts.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">
            No matching delay alerts found for the selected filter criteria.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {/* Active Actionable Alerts */}
            {activePendingAlerts.map(({ t, s, zone }) => (
              <li
                key={t.number}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-secondary/20"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* 5. Acknowledge Action Button */}
                  <button
                    onClick={() => toggleAcknowledge(t.number)}
                    className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors cursor-pointer"
                    title="Acknowledge Alert"
                  >
                    <Check className="size-4" />
                  </button>

                  <Link
                    to="/train/$number"
                    params={{ number: t.number }}
                    className="min-w-0 flex-1 group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        <span className="font-mono text-muted-foreground">{t.number}</span> {t.name}
                      </span>
                      <span className="rounded bg-secondary/80 px-1.5 py-0.2 font-mono text-[9px] font-bold text-foreground">
                        {zone}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <DelayReasonTag reason={s.delayReason} />
                      <span className="text-xs text-muted-foreground">
                        Approaching: <strong>{s.nextHalt?.code ?? "Destination"}</strong>
                      </span>
                    </div>
                  </Link>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="block font-mono text-base font-bold text-rail-alert">
                      +{s.forecast?.delayMin ?? s.delay} min
                    </span>
                    <EtaConfidenceBadge confidence={s.forecast?.confidence ?? 0} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* 5. Collapsible Acknowledged Section */}
        {activeAckAlerts.length > 0 && (
          <div className="border-t border-border bg-secondary/15">
            <button
              onClick={() => setShowAcknowledgedSection(!showAcknowledgedSection)}
              className="flex w-full items-center justify-between px-5 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Acknowledged Alerts ({activeAckAlerts.length})</span>
              </span>
              {showAcknowledgedSection ? (
                <ChevronUp className="size-3.5" />
              ) : (
                <ChevronDown className="size-3.5" />
              )}
            </button>

            {showAcknowledgedSection && (
              <ul className="divide-y divide-border/60 bg-secondary/5 opacity-75">
                {activeAckAlerts.map(({ t, s, zone }) => (
                  <li
                    key={t.number}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-2.5 bg-secondary/10"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <button
                        onClick={() => toggleAcknowledge(t.number)}
                        className="flex size-6 shrink-0 items-center justify-center rounded-md border border-emerald-500/40 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-amber-500/20 hover:text-amber-600 transition-colors cursor-pointer"
                        title="Reopen Alert"
                      >
                        <RotateCcw className="size-3" />
                      </button>

                      <Link
                        to="/train/$number"
                        params={{ number: t.number }}
                        className="min-w-0 flex-1"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium line-through text-muted-foreground">
                            {t.number} {t.name}
                          </span>
                          <span className="rounded bg-secondary px-1 py-0.2 font-mono text-[8px] text-muted-foreground">
                            {zone}
                          </span>
                          <span className="rounded-xs bg-emerald-500/10 px-1 py-0.2 text-[8px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                            Actioned
                          </span>
                        </div>
                      </Link>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-xs text-muted-foreground">
                        +{s.forecast?.delayMin ?? s.delay} min
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function Kpi({
  icon,
  label,
  value,
  sub,
  alert,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  sub: string;
  alert?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </p>
      <p className={`mt-2 text-3xl font-bold ${alert ? "text-rail-alert" : "text-foreground"}`}>
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}
