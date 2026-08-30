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
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { quickServices } from "@/data/rail";
import { findTrains, trainRoutes } from "@/data/trains";

const icons = {
  board: LayoutList,
  seat: Armchair,
};

export function SearchPanel() {
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [train, setTrain] = useState("");

  const suggestions = useMemo(() => (train.trim() ? findTrains(train).slice(0, 5) : []), [train]);

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
      toast("No train matches that number or name");
      return;
    }
    navigate({ to: "/train/$number", params: { number: match.number } });
  };

  return (
    <div className="space-y-4">
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
            <p className="text-xs text-muted-foreground">Real-time positions across the network</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
          Open <ArrowRight className="size-4" />
        </span>
      </Link>

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
          <div className="flex items-center gap-3">
            <span className="size-2.5 rounded-full ring-3 ring-accent/30 bg-accent" />
            <Input
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="From station (e.g. NDLS)"
              className="h-11 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0"
            />
            <Button
              variant="outline"
              size="icon"
              aria-label="Swap stations"
              className="rounded-full"
              onClick={swap}
            >
              <ArrowUpDown className="size-4" />
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <span className="size-2.5 rounded-full ring-3 ring-primary/25 bg-primary" />
            <Input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="To station (e.g. KOTA)"
              className="h-11 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0"
            />
          </div>
          <Button
            className="mt-2 h-12 w-full rounded-xl text-base"
            onClick={() => {
              if (!from || !to) {
                toast("Enter both stations to search");
                return;
              }
              setShowBetween(true);
            }}
          >
            View trains <ArrowRight className="size-4" />
          </Button>

          {showBetween && (
            <ul className="mt-1 space-y-1">
              {between.length === 0 && (
                <li className="px-1 py-2 text-xs text-muted-foreground">
                  No direct service found on this pair.
                </li>
              )}
              {between.map((r) => (
                <li key={r.number}>
                  <Link
                    to="/train/$number"
                    params={{ number: r.number }}
                    className="flex items-center justify-between rounded-lg px-2 py-2 text-sm transition-colors hover:bg-secondary/60"
                  >
                    <span>
                      <span className="text-muted-foreground">{r.number}</span> {r.name}
                    </span>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

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
              placeholder="Train number or name"
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

          {suggestions.length > 0 && (
            <ul className="mt-2 space-y-1">
              {suggestions.map((s) => (
                <li key={s.number}>
                  <Link
                    to="/train/$number"
                    params={{ number: s.number }}
                    className="flex items-center justify-between rounded-lg px-2 py-2 text-sm transition-colors hover:bg-secondary/60"
                  >
                    <span>
                      <span className="text-muted-foreground">{s.number}</span> {s.name}
                    </span>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <p className="border-b border-border bg-subtle-gradient px-4 py-3 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          Quick services
        </p>
        <ul className="divide-y divide-border">
          {quickServices.map((s) => {
            const Icon = icons[s.icon];
            return (
              <li key={s.title}>
                <button
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-secondary/60"
                  onClick={() => toast(`${s.title} is coming soon`)}
                >
                  <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="size-4" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold">{s.title}</span>
                    <span className="block text-xs text-muted-foreground">{s.description}</span>
                  </span>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
