import { useMemo, useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpDown,
  Radar,
  LayoutList,
  Armchair,
  ChevronRight,
  Search,
  FileText,
  Code2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { findTrains, trainRoutes } from "@/data/trains";
import { stationMap } from "@/data/generated/stations";

export function SearchPanel() {
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [train, setTrain] = useState("");
  const [focusedInput, setFocusedInput] = useState<"from" | "to" | null>(null);

  const trainSuggestions = useMemo(() => (train.trim() ? findTrains(train).slice(0, 5) : []), [train]);

  const fromSuggestions = useMemo(() => {
    const q = from.trim().toUpperCase();
    if (!q || q.length < 1) return [];
    return Object.entries(stationMap)
      .filter(([code, info]) => code.includes(q) || info.name.toUpperCase().includes(q))
      .slice(0, 4);
  }, [from]);

  const toSuggestions = useMemo(() => {
    const q = to.trim().toUpperCase();
    if (!q || q.length < 1) return [];
    return Object.entries(stationMap)
      .filter(([code, info]) => code.includes(q) || info.name.toUpperCase().includes(q))
      .slice(0, 4);
  }, [to]);

  const between = useMemo(() => {
    const f = from.trim().toLowerCase();
    const t = to.trim().toLowerCase();
    if (!f || !t) return [];
    return trainRoutes.filter((r) => {
      const fi = r.halts.findIndex(
        (s) => s.code.toLowerCase() === f || s.name.toLowerCase().includes(f),
      );
      const ti = r.halts.findIndex(
        (s) => s.code.toLowerCase() === t || s.name.toLowerCase().includes(t),
      );
      return fi !== -1 && ti !== -1 && fi < ti;
    });
  }, [from, to]);

  const [showBetween, setShowBetween] = useState(false);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const track = () => {
    const match = findTrains(train)[0];
    if (!match) {
      toast.error("No train matches that number or name");
      return;
    }
    navigate({ to: "/train/$number", params: { number: match.number } });
  };

  return (
    <div className="space-y-4">
      {/* Live map link banner */}
      <Link
        to="/network"
        className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-card transition-colors hover:bg-secondary/40"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-hero-gradient text-primary-foreground">
            <Radar className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">Live network map</p>
            <p className="text-xs text-muted-foreground">Real-time GPS positions across Indian Railways</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
          Open <ArrowRight className="size-4" />
        </span>
      </Link>

      {/* Trains between stations */}
      <div
        id="between"
        className="overflow-hidden rounded-2xl border border-border bg-card shadow-card"
      >
        <div className="flex items-center gap-2 border-b border-border bg-subtle-gradient px-4 py-3">
          <ArrowRight className="size-4 text-accent" />
          <p className="text-sm font-semibold">Trains between stations</p>
        </div>
        <div className="relative space-y-2 p-4">
          <div className="absolute left-8 top-11 h-8 w-px bg-border" />
          
          {/* FROM input */}
          <div className="relative">
            <div className="flex items-center gap-3">
              <span className="size-2.5 rounded-full ring-3 ring-accent/30 bg-accent shrink-0" />
              <Input
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  setShowBetween(false);
                }}
                onFocus={() => setFocusedInput("from")}
                onBlur={() => setTimeout(() => setFocusedInput(null), 200)}
                placeholder="From station (e.g. NDLS)"
                className="h-11 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0"
              />
              <Button
                variant="outline"
                size="icon"
                aria-label="Swap stations"
                className="rounded-full shrink-0"
                onClick={swap}
              >
                <ArrowUpDown className="size-4" />
              </Button>
            </div>
            {focusedInput === "from" && fromSuggestions.length > 0 && (
              <ul className="absolute top-full left-6 right-0 z-20 mt-1 rounded-xl border border-border bg-card p-1 shadow-float">
                {fromSuggestions.map(([code, info]) => (
                  <li key={code}>
                    <button
                      type="button"
                      onMouseDown={() => {
                        setFrom(code);
                        setFocusedInput(null);
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-xs hover:bg-secondary"
                    >
                      <span className="font-semibold text-foreground">{info.name}</span>
                      <span className="font-mono text-muted-foreground">({code})</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* TO input */}
          <div className="relative">
            <div className="flex items-center gap-3">
              <span className="size-2.5 rounded-full ring-3 ring-primary/25 bg-primary shrink-0" />
              <Input
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  setShowBetween(false);
                }}
                onFocus={() => setFocusedInput("to")}
                onBlur={() => setTimeout(() => setFocusedInput(null), 200)}
                placeholder="To station (e.g. KOTA)"
                className="h-11 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0"
              />
            </div>
            {focusedInput === "to" && toSuggestions.length > 0 && (
              <ul className="absolute top-full left-6 right-0 z-20 mt-1 rounded-xl border border-border bg-card p-1 shadow-float">
                {toSuggestions.map(([code, info]) => (
                  <li key={code}>
                    <button
                      type="button"
                      onMouseDown={() => {
                        setTo(code);
                        setFocusedInput(null);
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-xs hover:bg-secondary"
                    >
                      <span className="font-semibold text-foreground">{info.name}</span>
                      <span className="font-mono text-muted-foreground">({code})</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Button
            className="mt-2 h-12 w-full rounded-xl text-base font-semibold"
            onClick={() => {
              if (!from.trim() || !to.trim()) {
                toast.error("Enter both stations to search");
                return;
              }
              setShowBetween(true);
            }}
          >
            View trains <ArrowRight className="size-4" />
          </Button>

          {showBetween && (
            <ul className="mt-2 space-y-1.5 border-t border-border pt-3">
              {between.length === 0 && (
                <li className="px-2 py-3 text-center text-xs text-muted-foreground">
                  No direct service found on this pair.
                </li>
              )}
              {between.map((r) => (
                <li key={r.number}>
                  <Link
                    to="/train/$number"
                    params={{ number: r.number }}
                    className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 px-3 py-2.5 text-sm transition-colors hover:bg-secondary"
                  >
                    <span>
                      <span className="font-semibold text-foreground">{r.name}</span>{" "}
                      <span className="font-mono text-xs text-muted-foreground">({r.number})</span>
                    </span>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Live train status search */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <div className="flex items-center gap-2 border-b border-border bg-subtle-gradient px-4 py-3">
          <Radar className="size-4 text-primary" />
          <p className="text-sm font-semibold">Live train status</p>
        </div>
        <div className="p-4">
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              track();
            }}
          >
            <Input
              value={train}
              onChange={(e) => setTrain(e.target.value)}
              placeholder="Train number or name (e.g. 12951)"
              className="h-11"
            />
            <Button
              type="submit"
              size="icon"
              className="size-11 shrink-0 rounded-xl"
              aria-label="Track train"
            >
              <Search className="size-4" />
            </Button>
          </form>

          {trainSuggestions.length > 0 && (
            <ul className="mt-2 space-y-1">
              {trainSuggestions.map((s) => (
                <li key={s.number}>
                  <Link
                    to="/train/$number"
                    params={{ number: s.number }}
                    className="flex items-center justify-between rounded-lg px-2 py-2 text-sm transition-colors hover:bg-secondary/60"
                  >
                    <span>
                      <span className="text-muted-foreground font-mono">{s.number}</span> {s.name}
                    </span>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Quick services */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <p className="border-b border-border bg-subtle-gradient px-4 py-3 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          Quick services & tools
        </p>
        <ul className="divide-y divide-border">
          <li>
            <Link
              to="/pnr"
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-secondary/60 cursor-pointer"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-primary">
                <FileText className="size-4" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold">PNR Status Check</span>
                <span className="block text-xs text-muted-foreground">Verify coach, berth, and charting status</span>
              </span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </Link>
          </li>
          <li>
            <Link
              to="/connecting-impact"
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-secondary/60 cursor-pointer"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-primary">
                <Armchair className="size-4" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold">Connecting Impact</span>
                <span className="block text-xs text-muted-foreground">Calculate transfer risk at junction stations</span>
              </span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </Link>
          </li>
          <li>
            <Link
              to="/station/$code"
              params={{ code: "NDLS" }}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-secondary/60 cursor-pointer"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-primary">
                <LayoutList className="size-4" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold">Live Station Board</span>
                <span className="block text-xs text-muted-foreground">Arrivals, departures, and platform assignments</span>
              </span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </Link>
          </li>
          <li>
            <Link
              to="/developer"
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-secondary/60 cursor-pointer"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-primary">
                <Code2 className="size-4" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold">Developer REST API</span>
                <span className="block text-xs text-muted-foreground">Live API sandbox, OpenAPI docs, and SDK snippets</span>
              </span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
