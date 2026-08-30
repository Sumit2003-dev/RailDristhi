import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Search,
  TrainFront,
  ArrowRight,
  User,
  CheckCircle2,
  Calendar,
  CreditCard,
  MapPin,
  Clock,
  Gauge,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/rail/SiteHeader";
import { SiteFooter } from "@/components/rail/Sections";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import type { PnrStatus } from "@/server/services/railBackend";

export const Route = createFileRoute("/pnr")({
  component: PnrStatusPage,
  head: () => ({
    meta: [
      { title: "Live PNR Status & Coach Position | RailDristhi" },
      {
        name: "description",
        content:
          "Check real-time Indian Railways PNR status, coach and berth allocations, chart preparation state, and live train location.",
      },
    ],
  }),
});

const SAMPLE_PNRS = ["8421950247", "4920194821", "6730192845", "9120485721"];

function PnrStatusPage() {
  const [pnrInput, setPnrInput] = useState("8421950247");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PnrStatus | null>(null);

  const fetchPnr = async (pnrToFetch: string) => {
    const cleaned = pnrToFetch.replace(/\D/g, "");
    if (cleaned.length !== 10) {
      toast.error("Please enter a valid 10-digit numeric PNR number");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/pnr/${cleaned}`);
      const data = await res.json();
      if (data.error || !data.data) {
        toast.error(data.message || "PNR record not found");
        setResult(null);
      } else {
        setResult(data.data);
        toast.success(`PNR ${cleaned} status fetched successfully`);
      }
    } catch {
      toast.error("Failed to query PNR service");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPnr(pnrInput);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" /> Instant Confirmation & Coach Locator
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Live PNR Status Check
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Get instant verification for Indian Railways ticket status, confirmed coach and berth
            assignments, and real-time train running updates.
          </p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="mt-8 mx-auto max-w-xl">
          <div className="relative flex items-center rounded-2xl border border-border bg-card p-2 shadow-float">
            <Input
              value={pnrInput}
              onChange={(e) => setPnrInput(e.target.value)}
              maxLength={10}
              placeholder="Enter 10-digit PNR Number (e.g. 8421950247)"
              className="h-12 border-0 bg-transparent px-4 font-mono text-base tracking-wider shadow-none focus-visible:ring-0"
            />
            <Button
              type="submit"
              disabled={loading}
              className="h-12 rounded-xl px-6 font-semibold gap-2"
            >
              <Search className="size-4" /> {loading ? "Checking…" : "Check Status"}
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>Try sample PNRs:</span>
            {SAMPLE_PNRS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setPnrInput(p);
                  fetchPnr(p);
                }}
                className="rounded-md border border-border bg-secondary/60 px-2 py-1 font-mono hover:bg-secondary hover:text-foreground"
              >
                {p}
              </button>
            ))}
          </div>
        </form>

        {/* Result Card */}
        {result && (
          <div className="mt-10 space-y-6 animate-in fade-in duration-300">
            {/* Ticket Card */}
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-subtle-gradient p-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <TrainFront className="size-4 text-primary" />
                    <span>TRAIN DETAILS</span>
                  </div>
                  <h2 className="mt-1 text-2xl font-bold">
                    <span className="text-muted-foreground">{result.trainNumber}</span>{" "}
                    {result.trainName}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Class:{" "}
                    <span className="font-semibold text-foreground">{result.bookingClass}</span> ·
                    Quota: <span className="font-semibold text-foreground">{result.quota}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-rail-live/15 px-3 py-1 text-xs font-semibold text-rail-live">
                    <CheckCircle2 className="size-3.5" /> {result.chartStatus}
                  </span>
                  <p className="mt-1 text-xs text-muted-foreground">PNR: {result.pnr}</p>
                </div>
              </div>

              {/* Journey Route Details */}
              <div className="grid gap-6 border-b border-border p-6 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">FROM</p>
                  <p className="mt-1 text-lg font-bold">
                    {result.fromStation.name} ({result.fromStation.code})
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Calendar className="size-3.5" /> {result.journeyDate}
                  </span>
                  <div className="mt-1 flex w-full items-center gap-2 text-muted-foreground">
                    <div className="h-px flex-1 bg-border" />
                    <ArrowRight className="size-4 text-primary" />
                    <div className="h-px flex-1 bg-border" />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-muted-foreground">DESTINATION</p>
                  <p className="mt-1 text-lg font-bold">
                    {result.toStation.name} ({result.toStation.code})
                  </p>
                </div>
              </div>

              {/* Passenger List */}
              <div className="p-6">
                <h3 className="text-sm font-bold text-foreground">Passenger Details</h3>
                <div className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border">
                  {result.passengers.map((p) => (
                    <div
                      key={p.number}
                      className="flex flex-wrap items-center justify-between gap-4 bg-card px-5 py-4 hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-primary">
                          #{p.number}
                        </span>
                        <div>
                          <p className="text-sm font-semibold">Passenger {p.number}</p>
                          <p className="text-xs text-muted-foreground">
                            Booking: <span className="font-mono">{p.bookingStatus}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <span className="inline-block rounded-md bg-rail-live/15 px-2.5 py-0.5 text-xs font-bold text-rail-live">
                            {p.currentStatus}
                          </span>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Coach <span className="font-semibold text-foreground">{p.coach}</span> ·
                            Berth <span className="font-semibold text-foreground">{p.berth}</span> (
                            {p.berthType})
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Running Feed link */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border bg-secondary/40 px-6 py-4">
                <div className="flex items-center gap-4 text-xs">
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <Gauge className="size-3.5" /> Speed: {result.liveStatus.speed} km/h
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="size-3.5" /> Next: {result.liveStatus.nextStation} (ETA{" "}
                    {result.liveStatus.eta})
                  </span>
                </div>
                <Link
                  to="/train/$number"
                  params={{ number: result.trainNumber }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  Track live GPS on map <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
      <Toaster />
    </div>
  );
}
