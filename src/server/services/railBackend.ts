import { trainRoutes, type TrainRoute } from "../../data/trains";
import { stationMap, stationFor, type Station } from "../../data/generated/stations";
import { computeLiveStatus, fmtMinutes, type LiveStatus } from "../../lib/liveStatus";
import { DELAY_REASONS, type DelayReason } from "../../lib/delayReasons";

export type TrainSearchOptions = {
  query?: string | undefined;
  type?: string | undefined;
  state?: "running" | "halted" | "on-time" | "delayed" | undefined;
  from?: string | undefined;
  to?: string | undefined;
  limit?: number | undefined;
  offset?: number | undefined;
};

export type PnrStatus = {
  pnr: string;
  trainNumber: string;
  trainName: string;
  fromStation: { code: string; name: string };
  toStation: { code: string; name: string };
  boardingStation: { code: string; name: string };
  journeyDate: string;
  bookingClass: string;
  quota: string;
  chartStatus: "CHART PREPARED" | "CHART NOT PREPARED";
  passengers: {
    number: number;
    bookingStatus: string;
    currentStatus: string;
    coach: string;
    berth: number;
    berthType: "Lower" | "Middle" | "Upper" | "Side Lower" | "Side Upper" | "Window" | "Aisle";
  }[];
  fare: number;
  liveStatus: {
    speed: number;
    delay: number;
    nextStation: string;
    eta: string;
  };
};

export type ConnectingImpactResult = {
  transferStation: { code: string; name: string };
  incomingTrain: {
    number: string;
    name: string;
    scheduledArrival: string;
    predictedArrival: string;
    delayMinutes: number;
    confidence: number;
    forecastWindow: { lower: string; upper: string };
  };
  connectingTrain: {
    number: string;
    name: string;
    scheduledDeparture: string;
    platform: string;
  };
  bufferMinutes: number;
  effectiveBufferMinutes: number;
  transferFeasibility: "SAFE" | "RISKY" | "MISSED";
  riskScorePercent: number;
  recommendation: string;
  alternativeTrains: {
    number: string;
    name: string;
    departure: string;
    availableSeatsEstimated: number;
  }[];
};

/**
 * High-performance backend service for Indian Railways intelligence.
 */
export class RailBackendService {
  /**
   * Search and filter trains with pagination and status checks.
   */
  static searchTrains(options: TrainSearchOptions = {}) {
    const { query = "", type, state, from, to, limit = 20, offset = 0 } = options;
    const q = query.trim().toLowerCase();
    const fromQ = from?.trim().toLowerCase();
    const toQ = to?.trim().toLowerCase();
    const now = new Date();

    let results = trainRoutes;

    if (q) {
      results = results.filter(
        (t) =>
          t.number.includes(q) ||
          t.name.toLowerCase().includes(q) ||
          t.halts.some((h) => h.code.toLowerCase() === q || h.name.toLowerCase().includes(q)),
      );
    }

    if (type && type !== "all") {
      results = results.filter((t) => t.type.toLowerCase() === type.toLowerCase());
    }

    if (fromQ && toQ) {
      results = results.filter((t) => {
        const fi = t.halts.findIndex(
          (h) => h.code.toLowerCase() === fromQ || h.name.toLowerCase().includes(fromQ),
        );
        const ti = t.halts.findIndex(
          (h) => h.code.toLowerCase() === toQ || h.name.toLowerCase().includes(toQ),
        );
        return fi !== -1 && ti !== -1 && fi < ti;
      });
    }

    // Enrich with live state if requested
    const enriched = results.map((t) => {
      const live = computeLiveStatus(t, now);
      return {
        number: t.number,
        name: t.name,
        type: t.type,
        origin: { code: t.halts[0]!.code, name: t.halts[0]!.name },
        destination: {
          code: t.halts[t.halts.length - 1]!.code,
          name: t.halts[t.halts.length - 1]!.name,
        },
        totalKm: t.halts[t.halts.length - 1]!.km,
        startsAt: fmtMinutes(t.startsAt),
        runsOn: t.runsOn,
        haltsCount: t.halts.length,
        live: {
          state: live.state,
          speedKmH: live.speed,
          delayMinutes: live.forecast?.delayMin ?? live.delay,
          delayReason: live.delayReason,
          confidencePercent: Math.round(live.confidence * 100),
          nextHalt: live.nextHalt ? { code: live.nextHalt.code, name: live.nextHalt.name } : null,
          etaNext: live.etaNext,
          progressPercent: Math.round(live.progress),
        },
      };
    });

    let filtered = enriched;
    if (state && state !== "running") {
      if (state === "on-time") {
        filtered = filtered.filter((t) => t.live.delayMinutes <= 2);
      } else if (state === "delayed") {
        filtered = filtered.filter((t) => t.live.delayMinutes > 2);
      } else if (state === "halted") {
        filtered = filtered.filter((t) => t.live.state === "halted");
      }
    }

    const total = filtered.length;
    const items = filtered.slice(offset, offset + limit);

    return {
      total,
      offset,
      limit,
      items,
    };
  }

