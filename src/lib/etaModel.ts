import { type DelayReason, classifyDelay, DELAY_REASONS } from "./delayReasons";
import type { TrainRoute, Halt } from "@/data/trains";

/** Format minutes-after-midnight as HH:MM. */
function fmtClock(minutesAfterMidnight: number) {
  const m = ((Math.round(minutesAfterMidnight) % 1440) + 1440) % 1440;
  const hh = String(Math.floor(m / 60)).padStart(2, "0");
  const mm = String(m % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

/**
 * RailDristhi ETA forecasting model.
 *
 * This is a transparent, rule-based forecast layer that consumes a structured
 * feature vector per train and produces a predicted delay, a confidence
 * interval and a classified delay cause. The interfaces are designed so the
 * backend can later be swapped for a trained ML inference service with no
 * change to callers.
 */

export type WeatherCondition = "clear" | "rain" | "fog" | "wind" | "heat";

export type FeatureVector = {
  trainNumber: string;
  trainName: string;
  /** minutes after origin departure the train is currently scheduled at */
  elapsedMin: number;
  /** minutes the train is currently behind schedule (negative = ahead) */
  currentDelayMin: number;
  /** distance covered along the route in km */
  currentKm: number;
  totalKm: number;
  /** index of the last completed halt */
  lastHaltIndex: number;
  /** historical delay in minutes recorded at each prior halt (seconds allowed) */
  priorHaltDelays: number[];
  /** minutes this train has been sitting at a halt (0 while running) */
  haltedDurationMin: number;
  isHalted: boolean;
  timeOfDayHours: number;
  dayOfWeek: number; // 0=Sun .. 6=Sat
  weather: WeatherCondition;
  /** 0..1 crowding factor for the current corridor */
  corridorCongestion: number;
};

export type DelayForecast = {
  /** most likely additional minutes of delay to apply */
  predictedDelayShiftMin: number;
  /** absolute forecast minutes late at the target halt */
  delayMin: number;
  /** expected arrival minutes after origin departure */
  etaMin: number;
  /** clock string for arrival */
  eta: string;
  /** confidence 0..1 */
  confidence: number;
  /** 80% confidence window, minutes each way */
  intervalMin: number;
  lowerEta: string;
  upperEta: string;
  reason: DelayReason;
};

export type ModelConfig = {
  version: string;
  trainedAt: string;
  method: "heuristic";
};

export const MODEL: ModelConfig = {
  version: "1.0.0",
  trainedAt: "2026-01-01",
  method: "heuristic",
};

const weatherPenalty: Record<WeatherCondition, number> = {
  clear: 0,
  rain: 6,
  fog: 14,
  wind: 8,
  heat: 4,
};

/** Convergence factor: how quickly additional delay decays with distance covered. */
const delayDecay = 0.045;

/**
 * Primary predictor. Given the current state of a train and the accumulated
 * historical signal, returns an ETA forecast for the *next* halt (or a named
 * target halt index).
 */
export function predictDelay(features: FeatureVector, targetHaltIndex?: number): DelayForecast {
  const lastIdx = features.lastHaltIndex;
  const targetIdx = targetHaltIndex ?? lastIdx + 1;

  // 1) Persistence of the observed delay. Delays are sticky but partially recover.
  const recovered = features.currentDelayMin * (1 - delayDecay * Math.max(0, targetIdx - lastIdx));

  // 2) Historical drift from prior halts (early/late pattern).
  let histSum = 0;
  for (const d of features.priorHaltDelays) histSum += d;
  const histAvg = features.priorHaltDelays.length ? histSum / features.priorHaltDelays.length : 0;
  const histComponent = histAvg * 0.4 * Math.max(0, targetIdx - lastIdx);

  // 3) Environmental & contextual modifiers.
  const weatherComponent = weatherPenalty[features.weather];
  const congestionComponent = features.corridorCongestion * 18;
  const timeComponent = features.timeOfDayHours >= 7 && features.timeOfDayHours <= 20 ? 3 : 0;
  const peakComponent =
    (features.timeOfDayHours >= 8 && features.timeOfDayHours <= 11) ||
    (features.timeOfDayHours >= 17 && features.timeOfDayHours <= 20)
      ? 5
      : 0;

  const delayMin = Math.max(
    0,
    recovered +
      histComponent +
      weatherComponent +
      congestionComponent +
      timeComponent +
      peakComponent,
  );

  // 4) Confidence shrinks with distance to target and grows with observed signal.
  const horizon = Math.max(1, targetIdx - lastIdx);
  const signal = Math.min(1, features.priorHaltDelays.length / 4);
  const baseConf = 0.62 + signal * 0.2;
  const horizonPenalty = Math.min(0.35, horizon * 0.05);
  let confidence = baseConf - horizonPenalty;
  if (features.weather !== "clear") confidence -= 0.08;
  confidence = Math.min(0.95, Math.max(0.35, confidence));

  // 5) Interval widens with delay and horizon.
  const intervalMin = Math.round(6 + delayMin * 0.2 + horizon * 2);

  const reason = classifyDelay({
    delayMin,
    weatherActive: features.weather !== "clear",
    timeOfDayHours: features.timeOfDayHours,
    isHalted: features.isHalted,
    haltedDurationMin: features.haltedDurationMin,
  });

  return {
    predictedDelayShiftMin: Math.round(delayMin * 100) / 100,
    delayMin: Math.round(delayMin),
    etaMin: Math.round(delayMin),
    eta: fmtClock(delayMin),
    confidence: Math.round(confidence * 100) / 100,
    intervalMin,
    lowerEta: "",
    upperEta: "",
    reason,
  };
}

/** Build the feature vector from a train route and its live running state. */
export function buildFeatures(
  train: TrainRoute,
  state: {
    elapsedMin: number;
    currentDelayMin: number;
    currentKm: number;
    lastHaltIndex: number;
    haltedDurationMin: number;
    isHalted: boolean;
    date: Date;
  },
  weather?: WeatherCondition,
  corridorCongestion?: number,
): FeatureVector {
  const totalKm = train.halts[train.halts.length - 1]!.km;
  const priorHaltDelays: number[] = [];
  for (let i = 0; i <= state.lastHaltIndex && i < train.halts.length; i++) {
    priorHaltDelays.push(state.currentDelayMin * 0.6);
  }

  const date = state.date;
  const dayOfWeek = date.getDay();
  const timeOfDayHours = state.elapsedMin / 60;

  // Deterministic per-train weather/congestion so the demo is stable between renders.
  const wSeed = hash(`${train.number}:${state.lastHaltIndex}-${state.date.getDate()}`);
  const wTable: WeatherCondition[] = ["clear", "clear", "clear", "clear", "rain", "fog", "wind"];
  const weatherSel = weather ?? wTable[Math.floor(wSeed * wTable.length)] ?? "clear";
  const congestion =
    corridorCongestion ??
    0.2 + hash(`${train.name}:${state.lastHaltIndex}-${state.date.getDate()}`) * 0.6;

  return {
    trainNumber: train.number,
    trainName: train.name,
    elapsedMin: state.elapsedMin,
    currentDelayMin: state.currentDelayMin,
    currentKm: state.currentKm,
    totalKm,
    lastHaltIndex: state.lastHaltIndex,
    priorHaltDelays,
    haltedDurationMin: state.haltedDurationMin,
    isHalted: state.isHalted,
    timeOfDayHours,
    dayOfWeek,
    weather: weatherSel,
    corridorCongestion: congestion,
  };
}

/** Forecast ETA at a given halt index given the train route + live state. */
export function forecastEtaAtHalt(
  train: TrainRoute,
  haltIndex: number,
  live: {
    elapsedMin: number;
    currentDelayMin: number;
    currentKm: number;
    lastHaltIndex: number;
    haltedDurationMin: number;
    isHalted: boolean;
  },
  now: Date,
): DelayForecast {
  const features = buildFeatures(train, { ...live, date: now });
  const delayAtTarget = predictDelay(features, haltIndex);
  const scheduledArr = train.startsAt + train.halts[haltIndex]!.arr + delayAtTarget.delayMin;
  const etaMin = scheduledArr;
  delayAtTarget.etaMin = etaMin;
  delayAtTarget.eta = fmtClock(etaMin);
  delayAtTarget.lowerEta = fmtClock(etaMin - delayAtTarget.intervalMin);
  delayAtTarget.upperEta = fmtClock(etaMin + delayAtTarget.intervalMin);
  return delayAtTarget;
}

function hash(s: string) {
  let x = 0;
  for (let i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) % 100000;
  return (x % 1000) / 1000;
}

export function reasonLabel(reason: DelayReason) {
  return DELAY_REASONS[reason].label;
}
