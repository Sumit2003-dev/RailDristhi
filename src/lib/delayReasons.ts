export type DelayReason =
  "weather" | "congestion" | "track-work" | "signal-failure" | "technical" | "unknown";

export type DelayReasonMeta = {
  label: string;
  short: string;
  description: string;
};

export const DELAY_REASONS: Record<DelayReason, DelayReasonMeta> = {
  weather: {
    label: "Weather",
    short: "Weather",
    description: "Heavy rain, fog, high winds or heat restricting the line.",
  },
  congestion: {
    label: "Track congestion",
    short: "Congestion",
    description: "Dense traffic ahead slowing movement on this section.",
  },
  "track-work": {
    label: "Track work",
    short: "Track work",
    description: "Planned maintenance or speed restrictions on the section.",
  },
  "signal-failure": {
    label: "Signal failure",
    short: "Signal",
    description: "Block signalling issue causing trains to hold between stations.",
  },
  technical: {
    label: "Technical",
    short: "Technical",
    description: "Locomotive or coach fault requiring attention.",
  },
  unknown: {
    label: "Unknown",
    short: "Unknown",
    description: "Delay detected but no cause has been confirmed yet.",
  },
};

/** Weighted heuristics mapping delay magnitude and context to a probable cause. */
export function classifyDelay(features: {
  delayMin: number;
  weatherActive: boolean;
  timeOfDayHours: number;
  isHalted: boolean;
  haltedDurationMin: number;
}): DelayReason {
  if (features.delayMin <= 2) return "unknown";

  const prob: Record<DelayReason, number> = {
    weather: 0,
    congestion: 0,
    "track-work": 0,
    "signal-failure": 0,
    technical: 0,
    unknown: 0,
  };

  if (features.weatherActive) prob.weather += 0.55;
  if (features.timeOfDayHours >= 6 && features.timeOfDayHours <= 21) prob.congestion += 0;
  if (features.haltedDurationMin > 12) prob["signal-failure"] += 0.3;
  if (features.haltedDurationMin > 20) prob["signal-failure"] += 0.2;
  if (features.delayMin >= 25) prob["track-work"] += 0.2;
  if (features.delayMin >= 40) prob.technical += 0.2;

  // Congestion grows at peak hours on busy corridors.
  if (features.timeOfDayHours >= 8 && features.timeOfDayHours <= 11) prob.congestion += 0.3;
  if (features.timeOfDayHours >= 17 && features.timeOfDayHours <= 20) prob.congestion += 0.4;

  prob.unknown = 0.1;

  let best: DelayReason = "unknown";
  let bestScore = -1;
  for (const key of Object.keys(prob) as DelayReason[]) {
    if (prob[key] > bestScore) {
      bestScore = prob[key];
      best = key;
    }
  }
  return best;
}
