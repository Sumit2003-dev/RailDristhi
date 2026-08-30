import { useState } from "react";
import { Gauge, MapPin, Clock, Filter } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { trainRoutes } from "@/data/trains";
import { computeLiveStatus, delayLabel, delayTone } from "@/lib/liveStatus";
import { useLiveClock } from "./useLiveClock";
import { EtaConfidenceBadge } from "./EtaConfidenceBadge";
import { DelayReasonTag } from "./DelayReasonTag";

type FilterTab = "all" | "ontime" | "delayed" | "halted";

export function LiveTrainList() {
  const now = useLiveClock(5000);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const trainsWithStatus = trainRoutes.map((t) => {
    const status = now ? computeLiveStatus(t, now) : null;
    const dest = t.halts[t.halts.length - 1]!;
    const delay = status?.forecast?.delayMin ?? status?.delay ?? 0;
    const isHalted = status?.state === "halted";
    const isOnTime = delay <= 2;
    const isDelayed = delay > 2;

    return {
      t,
      status,
      dest,
      delay,
      isHalted,
      isOnTime,
      isDelayed,
    };
  });

  const filteredTrains = trainsWithStatus.filter(({ isHalted, isOnTime, isDelayed }) => {
    if (activeTab === "ontime") return isOnTime;
    if (activeTab === "delayed") return isDelayed;
    if (activeTab === "halted") return isHalted;
    return true;
  });

  const onTimeCount = trainsWithStatus.filter((x) => x.isOnTime).length;
  const delayedCount = trainsWithStatus.filter((x) => x.isDelayed).length;
  const haltedCount = trainsWithStatus.filter((x) => x.isHalted).length;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-subtle-gradient px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-rail-live animate-rail-pulse" />
          <h2 className="text-sm font-semibold">Trains running now</h2>
        </div>
        <span className="text-xs text-muted-foreground">
          {now ? `Live GPS updated ${now.toLocaleTimeString()}` : "Connecting…"}
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-border bg-secondary/30 px-5 py-2.5 text-xs">
        <span className="text-muted-foreground mr-1 flex items-center gap-1 font-semibold">
          <Filter className="size-3" /> Filter:
        </span>
        <button
          onClick={() => setActiveTab("all")}
          className={`rounded-lg px-2.5 py-1 font-semibold transition-colors ${
            activeTab === "all"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          }`}
        >
          All ({trainRoutes.length})
        </button>
        <button
          onClick={() => setActiveTab("ontime")}
          className={`rounded-lg px-2.5 py-1 font-semibold transition-colors ${
            activeTab === "ontime"
              ? "bg-rail-live text-white"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          }`}
        >
          On Time ({onTimeCount})
        </button>
        <button
          onClick={() => setActiveTab("delayed")}
          className={`rounded-lg px-2.5 py-1 font-semibold transition-colors ${
            activeTab === "delayed"
              ? "bg-rail-alert text-white"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          }`}
        >
          Delayed ({delayedCount})
        </button>
        <button
          onClick={() => setActiveTab("halted")}
          className={`rounded-lg px-2.5 py-1 font-semibold transition-colors ${
            activeTab === "halted"
              ? "bg-amber-600 text-white"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          }`}
        >
          Halted at Station ({haltedCount})
        </button>
      </div>

      <ul className="divide-y divide-border">
        {filteredTrains.length === 0 ? (
          <li className="p-8 text-center text-sm text-muted-foreground">
            No trains currently match this filter.
          </li>
        ) : (
          filteredTrains.map(({ t, status, dest }) => (
            <li key={t.number}>
              <Link
                to="/train/$number"
                params={{ number: t.number }}
                className="block px-5 py-4 transition-colors hover:bg-secondary/40"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className="font-semibold">
                    <span className="text-muted-foreground font-mono">{t.number}</span> {t.name}
                  </p>
                  <p
                    className={`text-sm font-semibold ${status ? delayTone(status) : "text-muted-foreground"}`}
                  >
                    {status ? delayLabel(status) : "…"}
                  </p>
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-2">
                  <p className="text-xs text-muted-foreground">
                    {t.halts[0]!.code} → {dest.code} · {t.type}
                  </p>
                  {status && status.forecast && status.forecast.delayMin > 2 && (
                    <DelayReasonTag reason={status.delayReason} />
                  )}
                </div>

                <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-hero-gradient transition-all duration-1000"
                    style={{ width: `${status?.progress ?? 0}%` }}
                  />
                  <div
                    className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-3 ring-primary/20 transition-all duration-1000"
                    style={{ left: `${status?.progress ?? 0}%` }}
                  />
                </div>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Gauge className="size-3.5" />
                    {status ? (status.speed === 0 ? "Halted" : `${status.speed} km/h`) : "—"}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-3.5" />
                    Next: {status?.nextHalt?.name ?? "—"}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-3.5" />
                    Predicted ETA {status?.etaNext ?? "—"}
                  </span>
                  {status && status.forecast && (
                    <EtaConfidenceBadge confidence={status.forecast.confidence} />
                  )}
                </div>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
