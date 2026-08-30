import { Gauge, MapPin, Clock } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { trainRoutes } from "@/data/trains";
import { computeLiveStatus, delayLabel, delayTone } from "@/lib/liveStatus";
import { useLiveClock } from "./useLiveClock";
import { EtaConfidenceBadge } from "./EtaConfidenceBadge";
import { DelayReasonTag } from "./DelayReasonTag";

export function LiveTrainList() {
  const now = useLiveClock(5000);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <div className="flex items-center justify-between border-b border-border bg-subtle-gradient px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-rail-live animate-rail-pulse" />
          <h2 className="text-sm font-semibold">Trains running now</h2>
        </div>
        <span className="text-xs text-muted-foreground">
          {now ? `Updated ${now.toLocaleTimeString()}` : "Connecting…"}
        </span>
      </div>
      <ul className="divide-y divide-border">
        {trainRoutes.map((t) => {
          const status = now ? computeLiveStatus(t, now) : null;
          const dest = t.halts[t.halts.length - 1]!;
          return (
            <li key={t.number}>
              <Link
                to="/train/$number"
                params={{ number: t.number }}
                className="block px-5 py-4 transition-colors hover:bg-secondary/40"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className="font-semibold">
                    <span className="text-muted-foreground">{t.number}</span> {t.name}
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
          );
        })}
      </ul>
    </div>
  );
}