  /**
   * Get real-time status of a specific train.
   */
  static getTrainLiveStatus(trainNumber: string, date = new Date()) {
    const train = trainRoutes.find((t) => t.number === trainNumber);
    if (!train) return null;

    const live = computeLiveStatus(train, date);
    const origin = train.halts[0]!;
    const dest = train.halts[train.halts.length - 1]!;

    return {
      train: {
        number: train.number,
        name: train.name,
        type: train.type,
        origin: { code: origin.code, name: origin.name },
        destination: { code: dest.code, name: dest.name },
        totalKm: dest.km,
        departureTime: fmtMinutes(train.startsAt),
        runsOn: train.runsOn,
      },
      live: {
        state: live.state,
        speed: live.speed,
        currentKm: live.km,
        progressPercent: Math.round(live.progress),
        currentCoordinates: { lat: live.lat, lng: live.lng },
        delayMinutes: live.forecast?.delayMin ?? live.delay,
        delayReason: {
          code: live.delayReason,
          label: DELAY_REASONS[live.delayReason]?.label ?? "Unknown",
          description: DELAY_REASONS[live.delayReason]?.description ?? "",
        },
        forecast: live.forecast
          ? {
              predictedDelayMin: live.forecast.delayMin,
              confidence: live.forecast.confidence,
              confidenceWindow: {
                lowerEta: live.forecast.lowerEta,
                upperEta: live.forecast.upperEta,
                intervalMinutes: live.forecast.intervalMin,
              },
            }
          : null,
        lastHalt: { code: live.lastHalt.code, name: live.lastHalt.name },
        nextHalt: live.nextHalt
          ? {
              code: live.nextHalt.code,
              name: live.nextHalt.name,
              platform: live.nextHalt.platform,
              scheduledArrival: fmtMinutes(train.startsAt + live.nextHalt.arr),
              predictedEta: live.etaNext,
            }
          : null,
        updatedAt: new Date(live.updatedAt).toISOString(),
      },
      timeline: live.haltStatus.map((h) => ({
        code: h.halt.code,
        name: h.halt.name,
        distanceKm: h.halt.km,
        platform: h.halt.platform,
        scheduledArrival: h.scheduled,
        predictedEta: !h.done && h.forecast ? h.forecast.eta : h.expected,
        delayMinutes: h.forecast?.delayMin ?? 0,
        isCompleted: h.done,
        isCurrentTarget: h.isNext,
        delayReason: h.forecast ? h.forecast.reason : null,
      })),
    };
  }

  /**
   * Get full timetable for a train.
   */
  static getTrainTimetable(trainNumber: string) {
    const train = trainRoutes.find((t) => t.number === trainNumber);
    if (!train) return null;

    return {
      number: train.number,
      name: train.name,
      type: train.type,
      departureTime: fmtMinutes(train.startsAt),
      runsOn: train.runsOn,
      halts: train.halts.map((h, idx) => ({
        sequence: idx + 1,
        code: h.code,
        name: h.name,
        distanceKm: h.km,
        day: h.day,
        platform: h.platform,
        scheduledArrival: fmtMinutes(train.startsAt + h.arr),
        scheduledDeparture: fmtMinutes(train.startsAt + h.dep),
        haltMinutes: Math.max(0, h.dep - h.arr),
        coordinates: { lat: h.lat, lng: h.lng },
      })),
    };
  }

  /**
   * Search station dictionary.
   */
  static searchStations(query = "", limit = 20) {
    const q = query.trim().toUpperCase();
    const entries = Object.entries(stationMap);

    const matches: (Station & { code: string })[] = [];
    for (const [code, info] of entries) {
      if (!q || code.includes(q) || info.name.toUpperCase().includes(q)) {
        matches.push({ code, ...info });
        if (matches.length >= limit) break;
      }
    }
    return matches;
  }

