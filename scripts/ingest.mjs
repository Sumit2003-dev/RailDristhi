#!/usr/bin/env node
/**
 * RailDristhi data ingestion build-time script.
 *
 * Reads the three raw CSVs in public/ plus a station coordinate lookup and
 * emits compact, typed TS data modules under src/data/generated/ that the
 * app bundles at build time:
 *
 *   public/Indian Railway Delay Dataset.csv        -> delayStats.ts (per-train per-station delay stats)
 *   public/Train_details_22122017.csv              -> routes.ts      (real train timetables)
 *   public/Indian Railways Train Delays Dataset 2025.csv -> runHistory.ts (prior-run delays)
 *   scripts/data/stations.json + manual-overrides  -> stations.ts    (station code -> lat/lng)
 *
 * Run: npm run ingest
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(ROOT, "public");
const OUT = join(ROOT, "src", "data", "generated");
const MONTH = 1440;

const read = (p) => readFileSync(join(PUBLIC, p), "utf8");

/** Minimal RFC4180 CSV parser that handles quoted fields, escaped quotes and CRLF. */
function parseCsv(text, hasHeader = true) {
  const rows = [];
  let field = "";
  let row = [];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      if (row.some((x, j) => row[j] !== undefined || x !== "")) rows.push(row);
      field = "";
      row = [];
    } else {
      field += c;
    }
  }
  // last field / row without trailing newline
  row.push(field);
  if (row.some((x) => x !== "")) rows.push(row);

  if (!hasHeader) return rows.map((r) => r.map(trim));

  const header = rows[0].map(trim);
  return rows.slice(1).map((r) => {
    const obj = {};
    header.forEach((h, i) => (obj[h] = (r[i] ?? "").trim()));
    return obj;
  });
}

function trim(s) {
  return s == null ? "" : String(s).trim();
}

function num(v, dflt = 0) {
  const n = Number.parseFloat(String(v ?? "").replace(",", ""));
  return Number.isFinite(n) ? n : dflt;
}

/** "22:10:00" or "22:10" -> minutes after midnight (0..1439). */
function clockToMin(clock) {
  const m = String(clock ?? "").match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (!m) return null;
  return (+m[1] * 60 + +m[2] + Math.round(+(m[3] ?? 0) / 60)) % MONTH;
}

/** Classify a train number into a display class. */
function classifyType(trainNo) {
  const n = String(trainNo);
  if (/^(22|226)\d{3}$/.test(n) || /^22\d{4}$/.test(n)) return "Superfast";
  if (/^12\d{4}$/.test(n)) return "Superfast";
  if (/^24\d{3,4}$/.test(n)) return "Superfast";
  if (/^1\d{4}$/.test(n)) return "Express";
  if (/^2\d{4}$/.test(n)) return "Express";
  if (/^3\d{4}$/.test(n)) return "Mail/Express";
  if (/^(5|6)\d{4}$/.test(n)) return "Passenger";
  return "Express";
}

