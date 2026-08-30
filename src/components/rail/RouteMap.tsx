// Source: Google Maps Platform Code Assist
import { useState, useEffect, useMemo, useCallback } from "react";
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
  Navigation,
  Layers,
  MapPin,
  Compass,
  Satellite,
  Maximize2,
  Key,
  Info,
  Check,
  Eye,
  Sliders,
} from "lucide-react";
import type { Halt } from "@/data/trains";

// Default demo fallback key for prototyping / zero-configuration startup
const DEFAULT_MAPS_KEY =
  (typeof import.meta !== "undefined" && import.meta.env?.["VITE_GOOGLE_MAPS_API_KEY"]) ||
  (typeof process !== "undefined" && process.env?.["GOOGLE_MAPS_API_KEY"]) ||
  "";

// Fallback bounding box projection for the schematic SVG view
const BOX = { minLat: 7.5, maxLat: 35.5, minLng: 67.5, maxLng: 90.5 };
const W = 640;
const H = 720;

function project(lat: number, lng: number) {
  const x = ((lng - BOX.minLng) / (BOX.maxLng - BOX.minLng)) * W;
  const y = ((BOX.maxLat - lat) / (BOX.maxLat - BOX.minLat)) * H;
  return { x, y };
}

function totalLen(pts: { x: number; y: number }[]) {
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    acc += Math.hypot(pts[i]!.x - pts[i - 1]!.x, pts[i]!.y - pts[i - 1]!.y);
  }
  return acc;
}

function snapToPath(
  pts: { x: number; y: number }[],
  p: { x: number; y: number },
): { x: number; y: number; d: number; angle: number } {
  let best = { x: p.x, y: p.y, d: 0, angle: 0 };
  let bestDist = Infinity;
  let acc = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i]!;
    const b = pts[i + 1]!;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / (len * len);
    t = Math.max(0, Math.min(1, t));
    const cx = a.x + dx * t;
    const cy = a.y + dy * t;
    const d = Math.hypot(p.x - cx, p.y - cy);
    if (d < bestDist) {
      bestDist = d;
      best = { x: cx, y: cy, d: acc + len * t, angle: Math.atan2(dy, dx) };
    }
    acc += len;
  }
  return best;
}

function buildTies(pts: { x: number; y: number }[], spacing: number) {
  const ties: { x: number; y: number; angle: number; d: number }[] = [];
  const total = totalLen(pts);
  for (let d = 0; d <= total; d += spacing) {
    let s = 0;
    let rem = d;
    for (let i = 0; i < pts.length - 1; i++) {
      const l = Math.hypot(pts[i + 1]!.x - pts[i]!.x, pts[i + 1]!.y - pts[i]!.y) || 1;
      if (rem <= l) {
        s = i;
        break;
      }
      rem -= l;
    }
    const a = pts[s]!;
    const b = pts[s + 1]!;
    const l = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    const t = l ? rem / l : 0;
    ties.push({
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t,
      angle: Math.atan2(b.y - a.y, b.x - a.x),
      d,
    });
  }
  return ties;
}

// -------------------------------------------------------------
// Google Maps Sub-Components (Polylines & Camera Controls)
// -------------------------------------------------------------

function GoogleMapsTrackPolyline({ path }: { path: { lat: number; lng: number }[] }) {
  const map = useMap();
  const mapsLib = useMapsLibrary("maps");

  useEffect(() => {
    if (!map || !mapsLib || path.length < 2) return;

    // 1. Broad Railway Corridor / Ballast Layer
    const ballastPolyline = new mapsLib.Polyline({
      path,
      strokeColor: "#1e293b",
      strokeOpacity: 0.85,
      strokeWeight: 6,
      map,
    });

    // 2. Traversed Track Polyline (High-contrast Indian Railway Blue)
    const railPolyline = new mapsLib.Polyline({
      path,
      strokeColor: "#2563eb",
      strokeOpacity: 0.95,
      strokeWeight: 3.5,
      map,
    });

    // 3. Railway Cross-Tie Sleepers (Dashed overlay)
    const tiePolyline = new mapsLib.Polyline({
      path,
      strokeColor: "#ffffff",
      strokeOpacity: 0.9,
      strokeWeight: 2,
      icons: [
        {
          icon: {
            path: "M 0,-1.5 0,1.5",
            strokeOpacity: 1,
            strokeWeight: 2,
            scale: 2,
          },
          offset: "0",
          repeat: "10px",
        },
      ],
      map,
    });

    return () => {
      ballastPolyline.setMap(null);
      railPolyline.setMap(null);
      tiePolyline.setMap(null);
    };
  }, [map, mapsLib, path]);

  return null;
}