  /**
   * Get arrivals and departures station board.
   */
  static getStationBoard(code: string, mode: "all" | "arrivals" | "departures" = "all") {
    const upperCode = code.toUpperCase();
    const stationInfo = stationFor(upperCode);
    const now = new Date();

    const services = trainRoutes
      .map((t) => {
        const idx = t.halts.findIndex((h) => h.code.toUpperCase() === upperCode);
        if (idx === -1) return null;
        const halt = t.halts[idx]!;
        const status = computeLiveStatus(t, now);
        const isFirst = idx === 0;
        const isLast = idx === t.halts.length - 1;
        const type = isFirst ? "Departure" : isLast ? "Terminal" : "Arrival";
        const scheduledTime = fmtMinutes(t.startsAt + (isFirst ? halt.dep : halt.arr));
        const haltForecast = status.haltStatus.find((h) => h.halt.code === upperCode)?.forecast;
        const predictedTime = haltForecast ? haltForecast.eta : scheduledTime;

        return {
          trainNumber: t.number,
          trainName: t.name,
          trainType: t.type,
          origin: { code: t.halts[0]!.code, name: t.halts[0]!.name },
          destination: {
            code: t.halts[t.halts.length - 1]!.code,
            name: t.halts[t.halts.length - 1]!.name,
          },
          serviceType: type,
          platform: halt.platform,
          scheduledTime,
          predictedTime,
          delayMinutes: haltForecast?.delayMin ?? 0,
          delayReason: haltForecast ? haltForecast.reason : null,
          confidencePercent: Math.round((haltForecast?.confidence ?? status.confidence) * 100),
          isArrived: status.progress >= (halt.km / (t.halts[t.halts.length - 1]!.km || 1)) * 100,
        };
      })
      .filter((s): s is NonNullable<typeof s> => s !== null);

    let filtered = services;
    if (mode === "arrivals") {
      filtered = filtered.filter((s) => s.serviceType === "Arrival" || s.serviceType === "Terminal");
    } else if (mode === "departures") {
      filtered = filtered.filter((s) => s.serviceType === "Departure" || s.serviceType === "Arrival");
    }

    filtered.sort((a, b) => a.predictedTime.localeCompare(b.predictedTime));

    return {
      station: {
        code: upperCode,
        name: stationInfo?.name ?? upperCode,
        coordinates: stationInfo ? { lat: stationInfo.lat, lng: stationInfo.lng } : null,
      },
      serverTime: now.toISOString(),
      mode,
      totalServices: filtered.length,
      services: filtered,
    };
  }

  /**
   * Find direct trains between source and destination stations.
   */
  static findTrainsBetween(fromCode: string, toCode: string) {
    const f = fromCode.trim().toUpperCase();
    const t = toCode.trim().toUpperCase();
    const now = new Date();

    const matches = trainRoutes
      .map((route) => {
        const fi = route.halts.findIndex((h) => h.code.toUpperCase() === f);
        const ti = route.halts.findIndex((h) => h.code.toUpperCase() === t);
        if (fi === -1 || ti === -1 || fi >= ti) return null;

        const fromHalt = route.halts[fi]!;
        const toHalt = route.halts[ti]!;
        const durationMin = toHalt.arr - fromHalt.dep;
        const distanceKm = toHalt.km - fromHalt.km;
        const live = computeLiveStatus(route, now);

        return {
          number: route.number,
          name: route.name,
          type: route.type,
          departureFromSource: fmtMinutes(route.startsAt + fromHalt.dep),
          arrivalAtDestination: fmtMinutes(route.startsAt + toHalt.arr),
          duration: `${Math.floor(durationMin / 60)}h ${durationMin % 60}m`,
          distanceKm,
          intermediateHalts: ti - fi - 1,
          runsOn: route.runsOn,
          currentLiveStatus: {
            delayMinutes: live.forecast?.delayMin ?? live.delay,
            speed: live.speed,
            nextHalt: live.nextHalt?.name ?? null,
          },
        };
      })
      .filter((m): m is NonNullable<typeof m> => m !== null);

    return {
      from: { code: f, name: stationFor(f)?.name ?? f },
      to: { code: t, name: stationFor(t)?.name ?? t },
      totalTrains: matches.length,
      trains: matches,
    };
  }

