import type { Halt, TrainRoute } from "@/data/trains";
import type { DelayReason } from "./delayReasons";
import {
  type DelayForecast,
  buildFeatures,
  forecastEtaAtHalt,
  historicalDelayAt,
} from "./etaModel";

export type LiveStatus = {
  /** minutes late */
  delay: number;
  /** 0-100 route completion */
  progress: number;
  km: number;
  speed: number;
  lat: number;
  lng: number;
  state: "not-started" | "running" | "halted" | "completed";
  lastHalt: Halt;
  nextHalt: Halt | null;
  /** clock time strings */
  etaNext: string;
  /** model forecast for the next halt (or destination when complete) */
  forecast: DelayForecast | null;
  /** classified cause of the current delay */
  delayReason: DelayReason;
  /** overall forecast confidence 0..1 */
  confidence: number;
  updatedAt: number;
  haltStatus: {
    halt: Halt;
    scheduled: string;
    expected: string;
    forecast: DelayForecast | null;
    done: boolean;
    isNext: boolean;
  }[];
};

export function fmtMinutes(minutesAfterMidnight: number) {
  const m = ((minutesAfterMidnight % 1440) + 1440) % 1440;
  const hh = String(Math.floor(m / 60)).padStart(2, "0");
  const mm = String(Math.round(m % 60)).padStart(2, "0");
  return `${hh}:${mm}`;
}

/** Halt index currently reached on the raw schedule (before delay offset). */
function haltIndexAtElapsed(train: TrainRoute, elapsed: number): number {
  let idx = 0;
  for (let i = 0; i < train.halts.length; i++) {
    if (train.halts[i]!.arr <= elapsed) idx = i;
  }
  return idx;
}

export function computeLiveStatus(train: TrainRoute, now: Date): LiveStatus {
  const total = train.halts[train.halts.length - 1]!;
  const minutesNow = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  // Elapsed minutes since today's origin departure (wrap to yesterday's run).
  let elapsed = minutesNow - train.startsAt;
  if (elapsed < 0) elapsed += 1440;

  // The baseline current delay is the real historical average recorded at the
  // station the train has just reached on schedule (the origin reports 0,
  // which keeps not-yet-departed trains on time).
  const delay = historicalDelayAt(train, haltIndexAtElapsed(train, elapsed));
  const effective = elapsed - delay; // schedule minutes actually covered

  let state: LiveStatus["state"] = "running";
  if (effective <= 0) state = "not-started";
  if (effective >= total.arr) state = "completed";

  const clamped = Math.min(Math.max(effective, 0), total.arr);

  let lastIdx = 0;
  for (let i = 0; i < train.halts.length; i++) {
    if (train.halts[i]!.arr <= clamped) lastIdx = i;
  }
  const lastHalt = train.halts[lastIdx]!;
  const nextHalt = train.halts[lastIdx + 1] ?? null;

  let km = lastHalt.km;
  let speed = 0;
  let lat = lastHalt.lat;
  let lng = lastHalt.lng;

  if (nextHalt) {
    if (clamped <= lastHalt.dep) {
      state = state === "running" ? "halted" : state;
    } else {
      const span = nextHalt.arr - lastHalt.dep || 1;
      const f = Math.min(1, (clamped - lastHalt.dep) / span);
      km = lastHalt.km + (nextHalt.km - lastHalt.km) * f;
      lat = lastHalt.lat + (nextHalt.lat - lastHalt.lat) * f;
      lng = lastHalt.lng + (nextHalt.lng - lastHalt.lng) * f;
      const legSpeed = ((nextHalt.km - lastHalt.km) / span) * 60;
      speed = Math.round(legSpeed * (0.85 + 0.3 * Math.sin(clamped / 7)));
      speed = Math.max(0, Math.min(160, speed));
    }
  }
  if (state === "not-started" || state === "completed") speed = 0;

  // Build the model feature vector from the current live state.
  const liveState = {
    elapsedMin: elapsed,
    currentDelayMin: delay,
    currentKm: km,
    lastHaltIndex: lastIdx,
    haltedDurationMin: state === "halted" ? Math.min(20, 4 + Math.abs(Math.sin(elapsed)) * 14) : 0,
    isHalted: state === "halted",
  };

  const forecastTarget = state === "completed" ? train.halts.length - 1 : lastIdx + 1;
  const forecast =
    state === "not-started"
      ? null
      : forecastEtaAtHalt(train, Math.min(forecastTarget, train.halts.length - 1), liveState, now);

  const reason = forecast ? forecast.reason : "unknown";

  const haltStatus = train.halts.map((halt, i) => {
    const haltForecast =
      state === "not-started"
        ? null
        : forecastEtaAtHalt(train, Math.min(i, train.halts.length - 1), liveState, now);
    return {
      halt,
      scheduled: fmtMinutes(train.startsAt + halt.arr),
      expected: fmtMinutes(train.startsAt + halt.arr + (i === 0 ? 0 : delay)),
      forecast: haltForecast,
      done: state === "completed" || (state !== "not-started" && halt.arr <= clamped),
      isNext: nextHalt ? halt.code === nextHalt.code && i === lastIdx + 1 : false,
    };
  });

  return {
    delay,
    progress: total.km ? (km / total.km) * 100 : 0,
    km: Math.round(km),
    speed,
    lat,
    lng,
    state,
    lastHalt,
    nextHalt,
    etaNext: nextHalt
      ? fmtMinutes(train.startsAt + nextHalt.arr + (forecast?.delayMin ?? delay))
      : "—",
    forecast,
    delayReason: reason,
    confidence: forecast?.confidence ?? 0,
    updatedAt: now.getTime(),
    haltStatus,
  };
}

export function delayLabel(status: LiveStatus) {
  if (status.state === "not-started") return "Not departed yet";
  if (status.state === "completed") return "Run completed";
  const forecastMin = status.forecast?.delayMin ?? status.delay;
  return forecastMin === 0 ? "On time" : `${forecastMin} min late (predicted)`;
}

export function delayTone(status: LiveStatus) {
  const delay = status.forecast?.delayMin ?? status.delay;
  if (delay === 0) return "text-rail-live";
  if (delay < 25) return "text-rail-late";
  return "text-rail-alert";
}

/** Confidence tier derived from the model's 0..1 confidence. */
export function confidenceTier(confidence: number): { label: string; tone: string } {
  if (confidence >= 0.7) return { label: "High", tone: "text-rail-live" };
  if (confidence >= 0.45) return { label: "Medium", tone: "text-rail-late" };
  return { label: "Low", tone: "text-rail-alert" };
}
