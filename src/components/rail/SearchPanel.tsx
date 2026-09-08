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
  Clock,
  TrainFront,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { findTrains, trainRoutes } from "@/data/trains";
import { stationMap } from "@/data/generated/stations";
import { useTranslation } from "@/lib/i18n";
import { fmtMinutes, getHaltPlatform, computeLiveStatus } from "@/lib/liveStatus";
import { useLiveClock } from "./useLiveClock";

export function SearchPanel() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const now = useLiveClock(5000);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [train, setTrain] = useState("");
  const [focusedInput, setFocusedInput] = useState<"from" | "to" | null>(null);

  const trainSuggestions = useMemo(
    () => (train.trim() ? findTrains(train).slice(0, 5) : []),
    [train],
  );

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
    return trainRoutes
      .map((r) => {
        const fi = r.halts.findIndex(
          (s) => s.code.toLowerCase() === f || s.name.toLowerCase().includes(f),
        );
        const ti = r.halts.findIndex(
          (s) => s.code.toLowerCase() === t || s.name.toLowerCase().includes(t),
        );
        if (fi === -1 || ti === -1 || fi >= ti) return null;
        const fromHalt = r.halts[fi]!;
        const toHalt = r.halts[ti]!;
        const depMinutes = r.startsAt + fromHalt.dep;
        const arrMinutes = r.startsAt + toHalt.arr;
        const durationMin = Math.max(1, toHalt.arr - fromHalt.dep);
        const hours = Math.floor(durationMin / 60);
        const mins = durationMin % 60;
        const durationStr = `${hours}h ${mins > 0 ? `${mins}m` : ""}`.trim();
        const distanceKm = Math.max(0, toHalt.km - fromHalt.km);
        const platform = getHaltPlatform(r.number, fromHalt.code, fromHalt.platform);
        const live = now ? computeLiveStatus(r, now) : null;
        const delay = live?.forecast?.delayMin ?? live?.delay ?? 0;

        return {
          route: r,
          fromHalt,
          toHalt,
          depTime: fmtMinutes(depMinutes),
          arrTime: fmtMinutes(arrMinutes),
          durationStr,
          distanceKm,
          platform,
          live,
          delay,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [from, to, now]);

  const [showBetween, setShowBetween] = useState(false);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSearchBetween = () => {
    if (!from.trim() || !to.trim()) {
      toast.error(t("search.enterBothStations"));
      return;
    }
    setShowBetween(true);
  };

  const track = () => {
    const match = findTrains(train)[0];
    if (!match) {
      toast.error(t("search.noTrainMatch"));
      return;
    }
    navigate({ to: "/train/$number", params: { number: match.number } });
  };

  return (
    <div className="space-y-4">
      {/* Live train status search */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <div className="flex items-center gap-2 border-b border-border bg-subtle-gradient px-4 py-3">
          <Radar className="size-4 text-primary" />
          <p className="text-sm font-semibold">{t("search.liveTrainStatus")}</p>
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
              placeholder={t("search.trainPlaceholder")}
              className="h-11"
            />
            <Button
              type="submit"
              size="icon"
              className="size-11 shrink-0 rounded-xl"
              aria-label={t("search.trackTrain")}
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

      {/* Trains between stations */}
      <div
        id="between"
        className="overflow-hidden rounded-2xl border border-border bg-card shadow-card"
      >
        <div className="flex items-center gap-2 border-b border-border bg-subtle-gradient px-4 py-3">
          <ArrowRight className="size-4 text-accent" />
          <p className="text-sm font-semibold">{t("search.trainsBetween")}</p>
        </div>
        <form
          className="relative space-y-2 p-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearchBetween();
          }}
        >
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
                placeholder={t("search.fromStation")}
                className="h-11 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={t("search.swapStations")}
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
                      className="flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-xs hover:bg-secondary cursor-pointer"
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
                placeholder={t("search.toStation")}
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
                      className="flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-xs hover:bg-secondary cursor-pointer"
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
            type="submit"
            className="mt-2 h-12 w-full rounded-xl text-base font-semibold cursor-pointer"
          >
            {t("search.viewTrains")} <ArrowRight className="size-4" />
          </Button>

          {showBetween && (
            <ul className="mt-3 space-y-2 border-t border-border pt-3">
              {between.length === 0 && (
                <li className="px-2 py-3 text-center text-xs text-muted-foreground">
                  {t("search.noDirectService")}
                </li>
              )}
              {between.map(
                ({
                  route: r,
                  fromHalt,
                  toHalt,
                  depTime,
                  arrTime,
                  durationStr,
                  distanceKm,
                  platform,
                  live,
                  delay,
                }) => {
                  const isRunning = live?.state === "running" || live?.state === "halted";
                  const isDelayed = delay > 5;
                  return (
                    <li key={r.number}>
                      <Link
                        to="/train/$number"
                        params={{ number: r.number }}
                        className="group flex flex-col gap-2 rounded-xl border border-border bg-card p-3 text-sm shadow-xs transition-all hover:border-primary/50 hover:bg-secondary/40 hover:shadow-card cursor-pointer"
                      >
                        {/* Train Header */}
                        <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                              <TrainFront className="size-3.5" />
                            </span>
                            <div className="truncate">
                              <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                                {r.name}
                              </span>{" "}
                              <span className="font-mono text-xs text-muted-foreground">
                                ({r.number})
                              </span>
                            </div>
                          </div>

                          {/* Live Status Pill */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            {isRunning ? (
                              <span
                                className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                                  isDelayed
                                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                                    : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                }`}
                              >
                                <span
                                  className={`size-1.5 rounded-full ${
                                    isDelayed ? "bg-amber-500" : "bg-emerald-500"
                                  } animate-pulse`}
                                />
                                {isDelayed ? `+${Math.round(delay)}m` : "On Time"}
                              </span>
                            ) : (
                              <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                                {r.type.toUpperCase()}
                              </span>
                            )}
                            <ChevronRight className="size-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>

                        {/* Journey Schedule Strip */}
                        <div className="flex items-center justify-between text-xs pt-0.5">
                          {/* Origin Dep */}
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1">
                              <span className="font-bold font-mono text-foreground text-sm">
                                {depTime}
                              </span>
                              <span className="rounded-sm bg-primary/10 px-1 py-0.2 text-[9px] font-bold text-primary font-mono">
                                PF {platform}
                              </span>
                            </div>
                            <p className="font-semibold text-[11px] text-muted-foreground">
                              {fromHalt.code}
                            </p>
                          </div>

                          {/* Mid Journey Indicator */}
                          <div className="flex flex-col items-center px-2">
                            <span className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1">
                              <Clock className="size-2.5" />
                              {durationStr}
                            </span>
                            <div className="relative flex items-center justify-center w-20 sm:w-28 my-0.5">
                              <div className="h-px w-full bg-border" />
                              <ArrowRight className="absolute right-0 size-3 text-muted-foreground" />
                            </div>
                            {distanceKm > 0 && (
                              <span className="text-[9px] text-muted-foreground font-mono">
                                {distanceKm} km
                              </span>
                            )}
                          </div>

                          {/* Destination Arr */}
                          <div className="space-y-0.5 text-right">
                            <span className="font-bold font-mono text-foreground text-sm">
                              {arrTime}
                            </span>
                            <p className="font-semibold text-[11px] text-muted-foreground">
                              {toHalt.code}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                },
              )}
            </ul>
          )}
        </form>
      </div>

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
            <p className="text-sm font-semibold">{t("search.liveNetworkMap")}</p>
            <p className="text-xs text-muted-foreground">{t("search.liveNetworkMapSub")}</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
          {t("search.open")} <ArrowRight className="size-4" />
        </span>
      </Link>

      {/* Quick services */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <p className="border-b border-border bg-subtle-gradient px-4 py-3 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          {t("search.quickServices")}
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
                <span className="block text-sm font-semibold">{t("search.pnrTitle")}</span>
                <span className="block text-xs text-muted-foreground">{t("search.pnrSub")}</span>
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
                <span className="block text-sm font-semibold">{t("search.connectingTitle")}</span>
                <span className="block text-xs text-muted-foreground">
                  {t("search.connectingSub")}
                </span>
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
                <span className="block text-sm font-semibold">{t("search.stationBoardTitle")}</span>
                <span className="block text-xs text-muted-foreground">
                  {t("search.stationBoardSub")}
                </span>
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
                <span className="block text-sm font-semibold">{t("search.developerApiTitle")}</span>
                <span className="block text-xs text-muted-foreground">
                  {t("search.developerApiSub")}
                </span>
              </span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