  /**
   * Aggregate fleet metrics for control room operations.
   */
  static getControlRoomMetrics() {
    const now = new Date();
    const statuses = trainRoutes.map((t) => ({ t, s: computeLiveStatus(t, now) }));

    const running = statuses.filter((x) => x.s.state === "running" || x.s.state === "halted");
    const onTime = running.filter((x) => (x.s.forecast?.delayMin ?? 0) <= 2).length;
    const late = running.length - onTime;
    const halted = running.filter((x) => x.s.state === "halted").length;
    const highConf = running.filter((x) => (x.s.forecast?.confidence ?? 0) >= 0.7).length;

    const reasonCounts: Record<string, number> = {};
    for (const { s } of statuses) {
      if ((s.forecast?.delayMin ?? 0) > 2) {
        reasonCounts[s.delayReason] = (reasonCounts[s.delayReason] ?? 0) + 1;
      }
    }

    const delayDistribution = (Object.keys(DELAY_REASONS) as DelayReason[]).map((r) => ({
      reason: r,
      label: DELAY_REASONS[r].label,
      short: DELAY_REASONS[r].short,
      count: reasonCounts[r] ?? 0,
    }));

    const activeAlerts = statuses
      .filter(({ s }) => (s.forecast?.delayMin ?? 0) > 15)
      .sort((a, b) => (b.s.forecast?.delayMin ?? 0) - (a.s.forecast?.delayMin ?? 0))
      .map(({ t, s }) => ({
        trainNumber: t.number,
        trainName: t.name,
        type: t.type,
        predictedDelayMinutes: s.forecast?.delayMin ?? s.delay,
        confidencePercent: Math.round((s.forecast?.confidence ?? s.confidence) * 100),
        delayReason: s.delayReason,
        nextHalt: s.nextHalt ? { code: s.nextHalt.code, name: s.nextHalt.name } : null,
      }));

    return {
      timestamp: now.toISOString(),
      kpis: {
        totalTrackedTrains: trainRoutes.length,
        currentlyRunning: running.length,
        onTimeCount: onTime,
        delayedCount: late,
        haltedAtStationCount: halted,
        highConfidenceForecasts: highConf,
        onTimePercentage: running.length ? Math.round((onTime / running.length) * 100) : 100,
      },
      delayDistribution,
      activeAlerts,
    };
  }

  /**
   * Evaluate connecting train impact & transfer feasibility.
   */
  static getConnectingImpact(
    incomingTrainNo: string,
    connectingTrainNo: string,
    transferStationCode: string,
  ): ConnectingImpactResult | null {
    const upperStation = transferStationCode.toUpperCase();
    const inTrain = trainRoutes.find((t) => t.number === incomingTrainNo);
    const connTrain = trainRoutes.find((t) => t.number === connectingTrainNo);

    if (!inTrain || !connTrain) return null;

    const inHalt = inTrain.halts.find((h) => h.code.toUpperCase() === upperStation);
    const connHalt = connTrain.halts.find((h) => h.code.toUpperCase() === upperStation);

    if (!inHalt || !connHalt) return null;

    const now = new Date();
    const inStatus = computeLiveStatus(inTrain, now);
    const haltForecast = inStatus.haltStatus.find((h) => h.halt.code.toUpperCase() === upperStation)?.forecast;

    const scheduledArrivalMin = inTrain.startsAt + inHalt.arr;
    const scheduledDepMin = connTrain.startsAt + connHalt.dep;
    const delayMin = haltForecast?.delayMin ?? 0;
    const predictedArrivalMin = scheduledArrivalMin + delayMin;

    const rawBuffer = scheduledDepMin - scheduledArrivalMin;
    const effectiveBuffer = scheduledDepMin - predictedArrivalMin;

    let feasibility: "SAFE" | "RISKY" | "MISSED" = "SAFE";
    let riskScore = 0;
    let recommendation = "";

    if (effectiveBuffer < 10) {
      feasibility = "MISSED";
      riskScore = 95;
      recommendation = "High risk of missing transfer. Consider rebooking on a subsequent departure.";
    } else if (effectiveBuffer < 25) {
      feasibility = "RISKY";
      riskScore = 65;
      recommendation = "Tight transfer window. Head directly to connecting platform upon arrival.";
    } else {
      feasibility = "SAFE";
      riskScore = 15;
      recommendation = "Comfortable transfer buffer available.";
    }

    // Alternative departures from transfer junction
    const alternatives = trainRoutes
      .filter((t) => t.number !== connectingTrainNo && t.halts.some((h) => h.code.toUpperCase() === upperStation))
      .slice(0, 3)
      .map((t) => {
        const h = t.halts.find((x) => x.code.toUpperCase() === upperStation)!;
        return {
          number: t.number,
          name: t.name,
          departure: fmtMinutes(t.startsAt + h.dep),
          availableSeatsEstimated: 12 + ((parseInt(t.number, 10) * 7) % 45),
        };
      });

    return {
      transferStation: {
        code: upperStation,
        name: stationFor(upperStation)?.name ?? upperStation,
      },
      incomingTrain: {
        number: inTrain.number,
        name: inTrain.name,
        scheduledArrival: fmtMinutes(scheduledArrivalMin),
        predictedArrival: fmtMinutes(predictedArrivalMin),
        delayMinutes: delayMin,
        confidence: haltForecast?.confidence ?? 0.85,
        forecastWindow: {
          lower: haltForecast?.lowerEta ?? fmtMinutes(predictedArrivalMin - 5),
          upper: haltForecast?.upperEta ?? fmtMinutes(predictedArrivalMin + 5),
        },
      },
      connectingTrain: {
        number: connTrain.number,
        name: connTrain.name,
        scheduledDeparture: fmtMinutes(scheduledDepMin),
        platform: connHalt.platform !== "-" ? connHalt.platform : "3",
      },
      bufferMinutes: rawBuffer,
      effectiveBufferMinutes: effectiveBuffer,
      transferFeasibility: feasibility,
      riskScorePercent: riskScore,
      recommendation,
      alternativeTrains: alternatives,
    };
  }

