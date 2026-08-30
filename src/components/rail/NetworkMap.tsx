// Source: Google Maps Platform Code Assist
import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import {
  TrainFront,
  Layers,
  Key,
  Check,
  AlertTriangle,
  Clock,
  Compass,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";
import { trainRoutes } from "@/data/trains";
import type { TrainRoute } from "@/data/trains";
import { computeLiveStatus } from "@/lib/liveStatus";
import type { LiveStatus } from "@/lib/liveStatus";
import { useLiveClock } from "@/components/rail/useLiveClock";

const DEFAULT_MAPS_KEY =
  (typeof import.meta !== "undefined" && import.meta.env?.["VITE_GOOGLE_MAPS_API_KEY"]) ||
  (typeof process !== "undefined" && process.env?.["GOOGLE_MAPS_API_KEY"]) ||
  "";

// Fallback schematic projection
const BOX = { minLat: 7.5, maxLat: 35.5, minLng: 67.5, maxLng: 90.5 };
const W = 820;
const H = 720;

function project(lat: number, lng: number) {
  const x = ((lng - BOX.minLng) / (BOX.maxLng - BOX.minLng)) * W;
  const y = ((BOX.maxLat - lat) / (BOX.maxLat - BOX.minLat)) * H;
  return { x, y };
}

// -------------------------------------------------------------
// Google Maps Network Multi-Route Polylines
// -------------------------------------------------------------

function NetworkRoutesLayer({ routes }: { routes: TrainRoute[] }) {
  const map = useMap();
  const mapsLib = useMapsLibrary("maps");

  useEffect(() => {
    if (!map || !mapsLib || routes.length === 0) return;

    const polylines: any[] = [];

    routes.forEach((train, idx) => {
      const path = train.halts.map((h) => ({ lat: h.lat, lng: h.lng }));
      if (path.length < 2) return;

      // Color scheme variation per route
      const colors = ["#2563eb", "#059669", "#7c3aed", "#d97706", "#0891b2", "#dc2626"];
      const strokeColor = colors[idx % colors.length]!;

      // 1. Broad Railway Corridor Line
      const baseLine = new mapsLib.Polyline({
        path,
        strokeColor: "#1e293b",
        strokeOpacity: 0.6,
        strokeWeight: 5,
        map,
      });

      // 2. Traversed Track Polyline
      const railLine = new mapsLib.Polyline({
        path,
        strokeColor,
        strokeOpacity: 0.85,
        strokeWeight: 2.5,
        map,
      });

      polylines.push(baseLine, railLine);
    });

    return () => {
      polylines.forEach((p) => p.setMap(null));
    };
  }, [map, mapsLib, routes]);

  return null;
}

function NetworkCameraHandler({ routes }: { routes: TrainRoute[] }) {
  const map = useMap();
  const coreLib = useMapsLibrary("core");

  const fitNetworkBounds = useCallback(() => {
    if (!map || !coreLib || routes.length === 0) return;
    const bounds = new coreLib.LatLngBounds();
    routes.forEach((train) => {
      train.halts.forEach((h) => bounds.extend({ lat: h.lat, lng: h.lng }));
    });
    map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
  }, [map, coreLib, routes]);

  useEffect(() => {
    fitNetworkBounds();
  }, [fitNetworkBounds]);

  return null;
}

// -------------------------------------------------------------
// Main NetworkMap Component
// -------------------------------------------------------------

type Props = {
  className?: string;
};

export function NetworkMap({ className = "" }: Props) {
  const [apiKey, setApiKey] = useState<string>(DEFAULT_MAPS_KEY);
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [inputKey, setInputKey] = useState("");
  const [mapType, setMapType] = useState<"roadmap" | "satellite" | "hybrid" | "terrain">("roadmap");
  const [viewMode, setViewMode] = useState<"google" | "schematic">("google");
  const [filterMode, setFilterMode] = useState<"all" | "delayed" | "on-time">("all");
  const [selectedTrain, setSelectedTrain] = useState<{
    train: TrainRoute;
    status: LiveStatus;
  } | null>(null);

  // Live simulation tick every 4 seconds
  const now = useLiveClock(4000);

  useEffect(() => {
    const saved = localStorage.getItem("GMP_API_KEY");
    if (saved && !apiKey) {
      setApiKey(saved);
    }
  }, [apiKey]);

  const handleSaveKey = (keyToSave: string) => {
    const trimmed = keyToSave.trim();
    setApiKey(trimmed);
    localStorage.setItem("GMP_API_KEY", trimmed);
    setShowKeyDialog(false);
  };

  // Live Train Status Calculations
  const liveTrains = useMemo(() => {
    return trainRoutes.map((train) => {
      const status = computeLiveStatus(train, now ?? new Date());
      const isLate = (status.forecast?.delayMin ?? 0) > 2;
      return { train, status, isLate };
    });
  }, [now]);

  const filteredTrains = useMemo(() => {
    if (filterMode === "delayed") {
      return liveTrains.filter((t) => t.isLate);
    }
    if (filterMode === "on-time") {
      return liveTrains.filter((t) => !t.isLate);
    }
    return liveTrains;
  }, [liveTrains, filterMode]);

  // Center coordinate for India
  const defaultCenter = { lat: 22.5937, lng: 78.9629 };

  // Schematic SVG fallback calculations
  const routesPts = useMemo(
    () => trainRoutes.map((t) => t.halts.map((h) => project(h.lat, h.lng))),
    [],
  );
  const xs = routesPts.flat().map((p) => p.x);
  const ys = routesPts.flat().map((p) => p.y);
  const pad = 60;
  const minX = Math.min(...xs) - pad;
  const minY = Math.min(...ys) - pad;
  const maxX = Math.max(...xs) + pad;
  const maxY = Math.max(...ys) + pad;

  return (
    <div className={`relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card ${className}`}>
      {/* Top Map Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-secondary/40 px-3 py-2 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle */}
          <button
            onClick={() => setViewMode(viewMode === "google" ? "schematic" : "google")}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-semibold transition-all cursor-pointer ${
              viewMode === "google"
                ? "border-primary bg-primary text-primary-foreground shadow-xs"
                : "border-border bg-card text-foreground hover:bg-secondary"
            }`}
            title="Toggle between Google Maps and Schematic View"
          >
            <Layers className="size-3.5" />
            <span>{viewMode === "google" ? "Google Maps" : "Schematic Track"}</span>
          </button>

          {/* Map Layer Switcher */}
          {viewMode === "google" && (
            <div className="flex items-center rounded-lg border border-border bg-card p-0.5">
              <button
                onClick={() => setMapType("roadmap")}
                className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
                  mapType === "roadmap"
                    ? "bg-primary text-primary-foreground font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Roadmap
              </button>
              <button
                onClick={() => setMapType("satellite")}
                className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
                  mapType === "satellite"
                    ? "bg-primary text-primary-foreground font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Satellite
              </button>
              <button
                onClick={() => setMapType("terrain")}
                className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
                  mapType === "terrain"
                    ? "bg-primary text-primary-foreground font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Terrain
              </button>
            </div>
          )}

          {/* Filter Delay Status */}
          <div className="flex items-center rounded-lg border border-border bg-card p-0.5">
            <button
              onClick={() => setFilterMode("all")}
              className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
                filterMode === "all"
                  ? "bg-secondary font-bold text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All ({liveTrains.length})
            </button>
            <button
              onClick={() => setFilterMode("on-time")}
              className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
                filterMode === "on-time"
                  ? "bg-emerald-600 font-bold text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              On Time
            </button>
            <button
              onClick={() => setFilterMode("delayed")}
              className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
                filterMode === "delayed"
                  ? "bg-amber-600 font-bold text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Delayed
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* API Key Modal Button */}
          <button
            onClick={() => setShowKeyDialog(!showKeyDialog)}
            className={`flex size-7 items-center justify-center rounded-lg border transition-colors cursor-pointer ${
              apiKey
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 animate-pulse"
            }`}
            title="Configure Google Maps API Key"
          >
            <Key className="size-3.5" />
          </button>
        </div>
      </div>

      {/* API Key Setup Banner */}
      {showKeyDialog && (
        <div className="border-b border-primary/20 bg-primary/5 p-3 text-xs">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <p className="font-bold text-foreground flex items-center gap-1.5">
                <Key className="size-3.5 text-primary" />
                Google Maps API Configuration
              </p>
              <p className="text-[11px] text-muted-foreground">
                Enter your Google Maps JavaScript API key, or use a free{" "}
                <a
                  href="https://mapsplatform.google.com/maps-demo-key?utm_campaign=gmp_git_agentskills_v1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline font-medium"
                >
                  Maps Demo Key
                </a>{" "}
                (no credit card required).
              </p>
            </div>
            <button
              onClick={() => setShowKeyDialog(false)}
              className="text-muted-foreground hover:text-foreground text-sm font-bold"
            >
              ✕
            </button>
          </div>

          <div className="mt-2.5 flex items-center gap-2">
            <input
              type="text"
              placeholder="AIzaSy... (Paste API Key)"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="flex-1 rounded-lg border border-border bg-card px-2.5 py-1.5 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden"
            />
            <button
              onClick={() => handleSaveKey(inputKey)}
              className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 font-bold text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <Check className="size-3.5" />
              Save
            </button>
          </div>
        </div>
      )}

      {/* Main Map Canvas */}
      <div className="relative flex-1 min-h-[500px] w-full bg-slate-900/10">
        {viewMode === "google" ? (
          <APIProvider apiKey={apiKey} libraries={["maps", "marker", "core"]}>
            <Map
              mapId="DEMO_MAP_ID"
              defaultCenter={defaultCenter}
              defaultZoom={5}
              mapTypeId={mapType}
              gestureHandling="greedy"
              disableDefaultUI={false}
              zoomControl={true}
              mapTypeControl={false}
              streetViewControl={false}
              fullscreenControl={true}
              internalUsageAttributionIds={["gmp_git_agentskills_v1"]}
              className="h-full w-full min-h-[500px]"
            >
              {/* 1. Indian Railway Multi-Track Polylines */}
              <NetworkRoutesLayer routes={trainRoutes} />

              {/* 2. Camera Viewport Initial Bounds Handler */}
              <NetworkCameraHandler routes={trainRoutes} />

              {/* 3. Live Train Markers Across India */}
              {filteredTrains.map(({ train, status, isLate }) => (
                <AdvancedMarker
                  key={train.number}
                  position={{ lat: status.lat, lng: status.lng }}
                  title={`${train.number} ${train.name} (${status.speed} km/h)`}
                  onClick={() => setSelectedTrain({ train, status })}
                  zIndex={isLate ? 60 : 50}
                >
                  <div className="group relative flex flex-col items-center cursor-pointer transition-transform hover:scale-125">
                    {/* Pulsing Beacon Halo */}
                    <span
                      className={`absolute -inset-1 rounded-full ${
                        isLate ? "bg-amber-500/40" : "bg-primary/40"
                      } animate-rail-pulse pointer-events-none`}
                    />

                    {/* Locomotive Emblem */}
                    <div
                      className={`relative z-10 flex size-7 items-center justify-center rounded-full text-white shadow-float ring-2 ring-white ${
                        isLate ? "bg-amber-600" : "bg-primary"
                      }`}
                    >
                      <TrainFront className="size-3.5" />
                    </div>

                    {/* Quick Badge */}
                    <div className="absolute -bottom-4 whitespace-nowrap rounded-xs bg-slate-950/85 px-1 py-0.2 text-[8px] font-mono font-bold text-white shadow-xs pointer-events-none">
                      {train.number}
                    </div>
                  </div>
                </AdvancedMarker>
              ))}

              {/* 4. Selected Train Detail InfoWindow */}
              {selectedTrain && (
                <InfoWindow
                  position={{ lat: selectedTrain.status.lat, lng: selectedTrain.status.lng }}
                  onCloseClick={() => setSelectedTrain(null)}
                >
                  <div className="p-1.5 text-slate-900 min-w-[210px]">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-1">
                      <span className="font-mono text-xs font-bold text-blue-700">
                        {selectedTrain.train.number}
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.2 text-[9px] font-bold uppercase ${
                          (selectedTrain.status.forecast?.delayMin ?? 0) > 2
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {(selectedTrain.status.forecast?.delayMin ?? 0) > 2
                          ? `${selectedTrain.status.forecast?.delayMin}m Late`
                          : "On Time"}
                      </span>
                    </div>

                    <h4 className="mt-1 text-xs font-bold text-slate-900">
                      {selectedTrain.train.name}
                    </h4>

                    <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-600">
                      <span>{selectedTrain.train.halts[0]!.code}</span>
                      <ArrowRight className="size-2.5" />
                      <span>{selectedTrain.train.halts[selectedTrain.train.halts.length - 1]!.code}</span>
                    </div>

                    <p className="mt-1 text-[10px] text-slate-600">
                      Near: <strong>{selectedTrain.status.lastHalt.name}</strong> ({selectedTrain.status.speed} km/h)
                    </p>

                    <div className="mt-2 pt-1 border-t border-slate-200">
                      <Link
                        to="/train/$number"
                        params={{ number: selectedTrain.train.number }}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                      >
                        <span>View Live GPS Tracking</span>
                        <ArrowRight className="size-3" />
                      </Link>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
        ) : (
          /* Schematic SVG Vector Track View */
          <svg
            viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
            className="h-full w-full min-h-[500px]"
            role="img"
            aria-label="Live Indian Railways schematic network map"
          >
            <defs>
              <pattern id="net-rail-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path
                  d="M24 0H0V24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-border"
                />
              </pattern>
            </defs>

            <rect x={minX} y={minY} width={maxX - minX} height={maxY - minY} fill="url(#net-rail-grid)" />

            {trainRoutes.map((t) => {
              const pts = t.halts.map((h) => project(h.lat, h.lng));
              const line = pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
              return (
                <polyline
                  key={t.number}
                  points={line}
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.45"
                />
              );
            })}

            {filteredTrains.map(({ train, status, isLate }) => {
              const p = project(status.lat, status.lng);
              return (
                <Link
                  key={train.number}
                  to="/train/$number"
                  params={{ number: train.number }}
                  className="group"
                >
                  <g>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={10}
                      className={
                        isLate
                          ? "fill-rail-alert/30 animate-rail-pulse"
                          : "fill-primary/30 animate-rail-pulse"
                      }
                    />
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={5}
                      className={isLate ? "fill-rail-alert" : "fill-primary"}
                    />
                    <text
                      x={p.x + 8}
                      y={p.y + 4}
                      className="fill-foreground font-mono text-[9px] font-bold"
                    >
                      {train.number}
                    </text>
                  </g>
                </Link>
              );
            })}
          </svg>
        )}
      </div>

      {/* Floating Bottom Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-card/90 px-3 py-2 text-[10px] text-muted-foreground backdrop-blur-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-primary" /> On-Time Fleet
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-amber-600" /> Delayed Fleet
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-600" /> Active GPS
          </span>
        </div>
        <div className="flex items-center gap-1 text-primary font-semibold">
          <Compass className="size-3" />
          <span>Real-Geography Indian Railways Network</span>
        </div>
      </div>
    </div>
  );
}
