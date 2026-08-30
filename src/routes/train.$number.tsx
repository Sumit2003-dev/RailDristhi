import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Gauge, MapPin, Clock, Route as RouteIcon, ArrowLeft, ShieldAlert } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/rail/SiteHeader";
import { SiteFooter } from "@/components/rail/Sections";
import { RouteMap } from "@/components/rail/RouteMap";
import { EtaConfidenceBadge } from "@/components/rail/EtaConfidenceBadge";
import { DelayReasonTag } from "@/components/rail/DelayReasonTag";
import { useLiveClock } from "@/components/rail/useLiveClock";
import { getTrain } from "@/data/trains";
import { computeLiveStatus, delayLabel, delayTone, fmtMinutes } from "@/lib/liveStatus";

export const Route = createFileRoute("/train/$number")({
  loader: ({ params }) => {
    const train = getTrain(params.number);
    if (!train) throw notFound();
    return { train };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Train not found — RailDristhi" }, { name: "robots", content: "noindex" }],
      };
    }
    const { train } = loaderData;
    const title = `${train.number} ${train.name} — Live Running Status | RailDristhi`;
    const description = `Live position, delay, next halt and full timetable for ${train.number} ${train.name} between ${train.halts[0]!.name} and ${train.halts[train.halts.length - 1]!.name}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: TrainNotFound,
  component: TrainStatus,
});

function TrainNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">Train not found</h1>
        <p className="mt-3 text-muted-foreground">
          We could not find that train number in the network.
        </p>
        <Link to="/" className="mt-6 inline-block text-primary underline">
          Back to live board
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}

function TrainStatus() {
  const { train } = Route.useLoaderData();
  const now = useLiveClock(4000);
  const status = now ? computeLiveStatus(train, now) : null;
  const dest = train.halts[train.halts.length - 1]!;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Live board
        </Link>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              {train.type} · runs {train.runsOn.length === 7 ? "daily" : train.runsOn.join(", ")}
            </p>
            <h1 className="mt-1 text-3xl font-bold">
              <span className="text-muted-foreground">{train.number}</span> {train.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {train.halts[0]!.name} ({train.halts[0]!.code}) → {dest.name} ({dest.code}) ·{" "}
              {dest.km} km · departs {fmtMinutes(train.startsAt)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <p
              className={`text-lg font-semibold ${status ? delayTone(status) : "text-muted-foreground"}`}
            >
              {status ? delayLabel(status) : "Fetching live feed…"}
            </p>
            {status?.forecast && status.forecast.delayMin > 2 && (
              <span className="inline-flex items-center gap-1.5 text-sm">
                <ShieldAlert className="size-4 text-muted-foreground" />
                <DelayReasonTag reason={status.delayReason} />
              </span>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Stat
                  icon={<Gauge className="size-4" />}
                  label="Speed"
                  value={status ? (status.speed === 0 ? "Halted" : `${status.speed} km/h`) : "—"}
                />
                <Stat
                  icon={<MapPin className="size-4" />}
                  label="Next halt"
                  value={status?.nextHalt ? status.nextHalt.code : "—"}
                />
                <Stat
                  icon={<Clock className="size-4" />}
                  label="Predicted ETA"
                  value={status ? status.etaNext : "—"}
                />
                <Stat
                  icon={<RouteIcon className="size-4" />}
                  label="Covered"
                  value={status ? `${status.km} km` : "—"}
                />
              </div>

              {status?.forecast && (
                <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-secondary/40 px-4 py-3">
                  <EtaConfidenceBadge confidence={status.forecast.confidence} />
                  <span className="text-xs text-muted-foreground">
                    Forecast window {status.forecast.lowerEta} – {status.forecast.upperEta} for{" "}
                    {status.nextHalt?.name ?? "destination"}
                    {status.forecast.delayMin > 0
                      ? ` (+${status.forecast.delayMin} min)`
                      : " (on time)"}
                  </span>
                </div>
              )}

              <div className="relative mt-5 h-1.5 overflow-hidden rounded-full bg-secondary">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-hero-gradient transition-all duration-1000"
                  style={{ width: `${status?.progress ?? 0}%` }}
                />
                <div
                  className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-3 ring-primary/20 transition-all duration-1000"
                  style={{ left: `${status?.progress ?? 0}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {status
                  ? `Last reported at ${status.lastHalt.name} · updated ${new Date(status.updatedAt).toLocaleTimeString()}`
                  : "Waiting for the first position report…"}
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              <div className="border-b border-border bg-subtle-gradient px-5 py-3">
                <p className="text-sm font-semibold">Schedule and predicted times</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Model forecast for every remaining halt.
                </p>
              </div>
              <ol className="divide-y divide-border">
                {(
                  status?.haltStatus ??
                  train.halts.map((halt) => ({
                    halt,
                    scheduled: fmtMinutes(train.startsAt + halt.arr),
                    expected: "—",
                    forecast: null,
                    done: false,
                    isNext: false,
                  }))
                ).map((row) => (
                  <li
                    key={row.halt.code}
                    className={`flex items-center gap-4 px-5 py-3 ${row.isNext ? "bg-secondary/50" : ""}`}
                  >
                    <span
                      className={`size-2.5 shrink-0 rounded-full ${
                        row.done
                          ? "bg-rail-live"
                          : row.isNext
                            ? "bg-primary animate-rail-pulse"
                            : "bg-border"
                      }`}
                    />
                    <span className="flex-1">
                      <span className="block text-sm font-semibold">
                        {row.halt.name}{" "}
                        <span className="text-muted-foreground">({row.halt.code})</span>
                      </span>
                      <span className="mt-0.5 flex flex-wrap items-center gap-1.5">
                        <span className="text-xs text-muted-foreground">
                          {row.halt.km} km · Platform {row.halt.platform}
                        </span>
                        {!row.done && row.forecast && row.forecast.delayMin > 2 && (
                          <DelayReasonTag reason={row.forecast.reason} />
                        )}
                      </span>
                    </span>
                    <span className="text-right text-xs">
                      <span className="block text-muted-foreground line-through">
                        {row.scheduled}
                      </span>
                      <span className="block font-semibold">
                        {!row.done && row.forecast ? row.forecast.eta : row.expected}
                      </span>
                      {!row.done && row.forecast && (
                        <span className="block text-[10px] text-muted-foreground">
                          ±{row.forecast.intervalMin} min
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-3 shadow-card">
            <RouteMap
              halts={train.halts}
              position={status ? { lat: status.lat, lng: status.lng } : null}
              className="h-[420px] w-full lg:h-[560px]"
            />
          </div>
        </div>
      </main>

      <SiteFooter />
      <Toaster />
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}
