import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Clock,
  MapPin,
  Sparkles,
  TrainFront,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/rail/SiteHeader";
import { SiteFooter } from "@/components/rail/Sections";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import type { ConnectingImpactResult } from "@/server/services/railBackend";

export const Route = createFileRoute("/connecting-impact")({
  component: ConnectingImpactPage,
  head: () => ({
    meta: [
      { title: "Connecting Trains Impact & Transfer Risk Calculator | RailDristhi" },
      {
        name: "description",
        content:
          "Calculate connection feasibility and platform transfer margins when switching trains at Indian Railways junction stations based on live ETA delay forecasts.",
      },
    ],
  }),
});

function ConnectingImpactPage() {
  const [incoming, setIncoming] = useState("12951");
  const [connecting, setConnecting] = useState("12001");
  const [station, setStation] = useState("NDLS");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ConnectingImpactResult | null>(null);

  const handleCalculate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!incoming || !connecting || !station) {
      toast.error("Please enter incoming train, connecting train, and transfer station code");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `/api/v1/connecting-impact?incoming=${encodeURIComponent(incoming)}&connecting=${encodeURIComponent(
          connecting,
        )}&station=${encodeURIComponent(station)}`,
      );
      const data = await res.json();
      if (data.error || !data.data) {
        toast.error(data.message || "Could not calculate transfer impact");
        setResult(null);
      } else {
        setResult(data.data);
        toast.success("Transfer impact calculated");
      }
    } catch {
      toast.error("Failed to connect to transfer risk service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" /> Live Transfer Risk Intelligence
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Connecting Train Impact & Transfer Margin
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
            Evaluate whether an incoming service delay puts your onward connecting train at risk using model-predicted ETA confidence windows.
          </p>
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleCalculate}
          className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-card"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase">
                Incoming Train Number
              </label>
              <Input
                value={incoming}
                onChange={(e) => setIncoming(e.target.value)}
                placeholder="e.g. 12951"
                className="mt-1.5 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase">
                Transfer Junction Station
              </label>
              <Input
                value={station}
                onChange={(e) => setStation(e.target.value)}
                placeholder="e.g. NDLS"
                className="mt-1.5 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase">
                Connecting Train Number
              </label>
              <Input
                value={connecting}
                onChange={(e) => setConnecting(e.target.value)}
                placeholder="e.g. 12001"
                className="mt-1.5 font-mono"
              />
            </div>
          </div>
          <Button type="submit" disabled={loading} className="mt-5 w-full h-11 rounded-xl font-semibold gap-2">
            <Clock className="size-4" /> {loading ? "Analyzing transfer..." : "Calculate Transfer Margin"}
          </Button>
        </form>

        {/* Results view */}
        {result && (
          <div className="mt-8 space-y-6 animate-in fade-in duration-300">
            {/* Feasibility Alert Banner */}
            <div
              className={`rounded-3xl border p-6 shadow-card ${
                result.transferFeasibility === "SAFE"
                  ? "border-rail-live/40 bg-rail-live/10"
                  : result.transferFeasibility === "RISKY"
                    ? "border-rail-late/40 bg-rail-late/10"
                    : "border-rail-alert/40 bg-rail-alert/10"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex size-12 items-center justify-center rounded-2xl ${
                      result.transferFeasibility === "SAFE"
                        ? "bg-rail-live text-white"
                        : result.transferFeasibility === "RISKY"
                          ? "bg-rail-late text-white"
                          : "bg-rail-alert text-white"
                    }`}
                  >
                    {result.transferFeasibility === "SAFE" ? (
                      <ShieldCheck className="size-6" />
                    ) : result.transferFeasibility === "RISKY" ? (
                      <AlertTriangle className="size-6" />
                    ) : (
                      <ShieldAlert className="size-6" />
                    )}
                  </span>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Transfer Status
                    </span>
                    <h2 className="text-2xl font-bold">
                      {result.transferFeasibility === "SAFE"
                        ? "Safe Connection"
                        : result.transferFeasibility === "RISKY"
                          ? "Tight Connection Warning"
                          : "Missed Connection Expected"}
                    </h2>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-muted-foreground">Effective Buffer</span>
                  <p className="text-2xl font-mono font-bold">
                    {result.effectiveBufferMinutes} min
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm font-medium">{result.recommendation}</p>
            </div>

            {/* Timings comparison grid */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                  <TrainFront className="size-4 text-primary" />
                  <span>INCOMING SERVICE</span>
                </div>
                <h3 className="mt-2 text-lg font-bold">
                  {result.incomingTrain.number} {result.incomingTrain.name}
                </h3>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Scheduled Arrival</span>
                    <span className="font-mono line-through text-muted-foreground">
                      {result.incomingTrain.scheduledArrival}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Model Predicted Arrival</span>
                    <span className="font-mono font-bold text-primary">
                      {result.incomingTrain.predictedArrival}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Confidence Window</span>
                    <span className="font-mono text-xs">
                      {result.incomingTrain.forecastWindow.lower} – {result.incomingTrain.forecastWindow.upper}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                  <TrainFront className="size-4 text-accent" />
                  <span>CONNECTING ONWARD SERVICE</span>
                </div>
                <h3 className="mt-2 text-lg font-bold">
                  {result.connectingTrain.number} {result.connectingTrain.name}
                </h3>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Scheduled Departure</span>
                    <span className="font-mono font-bold">
                      {result.connectingTrain.scheduledDeparture}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Departing Platform</span>
                    <span className="font-semibold">Platform {result.connectingTrain.platform}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Scheduled Buffer</span>
                    <span className="font-mono">{result.bufferMinutes} min</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Alternative connecting services */}
            {result.alternativeTrains.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <h3 className="text-sm font-bold">Alternative Departures from {result.transferStation.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Subsequent services available in case of transfer delay.
                </p>
                <div className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border">
                  {result.alternativeTrains.map((alt) => (
                    <div key={alt.number} className="flex items-center justify-between p-3 text-sm">
                      <div>
                        <p className="font-semibold">
                          <span className="text-muted-foreground">{alt.number}</span> {alt.name}
                        </p>
                        <p className="text-xs text-muted-foreground">Departs at {alt.departure}</p>
                      </div>
                      <Link
                        to="/train/$number"
                        params={{ number: alt.number }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                      >
                        View Train <ArrowRight className="size-3" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <SiteFooter />
      <Toaster />
    </div>
  );
}