function GoogleMapsCameraHandler({
  halts,
  position,
  focusTrain,
  onResetFocus,
}: {
  halts: Halt[];
  position?: { lat: number; lng: number } | null | undefined;
  focusTrain: boolean;
  onResetFocus: () => void;
}) {
  const map = useMap();
  const coreLib = useMapsLibrary("core");

  const fitRouteBounds = useCallback(() => {
    if (!map || !coreLib || halts.length === 0) return;
    const bounds = new coreLib.LatLngBounds();
    halts.forEach((h) => bounds.extend({ lat: h.lat, lng: h.lng }));
    if (position) bounds.extend(position);
    map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
  }, [map, coreLib, halts, position]);

  useEffect(() => {
    if (!map || !coreLib) return;

    if (focusTrain && position) {
      map.panTo(position);
      map.setZoom(12);
      onResetFocus();
    } else {
      fitRouteBounds();
    }
  }, [map, coreLib, focusTrain, position, fitRouteBounds, onResetFocus]);

  return null;
}

// -------------------------------------------------------------
// Main RouteMap Component
// -------------------------------------------------------------

type Props = {
  halts: Halt[];
  position?: { lat: number; lng: number } | null | undefined;
  className?: string;
  isMoving?: boolean;
};

export function RouteMap({ halts, position, className = "", isMoving = false }: Props) {
  const [apiKey, setApiKey] = useState<string>(DEFAULT_MAPS_KEY);
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [inputKey, setInputKey] = useState("");
  const [mapType, setMapType] = useState<"roadmap" | "satellite" | "hybrid" | "terrain">("roadmap");
  const [focusTrainTrigger, setFocusTrainTrigger] = useState(false);
  const [selectedHalt, setSelectedHalt] = useState<Halt | null>(null);
  const [viewMode, setViewMode] = useState<"google" | "schematic">("google");

  // Load any stored API key from localStorage if available
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

  // Center coordinate calculation for default view
  const defaultCenter = useMemo(() => {
    if (position) return position;
    if (halts.length > 0) {
      const mid = Math.floor(halts.length / 2);
      return { lat: halts[mid]!.lat, lng: halts[mid]!.lng };
    }
    return { lat: 20.5937, lng: 78.9629 }; // Geographic center of India
  }, [halts, position]);

  const pathCoords = useMemo(() => {
    return halts.map((h) => ({ lat: h.lat, lng: h.lng }));
  }, [halts]);

  // Schematic SVG coordinates fallback
  const pts = useMemo(() => halts.map((h) => project(h.lat, h.lng)), [halts]);
  const line = useMemo(
    () => pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" "),
    [pts],
  );
  const ties = useMemo(() => buildTies(pts, 9), [pts]);

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  pts.forEach((p) => {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  });

  const pad = 42;
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(W, maxX + pad);
  maxY = Math.min(H, maxY + pad);
  const vw = Math.max(120, maxX - minX);
  const vh = Math.max(120, maxY - minY);

  const marker = position ? snapToPath(pts, project(position.lat, position.lng)) : null;

  return (
    <div className={`relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card ${className}`}>
      {/* Top Map Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-secondary/40 px-3 py-2 text-xs">
        <div className="flex items-center gap-2">
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

          {viewMode === "google" && (
            <div className="flex items-center rounded-lg border border-border bg-card p-0.5">
              <button
                onClick={() => setMapType("roadmap")}
                className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
                  mapType === "roadmap" ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Roadmap
              </button>
              <button
                onClick={() => setMapType("satellite")}
                className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
                  mapType === "satellite" ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Satellite
              </button>
              <button
                onClick={() => setMapType("terrain")}
                className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
                  mapType === "terrain" ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Terrain
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {position && viewMode === "google" && (
            <button
              onClick={() => setFocusTrainTrigger(true)}
              className="inline-flex items-center gap-1 rounded-lg border border-primary/30 bg-primary/10 px-2 py-1 text-[11px] font-bold text-primary hover:bg-primary/20 transition-colors cursor-pointer"
              title="Recenter Camera on Live Train Engine"
            >
              <Navigation className="size-3" />
              <span>Track Train</span>
            </button>
          )}

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

      {/* API Key Banner / Modal if needed */}
      {showKeyDialog && (
        <div className="border-b border-primary/20 bg-primary/5 p-3 text-xs">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <p className="font-bold text-foreground flex items-center gap-1.5">
                <Key className="size-3.5 text-primary" />
                Google Maps API Configuration
              </p>
              <p className="text-[11px] text-muted-foreground">
                Enter your Google Cloud Maps JavaScript API key, or generate a free{" "}
                <a
                  href="https://mapsplatform.google.com/maps-demo-key?utm_campaign=gmp_git_agentskills_v1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline font-medium"
                >
                  Maps Demo Key
                </a>{" "}
                (no billing required).
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

      {/* Main Map Rendering Container */}
      <div className="relative flex-1 min-h-[460px] w-full bg-slate-900/10">
        {viewMode === "google" ? (
          <APIProvider apiKey={apiKey} libraries={["maps", "marker", "core"]}>
            <Map
              mapId="DEMO_MAP_ID"
              defaultCenter={defaultCenter}
              defaultZoom={7}
              mapTypeId={mapType}
              gestureHandling="greedy"
              disableDefaultUI={false}
              zoomControl={true}
              mapTypeControl={false}
              streetViewControl={false}
              fullscreenControl={true}
              internalUsageAttributionIds={["gmp_git_agentskills_v1"]}
              className="h-full w-full min-h-[460px]"
            >
              {/* 1. Real-Geography Railway Track Polyline */}
              <GoogleMapsTrackPolyline path={pathCoords} />

              {/* 2. Camera Viewport & Focus Handler */}
              <GoogleMapsCameraHandler
                halts={halts}
                position={position}
                focusTrain={focusTrainTrigger}
                onResetFocus={() => setFocusTrainTrigger(false)}
              />

              {/* 3. Station Advanced Markers with Badges */}
              {halts.map((halt, idx) => {
                const isOrigin = idx === 0;
                const isDest = idx === halts.length - 1;
                return (
                  <AdvancedMarker
                    key={halt.code}
                    position={{ lat: halt.lat, lng: halt.lng }}
                    title={`${halt.name} (${halt.code})`}
                    onClick={() => setSelectedHalt(halt)}
                  >
                    <div className="group relative flex flex-col items-center cursor-pointer transition-transform hover:scale-110">
                      <div
                        className={`flex size-6 items-center justify-center rounded-full border-2 border-white text-[9px] font-bold shadow-md transition-colors ${
                          isOrigin
                            ? "bg-emerald-600 text-white"
                            : isDest
                              ? "bg-red-600 text-white"
                              : "bg-blue-600 text-white"
                        }`}
                      >
                        {isOrigin ? "O" : isDest ? "D" : idx + 1}
                      </div>

                      <div className="absolute -bottom-4 whitespace-nowrap rounded-xs bg-slate-950/80 px-1 py-0.2 text-[8px] font-mono font-bold text-white shadow-xs pointer-events-none opacity-80 group-hover:opacity-100">
                        {halt.code}
                      </div>
                    </div>
                  </AdvancedMarker>
                );
              })}

              {/* 4. Live Train Engine Marker on the Track */}
              {position && (
                <AdvancedMarker
                  position={position}
                  title={`Live Train Location — Lat: ${position.lat.toFixed(4)}, Lng: ${position.lng.toFixed(4)}`}
                  zIndex={100}
                >
                  <div className="relative flex items-center justify-center">
                    {/* Blinking Radar Beacon when train is in motion */}
                    {isMoving && (
                      <>
                        <span className="absolute size-14 rounded-full border border-primary/50 bg-primary/20 animate-ping pointer-events-none" />
                        <span className="absolute size-10 rounded-full bg-primary/30 animate-rail-pulse pointer-events-none" />
                      </>
                    )}

                    {/* Locomotive Engine Emblem */}
                    <div className="relative z-20 flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-float ring-3 ring-white">
                      <TrainFront className="size-4.5" />
                    </div>

                    {/* Live Speed / Status Pill */}
                    <div className="absolute -top-7 z-30 whitespace-nowrap rounded-full bg-primary px-2 py-0.5 text-[9px] font-extrabold text-primary-foreground shadow-md ring-1 ring-white/40 flex items-center gap-1">
                      <span className="flex size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{isMoving ? "RUNNING" : "HALTED"}</span>
                    </div>
                  </div>
                </AdvancedMarker>
              )}

              {/* 5. Selected Station Popup InfoWindow */}
              {selectedHalt && (
                <InfoWindow
                  position={{ lat: selectedHalt.lat, lng: selectedHalt.lng }}
                  onCloseClick={() => setSelectedHalt(null)}
                >
                  <div className="p-1 text-slate-900">
                    <h4 className="text-xs font-bold">{selectedHalt.name}</h4>
                    <p className="font-mono text-[10px] text-slate-600">
                      Station Code: {selectedHalt.code}
                    </p>
                    <p className="text-[10px] text-slate-600 mt-0.5">
                      Distance: {selectedHalt.km} km
                      {selectedHalt.platform && ` • Platform ${selectedHalt.platform}`}
                    </p>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
        ) : (
          /* Schematic SVG Vector Track View */
          <svg
            viewBox={`${minX} ${minY} ${vw} ${vh}`}
            className="h-full w-full min-h-[460px]"
            role="img"
            aria-label="Train schematic route map"
          >
            <defs>
              <pattern id="rail-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path
                  d="M24 0H0V24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-border"
                />
              </pattern>
            </defs>

            <rect x={minX} y={minY} width={vw} height={vh} fill="url(#rail-grid)" />

            <polyline
              points={line}
              fill="none"
              stroke="var(--primary)"
              strokeOpacity="0.15"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {ties.map((t, i) => {
              const perp = t.angle + Math.PI / 2;
              const dx = Math.cos(perp) * 4.5;
              const dy = Math.sin(perp) * 4.5;
              return (
                <line
                  key={`tie-${i}`}
                  x1={t.x - dx}
                  y1={t.y - dy}
                  x2={t.x + dx}
                  y2={t.y + dy}
                  stroke="var(--primary)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeOpacity={0.4}
                />
              );
            })}

            <polyline
              points={line}
              fill="none"
              stroke="var(--primary)"
              strokeOpacity="0.7"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {pts.map((p, i) => (
              <g key={halts[i]!.code}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={3.5}
                  className="fill-card stroke-primary"
                  strokeWidth="1.5"
                />
                <text x={p.x + 8} y={p.y + 4} className="fill-muted-foreground font-mono" fontSize="9">
                  {halts[i]!.code}
                </text>
              </g>
            ))}

            {marker && (
              <g transform={`translate(${marker.x.toFixed(1)}, ${marker.y.toFixed(1)})`}>
                {isMoving && (
                  <circle r={18} className="fill-none stroke-primary/50 animate-ping" strokeWidth={1} />
                )}
                <circle r={8} className="fill-primary text-primary-foreground" />
              </g>
            )}
          </svg>
        )}
      </div>

      {/* Floating Bottom Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-card/90 px-3 py-2 text-[10px] text-muted-foreground backdrop-blur-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-emerald-600" /> Origin
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-blue-600" /> Halts
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-red-600" /> Destination
          </span>
        </div>
        <div className="flex items-center gap-1 text-primary font-semibold">
          <Compass className="size-3" />
          <span>Real-Geography GPS Path</span>
        </div>
      </div>
    </div>
  );
}
