import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  TrainFront,
  Calendar,
  Layers,
  RotateCw,
  Edit2,
  Radio,
  Satellite,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DelayReasonTag } from "./DelayReasonTag";
import type { TrainRoute, Halt } from "@/data/trains";
import type { LiveStatus } from "@/lib/liveStatus";
import { fmtMinutes } from "@/lib/liveStatus";

interface TrainTrackTimelineProps {
  train: TrainRoute;
  status: LiveStatus | null;
  className?: string;
  isGpsActive?: boolean;
  isOnBoard?: boolean;
  onToggleGps?: () => void;
}

function format12Hour(totalMinutes: number): string {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  const period = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  const mStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${h12}:${mStr}${period}`;
}

function isMajorStation(halt: Halt, index: number, total: number, status: LiveStatus | null): boolean {
  if (index === 0 || index === total - 1) return true; // Origin & Destination
  if (status?.lastHalt.code === halt.code || status?.nextHalt?.code === halt.code) return true; // Live train halts

  const n = halt.name.toUpperCase();
  if (
    n.includes("JN") ||
    n.includes("JUNCTION") ||
    n.includes("CENT") ||
    n.includes("CANTT") ||
    n.includes("TERMINUS") ||
    n.includes("MUMBAI") ||
    n.includes("DELHI") ||
    n.includes("HOWRAH") ||
    n.includes("PATNA") ||
    n.includes("PUNE") ||
    n.includes("CHENNAI") ||
    n.includes("AHMEDABAD") ||
    n.includes("SURAT") ||
    n.includes("VADODARA") ||
    n.includes("KOTA") ||
    n.includes("BHOPAL") ||
    n.includes("DHANBAD") ||
    n.includes("KANPUR") ||
    n.includes("VARANASI")
  ) {
    return true;
  }
  if (halt.dep - halt.arr >= 4) return true;

  return false;
}

function getCoachComposition(type: string) {
  const t = type.toLowerCase();
  if (t.includes("rajdhani") || t.includes("duronto")) {
    return [
      { code: "LOCO", name: "Electric WAP-7 Engine", color: "bg-red-600 text-white" },
      { code: "EOG", name: "Generator Car", color: "bg-zinc-700 text-white" },
      { code: "H1", name: "First AC (1A)", color: "bg-amber-600 text-white" },
      { code: "A1", name: "AC 2-Tier (2A)", color: "bg-blue-600 text-white" },
      { code: "A2", name: "AC 2-Tier (2A)", color: "bg-blue-600 text-white" },
      { code: "PC", name: "Pantry Car", color: "bg-emerald-700 text-white" },
      { code: "B1", name: "AC 3-Tier (3A)", color: "bg-sky-600 text-white" },
      { code: "B2", name: "AC 3-Tier (3A)", color: "bg-sky-600 text-white" },
      { code: "B3", name: "AC 3-Tier (3A)", color: "bg-sky-600 text-white" },
      { code: "B4", name: "AC 3-Tier (3A)", color: "bg-sky-600 text-white" },
      { code: "B5", name: "AC 3-Tier (3A)", color: "bg-sky-600 text-white" },
      { code: "B6", name: "AC 3-Tier (3A)", color: "bg-sky-600 text-white" },
      { code: "EOG", name: "Generator Car", color: "bg-zinc-700 text-white" },
    ];
  }
  if (t.includes("shatabdi") || t.includes("vande")) {
    return [
      { code: "LOCO", name: "Loco / Driving Cab", color: "bg-red-600 text-white" },
      { code: "E1", name: "Executive Chair (EC)", color: "bg-purple-600 text-white" },
      { code: "C1", name: "AC Chair Car (CC)", color: "bg-blue-600 text-white" },
      { code: "C2", name: "AC Chair Car (CC)", color: "bg-blue-600 text-white" },
      { code: "C3", name: "AC Chair Car (CC)", color: "bg-blue-600 text-white" },
      { code: "C4", name: "AC Chair Car (CC)", color: "bg-blue-600 text-white" },
      { code: "C5", name: "AC Chair Car (CC)", color: "bg-blue-600 text-white" },
      { code: "EOG", name: "Generator Car", color: "bg-zinc-700 text-white" },
    ];
  }
  return [
    { code: "LOCO", name: "Locomotive WAP-4", color: "bg-red-600 text-white" },
    { code: "SLR", name: "Seating Cum Luggage", color: "bg-zinc-700 text-white" },
    { code: "GS", name: "General Unreserved", color: "bg-amber-700 text-white" },
    { code: "S1", name: "Sleeper Class (SL)", color: "bg-emerald-600 text-white" },
    { code: "S2", name: "Sleeper Class (SL)", color: "bg-emerald-600 text-white" },
    { code: "S3", name: "Sleeper Class (SL)", color: "bg-emerald-600 text-white" },
    { code: "S4", name: "Sleeper Class (SL)", color: "bg-emerald-600 text-white" },
    { code: "B1", name: "AC 3-Tier (3A)", color: "bg-sky-600 text-white" },
    { code: "B2", name: "AC 3-Tier (3A)", color: "bg-sky-600 text-white" },
    { code: "A1", name: "AC 2-Tier (2A)", color: "bg-blue-600 text-white" },
    { code: "GS", name: "General Unreserved", color: "bg-amber-700 text-white" },
    { code: "SLR", name: "Luggage / Guard", color: "bg-zinc-700 text-white" },
  ];
}

type TimelineItem =
  | { type: "station"; row: ReturnType<typeof getHaltRows>[number]; originalIdx: number }
  | {
      type: "intermediate-group";
      groupId: string;
      items: { row: ReturnType<typeof getHaltRows>[number]; originalIdx: number }[];
      isPassed: boolean;
      containsLiveTrain: boolean;
    };

function getHaltRows(train: TrainRoute, status: LiveStatus | null) {
  return (
    status?.haltStatus ??
    train.halts.map((halt) => ({
      halt,
      scheduled: fmtMinutes(train.startsAt + halt.arr),
      expected: "—",
      forecast: null,
      done: false,
      isNext: false,
    }))
  );
}

export function TrainTrackTimeline({
  train,
  status,
  className = "",
  isGpsActive = false,
  isOnBoard = false,
  onToggleGps,
}: TrainTrackTimelineProps) {
  const [refreshing, setRefreshing] = useState(false);
  const [showAllStations, setShowAllStations] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const coaches = getCoachComposition(train.type);
  const rows = getHaltRows(train, status);

  const isRunning = status ? status.speed > 0 && status.state === "running" : false;
  const isHalted = status ? status.state === "halted" : false;

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 400);
  };

  const todayStr = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  // Group stations into major stopping stations vs intermediate collapsible bundles
  const timelineItems = useMemo<TimelineItem[]>(() => {
    if (train.halts.length <= 7 || showAllStations) {
      return rows.map((row, idx) => ({ type: "station", row, originalIdx: idx }));
    }

    const items: TimelineItem[] = [];
    let currentIntermediate: { row: (typeof rows)[number]; originalIdx: number }[] = [];

    rows.forEach((row, idx) => {
      const isMajor = isMajorStation(row.halt, idx, rows.length, status);

      if (isMajor) {
        if (currentIntermediate.length > 0) {
          const groupId = `group-${currentIntermediate[0]!.originalIdx}-${idx}`;
          const isPassed = currentIntermediate.every((item) => item.row.done);
          const containsLiveTrain = currentIntermediate.some(
            (item) =>
              status?.lastHalt.code === item.row.halt.code ||
              status?.nextHalt?.code === item.row.halt.code,
          );
          items.push({
            type: "intermediate-group",
            groupId,
            items: currentIntermediate,
            isPassed,
            containsLiveTrain,
          });
          currentIntermediate = [];
        }
        items.push({ type: "station", row, originalIdx: idx });
      } else {
        currentIntermediate.push({ row, originalIdx: idx });
      }
    });

    if (currentIntermediate.length > 0) {
      const groupId = `group-${currentIntermediate[0]!.originalIdx}-end`;
      const isPassed = currentIntermediate.every((item) => item.row.done);
      const containsLiveTrain = currentIntermediate.some(
        (item) =>
          status?.lastHalt.code === item.row.halt.code ||
          status?.nextHalt?.code === item.row.halt.code,
      );
      items.push({
        type: "intermediate-group",
        groupId,
        items: currentIntermediate,
        isPassed,
        containsLiveTrain,
      });
    }

    return items;
  }, [train.halts.length, showAllStations, rows, status]);

  // Render a station row with clear visual distinction between main stations vs lighter sub-stations
  const renderStationRow = (
    row: (typeof rows)[number],
    idx: number,
    isIntermediate: boolean = false,
  ) => {
    const isOrigin = idx === 0;
    const isDestination = idx === rows.length - 1;

    const isLastHalt = status?.lastHalt.code === row.halt.code;
    const isNextHalt = status?.nextHalt?.code === row.halt.code;
    const isTrainHaltedHere = isHalted && isLastHalt;
    const showEnRouteAfterThis = isRunning && isLastHalt && status.nextHalt;

    const isRowPassed = row.done || (isLastHalt && isRunning);
    const isTopTraversed = row.done || isLastHalt;
    const isBottomTraversed = isRowPassed;

    // Day divider check
    const prevDay = idx > 0 ? rows[idx - 1]!.halt.day : 1;
    const currentDay = row.halt.day;
    const showDayDivider = currentDay > prevDay;

    // Timing calculations
    const schedArrMin = train.startsAt + row.halt.arr;
    const schedDepMin = train.startsAt + row.halt.dep;
    const schedArrTime = format12Hour(schedArrMin);
    const schedDepTime = format12Hour(schedDepMin);

    const delayMin = row.forecast?.delayMin ?? (isRowPassed ? 0 : status?.delay ?? 0);
    const predArrTime = format12Hour(schedArrMin + delayMin);
    const predDepTime = format12Hour(schedDepMin + delayMin);
    const isDelayed = delayMin > 2;

    return (
      <div key={row.halt.code} className="relative">
        {/* Day divider banner */}
        {showDayDivider && (
          <div className="relative flex items-center justify-center py-2.5 bg-secondary/60 border-y border-border">
            <div className="absolute left-[72px] sm:left-[92px] inset-y-0 w-[24px] pointer-events-none">
              <div
                className={`absolute left-[4px] inset-y-0 w-[2.5px] ${
                  isTopTraversed ? "bg-primary shadow-xs" : "bg-border"
                }`}
              />
              <div
                className={`absolute right-[4px] inset-y-0 w-[2.5px] ${
                  isTopTraversed ? "bg-primary shadow-xs" : "bg-border"
                }`}
              />
            </div>
            <span className="relative z-10 inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-0.5 text-[10px] font-bold text-primary shadow-xs">
              DAY {currentDay} • TOMORROW
            </span>
          </div>
        )}

        {/* Station Row — Lighter background & styling for sub-stations */}
        <div
          className={`grid grid-cols-[65px_minmax(0,1fr)_65px] sm:grid-cols-[85px_minmax(0,1fr)_85px] items-stretch ${
            isIntermediate
              ? "min-h-[48px] bg-secondary/10 hover:bg-secondary/25"
              : "min-h-[58px] hover:bg-secondary/20"
          } px-3 transition-colors ${
            isTrainHaltedHere ? "bg-secondary/60" : ""
          }`}
        >
          {/* 1. LEFT COLUMN: ARRIVAL (Lighter for sub-stations) */}
          <div className="flex flex-col justify-center text-left pl-1 py-2">
            {isOrigin ? (
              <span className="text-[11px] text-muted-foreground font-mono">—</span>
            ) : (
              <div>
                <span
                  className={`block font-mono ${
                    isIntermediate
                      ? "text-[10px] text-muted-foreground/80 font-medium"
                      : "text-[11px] font-semibold"
                  } ${
                    isDelayed ? "text-muted-foreground line-through" : isIntermediate ? "text-muted-foreground" : "text-foreground"
                  }`}
                >
                  {schedArrTime}
                </span>
                {isDelayed ? (
                  <span className="block font-mono text-[10px] font-bold text-rail-alert">
                    {predArrTime}
                  </span>
                ) : (
                  <span
                    className={`block font-mono ${
                      isIntermediate
                        ? "text-[8.5px] text-muted-foreground/60"
                        : "text-[9px] font-semibold text-rail-live"
                    }`}
                  >
                    {isIntermediate ? "Pass" : isRowPassed ? "Arr" : "On time"}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* 2. CENTER COLUMN: DUAL RAIL LADDER TRACK */}
          <div className="relative flex items-stretch gap-3 min-w-0">
            <div className="relative flex w-6 sm:w-7 shrink-0 items-center justify-center self-stretch">
              {/* Left Steel Rail */}
              {!isOrigin && (
                <div
                  className={`absolute left-[4px] top-0 bottom-1/2 w-[2.5px] ${
                    isTopTraversed ? "bg-primary shadow-xs" : "bg-border"
                  }`}
                />
              )}
              {!isDestination && (
                <div
                  className={`absolute left-[4px] top-1/2 bottom-0 w-[2.5px] ${
                    isBottomTraversed ? "bg-primary shadow-xs" : "bg-border"
                  }`}
                />
              )}

              {/* Right Steel Rail */}
              {!isOrigin && (
                <div
                  className={`absolute right-[4px] top-0 bottom-1/2 w-[2.5px] ${
                    isTopTraversed ? "bg-primary shadow-xs" : "bg-border"
                  }`}
                />
              )}
              {!isDestination && (
                <div
                  className={`absolute right-[4px] top-1/2 bottom-0 w-[2.5px] ${
                    isBottomTraversed ? "bg-primary shadow-xs" : "bg-border"
                  }`}
                />
              )}

              {/* Sleepers (Lighter & subtler for sub-stations) */}
              <div className="absolute inset-y-0 left-0 right-0 flex flex-col justify-between py-1.5 pointer-events-none">
                {[...Array(5)].map((_, sIdx) => {
                  const isSleeperTraversed = sIdx <= 2 ? isTopTraversed : isBottomTraversed;
                  return (
                    <div
                      key={sIdx}
                      className={`mx-auto ${
                        isIntermediate ? "h-[1.5px] w-[14px] opacity-40" : "h-[2px] w-[18px]"
                      } rounded-xs ${
                        isSleeperTraversed ? "bg-primary/50" : "bg-border"
                      }`}
                    />
                  );
                })}
              </div>

              {/* Active Train Engine Marker IF HALTED AT THIS STATION */}
              {isTrainHaltedHere && (
                <div className="relative z-20 flex size-6 sm:size-6.5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs ring-2 ring-primary/40">
                  <TrainFront className="size-3.5" />
                </div>
              )}
            </div>

            {/* Station Name & Metadata (Distinct Typography & Badges) */}
            <div className="flex flex-col justify-center min-w-0 flex-1 py-1.5 border-b border-border/30">
              <div className="flex items-center gap-1.5 truncate">
                <Link
                  to="/station/$code"
                  params={{ code: row.halt.code }}
                  className={`block transition-colors hover:underline truncate ${
                    isTrainHaltedHere
                      ? "text-primary text-sm font-extrabold"
                      : isNextHalt
                        ? "text-foreground text-sm font-bold"
                        : isIntermediate
                          ? "text-muted-foreground hover:text-foreground text-[11px] font-medium"
                          : "text-foreground text-xs hover:text-primary font-bold"
                  }`}
                >
                  {row.halt.name}
                </Link>

                {/* Sub-Station Indicator Badge */}
                {isIntermediate ? (
                  <span className="inline-flex items-center rounded-xs bg-secondary/80 border border-border/40 px-1 py-0.2 text-[7.5px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Pass
                  </span>
                ) : (
                  (isOrigin || isDestination) && (
                    <span className="inline-flex items-center rounded-xs bg-primary/10 border border-primary/20 px-1 py-0.2 text-[8px] font-bold text-primary uppercase">
                      {isOrigin ? "Origin" : "Dest"}
                    </span>
                  )
                )}
              </div>

              <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[9.5px] text-muted-foreground/80">
                <span className={`font-mono ${isIntermediate ? "text-muted-foreground/70" : "font-semibold text-foreground/80"}`}>
                  {row.halt.code}
                </span>
                <span>•</span>
                <span>{row.halt.km} km</span>
                {row.halt.platform && row.halt.platform !== "-" && (
                  <>
                    <span>•</span>
                    <span className="inline-flex items-center gap-0.5 rounded-md border border-border bg-secondary px-1 py-0.2 text-[8.5px] font-semibold text-secondary-foreground">
                      PF {row.halt.platform} <Edit2 className="size-2 opacity-50" />
                    </span>
                  </>
                )}
                {isTrainHaltedHere && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.2 text-[9px] font-bold text-amber-600 dark:text-amber-400">
                    Halted at Platform
                  </span>
                )}
                {!isRowPassed && row.forecast && row.forecast.delayMin > 2 && (
                  <DelayReasonTag reason={row.forecast.reason} />
                )}
              </div>
            </div>
          </div>

          {/* 3. RIGHT COLUMN: DEPARTURE (Lighter for sub-stations) */}
          <div className="flex flex-col justify-center text-right pr-1 py-2">
            {isDestination ? (
              <span className="text-[11px] text-muted-foreground font-mono">—</span>
            ) : (
              <div>
                <span
                  className={`block font-mono ${
                    isIntermediate
                      ? "text-[10px] text-muted-foreground/80 font-medium"
                      : "text-[11px] font-semibold"
                  } ${
                    isDelayed ? "text-muted-foreground line-through" : isIntermediate ? "text-muted-foreground" : "text-foreground"
                  }`}
                >
                  {schedDepTime}
                </span>
                {isDelayed ? (
                  <span className="block font-mono text-[10px] font-bold text-rail-alert">
                    {predDepTime}
                  </span>
                ) : (
                  <span
                    className={`block font-mono ${
                      isIntermediate
                        ? "text-[8.5px] text-muted-foreground/60"
                        : "text-[9px] font-semibold text-rail-live"
                    }`}
                  >
                    {isIntermediate ? "Pass" : isRowPassed ? "Dep" : "On time"}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 4. IN-BETWEEN EN ROUTE SEGMENT (WHEN ACTIVELY RUNNING) */}
        {showEnRouteAfterThis && (
          <div className="grid grid-cols-[65px_minmax(0,1fr)_65px] sm:grid-cols-[85px_minmax(0,1fr)_85px] items-stretch min-h-[56px] px-3 bg-primary/5 border-y border-primary/15">
            <div className="flex items-center justify-center text-center">
              <span className="font-mono text-[10px] text-primary/80 font-bold">
                {status.speed} km/h
              </span>
            </div>

            <div className="relative flex items-stretch gap-3 min-w-0">
              <div className="relative flex w-6 sm:w-7 shrink-0 items-center justify-center self-stretch">
                <div className="absolute left-[4px] top-0 bottom-1/2 w-[2.5px] bg-primary shadow-xs" />
                <div className="absolute left-[4px] top-1/2 bottom-0 w-[2.5px] bg-border" />
                <div className="absolute right-[4px] top-0 bottom-1/2 w-[2.5px] bg-primary shadow-xs" />
                <div className="absolute right-[4px] top-1/2 bottom-0 w-[2.5px] bg-border" />

                <div className="absolute inset-y-0 left-0 right-0 flex flex-col justify-between py-1.5 pointer-events-none">
                  {[...Array(5)].map((_, sIdx) => (
                    <div
                      key={sIdx}
                      className={`mx-auto h-[2px] w-[18px] rounded-xs ${
                        sIdx <= 2 ? "bg-primary/50" : "bg-border"
                      }`}
                    />
                  ))}
                </div>

                <div className="relative z-20 flex size-6 sm:size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-float ring-3 ring-primary/30">
                  <span className="absolute -inset-1 rounded-full bg-primary/35 animate-rail-pulse pointer-events-none" />
                  <span className="absolute -inset-2.5 rounded-full border border-primary/40 animate-ping opacity-75 pointer-events-none" />
                  <TrainFront className="relative z-10 size-3.5" />
                </div>
              </div>

              <div className="flex items-center min-w-0 flex-1 py-2">
                <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-primary/25 bg-card/90 px-3 py-1.5 shadow-xs">
                  <span className="flex size-2 rounded-full bg-primary animate-rail-pulse" />
                  <span className="font-bold text-primary text-xs">
                    En Route · {status.speed} km/h
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    ({Math.max(1, status.km - status.lastHalt.km)} km past {status.lastHalt.code} →{" "}
                    {Math.max(1, (status.nextHalt?.km ?? status.km) - status.km)} km to{" "}
                    {status.nextHalt?.code})
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center text-right pr-1">
              <span className="font-mono text-[10px] text-primary/80 font-bold">
                ETA {status.etaNext}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-card ${className}`}>
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-subtle-gradient px-4 py-3">
        <div className="flex items-center gap-2">
          <TrainFront className="size-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground tracking-tight">
            Journey · Station Sequence
          </h3>
          <span className="font-mono text-xs text-muted-foreground">
            ({train.number} {train.name})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Stops Filter Toggle */}
          {train.halts.length > 7 && (
            <button
              onClick={() => setShowAllStations(!showAllStations)}
              className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                showAllStations
                  ? "border-primary bg-primary text-primary-foreground shadow-xs"
                  : "border-border bg-secondary/80 text-secondary-foreground hover:bg-secondary"
              }`}
              title="Toggle between Major Stopping Stations and All Stations"
            >
              <SlidersHorizontal className="size-3" />
              <span>{showAllStations ? "All Stations" : "Stops Only"}</span>
            </button>
          )}

          {/* Today Button */}
          <button className="inline-flex items-center gap-1 rounded-xl border border-border bg-secondary/80 px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground transition-colors hover:bg-secondary">
            <Calendar className="size-3 text-primary" />
            <span>Today ▾</span>
          </button>

          {/* Coach Layout Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="inline-flex items-center gap-1 rounded-xl border border-border bg-secondary/80 px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground transition-colors hover:bg-secondary">
                <Layers className="size-3 text-primary" />
                <span>Coach</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[85vh] rounded-t-3xl border-t border-border bg-card text-card-foreground p-6">
              <SheetHeader className="text-left">
                <SheetTitle className="text-lg font-bold flex items-center gap-2">
                  <TrainFront className="size-5 text-primary" />
                  Coach Position & Rake Layout — {train.number} {train.name}
                </SheetTitle>
                <p className="text-xs text-muted-foreground">
                  Typical rake composition from engine to rear brake van. Platform coach displays may vary by station.
                </p>
              </SheetHeader>
              <div className="mt-6 overflow-x-auto pb-4">
                <div className="flex min-w-max items-center gap-2 py-2">
                  {coaches.map((c, idx) => (
                    <div
                      key={idx}
                      className={`flex h-18 w-22 flex-col items-center justify-center rounded-xl p-2 text-center shadow-md ${c.color}`}
                    >
                      <span className="font-mono text-sm font-extrabold">{c.code}</span>
                      <span className="text-[10px] opacity-90 truncate max-w-full">{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* GPS Active Announcement Bar */}
      {isGpsActive && (
        <div className="flex items-center justify-between gap-2 border-b border-primary/20 bg-primary/10 px-4 py-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-primary animate-rail-pulse" />
            <span className="font-semibold text-primary">
              {isOnBoard ? "On-Board Live GPS Tracking Active" : "GPS Sensor Active (Proximity Synced)"}
            </span>
          </div>
          <span className="font-mono text-[11px] text-muted-foreground">
            Live satellite sync
          </span>
        </div>
      )}

      {/* Table Headers: ARRIVAL | DAY 1 • DATE | DEPARTURE */}
      <div className="grid grid-cols-[65px_minmax(0,1fr)_65px] sm:grid-cols-[85px_minmax(0,1fr)_85px] items-center border-b border-border bg-secondary/30 px-3 py-2 text-center text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
        <div className="text-left pl-1">ARRIVAL</div>
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-0.5 text-[9px] font-semibold text-foreground shadow-xs">
            DAY 1 • {todayStr.toUpperCase()}
          </span>
        </div>
        <div className="text-right pr-1">DEPARTURE</div>
      </div>

      {/* Timeline track body with light distinction for sub-stations */}
      <div className="py-0">
        {timelineItems.map((item) => {
          if (item.type === "station") {
            return renderStationRow(item.row, item.originalIdx, false);
          }

          // Intermediate Collapsible Group
          const isExpanded = expandedGroups[item.groupId] ?? item.containsLiveTrain;
          const count = item.items.length;
          const startKm = item.items[0]!.row.halt.km;
          const endKm = item.items[count - 1]!.row.halt.km;
          const distanceDiff = endKm - startKm;

          if (isExpanded) {
            // When expanded: Render lighter sub-stations with seamless rail continuity
            return (
              <div key={item.groupId} className="relative">
                {item.items.map((subItem) =>
                  renderStationRow(subItem.row, subItem.originalIdx, true),
                )}
                {/* Collapse Bar */}
                <div className="grid grid-cols-[65px_minmax(0,1fr)_65px] sm:grid-cols-[85px_minmax(0,1fr)_85px] items-stretch min-h-[34px] px-3 bg-secondary/15 border-b border-border/30">
                  <div />
                  <div className="relative flex items-stretch gap-3 min-w-0">
                    <div className="relative flex w-6 sm:w-7 shrink-0 items-center justify-center self-stretch">
                      <div
                        className={`absolute left-[4px] inset-y-0 w-[2.5px] ${
                          item.isPassed ? "bg-primary shadow-xs" : "bg-border"
                        }`}
                      />
                      <div
                        className={`absolute right-[4px] inset-y-0 w-[2.5px] ${
                          item.isPassed ? "bg-primary shadow-xs" : "bg-border"
                        }`}
                      />
                    </div>
                    <div className="flex items-center min-w-0 flex-1 py-1">
                      <button
                        onClick={() => toggleGroup(item.groupId)}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold text-primary hover:bg-secondary/60 transition-colors cursor-pointer"
                      >
                        <ChevronUp className="size-3" />
                        <span>Hide {count} in-between stations</span>
                      </button>
                    </div>
                  </div>
                  <div />
                </div>
              </div>
            );
          }

          // When collapsed: Render the single trigger row with aligned dual rails & sleepers
          return (
            <div key={item.groupId} className="relative">
              <div className="grid grid-cols-[65px_minmax(0,1fr)_65px] sm:grid-cols-[85px_minmax(0,1fr)_85px] items-stretch min-h-[46px] px-3 bg-secondary/30 transition-colors hover:bg-secondary/50">
                {/* Left Column */}
                <div className="flex items-center justify-center text-center">
                  <span className="text-[10px] font-mono text-muted-foreground/75">
                    {distanceDiff > 0 ? `+${distanceDiff} km` : ""}
                  </span>
                </div>

                {/* Track Column with continuous rails */}
                <div className="relative flex items-stretch gap-3 min-w-0">
                  <div className="relative flex w-6 sm:w-7 shrink-0 items-center justify-center self-stretch">
                    {/* Continuous Dual Rails */}
                    <div
                      className={`absolute left-[4px] inset-y-0 w-[2.5px] ${
                        item.isPassed ? "bg-primary shadow-xs" : "bg-border"
                      }`}
                    />
                    <div
                      className={`absolute right-[4px] inset-y-0 w-[2.5px] ${
                        item.isPassed ? "bg-primary shadow-xs" : "bg-border"
                      }`}
                    />

                    {/* Sleepers */}
                    <div className="absolute inset-y-0 left-0 right-0 flex flex-col justify-between py-1 pointer-events-none">
                      {[...Array(4)].map((_, sIdx) => (
                        <div
                          key={sIdx}
                          className={`mx-auto h-[1.5px] w-[15px] opacity-50 rounded-xs ${
                            item.isPassed ? "bg-primary/50" : "bg-border"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Interactive Button to Expand In-Between Stations */}
                  <div className="flex items-center min-w-0 flex-1 py-1.5">
                    <button
                      onClick={() => toggleGroup(item.groupId)}
                      className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-xs hover:border-primary/40 hover:bg-secondary/40 transition-all cursor-pointer w-full text-left truncate"
                    >
                      <ChevronDown className="size-3 text-primary shrink-0" />
                      <span className="text-primary font-bold">
                        ▾ {count} in-between stations (Click to view)
                      </span>
                      <span className="text-[10px] text-muted-foreground truncate hidden sm:inline">
                        ({item.items.map((i) => i.row.halt.code).join(", ")})
                      </span>
                    </button>
                  </div>
                </div>

                {/* Right Column */}
                <div className="flex items-center justify-center text-right pr-1">
                  <span className="text-[10px] text-muted-foreground/75 font-mono">
                    {count} stops
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-subtle-gradient px-4 py-3">
        <div>
          <p className="text-xs font-bold text-foreground">
            {status?.state === "halted" ? (
              <>At {status.lastHalt.name}</>
            ) : status?.nextHalt ? (
              <>En Route: {status.lastHalt.name} → {status.nextHalt.name}</>
            ) : (
              <>At {train.halts[0]!.name}</>
            )}
          </p>
          <div className="mt-0.5 flex items-center gap-1.5">
            <span className="inline-flex items-center rounded-md bg-secondary border border-border px-1.5 py-0.2 text-[9px] font-bold text-primary uppercase tracking-wide">
              {isGpsActive ? `GPS LIVE (${status ? status.speed : 0} KM/H)` : status ? (status.speed > 0 ? `RUNNING (${status.speed} KM/H)` : "HALTED") : "SCHEDULED"}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {isGpsActive ? "Live GPS sensor" : "Updated few seconds ago"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* In Train GPS Pill */}
          <button
            onClick={onToggleGps}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
              isGpsActive
                ? "border-primary bg-primary text-primary-foreground shadow-float ring-2 ring-primary/20"
                : "border-border bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {isGpsActive ? (
              <Satellite className="size-3.5 animate-pulse" />
            ) : (
              <Radio className="size-3.5 text-primary" />
            )}
            <span>{isGpsActive ? "In Train (GPS Active)" : "In Train?"}</span>
          </button>

          {/* Refresh Action */}
          <button
            onClick={handleRefresh}
            className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs hover:opacity-90 transition-opacity"
            title="Refresh Live Status"
          >
            <RotateCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