  /**
   * Realistic 10-digit Indian Railways PNR status validator & engine.
   */
  static getPnrStatus(pnr: string): PnrStatus | null {
    const cleaned = pnr.replace(/\D/g, "");
    if (cleaned.length !== 10) return null;

    // Use deterministic hash of PNR so querying the same PNR returns consistent results
    let seed = 0;
    for (let i = 0; i < cleaned.length; i++) {
      seed = (seed * 31 + cleaned.charCodeAt(i)) % 100000;
    }

    const trainIdx = seed % trainRoutes.length;
    const train = trainRoutes[trainIdx]!;
    const origin = train.halts[0]!;
    const dest = train.halts[train.halts.length - 1]!;
    const now = new Date();
    const live = computeLiveStatus(train, now);

    const classes = ["1A", "2A", "3A", "SL", "CC", "EC"];
    const bookingClass = classes[seed % classes.length]!;

    const passengerCount = (seed % 3) + 1;
    const berthTypes: PnrStatus["passengers"][number]["berthType"][] = [
      "Lower",
      "Middle",
      "Upper",
      "Side Lower",
      "Side Upper",
    ];

    const coachPrefix = bookingClass === "SL" ? "S" : bookingClass === "3A" ? "B" : bookingClass === "2A" ? "A" : "H";
    const coachNum = (seed % 6) + 1;
    const coach = `${coachPrefix}${coachNum}`;

    const passengers: PnrStatus["passengers"] = [];
    for (let i = 1; i <= passengerCount; i++) {
      const berthNo = ((seed + i * 7) % 72) + 1;
      const bType = berthTypes[berthNo % berthTypes.length]!;
      passengers.push({
        number: i,
        bookingStatus: `CNF/${coach}/${berthNo}`,
        currentStatus: `CNF/${coach}/${berthNo}`,
        coach,
        berth: berthNo,
        berthType: bType,
      });
    }

    return {
      pnr: cleaned,
      trainNumber: train.number,
      trainName: train.name,
      fromStation: { code: origin.code, name: origin.name },
      toStation: { code: dest.code, name: dest.name },
      boardingStation: { code: origin.code, name: origin.name },
      journeyDate: now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      bookingClass,
      quota: "GN (General Quota)",
      chartStatus: "CHART PREPARED",
      passengers,
      fare: 450 + (passengerCount * 380 * (classes.indexOf(bookingClass) + 1)),
      liveStatus: {
        speed: live.speed,
        delay: live.forecast?.delayMin ?? live.delay,
        nextStation: live.nextHalt?.name ?? dest.name,
        eta: live.etaNext,
      },
    };
  }
}