function main() {
  mkdirSync(OUT, { recursive: true });

  // ---- Station coordinate lookup -------------------------------------------
  const stationPath = join(ROOT, "scripts", "data", "stations.json");
  if (!existsSync(stationPath)) {
    console.error(
      `[ingest] Missing ${stationPath}. Download the datameet stations.json into scripts/data/ and re-run.`,
    );
    process.exit(1);
  }
  const lookupFeats = JSON.parse(readFileSync(stationPath, "utf8")).features ?? [];
  const lookup = new Map();
  for (const f of lookupFeats) {
    const g = f.geometry;
    if (g && Array.isArray(g.coordinates)) {
      lookup.set(f.properties.code, [g.coordinates[1], g.coordinates[0]]);
    }
  }
  const overrides = JSON.parse(
    existsSync(join(ROOT, "scripts", "manual-overrides.json"))
      ? readFileSync(join(ROOT, "scripts", "manual-overrides.json"), "utf8")
      : "{}",
  );
  const nameLookup = new Map();
  for (const f of lookupFeats) nameLookup.set(f.properties.code, f.properties.name);
  for (const [code, latlng] of Object.entries(overrides)) lookup.set(code, latlng);

  // ---- Dataset 1: per-train, per-station delay stats ------------------------
  const delayRows = parseCsv(read("Indian Railway Delay Dataset.csv"));
  const delayStats = {};
  const delayTrainNames = {};
  for (const r of delayRows) {
    if (!r.train_number) continue;
    delayTrainNames[r.train_number] = r.train_name || delayTrainNames[r.train_number];
    const code = r.station_code;
    if (!code) continue;
    delayStats[r.train_number] ||= {};
    delayStats[r.train_number][code] = {
      avgDelayMin: num(r.average_delay_minutes),
      pctRight: num(r.pct_right_time),
      pctSlight: num(r.pct_slight_delay),
      pctSignificant: num(r.pct_significant_delay),
    };
  }
  const delayTrains = Object.keys(delayStats);

  // ---- Dataset 3: timetables, filtered to delay-trained trains --------------
  const ttRows = parseCsv(read("Train_details_22122017.csv"));
  const routesByTrain = {};
  const ttName = {};
  for (const r of ttRows) {
    const tn = r["Train No"];
    if (!tn || !delayStats[tn]) continue;
    const clockA = clockToMin(r["Arrival time"]);
    const clockD = clockToMin(r["Departure Time"]);
    routesByTrain[tn] ||= [];
    routesByTrain[tn].push({
      code: r["Station Code"],
      name: r["Station Name"],
      seq: +r.SEQ,
      clockA,
      clockD,
      km: num(r.Distance),
    });
    ttName[tn] = r["Train Name"] || ttName[tn];
  }

  // ---- Dataset 2: prior-run delay history -----------------------------------
  const runRows = parseCsv(read("Indian Railways Train Delays Dataset 2025.csv"));
  const runHistory = {};
  const runFreq = {};
  for (const r of runRows) {
    const tn = r.Train_no;
    if (!tn) continue;
    runHistory[tn] ||= [];
    const dl = parseDelay(r.Dealy_min, r.Sc_arr__time, r.Act_arr_time);
    if (dl != null) runHistory[tn].push(dl);
    runFreq[tn] = r.Run_frequency || runFreq[tn];
  }

  // ---- Assemble routes + stations --------------------------------------------
  const stationMap = {};
  const missingCoord = new Set();
  const multiDaySkipped = new Set();
  const routes = [];

  for (const tn of delayTrains) {
    const stops = (routesByTrain[tn] || []).sort((a, b) => a.seq - b.seq);
    if (stops.length < 2) continue;

    const startClock = stops[0].clockD ?? stops[0].clockA;
    if (startClock == null) continue;
    const startsAt = startClock;

    // Cumulative elapsed minutes from origin, adding a full day each time the
    // departure clock rolls back (midnight crossing). The app's live model
    // assumes a <24h journey, so we keep only trains whose total run is under
    // 1440 minutes (a run can still legitimately cross midnight).
    const dayByIdx = [];
    let dayOffset = 0;
    let prevDepClock = null;
    for (const s of stops) {
      if (prevDepClock != null && s.clockD != null && s.clockD < prevDepClock) dayOffset += MONTH;
      dayByIdx.push(dayOffset);
      if (s.clockD != null) prevDepClock = s.clockD;
    }
    const elapsedFor = (idx) =>
      (stops[idx].clockA ?? stops[idx].clockD ?? 0) + dayByIdx[idx] - startsAt;
    const maxElapsed = elapsedFor(stops.length - 1);
    if (maxElapsed >= MONTH - 1) {
      multiDaySkipped.add(tn);
      continue;
    }

    let missing = false;
    const halts = stops.map((s, i) => {
      const latlng = lookup.get(s.code) || overrides[s.code];
      if (!latlng) {
        missingCoord.add(s.code);
        missing = true;
      }
      const arr = i === 0 ? 0 : elapsedFor(i);
      const depClock = stops[i].clockD ?? stops[i].clockA ?? arr;
      const dep = i === stops.length - 1 ? arr : Math.max(depClock + dayByIdx[i] - startsAt, arr);
      const ll = latlng || [0, 0];
      return {
        code: s.code,
        name: s.name || nameLookup.get(s.code) || s.code,
        lat: +ll[0].toFixed(4),
        lng: +ll[1].toFixed(4),
        km: Math.round(s.km),
        arr,
        dep,
        platform: "-",
        day: Math.floor((stops[i].clockA ?? stops[i].clockD ?? 0) / MONTH) + 1,
      };
    });
    if (missing) continue;

    const type = classifyType(tn);
    routes.push({
      number: tn,
      name: ttName[tn] || delayTrainNames[tn] || tn,
      type,
      startsAt,
      runsOn: runsOnFor(runFreq[tn]),
      halts,
    });
  }

  // accumulate all station codes actually used
  for (const r of routes) {
    for (const h of r.halts) {
      stationMap[h.code] ||= { name: h.name, lat: h.lat, lng: h.lng };
    }
  }

  // ---- Emit TS modules -------------------------------------------------------
  writeModule(
    join(OUT, "stations.ts"),
    `// generated by npm run ingest

export type Station = { name: string; lat: number; lng: number };

export const stationMap: Record<string, Station> = ${jsonLit(stationMap)};

export function stationFor(code: string): Station | undefined {
  return stationMap[code];
}
`,
  );

  writeModule(
    join(OUT, "routes.ts"),
    `// generated by npm run ingest
import type { TrainRoute } from "../trainTypes";

export const trainRoutes: TrainRoute[] = ${jsonLit(routes)};
`,
  );

  writeModule(
    join(OUT, "delayStats.ts"),
    `// generated by npm run ingest

export type StationDelayStats = {
  avgDelayMin: number;
  pctRight: number;
  pctSlight: number;
  pctSignificant: number;
};

export type TrainDelayTable = Record<string, StationDelayStats>;

export const trainDelayStats: Record<string, TrainDelayTable> = ${jsonLit(delayStats)};

export const DEFAULT_AVG_DELAY = 8;
`,
  );

  writeModule(
    join(OUT, "runHistory.ts"),
    `// generated by npm run ingest

export const trainRunHistory: Record<string, number[]> = ${jsonLit(runHistory)};
`,
  );

  // ---- Report -----------------------------------------------------------------
  console.log(`[ingest] stations: ${Object.keys(stationMap).length}`);
  console.log(`[ingest] routes: ${routes.length} trains`);
  const haltCount = routes.reduce((a, r) => a + r.halts.length, 0);
  console.log(`[ingest] halts: ${haltCount}`);
  console.log(`[ingest] trains with delay stats: ${Object.keys(delayStats).length}`);
  console.log(`[ingest] trains with run history: ${Object.keys(runHistory).length}`);
  if (missingCoord.size)
    console.log(`[ingest] WARN missing coords skipped: ${[...missingCoord].join(", ")}`);
  if (multiDaySkipped.size)
    console.log(`[ingest] multi-day (>24h) skipped: ${multiDaySkipped.size} trains`);
  const noDelayRoute = delayTrains.filter(
    (tn) => !routesByTrain[tn] || routesByTrain[tn].length < 2,
  );
  if (noDelayRoute.length)
    console.log(`[ingest] delay trains w/o usable route: ${noDelayRoute.join(", ")}`);
}

function parseDelay(dealyMin, sc, act) {
  // Dealy_min may be "HH:MM:SS" or a plain number
  const mm = Number(dealyMin);
  if (dealyMin && /:/.test(String(dealyMin))) return clockToMin(dealyMin);
  if (Number.isFinite(mm) && mm !== 0) return mm;
  return null;
}

function runsOnFor(freq) {
  const f = (freq || "").toLowerCase();
  if (f.includes("week")) return ["Mon"];
  if (f.includes("alternate") || f.includes("tri")) return ["Mon", "Wed", "Fri"];
  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
}

function writeModule(path, content) {
  writeFileSync(path, content.replace(/\n{3,}/g, "\n\n"));
  console.log(`[ingest] wrote ${path}`);
}

function jsonLit(obj) {
  return JSON.stringify(obj);
}

main();
