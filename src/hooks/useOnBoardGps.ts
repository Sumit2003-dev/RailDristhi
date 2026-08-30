import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import type { TrainRoute, Halt } from "@/data/trains";
import type { LiveStatus } from "@/lib/liveStatus";
import type { DelayForecast } from "@/lib/etaModel";
import { fmtMinutes } from "@/lib/liveStatus";

export type GpsLocation = {
  lat: number;
  lng: number;
  speedKmH: number;
  accuracy: number;
  timestamp: number;
};

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function createForecast(arrMin: number): DelayForecast {
  return {
    predictedDelayShiftMin: 0,
    delayMin: 0,
    confidence: 0.98,
    lowerEta: fmtMinutes(arrMin - 2),
    upperEta: fmtMinutes(arrMin + 2),
    intervalMin: 4,
    reason: "unknown",
    etaMin: arrMin,
    eta: fmtMinutes(arrMin),
  };
}

/**
 * Snap user GPS coordinates to closest halt / progress along the train route.
 */
function computeGpsStatus(train: TrainRoute, gps: GpsLocation): LiveStatus {
  const halts = train.halts;
  const destHalt = halts[halts.length - 1]!;
  const totalKm = destHalt.km || 1;

  // Find the closest halt to the passenger's current GPS position
  let closestHaltIdx = 0;
  let minDistance = Infinity;

  halts.forEach((h, idx) => {
    const dist = haversineKm(gps.lat, gps.lng, h.lat, h.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closestHaltIdx = idx;
    }
  });

  const closestHalt = halts[closestHaltIdx]!;
  const isLast = closestHaltIdx === halts.length - 1;

  const currentKm = closestHalt.km;
  const progress = Math.min(100, Math.max(0, (currentKm / totalKm) * 100));

  const speed = gps.speedKmH > 0 ? Math.round(gps.speedKmH) : 48;
  const state: LiveStatus["state"] = speed < 5 ? "halted" : "running";

  const nextHalt = isLast ? null : halts[closestHaltIdx + 1]!;
  const nextArrMin = train.startsAt + (nextHalt?.arr ?? closestHalt.arr);

  const haltStatus = halts.map((h, idx) => {
    const isDone = idx < closestHaltIdx;
    const isNext = idx === closestHaltIdx || idx === closestHaltIdx + 1;
    const haltArrMin = train.startsAt + h.arr;
    return {
      halt: h,
      scheduled: fmtMinutes(haltArrMin),
      expected: fmtMinutes(haltArrMin),
      forecast: createForecast(haltArrMin),
      done: isDone,
      isNext,
    };
  });

  return {
    state,
    speed,
    lat: gps.lat,
    lng: gps.lng,
    km: currentKm,
    progress,
    delay: 0,
    delayReason: "unknown",
    confidence: 0.98,
    lastHalt: closestHalt,
    nextHalt,
    etaNext: nextHalt ? fmtMinutes(train.startsAt + nextHalt.arr) : "Arrived",
    haltStatus,
    updatedAt: gps.timestamp,
    forecast: createForecast(nextArrMin),
  };
}

export function useOnBoardGps(train: TrainRoute) {
  const [isActive, setIsActive] = useState(false);
  const [location, setLocation] = useState<GpsLocation | null>(null);
  const [isOnBoard, setIsOnBoard] = useState(false);
  const [distanceToRouteKm, setDistanceToRouteKm] = useState<number | null>(null);
  const [gpsStatus, setGpsStatus] = useState<LiveStatus | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null && typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const handlePosition = useCallback(
    (pos: GeolocationPosition) => {
      const { latitude: lat, longitude: lng, speed: rawSpeed, accuracy } = pos.coords;
      const speedKmH = rawSpeed && rawSpeed > 0 ? rawSpeed * 3.6 : 0;
      const gps: GpsLocation = {
        lat,
        lng,
        speedKmH,
        accuracy,
        timestamp: pos.timestamp,
      };

      setLocation(gps);

      // Check distance from closest halt on train route
      let minHaltDist = Infinity;
      train.halts.forEach((h) => {
        const d = haversineKm(lat, lng, h.lat, h.lng);
        if (d < minHaltDist) minHaltDist = d;
      });

      const distRounded = Math.round(minHaltDist);
      setDistanceToRouteKm(distRounded);

      if (minHaltDist <= 25) {
        // Passenger is close to / on the train route!
        setIsOnBoard(true);
        const live = computeGpsStatus(train, gps);
        setGpsStatus(live);
        toast.success(`Connected to On-Board GPS! Train location synced to your device.`);
      } else {
        setIsOnBoard(false);
        // Compute status snapping to closest halt but inform the user
        const live = computeGpsStatus(train, gps);
        setGpsStatus(live);
        toast.info(
          `GPS active (${distRounded} km from route). Location synced using your GPS sensor.`,
        );
      }
    },
    [train],
  );

  const toggleGps = useCallback(() => {
    if (isActive) {
      stopWatching();
      setIsActive(false);
      setLocation(null);
      setGpsStatus(null);
      setIsOnBoard(false);
      toast.info("On-board GPS mode turned off. Showing network timetable estimation.");
      return;
    }

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setIsActive(true);
    toast.loading("Acquiring GPS satellite fix...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        handlePosition(pos);
        // Start watching continuous live GPS movement
        watchIdRef.current = navigator.geolocation.watchPosition(
          handlePosition,
          (err) => {
            console.warn("GPS watch error:", err.message);
          },
          { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 },
        );
      },
      (err) => {
        setIsActive(false);
        if (err.code === 1) {
          toast.error("Location permission denied. Please allow location access in your browser.");
        } else {
          toast.error(`GPS Fix failed: ${err.message}`);
        }
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, [isActive, stopWatching, handlePosition]);

  useEffect(() => {
    return () => {
      stopWatching();
    };
  }, [stopWatching]);

  return {
    isActive,
    location,
    isOnBoard,
    distanceToRouteKm,
    gpsStatus,
    toggleGps,
  };
}
